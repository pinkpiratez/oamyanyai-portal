import Link from "next/link";

type PortalButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
};

export function PortalButton({
  href,
  children,
  variant = "primary",
  external = false,
}: PortalButtonProps) {
  const base =
    "inline-flex min-h-[46px] min-w-[200px] items-center justify-center rounded-md px-8 py-3 text-[13px] font-semibold tracking-wide transition-all duration-300";

  const styles =
    variant === "primary"
      ? "border border-white bg-white text-neutral-950 shadow-[0_8px_32px_rgba(255,255,255,0.18)] hover:bg-neutral-100 hover:shadow-[0_12px_40px_rgba(255,255,255,0.24)]"
      : "border border-white/80 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md hover:border-white hover:bg-white/18";

  const className = `${base} ${styles}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={variant === "primary" ? { color: "#0a0a0a" } : { color: "#ffffff" }}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      style={variant === "primary" ? { color: "#0a0a0a" } : { color: "#ffffff" }}
    >
      {children}
    </Link>
  );
}
