import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enabled for desktop/fine pointers (disabled on touch) and when motion is not reduced
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isFinePointer || prefersReducedMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId = null;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      const isButtonOrLink = target.closest("button") || target.closest("a");

      // Check if specifically hovering over a [data-cursor="view"] container and NOT a button/link inside it
      const viewTarget = target.closest('[data-cursor="view"]');
      if (viewTarget && !isButtonOrLink) {
        setCursorText("VIEW");
        setIsHovering(true);
        return;
      }

      setCursorText("");
      const isInteractive =
        isButtonOrLink ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest('[role="button"]') ||
        target.classList.contains("cursor-pointer");

      setIsHovering(!!isInteractive);
    };

    const loop = () => {
      // Smooth interpolation for the follower bubble/ring
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  const isFinePointer =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches;
  if (!isFinePointer) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[35] overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Outer Follower Ring / 64px VIEW Bubble */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none flex items-center justify-center transition-[width,height,background-color,border-color] duration-250 ${
          cursorText
            ? "w-16 h-16 bg-[var(--accent)] text-white text-[11px] font-black tracking-widest shadow-[0_0_25px_rgba(239,91,79,0.55)]"
            : isHovering
            ? "w-12 h-12 border border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_15px_rgba(239,91,79,0.25)]"
            : "w-8 h-8 border border-[var(--accent)]/50 bg-transparent"
        }`}
      >
        {cursorText && (
          <span className="select-none font-sans font-extrabold tracking-wider">
            {cursorText}
          </span>
        )}
      </div>

      {/* Inner Immediate Dot (hidden when in VIEW bubble mode) */}
      {!cursorText && (
        <div
          ref={dotRef}
          className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-150 ${
            isHovering
              ? "w-2.5 h-2.5 bg-white"
              : "w-2 h-2 bg-[var(--accent)] shadow-[0_0_8px_#ef5b4f]"
          }`}
        />
      )}
    </div>
  );
}
