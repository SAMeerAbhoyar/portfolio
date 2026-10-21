import React, { useEffect, useRef } from "react";

export default function ParallaxBlobs() {
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let rafId = null;

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (blob1Ref.current) {
          blob1Ref.current.style.transform = `translate3d(0, ${scrollY * 0.06}px, 0)`;
        }
        if (blob2Ref.current) {
          blob2Ref.current.style.transform = `translate3d(0, ${scrollY * -0.04}px, 0)`;
        }
        if (blob3Ref.current) {
          blob3Ref.current.style.transform = `translate3d(0, ${scrollY * 0.05}px, 0)`;
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden hidden md:block"
      aria-hidden="true"
    >
      {/* Blob 1: Top-middle / projects area */}
      <div
        ref={blob1Ref}
        className="absolute top-[25%] left-[-10%] h-[550px] w-[550px] rounded-full bg-[var(--accent)]/08 blur-[150px] will-change-transform"
      />
      {/* Blob 2: Mid / certifications & experience area */}
      <div
        ref={blob2Ref}
        className="absolute top-[55%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[var(--accent)]/06 blur-[160px] will-change-transform"
      />
      {/* Blob 3: Lower / education & contact area */}
      <div
        ref={blob3Ref}
        className="absolute top-[80%] left-[20%] h-[500px] w-[500px] rounded-full bg-[var(--accent)]/07 blur-[150px] will-change-transform"
      />
    </div>
  );
}
