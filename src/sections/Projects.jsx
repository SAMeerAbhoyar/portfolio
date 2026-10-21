import React, { useMemo, useState, useCallback, useRef } from "react";
import { gsap } from "gsap";
import { FiGithub, FiExternalLink, FiArrowUpRight } from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";
import FilterTabs from "../ui/FilterTabs";
import Editable from "../ui/Editable";
import Tag from "../ui/Tag";
import Modal from "../ui/Modal";
import LinkButton from "../ui/LinkButton";
import ProjectCover from "../components/ProjectCover";
import { projects, projectCategories } from "../content/projects";
import { getAsset } from "../utils/assets";

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const gridRef = useRef(null);
  const close = useCallback(() => setSelected(null), []);

  const shown = useMemo(
    () => projects.filter((p) => filter === "All" || p.category === filter),
    [filter]
  );

  // Smooth reflow animation on filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    const cards = gridRef.current?.querySelectorAll(".project-card");
    if (cards) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.38,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    }
  };

  return (
    <section id="projects" className="mt-28 md:mt-36 scroll-mt-24">
      <SectionHeading
        label="FEATURED WORK"
        title="Selected Projects"
        subtitle="Full-scale machine learning systems, deepfake detection pipelines, and high-performance applications."
      />

      <FilterTabs
        label="Filter projects by category"
        options={projectCategories}
        value={filter}
        onChange={handleFilterChange}
      />

      {shown.length === 0 ? (
        <p className="text-center text-[var(--muted)] my-14">
          No projects in this category yet.
        </p>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-[28px]"
        >
          {shown.map((project, index) => {
            const imageSrc = getAsset(project.image);
            const totalCount =
              projects.length < 10
                ? `0${projects.length}`
                : `${projects.length}`;
            const itemNumber = index < 9 ? `0${index + 1}` : `${index + 1}`;

            return (
              <article
                key={project.id}
                onClick={() => setSelected(project)}
                className="project-card group relative flex flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-400 ease-out hover:-translate-y-[6px] hover:border-[var(--accent)] hover:shadow-[0_12px_35px_-8px_rgba(239,91,79,0.3)] overflow-hidden cursor-pointer select-none min-h-[440px] aspect-[16/11]"
              >
                {/* 1. Top Row: Left Number Pill + Right Category Pill (Never overlaps title) */}
                <div className="flex items-center justify-between p-5 pb-3 z-10 select-none">
                  <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--surface-2)] text-white border border-white/10 shadow-xs">
                    {itemNumber} / {totalCount}
                  </span>

                  <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 shadow-xs">
                    {project.category}
                  </span>
                </div>

                {/* 2. Middle Area: Media or Generated Cover with VIEW cursor bubble */}
                <div
                  className="flex-1 px-5 relative overflow-hidden flex items-center justify-center min-h-[200px]"
                  data-cursor="view"
                >
                  <div className="w-full h-full rounded-2xl overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <ProjectCover project={project} index={index} />
                    )}
                  </div>
                </div>

                {/* 3. Bottom Area: Title + Description (left) and Arrow Button (right) */}
                <div className="p-5 pt-4 z-10 grid grid-cols-[1fr_auto] items-end gap-4 border-t border-[var(--border)] bg-[var(--surface)]">
                  <div className="overflow-hidden">
                    {/* Title: clamp 22px-30px, font-weight 700, max 2 lines with line-clamp, no coral text */}
                    <h3
                      className="font-bold text-white tracking-tight line-clamp-2 leading-snug"
                      style={{ fontSize: "clamp(22px, 2.5vw, 30px)" }}
                    >
                      <Editable value={project.title} />
                    </h3>

                    {/* Description: max 2 lines, muted */}
                    <p className="mt-1.5 text-xs sm:text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                      <Editable value={project.description} />
                    </p>
                  </div>

                  {/* Arrow button aligned in its own column so it never overlaps text */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(project);
                    }}
                    aria-label={`Open details for ${project.title}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] group-hover:scale-105 shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    <FiArrowUpRight size={20} aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Accessible Project Details Modal
      ───────────────────────────────────────────────────────────── */}
      <Modal open={!!selected} onClose={close} title={selected?.title ?? ""} wide>
        {selected && (
          <div className="flex flex-col gap-6 text-sm text-[var(--muted)]">
            <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[var(--border)]">
              {getAsset(selected.image) ? (
                <img
                  src={getAsset(selected.image)}
                  alt={`${selected.title} preview`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ProjectCover project={selected} />
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                {selected.category}
              </span>
            </div>

            {selected.description && (
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)] mb-1.5">
                  Overview
                </h4>
                <p className="text-base leading-relaxed text-zinc-200">
                  <Editable value={selected.description} />
                </p>
              </div>
            )}

            {selected.problem && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:p-5">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)] mb-1">
                  Problem Addressed
                </h4>
                <p className="text-sm leading-relaxed text-zinc-300">
                  <Editable value={selected.problem} />
                </p>
              </div>
            )}

            {selected.features?.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)] mb-2">
                  Key Features & Pipeline
                </h4>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-zinc-200">
                  {selected.features.map((f, i) => (
                    <li key={i}>
                      <Editable value={f} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selected.tech?.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)] mb-2">
                  Technologies Leveraged
                </h4>
                <ul className="flex flex-wrap gap-2">
                  {selected.tech.map((t, i) => (
                    <Tag key={i}>{t}</Tag>
                  ))}
                </ul>
              </div>
            )}

            {selected.details && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:p-5">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)] mb-1">
                  Technical Metrics & Architecture
                </h4>
                <p className="text-sm leading-relaxed text-zinc-300">
                  {selected.details}
                </p>
              </div>
            )}

            {(selected.github || selected.demo) && (
              <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--border)]">
                {selected.github && (
                  <LinkButton href={selected.github} icon={FiGithub} variant="primary">
                    View Source Code
                  </LinkButton>
                )}
                {selected.demo && (
                  <LinkButton href={selected.demo} icon={FiExternalLink}>
                    Live Demo
                  </LinkButton>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
