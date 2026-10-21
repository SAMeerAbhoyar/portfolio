import React from "react";
import { isValidUrl } from "../utils/assets";

// Renders an external link button only if the URL is valid; otherwise renders nothing.
export default function LinkButton({ href, icon: Icon, children, variant = "ghost", download }) {
  if (!isValidUrl(href) && !(href && download)) return null;
  const base =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer";
  const styles =
    variant === "primary"
      ? "bg-[var(--accent)] text-white hover:bg-[#f1685d] hover:shadow-[0_4px_20px_-4px_rgba(239,91,79,0.4)]"
      : "border border-[var(--border)] bg-[var(--surface-2)] text-zinc-200 hover:border-[var(--accent)]/50 hover:text-white";
  return (
    <a
      href={href}
      target={download ? undefined : "_blank"}
      rel={download ? undefined : "noopener noreferrer"}
      download={download || undefined}
      className={`${base} ${styles}`}
    >
      {Icon && <Icon aria-hidden="true" />}
      <span>{children}</span>
    </a>
  );
}
