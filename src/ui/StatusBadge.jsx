import React from "react";

const STYLES = {
  Published: "border-[var(--accent)]/50 bg-[var(--accent)]/12 text-white font-semibold shadow-[0_0_12px_rgba(239,91,79,0.2)]",
  Granted: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  Accepted: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  Filed: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  "Under Review": "border-amber-500/40 bg-amber-500/10 text-amber-300",
  Pending: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  "In Progress": "border-[var(--accent)]/50 bg-[var(--accent)]/10 text-[var(--accent)]",
  Course: "border-white/10 bg-[var(--surface-2)] text-zinc-300",
  Internship: "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]",
  Conference: "border-white/10 bg-[var(--surface-2)] text-zinc-300",
};

export default function StatusBadge({ status }) {
  const known = STYLES[status];
  const label = known ? status : (status || "Status: to be added");
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${
        known ? known : "border-dashed border-zinc-700 text-zinc-400"
      }`}
    >
      {label}
    </span>
  );
}
