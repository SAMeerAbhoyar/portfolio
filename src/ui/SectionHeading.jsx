import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SectionHeading({
  label,
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}) {
  const containerRef = useRef(null);
  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  const displayLabel = (label || eyebrow || title || "").trim();
  const cleanLabel = displayLabel.startsWith("—")
    ? displayLabel
    : `— ${displayLabel.toUpperCase()}`;

  const isCenter = align === "center";

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const letters = titleRef.current?.querySelectorAll(".heading-char");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // 1. Label fades in first
      if (labelRef.current) {
        tl.fromTo(
          labelRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
        );
      }

      // 2. Letters slide up from mask with stagger 0.04s
      if (letters && letters.length > 0) {
        tl.fromTo(
          letters,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 0.55,
            stagger: 0.04,
            ease: "power3.out",
          },
          "-=0.2"
        );
      }

      // 3. Subtitle fades in
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [title]);

  const words = (title || "").split(" ");

  return (
    <div
      ref={containerRef}
      className={`mb-12 md:mb-16 ${isCenter ? "text-center" : "text-left"} ${className} select-none`}
    >
      {/* Small Uppercase Coral Eyebrow Label (fades in first) */}
      <div
        ref={labelRef}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)] mb-3"
      >
        <span>{cleanLabel}</span>
      </div>

      {/* Big Title with Masked Slide-Up Letters */}
      <h2
        ref={titleRef}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight flex flex-wrap justify-center gap-x-[0.28em]"
      >
        {words.map((word, wIdx) => (
          <span key={wIdx} className="inline-block whitespace-nowrap">
            {word.split("").map((char, cIdx) => (
              <span
                key={cIdx}
                className="inline-block overflow-hidden align-top"
              >
                <span className="heading-char inline-block will-change-transform">
                  {char}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          ref={subtitleRef}
          className={`mt-4 text-base sm:text-lg text-[var(--muted)] leading-relaxed ${
            isCenter ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
