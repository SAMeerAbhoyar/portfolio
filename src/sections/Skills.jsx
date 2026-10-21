import React from "react";
import SectionHeading from "../ui/SectionHeading";
import { skillGroups } from "../content/skills";

export default function Skills() {
  return (
    <section id="skills" className="mt-28 md:mt-36 scroll-mt-24">
      <SectionHeading
        label="TECH STACK"
        title="Technical Arsenal"
        subtitle="Tools, languages, libraries, and frameworks I leverage to engineer intelligent software."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {skillGroups.map((group, groupIndex) => (
          <div
            key={group.title}
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay={(groupIndex % 3) * 120}
            data-aos-once="true"
            className="design-card p-6 flex flex-col justify-between"
          >
            {/* Header row: Coral Section Dot + Group Title */}
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[var(--border)]">
              <span
                className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(239,91,79,0.7)] shrink-0"
                aria-hidden="true"
              />
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white">
                {group.title}
              </h3>
            </div>

            {/* Logo Chips */}
            <div className="flex flex-wrap gap-2.5">
              {group.skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={skill.name}
                    className="group inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 transition-all duration-300 hover:border-[var(--accent)]/50 hover:bg-[#1a1a24] hover:shadow-[0_4px_15px_-4px_rgba(239,91,79,0.25)] select-none"
                  >
                    {/* Logo chip container */}
                    <div className="h-7 w-7 rounded-lg bg-white/95 flex items-center justify-center shrink-0 overflow-hidden shadow-xs transition-transform duration-300 group-hover:scale-105">
                      {skill.logo ? (
                        <img
                          src={`${import.meta.env.BASE_URL}assets/skills/${skill.logo}.svg`}
                          alt=""
                          className="h-4.5 w-4.5 object-contain"
                          loading="lazy"
                        />
                      ) : Icon ? (
                        <Icon
                          className="h-4 w-4"
                          style={{ color: skill.color || "var(--accent)" }}
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>

                    {/* Skill name */}
                    <span className="text-xs sm:text-sm font-medium text-zinc-200 group-hover:text-white whitespace-nowrap">
                      {skill.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
