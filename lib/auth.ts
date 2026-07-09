export const SESSION_COOKIE_NAME = "portal_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

type SessionPayload = {
  exp: number;
  v: 1;
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

function timingSafeEqualString(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return mismatch === 0;
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
  if (!timingSafeEqualString(signature, expectedSignature)) {
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

export function getAdminPasswordFromEnv(env?: unknown) {
  const typedEnv = env as { ADMIN_PASSWORD?: string } | undefined;
  return typedEnv?.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "";
}

export async function isAuthenticatedRequest(
  token: string | undefined,
  env?: unknown,
) {
  const secret = getAdminPasswordFromEnv(env);
  return verifySessionToken(token, secret);
}
