import React from "react";
import SectionHeading from "../ui/SectionHeading";
import { focusAreas } from "../content/focus";
import Editable from "../ui/Editable";
import Tag from "../ui/Tag";

export default function Focus() {
  return (
    <section id="what-i-do" className="mt-28 md:mt-36 scroll-mt-24">
      <SectionHeading
        label="WHAT I DO"
        title="Core Engineering Focus"
        subtitle="Specialized domains where I apply machine learning, deep neural networks, and modern full-stack architecture."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {focusAreas.map((item, index) => (
          <div
            key={item.id}
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay={index * 150}
            data-aos-once="true"
            className="design-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Ambient subtle coral corner light on hover */}
            <div
              className="pointer-events-none absolute -top-16 -right-16 w-32 h-32 rounded-full bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/15 blur-2xl transition-all duration-500"
              aria-hidden="true"
            />

            <div>
              {/* Number index */}
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--accent)] mb-4 inline-block">
                0{index + 1} //
              </span>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[var(--accent)] transition-colors">
                <Editable value={item.title} />
              </h3>

              {/* 1-sentence grounded description */}
              <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-6">
                <Editable value={item.description} />
              </p>
            </div>

            {/* Tech tags */}
            <ul className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]">
              {item.tags.map((tag, tIdx) => (
                <Tag key={tIdx}>{tag}</Tag>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
