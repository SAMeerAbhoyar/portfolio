import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FiArrowDown } from "react-icons/fi";
import { profile } from "../content/profile";
import { getAsset } from "../utils/assets";
import { lenis, scrollToTarget } from "../lib/lenis";

const SUBTITLES = [
  "Computer Science and Engineering Student",
  "Software Developer",
  "Research Enthusiast",
];

export default function Hero() {
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [introFinished, setIntroFinished] = useState(false);

  const containerRef = useRef(null);
  const photoRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const glitchSweepRef = useRef(null);

  const photoCutout = getAsset("profile/photo-cutout.png");
  const tagline = profile.tagline || "BUILDING INTELLIGENT SYSTEMS.";

  const line1Letters = "SAMEERA".split("");
  const line2Letters = "BHOYAR".split("");

  // Subtitle rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSubIndex((prev) => (prev + 1) % SUBTITLES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Equal-width fit function for Line 2 (BHOYAR) to match Line 1 (SAMEERA) exactly
  useEffect(() => {
    const fitTextWidths = () => {
      if (!line1Ref.current || !line2Ref.current) return;
      line2Ref.current.style.transform = "scaleX(1)";
      const w1 = line1Ref.current.getBoundingClientRect().width;
      const w2 = line2Ref.current.getBoundingClientRect().width;

      if (w1 > 0 && w2 > 0) {
        const scale = w1 / w2;
        line2Ref.current.style.transform = `scaleX(${scale})`;
        line2Ref.current.style.transformOrigin = "center center";
      }
    };

    fitTextWidths();
    window.addEventListener("resize", fitTextWidths);
    return () => window.removeEventListener("resize", fitTextWidths);
  }, [introFinished]);

  // GSAP Glitch Intro Timeline
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const runIntro = () => {
      if (prefersReducedMotion) {
        setIntroFinished(true);
        return;
      }

      const l1 = line1Ref.current?.querySelectorAll(".hero-char");
      const l2 = line2Ref.current?.querySelectorAll(".hero-char");
      const allChars = [...(l1 || []), ...(l2 || [])];
      const clone1 = containerRef.current?.querySelectorAll(".glitch-clone-1");
      const clone2 = containerRef.current?.querySelectorAll(".glitch-clone-2");

      if (!allChars.length) return;

      const tl = gsap.timeline({
        onComplete: () => {
          setIntroFinished(true);
        },
      });

      // Initial state: thin vertical slivers
      gsap.set(allChars, {
        scaleX: 0.05,
        opacity: 0.35,
        filter: "blur(3px)",
        transformOrigin: "center center",
      });
      gsap.set([clone1, clone2], { opacity: 1 });

      // Stagger expansion of slivers into full letters
      tl.to(allChars, {
        scaleX: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.65,
        stagger: 0.06,
        ease: "power3.out",
      });

      // Jitter RGB-split glitch slices
      if (clone1 && clone2) {
        tl.to(
          clone1,
          {
            x: -6,
            duration: 0.08,
            repeat: 4,
            yoyo: true,
            ease: "rough",
          },
          "-=0.5"
        );
        tl.to(
          clone2,
          {
            x: 6,
            duration: 0.08,
            repeat: 4,
            yoyo: true,
            ease: "rough",
          },
          "-=0.5"
        );
        tl.to([clone1, clone2], {
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
        });
      }

      // Vertical thin coral sweep line across the text
      if (glitchSweepRef.current) {
        tl.fromTo(
          glitchSweepRef.current,
          { left: "-10%", opacity: 0 },
          {
            left: "110%",
            opacity: 1,
            duration: 0.65,
            ease: "power2.inOut",
          },
          "-=0.6"
        );
      }

      // Brief coral glow flash across the letters
      tl.to(
        allChars,
        {
          textShadow: "0 0 40px #ef5b4f, 0 0 70px rgba(239,91,79,0.7)",
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        },
        "-=0.4"
      );
    };

    const handleLoaded = () => {
      runIntro();
    };

    window.addEventListener("portfolio-loaded", handleLoaded);

    const timeout = setTimeout(() => {
      runIntro();
    }, 2800);

    return () => {
      window.removeEventListener("portfolio-loaded", handleLoaded);
      clearTimeout(timeout);
    };
  }, []);

  // Subtle Mouse Parallax & Periodic Micro-Glitch after intro
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let rafId = null;

    const onMouseMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        const normX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
        const normY = (e.clientY - innerHeight / 2) / (innerHeight / 2);

        if (photoRef.current) {
          gsap.to(photoRef.current, {
            x: normX * -12,
            y: normY * -6,
            duration: 0.6,
            ease: "power1.out",
          });
        }
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Micro-glitch every ~6 seconds
    const microGlitchInterval = setInterval(() => {
      if (!introFinished) return;
      const clone1 = containerRef.current?.querySelectorAll(".glitch-clone-1");
      const clone2 = containerRef.current?.querySelectorAll(".glitch-clone-2");
      if (clone1 && clone2) {
        gsap.timeline()
          .to([clone1, clone2], { opacity: 0.85, duration: 0.05 })
          .to(clone1, { x: -4, duration: 0.05 })
          .to(clone2, { x: 4, duration: 0.05 })
          .to([clone1, clone2], { opacity: 0, x: 0, duration: 0.08 });
      }
    }, 6000);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      clearInterval(microGlitchInterval);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [introFinished]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[100svh] w-full bg-[#050507] flex flex-col justify-between select-none px-[4vw] pt-[12vh] pb-8 overflow-hidden"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. Top Left Tagline (Dive In + is fixed in Navbar beside Menu)
      ───────────────────────────────────────────────────────────── */}
      <header className="relative z-40 flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">
            {tagline}
          </span>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. Center: GIANT GLITCH NAME & Layered Cutout Photo
      ───────────────────────────────────────────────────────────── */}
      <div className="relative my-auto flex flex-col items-center justify-center w-full max-w-full overflow-visible">
        {/* Layer 0: Big Coral Radial Glow behind photo */}
        <div
          className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 w-[420px] sm:w-[650px] md:w-[800px] h-[420px] sm:h-[650px] md:h-[800px] rounded-full bg-[var(--accent)]/20 blur-[130px] z-0"
          aria-hidden="true"
        />

        {/* Sweep line for intro glitch */}
        <div
          ref={glitchSweepRef}
          className="pointer-events-none absolute top-0 bottom-0 w-[3px] bg-[var(--accent)] shadow-[0_0_20px_#ef5b4f] z-30 opacity-0"
          aria-hidden="true"
        />

        {/* Layer 10: Giant Name Container (Behind photo shoulders) */}
        <div className="relative z-10 w-full flex flex-col items-center text-center font-extrabold font-sans uppercase leading-[0.82] tracking-[-0.02em]">
          {/* Line 1: SAMEERA (solid white with animated light-sheen sweep) */}
          <div
            ref={line1Ref}
            className="relative z-10 flex justify-center whitespace-nowrap will-change-transform hero-sheen-text"
            style={{
              fontSize: "clamp(56px, 17vw, 300px)",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 800,
              lineHeight: 0.82,
            }}
          >
            {line1Letters.map((char, i) => (
              <span
                key={`l1-${i}`}
                className="hero-char relative inline-block overflow-visible"
              >
                <span className="relative z-10">{char}</span>
                <span
                  className="glitch-clone-1 absolute inset-0 text-[var(--accent)] opacity-0 pointer-events-none z-0"
                  style={{ mixBlendMode: "screen" }}
                  aria-hidden="true"
                >
                  {char}
                </span>
                <span
                  className="glitch-clone-2 absolute inset-0 text-white/90 opacity-0 pointer-events-none z-0"
                  style={{ mixBlendMode: "screen" }}
                  aria-hidden="true"
                >
                  {char}
                </span>
              </span>
            ))}
          </div>

          {/* Line 2: BHOYAR (Outlined letters with coral bottom gradient, hover white fill) */}
          <div
            ref={line2Ref}
            className="relative z-10 flex justify-center whitespace-nowrap will-change-transform mt-0"
            style={{
              fontSize: "clamp(56px, 17vw, 300px)",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 800,
              lineHeight: 0.82,
            }}
          >
            {line2Letters.map((char, i) => (
              <span
                key={`l2-${i}`}
                className="hero-char hero-outlined-char relative inline-block overflow-visible px-[0.01em]"
              >
                <span className="relative z-10">{char}</span>
                <span
                  className="glitch-clone-1 absolute inset-0 text-[var(--accent)] opacity-0 pointer-events-none z-0"
                  style={{ mixBlendMode: "screen" }}
                  aria-hidden="true"
                >
                  {char}
                </span>
                <span
                  className="glitch-clone-2 absolute inset-0 text-white/90 opacity-0 pointer-events-none z-0"
                  style={{ mixBlendMode: "screen" }}
                  aria-hidden="true"
                >
                  {char}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Layer 20: Sharp Cutout Photo ON TOP of name's middle letters (Head & Hair fully visible!) */}
        {photoCutout && (
          <div
            ref={photoRef}
            className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-auto max-w-full overflow-visible flex justify-center items-end will-change-transform"
          >
            <img
              src={photoCutout}
              alt={profile.name}
              className="w-auto max-w-[88vw] sm:max-w-[480px] md:max-w-[540px] max-h-[58vh] sm:max-h-[62vh] object-contain object-bottom select-none drop-shadow-2xl"
              style={{
                filter: "none",
                mixBlendMode: "normal",
              }}
              loading="eager"
            />
          </div>
        )}

        {/* Layer 25: Subtle Dark gradient fading the bottom of hero into next section */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-36 bg-gradient-to-t from-[#050507] via-[#050507]/80 to-transparent z-25"
          aria-hidden="true"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. Centered Caption & Line + Rotating Role Badge & Scroll
      ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-30 flex flex-col items-center justify-between gap-3 w-full max-w-7xl mx-auto pt-2">
        {/* Thin Coral Line + Small Caption */}
        <div className="flex flex-col items-center gap-2 text-center w-full px-2">
          <div className="w-14 h-[2px] bg-[var(--accent)] shadow-[0_0_8px_#ef5b4f]" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.09em] sm:tracking-[0.22em] text-zinc-300 uppercase whitespace-nowrap">
            COMPUTER SCIENCE AND ENGINEERING STUDENT
          </span>
        </div>

        {/* Bottom Bar: Rotating Role Line + Scroll Indicator */}
        <div className="flex items-center justify-between w-full pt-1">
          {/* Rotating Role Line */}
          <div className="h-8 flex items-center">
            <span
              key={activeSubIndex}
              className="inline-block text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[var(--accent)] px-4 py-1 rounded-full border border-[var(--accent)]/30 bg-[#0c0c11]/85 backdrop-blur-md animate__animated animate__fadeInUp animate__faster"
            >
              {SUBTITLES[activeSubIndex]}
            </span>
          </div>

          {/* Scroll Indicator */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (lenis) {
                lenis.scrollTo("#about", { offset: 0, duration: 1.2 });
              } else {
                scrollToTarget("#about", { offset: 0, duration: 1.2 });
              }
            }}
            aria-label="Scroll to content"
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
          >
            <span>SCROLL</span>
            <FiArrowDown
              size={14}
              className="text-[var(--accent)] animate-bounce"
              aria-hidden="true"
            />
          </button>
        </div>
      </footer>
    </section>
  );
}
