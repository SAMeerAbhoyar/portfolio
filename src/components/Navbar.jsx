import React, { useState, useEffect, useRef } from "react";
import { FiX, FiMail, FiGithub, FiLinkedin, FiArrowUpRight } from "react-icons/fi";
import { profile } from "../content/profile";
import { getProfileLinks } from "../utils/profileLinks";
import { lenis, scrollToTarget } from "../lib/lenis";

const OVERLAY_NAV_ITEMS = [
  { id: "home", label: "Home", num: "01" },
  { id: "about", label: "About", num: "02" },
  { id: "skills", label: "Skills", num: "03" },
  { id: "projects", label: "Projects", num: "04" },
  { id: "experience", label: "Experience", num: "05" },
  { id: "research", label: "Research", num: "06" },
  { id: "certifications", label: "Certifications", num: "07" },
  { id: "education", label: "Education", num: "08" },
  { id: "contact", label: "Contact", num: "09" },
];

const BOTTOM_NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const SCRAMBLE_CHARS = "01!@#$%^&*<>~+/";

function ScrambleLink({ label, num, id, onClick }) {
  const [text, setText] = useState(label);
  const intervalRef = useRef(null);

  const handleMouseEnter = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setText(
        label
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return label[index];
            }
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= label.length) {
        clearInterval(intervalRef.current);
      }
      iteration += 1 / 2;
    }, 28);
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setText(label);
  };

  return (
    <a
      href={`#${id}`}
      onClick={(e) => {
        e.preventDefault();
        onClick(id);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex items-baseline gap-4 py-1 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white transition-all duration-300 hover:text-[var(--accent)] hover:translate-x-2 focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer"
    >
      <span className="text-xs sm:text-sm font-mono font-normal text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
        {num}
      </span>
      <span className="tracking-tight">{text}</span>
      <FiArrowUpRight
        size={20}
        className="opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-[var(--accent)]"
        aria-hidden="true"
      />
    </a>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeBottomSection, setActiveBottomSection] = useState("home");
  const overlayRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (menuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [menuOpen]);

  // Track active section for bottom pill nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (["home", "projects", "about", "contact"].includes(id)) {
              setActiveBottomSection(id);
            }
          }
        });
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );

    ["home", "projects", "about", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => {
    document.body.style.overflow = "";
    setMenuOpen(false);
    const target = id === "home" ? "#home" : `#${id}`;
    if (lenis) {
      lenis.scrollTo(target, { offset: 0, duration: 1.2 });
    } else {
      scrollToTarget(target, { offset: 0, duration: 1.2 });
    }
  };

  const githubLink = getProfileLinks(["github"])[0]?.href || profile.links?.github;
  const linkedinLink = getProfileLinks(["linkedin"])[0]?.href || profile.links?.linkedin;

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          (a) Floating "Menu +" Button fixed top-right
      ───────────────────────────────────────────────────────────── */}
      <div className="fixed top-5 right-5 sm:top-7 sm:right-8 z-50 flex items-center gap-6">
        {/* Dive In + Button with 24px gap to the left of MENU */}
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
          className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0c0c11]/85 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_20px_rgba(239,91,79,0.3)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          <span>Dive In</span>
          <span className="text-[var(--accent)] text-base font-extrabold transition-transform duration-300 group-hover:rotate-45">
            +
          </span>
        </button>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="fullscreen-menu-overlay"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="group relative flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0c0c11]/85 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wide text-white backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_0_20px_rgba(239,91,79,0.3)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
          </span>
          <span className="transition-colors group-hover:text-[var(--accent)]">
            {menuOpen ? "CLOSE" : "MENU"}
          </span>
          <span className="text-base font-bold text-[var(--accent)] transition-transform duration-300 group-hover:rotate-45">
            {menuOpen ? "×" : "+"}
          </span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Fullscreen Overlay Menu with Staggered Links & Text Scramble
      ───────────────────────────────────────────────────────────── */}
      <div
        id="fullscreen-menu-overlay"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation"
        className={`fixed inset-0 z-[9990] flex flex-col justify-between bg-[#050507]/97 backdrop-blur-2xl px-6 py-8 sm:p-12 md:p-16 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen
            ? "opacity-100 pointer-events-auto scale-100"
            : "opacity-0 pointer-events-none scale-95"
        }`}
      >
        {/* Subtle background glow */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[var(--accent)]/15 blur-[140px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[var(--accent)]/10 blur-[140px]"
          aria-hidden="true"
        />

        {/* Overlay Top Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
              NAVIGATION
            </span>
            <span className="text-sm font-bold text-white tracking-wider">
              {profile.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-[#12121a] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            <span>Close</span>
            <FiX size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Overlay Center: Large Staggered Links with Text Scramble */}
        <nav
          aria-label="Full-screen menu"
          className="relative z-10 my-auto py-8 max-h-[60vh] overflow-y-auto pr-2"
        >
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-12 max-w-5xl mx-auto">
            {OVERLAY_NAV_ITEMS.map((item, idx) => (
              <li
                key={item.id}
                className="overflow-hidden"
                style={{
                  transitionDelay: menuOpen ? `${idx * 40}ms` : "0ms",
                }}
              >
                <ScrambleLink
                  label={item.label}
                  num={item.num}
                  id={item.id}
                  onClick={handleNavClick}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Overlay Bottom: Email & Social Links */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-[var(--muted)]">
          <div>
            {profile.links?.email && (
              <a
                href={`mailto:${profile.links.email}`}
                className="inline-flex items-center gap-2 text-white hover:text-[var(--accent)] transition-colors font-medium"
              >
                <FiMail className="text-[var(--accent)]" aria-hidden="true" />
                <span>{profile.links.email}</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-6">
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <FiGithub aria-hidden="true" />
                <span>GitHub</span>
              </a>
            )}
            {linkedinLink && (
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <FiLinkedin aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          (b) Pill-Shaped Bottom-Center Floating Nav
      ───────────────────────────────────────────────────────────── */}
      <nav
        aria-label="Floating quick navigation"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="flex items-center rounded-full border border-white/15 bg-[#0c0c11]/90 p-1.5 shadow-2xl shadow-black/80 backdrop-blur-xl">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive = activeBottomSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                  isActive
                    ? "bg-white text-black shadow-md scale-105"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
