import React, { useEffect, useRef, useState } from "react";

export default function SectionDivider({ className = "" }) {
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`mx-auto my-16 flex w-full max-w-4xl items-center justify-center px-4 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className={`h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--accent)]/25 to-transparent transition-all duration-1000 ease-out ${
          active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
}
