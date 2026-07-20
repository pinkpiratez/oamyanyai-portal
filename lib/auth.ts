import {
  hashPassword,
  passwordsMatchPlain,
  verifyPassword,
} from "@/lib/password";
import { getDbAsync } from "@/lib/db";

export const SESSION_COOKIE_NAME = "portal_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

type SessionPayload = {
  exp: number;
  v: 1;
};

type AdminCredentialRow = {
  password_hash: string;
  password_salt: string;
};

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function encodePayload(payload: SessionPayload) {
  return toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
}

function decodePayload(encodedPayload: string): SessionPayload | null {
  try {
    const json = new TextDecoder().decode(fromBase64Url(encodedPayload));
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}

async function signPayload(encodedPayload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encodedPayload),
  );

  return toBase64Url(new Uint8Array(signature));
}

export function getAdminPasswordFromEnv(env?: unknown) {
  const typedEnv = env as { ADMIN_PASSWORD?: string } | undefined;
  return typedEnv?.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "";
}

/** Session signing secret — keep stable (Cloudflare secret), not the mutable login password. */
export function getSessionSecret(env?: unknown) {
  return getAdminPasswordFromEnv(env);
}

export async function createSessionToken(secret: string) {
  const payload: SessionPayload = {
    v: 1,
    exp: Date.now() + SESSION_TTL_MS,
  };

  const encodedPayload = encodePayload(payload);
  const signature = await signPayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string,
) {
  if (!token || !secret) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = await signPayload(encodedPayload, secret);
  if (!passwordsMatchPlain(signature, expectedSignature)) {
    return false;
  }

  const payload = decodePayload(encodedPayload);
  return Boolean(payload && payload.v === 1 && payload.exp > Date.now());
}

export function getSessionCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function isAuthenticatedRequest(
  token: string | undefined,
  env?: unknown,
) {
  const secret = getSessionSecret(env);
  return verifySessionToken(token, secret);
}

export async function getStoredAdminCredential() {
  try {
    const db = await getDbAsync();
    return db
      .prepare(
        "SELECT password_hash, password_salt FROM admin_credentials WHERE id = 1",
      )
      .first<AdminCredentialRow>();
  } catch {
    return null;
  }
}

export async function setStoredAdminPassword(password: string) {
  const { hash, salt } = await hashPassword(password);
  const db = await getDbAsync();
  await db
    .prepare(
      `INSERT INTO admin_credentials (id, password_hash, password_salt, updated_at)
       VALUES (1, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         password_hash = excluded.password_hash,
         password_salt = excluded.password_salt,
         updated_at = datetime('now')`,
    )
    .bind(hash, salt)
    .run();
}

export async function verifyLoginPassword(
  submittedPassword: string,
  env?: unknown,
) {
  const trimmed = submittedPassword.trim();
  if (!trimmed) {
    return false;
  }

  const stored = await getStoredAdminCredential();
  if (stored?.password_hash && stored.password_salt) {
    return verifyPassword(trimmed, stored.password_hash, stored.password_salt);
  }

  const bootstrapPassword = getAdminPasswordFromEnv(env).trim();
  return Boolean(bootstrapPassword) && passwordsMatchPlain(trimmed, bootstrapPassword);
}

/** Accepts current login password or Cloudflare ADMIN_PASSWORD recovery secret. */
export async function verifyPasswordResetAuthority(
  currentOrRecoveryPassword: string,
  env?: unknown,
) {
  const trimmed = currentOrRecoveryPassword.trim();
  if (!trimmed) {
    return false;
  }

  const recovery = getAdminPasswordFromEnv(env).trim();
  if (recovery && passwordsMatchPlain(trimmed, recovery)) {
    return true;
  }

  return verifyLoginPassword(trimmed, env);
}
