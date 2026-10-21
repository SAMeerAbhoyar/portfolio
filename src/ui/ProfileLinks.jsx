import { FiCode } from "react-icons/fi";
import { getProfileLinks } from "../utils/profileLinks";

// Hidden profiles are simply not rendered. In dev, a hint reminds you to add them.
export default function ProfileLinks({ only, showLabels = false }) {
  const links = getProfileLinks(only);
  if (!links.length) {
    return import.meta.env.DEV ? (
      <span className="inline-flex items-center gap-2 rounded-md border border-dashed border-amber-400/50 px-2 py-1 text-xs text-amber-200/80">
        <FiCode aria-hidden="true" /> Add your profile URLs in src/content/profile.js (dev-only hint)
      </span>
    ) : null;
  }
  return (
    <ul className="flex flex-wrap items-center gap-3">
      {links.map(({ key, label, icon: Icon, href }) => (
        <li key={key}>
          <a
            href={href}
            target={key === "email" ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-3 text-zinc-300 transition-colors hover:border-[var(--accent)] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <Icon size={18} aria-hidden="true" />
            {showLabels && <span className="pr-1 text-sm">{label}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
