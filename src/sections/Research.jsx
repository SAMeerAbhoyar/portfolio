import React, { useState } from "react";
import { FiChevronDown, FiExternalLink, FiFileText } from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";
import StatusBadge from "../ui/StatusBadge";
import Editable from "../ui/Editable";
import Tag from "../ui/Tag";
import LinkButton from "../ui/LinkButton";
import PlaceholderTag from "../ui/PlaceholderTag";
import { papers } from "../content/research";
import { getAsset } from "../utils/assets";

function PaperCard({ paper, delay = 0, index = 0 }) {
  const [open, setOpen] = useState(false);
  const panelId = `paper-${paper.id}`;
  const pdf = getAsset(paper.pdf);
  const doiUrl = paper.doi
    ? `https://doi.org/${paper.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, "")}`
    : "";

  return (
    <article
      data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
      data-aos-duration="850"
      data-aos-delay={delay}
      data-aos-once="true"
      className="design-card p-6 sm:p-8 flex flex-col justify-between"
    >
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={paper.status} />
          <PlaceholderTag show={paper.placeholder} />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
          <Editable value={paper.title} />
        </h3>

        <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
          <span className="text-zinc-200 font-medium">
            <Editable value={paper.venue} />
          </span>{" "}
          · <Editable value={paper.date} />
        </p>

        {paper.keywords?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {paper.keywords.map((k, i) => (
              <Tag key={i}>{k}</Tag>
            ))}
          </ul>
        )}

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="mt-5 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--accent)] hover:text-white cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          <span>{open ? "Hide Details" : "Show Abstract & Authors"}</span>
          <FiChevronDown
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div
            id={panelId}
            className="mt-4 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 text-sm text-[var(--muted)]"
          >
            {paper.summary && (
              <div>
                <span className="font-semibold text-white block mb-1">Abstract:</span>
                <p className="leading-relaxed">
                  <Editable value={paper.summary} />
                </p>
              </div>
            )}
            <p>
              <span className="font-semibold text-white">Authors: </span>
              {paper.authors.map((a, i) => (
                <span key={i}>
                  {i > 0 && ", "}
                  <Editable value={a} />
                </span>
              ))}
            </p>
            {paper.contribution && (
              <p>
                <span className="font-semibold text-white">My Contribution: </span>
                <Editable value={paper.contribution} />
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5 pt-4 border-t border-[var(--border)]">
        <LinkButton href={paper.url} icon={FiExternalLink} variant="primary">
          View Publication
        </LinkButton>
        {doiUrl && (
          <LinkButton href={doiUrl} icon={FiExternalLink}>
            DOI Reference
          </LinkButton>
        )}
        {pdf && (
          <LinkButton href={pdf} icon={FiFileText}>
            Read PDF
          </LinkButton>
        )}
      </div>
    </article>
  );
}

export default function Research() {
  return (
    <section id="research" className="mt-28 md:mt-36 scroll-mt-24">
      <SectionHeading
        label="RESEARCH"
        title="Research & Publications"
        subtitle="Peer-reviewed conference papers and scholarly investigations in IoT and machine intelligence."
      />
      <div className="mx-auto grid max-w-4xl gap-6 sm:gap-8">
        {papers.map((p, i) => (
          <PaperCard key={p.id} paper={p} delay={(i % 3) * 150} index={i} />
        ))}
      </div>
    </section>
  );
}
