import React from "react";

const floatingIcons = [
  { name: "python", top: "10%", left: "-8%", delay: "0s", duration: "7s" },
  { name: "react", top: "25%", right: "-8%", delay: "1.5s", duration: "8s" },
  { name: "tensorflow", top: "60%", left: "-10%", delay: "3s", duration: "9s" },
  { name: "fastapi", bottom: "15%", right: "-6%", delay: "0.8s", duration: "7.5s" },
  { name: "opencv", bottom: "35%", left: "-6%", delay: "2.2s", duration: "8.5s" },
];

export default function FloatingTechIcons() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-1 overflow-visible hidden sm:block"
      aria-hidden="true"
    >
      {floatingIcons.map((item, idx) => (
        <div
          key={idx}
          className="absolute flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700/60 bg-zinc-900/80 p-1.5 shadow-md backdrop-blur-xs opacity-50 will-change-transform animate-float-icon"
          style={{
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/skills/${item.name}.svg`}
            alt=""
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
