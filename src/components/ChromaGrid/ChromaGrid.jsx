import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { FiInfo, FiGithub, FiExternalLink } from "react-icons/fi";
import "./ChromaGrid.css";

export const ChromaGrid = ({
  items,
  onItemClick,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const data = items?.length ? items : [];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        "--r": `${radius}px`,
        "--cols": columns,
        "--rows": rows,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={c.id || i}
          className="chroma-card group"
          data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
          data-aos-duration="900"
          data-aos-delay={(i % 3) * 150}
          data-aos-once="true"
          onMouseMove={handleCardMove}
          onClick={() => onItemClick(c)}
          style={{
            "--card-border": c.borderColor || "transparent",
            "--card-gradient": c.gradient,
            cursor: "pointer",
          }}
        >
          {/* 1. Preview */}
          <div className="chroma-img-wrapper h-56 w-full shrink-0">
            {c.preview ? (
              c.preview
            ) : (
              <img src={c.image} alt={c.title} loading="lazy" />
            )}
          </div>

          <div className="chroma-info">
            {/* 2. Category tag */}
            <div>
              <span className="inline-block rounded-full border border-violet-500/40 bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                {c.category}
              </span>
            </div>

            {/* 3. Title */}
            <h3 className="name text-lg font-bold text-white line-clamp-1 group-hover:text-violet-300 transition-colors">
              {c.title}
            </h3>

            {/* 4. 2-line description */}
            <p className="description text-sm text-zinc-300 line-clamp-2 leading-relaxed">
              {c.description}
            </p>

            {/* 5. Tech tags */}
            {c.tech?.length > 0 && (
              <ul className="flex flex-wrap gap-1.5 mt-auto pt-1">
                {c.tech.map((t, idx) => (
                  <li
                    key={idx}
                    className="rounded-md border border-zinc-700/60 bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-300"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}

            {/* 6. Details button & 7. GitHub / Live demo buttons */}
            <div className="card-actions mt-2 flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick(c);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/50 bg-violet-600/20 px-3 py-1.5 text-xs font-semibold text-violet-200 hover:bg-violet-600 hover:text-white transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-400"
              >
                <FiInfo size={14} /> Details
              </button>
              {c.github && (
                <a
                  href={c.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/90 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500 hover:text-white transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-400"
                >
                  <FiGithub size={14} /> Code
                </a>
              )}
              {c.demo && (
                <a
                  href={c.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/90 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500 hover:text-white transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-400"
                >
                  <FiExternalLink size={14} /> Live demo
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
