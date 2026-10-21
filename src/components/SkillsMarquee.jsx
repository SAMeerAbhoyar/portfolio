import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillGroups } from "../content/skills";

gsap.registerPlugin(ScrollTrigger);

export default function SkillsMarquee() {
  const containerRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  // Extract all skills with logos
  const skillsWithLogos = skillGroups
    .flatMap((group) => group.skills)
    .filter((skill) => skill.logo);

  const uniqueSkills = Array.from(
    new Map(skillsWithLogos.map((s) => [s.logo, s])).values()
  );

  const half = Math.ceil(uniqueSkills.length / 2);
  const row1Skills = uniqueSkills.slice(0, half);
  const row2Skills = uniqueSkills.slice(half);

  const isHoveredRef = useRef(false);

  // Duplicate 4x so 1 loop cycle = 25% for a seamless 90s duration
  const row1Duplicated = [
    ...row1Skills,
    ...row1Skills,
    ...row1Skills,
    ...row1Skills,
  ];
  const row2Duplicated = [
    ...row2Skills,
    ...row2Skills,
    ...row2Skills,
    ...row2Skills,
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    let row1X = 0;
    let row2X = -25;
    let currentMultiplier = 1.0;
    let targetMultiplier = 1.0;
    let animId = null;
    let lastTime = performance.now();

    // ScrollTrigger to detect scroll velocity, capped to at most 1.3x boost
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const vel = Math.abs(self.getVelocity());
        targetMultiplier = Math.min(1.0 + vel * 0.00025, 1.3);
      },
    });

    // RAF loop with delta-time for exact 90-second loop duration
    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (!isHoveredRef.current) {
        // Smoothly ease multiplier toward target, and target back to 1.0
        currentMultiplier += (targetMultiplier - currentMultiplier) * 0.08;
        targetMultiplier += (1.0 - targetMultiplier) * 0.04;

        // Hard-cap the multiplier to 1.3x max
        const speedFactor = Math.max(1.0, Math.min(currentMultiplier, 1.3));

        // 25% of strip covered in 90 seconds:
        const baseSpeed = 25 / 90; // ~0.2778 % per second
        const delta = baseSpeed * speedFactor * dt;

        // Row 1: Leftward moving
        row1X -= delta;
        if (row1X <= -25) row1X += 25;

        // Row 2: Rightward moving (same speed, opposite direction)
        row2X += delta;
        if (row2X >= 0) row2X -= 25;

        if (row1Ref.current) {
          row1Ref.current.style.transform = `translate3d(${row1X}%, 0, 0)`;
        }
        if (row2Ref.current) {
          row2Ref.current.style.transform = `translate3d(${row2X}%, 0, 0)`;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      trigger.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      className="relative my-16 w-full overflow-hidden py-4 select-none cursor-default"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
      aria-label="Technologies and skills marquee"
    >
      {/* Row 1: Leftward moving */}
      <div
        className="flex w-max items-center gap-4 mb-3.5 will-change-transform"
        ref={row1Ref}
      >
        {row1Duplicated.map((skill, idx) => (
          <div
            key={`r1-${idx}`}
            className="flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 shadow-xs backdrop-blur transition-all duration-300 hover:border-[var(--accent)]/60 hover:bg-[var(--surface-2)] select-none shrink-0"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/95 p-1 shadow-xs">
              <img
                src={`${import.meta.env.BASE_URL}assets/skills/${skill.logo}.svg`}
                alt=""
                className="h-4 w-4 object-contain"
                loading="lazy"
              />
            </div>
            <span className="text-xs font-semibold text-zinc-300 whitespace-nowrap">
              {skill.name}
            </span>
          </div>
        ))}
      </div>

      {/* Row 2: Rightward moving (alternate direction, same speed) */}
      <div
        className="flex w-max items-center gap-4 will-change-transform"
        ref={row2Ref}
      >
        {row2Duplicated.map((skill, idx) => (
          <div
            key={`r2-${idx}`}
            className="flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 shadow-xs backdrop-blur transition-all duration-300 hover:border-[var(--accent)]/60 hover:bg-[var(--surface-2)] select-none shrink-0"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/95 p-1 shadow-xs">
              <img
                src={`${import.meta.env.BASE_URL}assets/skills/${skill.logo}.svg`}
                alt=""
                className="h-4 w-4 object-contain"
                loading="lazy"
              />
            </div>
            <span className="text-xs font-semibold text-zinc-300 whitespace-nowrap">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
