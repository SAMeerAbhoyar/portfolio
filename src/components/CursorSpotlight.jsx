import React, { useEffect, useRef } from "react";

export default function CursorSpotlight() {
  const spotlightRef = useRef(null);

  useEffect(() => {
    // Only enabled for desktop/fine pointers and when reduced motion is not preferred
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isFinePointer || prefersReducedMotion) return;

    const el = spotlightRef.current;
    if (!el) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let animId = null;
    let hasMoved = false;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        el.style.opacity = "1";
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const loop = () => {
      curX += (mouseX - curX) * 0.08;
      curY += (mouseY - curY) * 0.08;

      el.style.transform = `translate3d(${curX - 300}px, ${curY - 300}px, 0)`;
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none fixed top-0 left-0 -z-10 h-[600px] w-[600px] rounded-full opacity-0 transition-opacity duration-700 ease-out will-change-transform hidden md:block"
      style={{
        background:
          "radial-gradient(circle, rgba(239, 91, 79, 0.09) 0%, rgba(239, 91, 79, 0.02) 45%, transparent 70%)",
      }}
      aria-hidden="true"
    />
  );
}
