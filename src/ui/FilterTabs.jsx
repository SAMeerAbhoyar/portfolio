import React from "react";

export default function FilterTabs({ options, value, onChange, label }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="mb-10 flex flex-wrap justify-center gap-2 select-none"
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt)}
            className={`rounded-full border px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
              active
                ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_0_18px_rgba(239,91,79,0.35)] scale-105"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-white/20 hover:text-white hover:bg-[var(--surface-2)]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
