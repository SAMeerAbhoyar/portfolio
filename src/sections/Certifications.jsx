import React, { useMemo, useState, useCallback } from "react";
import { FiAward, FiCheckCircle } from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";
import FilterTabs from "../ui/FilterTabs";
import Editable from "../ui/Editable";
import Tag from "../ui/Tag";
import Modal from "../ui/Modal";
import LinkButton from "../ui/LinkButton";
import PlaceholderTag from "../ui/PlaceholderTag";
import StatusBadge from "../ui/StatusBadge";
import { certifications } from "../content/certifications";
import { getAsset } from "../utils/assets";

function CertificateBadge({ cert, className = "" }) {
  const src = getAsset(cert.image);
  const fit = className.includes("object-contain") ? "object-contain" : "object-cover";
  if (src) {
    return (
      <img
        src={src}
        alt={`${cert.title} certificate`}
        loading="lazy"
        className={`${fit} ${className} transition-transform duration-500 group-hover:scale-105`}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-[#1c1822] to-[#0c0c11] text-[var(--accent)] ${className}`}
      aria-hidden="true"
    >
      <FiAward size={44} className="opacity-80" />
    </div>
  );
}

export default function Certifications() {
  const filters = useMemo(() => {
    const fixedCategories = ["Course", "Internship", "Conference"];
    const issuers = Array.from(
      new Set(
        certifications
          .map((c) => c.issuer)
          .filter((v) => v && !/^\[.*\]$/.test(v))
      )
    );
    return ["All", ...fixedCategories, ...issuers];
  }, []);

  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const close = useCallback(() => setSelected(null), []);

  const shown = certifications.filter(
    (c) => filter === "All" || c.category === filter || c.issuer === filter
  );

  return (
    <section id="certifications" className="mt-28 md:mt-36 scroll-mt-24">
      <SectionHeading
        label="CREDENTIALS"
        title="Certifications & Courses"
        subtitle="Completed specialized coursework, Red Hat certifications, and industry recognitions."
      />

      {filters.length > 2 && (
        <FilterTabs
          label="Filter certifications"
          options={filters}
          value={filter}
          onChange={setFilter}
        />
      )}

      <div key={filter} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c, i) => (
          <article
            key={c.id}
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay={(i % 3) * 120}
            data-aos-once="true"
            className="design-card group flex flex-col overflow-hidden cursor-pointer"
            onClick={() => setSelected(c)}
          >
            {/* Certificate Preview Image with Hover Zoom */}
            <div className="relative h-44 sm:h-48 w-full overflow-hidden border-b border-[var(--border)] bg-[#050507]">
              <CertificateBadge cert={c} className="h-full w-full" />
              <div className="absolute top-3 left-3 z-10">
                <StatusBadge status={c.category} />
              </div>
            </div>

            {/* Card Content */}
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <PlaceholderTag show={c.placeholder} />
                <h3 className="font-bold text-lg text-white group-hover:text-[var(--accent)] transition-colors leading-snug">
                  <Editable value={c.title} />
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[var(--muted)]">
                  <span className="text-zinc-200 font-medium">
                    <Editable value={c.issuer} />
                  </span>{" "}
                  · <Editable value={c.date} />
                </p>
              </div>

              {c.skills?.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-[var(--border)]">
                  {c.skills.map((s, idx) => (
                    <Tag key={idx}>{s}</Tag>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Accessible Lightbox Modal */}
      <Modal open={!!selected} onClose={close} title={selected?.title ?? ""} wide>
        {selected && (
          <div className="flex flex-col gap-5 text-sm text-[var(--muted)]">
            <div className="max-h-[65vh] w-full rounded-2xl overflow-hidden bg-black/60 border border-[var(--border)] flex items-center justify-center p-2">
              <CertificateBadge
                cert={selected}
                className="max-h-[60vh] w-full object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div>
                <p className="text-base font-semibold text-white">
                  <Editable value={selected.issuer} />
                </p>
                <p className="text-xs text-[var(--muted)]">
                  Completed / Issued: <Editable value={selected.date} />
                </p>
              </div>
              <StatusBadge status={selected.category} />
            </div>

            {selected.credentialId && (
              <p className="font-mono text-xs text-zinc-300">
                <span className="text-white font-medium">Credential ID: </span>
                {selected.credentialId}
              </p>
            )}

            {selected.skills?.length > 0 && (
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)] block mb-2">
                  Demonstrated Competencies
                </span>
                <ul className="flex flex-wrap gap-1.5">
                  {selected.skills.map((s, idx) => (
                    <Tag key={idx}>{s}</Tag>
                  ))}
                </ul>
              </div>
            )}

            {selected.verifyUrl && (
              <div className="pt-3 border-t border-[var(--border)]">
                <LinkButton
                  href={selected.verifyUrl}
                  icon={FiCheckCircle}
                  variant="primary"
                >
                  Verify Credential
                </LinkButton>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
