import React from "react";
import { skillGroups } from "../content/skills";

const normalize = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export default function ProjectCover({ project, index = 0 }) {
  const allSkills = skillGroups.flatMap((group) => group.skills);
  const displayIndex = index < 9 ? `0${index + 1}` : `${index + 1}`;

  const allTechs = project.tech || [];
  const maxVisible = 4;
  const visibleTechs = allTechs.slice(0, maxVisible);
  const remainingCount = allTechs.length - maxVisible;

  return (
    <div className="relative flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#141018] via-[#0c0c11] to-[#07070a] p-6 sm:p-7 select-none overflow-hidden rounded-2xl">
      {/* Huge Faint Index Number in Background */}
      <span
        className="pointer-events-none absolute -right-2 -bottom-6 font-mono font-black text-white/[0.04] select-none text-[8rem] sm:text-[10rem] leading-none z-0"
        aria-hidden="true"
      >
        {displayIndex}
      </span>

      {/* Ambient Coral Glow */}
      <div
        className="pointer-events-none absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[var(--accent)]/10 blur-3xl z-0"
        aria-hidden="true"
      />

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--accent)] font-semibold">
          SYSTEM SPEC // {project.category}
        </span>
        <span className="text-[11px] font-mono text-[var(--muted)]">
          ID: {project.id}
        </span>
      </div>

      {/* Tech Chips Grid (Up to 4 chips in 1 row, wrap to max 2 rows, rest collapse to +N) */}
      <div className="relative z-10 my-auto py-3">
        <div className="flex flex-wrap items-center gap-2">
          {visibleTechs.map((techName, tIdx) => {
            const match = allSkills.find(
              (s) => normalize(s.name) === normalize(techName)
            );

            return (
              <div
                key={tIdx}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/90 px-3 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-sm shadow-xs"
              >
                {match?.logo && (
                  <img
                    src={`${import.meta.env.BASE_URL}assets/skills/${match.logo}.svg`}
                    alt=""
                    className="h-3.5 w-3.5 object-contain shrink-0"
                    loading="lazy"
                  />
                )}
                <span className="whitespace-nowrap">{techName}</span>
              </div>
            );
          })}

          {remainingCount > 0 && (
            <span className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/90 px-2.5 py-1.5 text-xs font-semibold text-[var(--muted)]">
              +{remainingCount}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Sub-tag */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[var(--muted)] pt-2 border-t border-white/5">
        <span>STATUS: PRODUCTION-READY</span>
        <span className="text-[var(--accent)]">VERIFIED</span>
      </div>
    </div>
  );
}
