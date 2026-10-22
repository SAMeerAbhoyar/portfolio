import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlowingSilkShader from "../components/FlowingSilkShader";
import { profile } from "../content/profile";
import { projects } from "../content/projects";
import { papers } from "../content/research";
import { certifications } from "../content/certifications";
import CountUp from "../components/CountUp/CountUp";

gsap.registerPlugin(ScrollTrigger);

const HIGHLIGHT_PHRASES = [
  "I am Sameera Bhoyar",
  "Artificial Intelligence and Machine Learning",
  "intelligent systems",
  "IEEE ICETET-SIP 2025",
  "next hard problem",
];

function parseParagraphWords(text, highlightPhrases) {
  const ranges = [];
  highlightPhrases.forEach((phrase) => {
    let pos = 0;
    while ((pos = text.indexOf(phrase, pos)) !== -1) {
      ranges.push({ start: pos, end: pos + phrase.length });
      pos += phrase.length;
    }
  });

  const regex = /\S+/g;
  const words = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    const isHighlight = ranges.some((r) => start < r.end && end > r.start);
    words.push({ word: match[0], isHighlight });
  }
  return words;
}

export default function About() {
  const sectionRef = useRef(null);
  const pinWrapperRef = useRef(null);
  const titleBoxRef = useRef(null);
  const paragraphRef = useRef(null);
  const statsRef = useRef(null);
  const shaderContainerRef = useRef(null);

  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setIsReduced(prefersReducedMotion);

    if (prefersReducedMotion) return;

    // Track mouse for shader
    const onMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current = {
        x: (e.clientX / innerWidth) * 2 - 1,
        y: -(e.clientY / innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // GSAP ScrollTrigger Pin & Scrub Timeline
    const words = paragraphRef.current?.querySelectorAll(".about-word");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=170%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
          },
        },
      });

      // 1. Title box scale down & drift upward
      tl.to(
        titleBoxRef.current,
        {
          scale: 0.72,
          y: -65,
          opacity: 0.85,
          ease: "none",
        },
        0
      );

      // 2. Fast scrubbed word-by-word reveal of the about text (~25ms per word)
      if (words && words.length > 0) {
        tl.fromTo(
          words,
          {
            opacity: 0.08,
            y: 12,
            filter: "blur(3px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.025,
            ease: "none",
          },
          0.08
        );
      }

      // 3. Stats row fade in
      if (statsRef.current) {
        tl.fromTo(
          statsRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
          },
          0.72
        );
      }

      // 4. Fade shader visual towards the end of the pin
      if (shaderContainerRef.current) {
        tl.to(
          shaderContainerRef.current,
          {
            opacity: 0,
            ease: "power2.inOut",
          },
          0.85
        );
      }

      // Refresh ScrollTrigger after pinned section is created
      ScrollTrigger.refresh();
    }, sectionRef);

    const refreshST = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", refreshST);
    window.addEventListener("load", refreshST);
    if (document.fonts) {
      document.fonts.ready.then(refreshST).catch(() => {});
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", refreshST);
      window.removeEventListener("load", refreshST);
      ctx.revert();
    };
  }, []);

  const parsedParagraphs = (profile.about || []).map((pText) =>
    parseParagraphWords(pText, HIGHLIGHT_PHRASES)
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-[#050507] overflow-hidden"
    >
      <div
        ref={pinWrapperRef}
        className="relative h-[100svh] min-h-[640px] w-full flex flex-col justify-center items-center px-4 sm:px-8 select-none"
      >
        {/* Full-bleed animated WebGL shader (with fallback for reduced motion) */}
        {!isReduced ? (
          <div
            ref={shaderContainerRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-500"
          >
            <FlowingSilkShader
              mouseRef={mouseRef}
              scrollProgressRef={scrollProgressRef}
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-[radial-gradient(circle_at_center,rgba(239,91,79,0.2)_0%,transparent_70%)] blur-[100px]"
            aria-hidden="true"
          />
        )}

        {/* Foreground Content Stack */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Title Box with Eyebrow, Giant "WHO I AM", and One-line Subtitle */}
          <div ref={titleBoxRef} className="flex flex-col items-center will-change-transform">
            {/* Small coral label */}
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
              <span>— ABOUT ME</span>
            </div>

            {/* Giant Centered Title: "WHO I AM" */}
            <h2
              className="font-extrabold tracking-tight text-white uppercase will-change-transform"
              style={{
                fontSize: "clamp(48px, 11vw, 180px)",
                lineHeight: 0.9,
                mixBlendMode: "difference",
              }}
            >
              WHO I AM
            </h2>

            {/* One-line Subtitle */}
            <p className="text-xs sm:text-sm font-semibold tracking-[0.14em] sm:tracking-[0.22em] uppercase text-[var(--accent)] mt-3">
              Computer Science and Engineering Student
            </p>
          </div>

          {/* Scrubbed 4 Paragraphs */}
          <div
            ref={paragraphRef}
            className="mt-5 sm:mt-7 max-w-4xl flex flex-col items-center gap-3 sm:gap-3.5 text-center"
          >
            {parsedParagraphs.map((wordsList, pIdx) => {
              const isFirst = pIdx === 0;

              if (isFirst) {
                // First paragraph: Largest and boldest (display size, white)
                return (
                  <p
                    key={pIdx}
                    className="flex flex-wrap justify-center gap-x-[0.28em] gap-y-1 text-base sm:text-xl md:text-2xl lg:text-[25px] font-bold tracking-tight text-white leading-snug sm:leading-tight mb-1 sm:mb-2"
                  >
                    {wordsList.map((item, wIdx) => (
                      <span
                        key={wIdx}
                        className={`about-word inline-block will-change-transform ${
                          item.isHighlight
                            ? "text-[var(--accent)] font-extrabold"
                            : "text-white font-bold"
                        }`}
                      >
                        {item.word}
                      </span>
                    ))}
                  </p>
                );
              }

              // Paragraphs 2, 3, 4: Clean, comfortable reading size, muted text with coral highlights
              return (
                <p
                  key={pIdx}
                  className="flex flex-wrap justify-center gap-x-[0.24em] gap-y-1 text-xs sm:text-sm md:text-[15px] font-normal leading-relaxed text-zinc-300 max-w-3xl"
                >
                  {wordsList.map((item, wIdx) => (
                    <span
                      key={wIdx}
                      className={`about-word inline-block will-change-transform ${
                        item.isHighlight
                          ? "text-[var(--accent)] font-semibold"
                          : "text-zinc-300"
                      }`}
                    >
                      {item.word}
                    </span>
                  ))}
                </p>
              );
            })}
          </div>

          {/* Pinned Stats Bar */}
          <div
            ref={statsRef}
            className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-8 sm:gap-16 border-t border-white/10 pt-6 sm:pt-8 w-full max-w-2xl"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-baseline justify-center">
                <CountUp to={projects.length} />
                <span className="text-[var(--accent)] ml-1">+</span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mt-1">
                Projects
              </p>
            </div>

            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-baseline justify-center">
                <CountUp to={papers.length} />
                <span className="text-[var(--accent)] ml-1">+</span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mt-1">
                Publication
              </p>
            </div>

            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-baseline justify-center">
                <CountUp to={certifications.length} />
                <span className="text-[var(--accent)] ml-1">+</span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mt-1">
                Certificates
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
