import React from "react";
import SectionHeading from "../ui/SectionHeading";
import Editable from "../ui/Editable";
import Tag from "../ui/Tag";
import { education } from "../content/education";

export default function Education() {
  return (
    <section id="education" className="mt-28 md:mt-36 scroll-mt-24">
      <SectionHeading
        label="ACADEMICS"
        title="Education"
        subtitle="Foundational engineering studies, curriculum coursework, and specialized technical degree."
      />

      <div className="mx-auto grid max-w-4xl gap-6 sm:gap-8">
        {education.map((e, i) => (
          <article
            key={e.id}
            data-aos="fade-up"
            data-aos-duration="850"
            data-aos-delay={i * 150}
            data-aos-once="true"
            className="design-card p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="inline-block rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-semibold text-[var(--accent)] border border-[var(--accent)]/30">
                  Degree Program
                </span>
                <span className="text-xs sm:text-sm font-mono text-[var(--muted)]">
                  <Editable value={e.start} /> – <Editable value={e.end} />
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                <Editable value={e.degree} />
              </h3>

              <p className="mt-1 text-sm sm:text-base font-semibold text-[var(--accent)]">
                <Editable value={e.specialization} />
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                <Editable value={e.institution} />
              </p>

              {e.coursework?.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                  <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)] mb-2.5">
                    Relevant Coursework
                  </h4>
                  <ul className="flex flex-wrap gap-2">
                    {e.coursework
                      .filter((c) => !c.startsWith("["))
                      .map((c, idx) => (
                        <li
                          key={idx}
                          data-aos="fade-up"
                          data-aos-delay={idx * 35}
                          data-aos-duration="450"
                          data-aos-once="true"
                          className="inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-medium text-zinc-300 select-none hover:border-[var(--accent)]/50 hover:text-white transition-colors"
                        >
                          <Editable value={c} />
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {e.academicProjects?.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[var(--border)]">
                  <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)] mb-2">
                    Academic Projects
                  </h4>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-zinc-300">
                    {e.academicProjects.map((a, idx) => (
                      <li key={idx}>
                        <Editable value={a} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
