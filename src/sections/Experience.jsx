import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../ui/SectionHeading";
import Editable from "../ui/Editable";
import { experiences } from "../content/experience";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !lineRef.current) return;

    const items = containerRef.current?.querySelectorAll(".timeline-entry");

    const ctx = gsap.context(() => {
      // Timeline vertical line draws with scroll scrub
      gsap.fromTo(
        lineRef.current,
        {
          scaleY: 0,
          transformOrigin: "top center",
        },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );

      // Entries fade in and dots pop
      if (items) {
        items.forEach((item) => {
          const dot = item.querySelector(".timeline-dot");
          const card = item.querySelector(".timeline-card");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          });

          if (dot) {
            tl.fromTo(
              dot,
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }
            );
          }

          if (card) {
            tl.fromTo(
              card,
              { opacity: 0, x: 25 },
              { opacity: 1, x: 0, duration: 0.55, ease: "power2.out" },
              "-=0.2"
            );
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="mt-28 md:mt-40 scroll-mt-24">
      <SectionHeading
        label="CAREER"
        title="Where I've Been"
        subtitle="Professional internships, technical tasks, and positions of institutional responsibility."
      />

      <div ref={containerRef} className="relative mx-auto max-w-4xl pl-6 sm:pl-10">
        {/* Coral Timeline Line that draws on scroll scrub */}
        <div
          ref={lineRef}
          className="absolute left-[7px] sm:left-[11px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[var(--accent)] via-[var(--accent)]/50 to-[var(--accent)]/10 shadow-[0_0_10px_rgba(239,91,79,0.5)]"
          aria-hidden="true"
        />

        <ol className="space-y-8 sm:space-y-12">
          {experiences.map((exp) => (
            <li key={exp.id} className="timeline-entry relative">
              {/* Glowing Coral Dot on Timeline */}
              <span
                aria-hidden="true"
                className="timeline-dot absolute -left-[30px] sm:-left-[44px] top-7 flex h-4 w-4 items-center justify-center will-change-transform"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60" />
                <span
                  className={`relative inline-flex h-3 w-3 rounded-full border border-black ${
                    exp.featured
                      ? "bg-[var(--accent)] shadow-[0_0_12px_rgba(239,91,79,1)] scale-110"
                      : "bg-[var(--accent)] shadow-[0_0_8px_rgba(239,91,79,0.7)]"
                  }`}
                />
              </span>

              {/* Experience Card */}
              <article
                className={`timeline-card design-card p-6 sm:p-8 ${
                  exp.featured ? "featured-coral-card" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <span className="inline-block rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-semibold text-[var(--accent)] border border-[var(--accent)]/30">
                    {exp.type}
                  </span>

                  {exp.duration && exp.duration.trim() !== "" && (
                    <span className="text-xs sm:text-sm font-medium text-[var(--muted)] font-mono">
                      <Editable value={exp.duration} />
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  <Editable value={exp.title} />
                </h3>

                <p className="mt-1 text-sm sm:text-base font-medium text-zinc-300">
                  <Editable value={exp.organization} />
                </p>

                {/* Responsibilities */}
                {exp.responsibilities?.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-[var(--border)]">
                    <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)] mb-2">
                      Key Responsibilities & Deliverables
                    </h4>
                    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-300">
                      {exp.responsibilities.map((r, rIdx) => (
                        <li key={rIdx}>
                          <Editable value={r} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Impact */}
                {exp.impact?.length > 0 &&
                  exp.impact.some((imp) => imp && imp.trim() !== "") && (
                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)] mb-1.5">
                        Contributions & Impact
                      </h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
                        {exp.impact
                          .filter((imp) => imp && imp.trim() !== "")
                          .map((imp, iIdx) => (
                            <li key={iIdx}>
                              <Editable value={imp} />
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
