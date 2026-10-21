import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PreLoader() {
  const [count, setCount] = useState(0);
  const [hidden, setHidden] = useState(false);
  const containerRef = useRef(null);
  const counterBoxRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setHidden(true);
      window.dispatchEvent(new CustomEvent("portfolio-loaded"));
      return;
    }

    document.body.style.overflow = "hidden";

    const counterObj = { val: 0 };
    const duration = 2.0; // 2 seconds

    const tl = gsap.timeline();

    tl.to(counterObj, {
      val: 100,
      duration: duration,
      ease: "power2.inOut",
      onUpdate: () => {
        const rounded = Math.round(counterObj.val);
        setCount(rounded);
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${rounded}%`;
        }
      },
    });

    // At 100: scale/fade counter, wipe up loader panel, start hero intro
    tl.to(
      counterBoxRef.current,
      {
        scale: 1.08,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.45,
        ease: "power3.in",
      },
      "+=0.1"
    );

    tl.to(
      containerRef.current,
      {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: () => {
          document.body.style.overflow = "";
          setHidden(true);
          // Trigger hero intro timeline
          window.dispatchEvent(new CustomEvent("portfolio-loaded"));
        },
      },
      "-=0.15"
    );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050507] text-white select-none overflow-hidden will-change-transform"
      aria-label="Loading portfolio"
      role="status"
    >
      {/* Background ambient subtle glow */}
      <div
        className="pointer-events-none absolute w-[450px] h-[450px] rounded-full bg-[var(--accent)]/10 blur-[130px]"
        aria-hidden="true"
      />

      <div
        ref={counterBoxRef}
        className="relative z-10 flex flex-col items-center select-none"
      >
        {/* Giant centered counter (tabular numerals) */}
        <div className="font-mono tabular-nums font-extrabold text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-tighter text-white flex items-baseline">
          <span>{count}</span>
          <span className="text-2xl sm:text-4xl text-[var(--accent)] ml-1 font-sans font-bold">
            %
          </span>
        </div>

        {/* Small "LOADING PORTFOLIO" label */}
        <p className="mt-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
          LOADING PORTFOLIO
        </p>

        {/* Thin coral progress line */}
        <div className="mt-7 w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full w-0 bg-[var(--accent)] shadow-[0_0_12px_rgba(239,91,79,0.85)]"
          />
        </div>
      </div>
    </div>
  );
}
