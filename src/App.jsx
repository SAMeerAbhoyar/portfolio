import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FiArrowUp } from "react-icons/fi";

import { initSmoothScroll, destroySmoothScroll, scrollToTarget } from "./utils/scroll";

import ParticleField from "./components/ParticleField";
import CursorSpotlight from "./components/CursorSpotlight";
import ParallaxBlobs from "./components/ParallaxBlobs";
import CustomCursor from "./components/CustomCursor";
import SkillsMarquee from "./components/SkillsMarquee";
import SectionDivider from "./components/SectionDivider";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Focus from "./sections/Focus";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Research from "./sections/Research";
import Certifications from "./sections/Certifications";
import Education from "./sections/Education";
import Contact from "./sections/Contact";

function App() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Initialize Lenis + GSAP ScrollTrigger smooth scroll engine
  useEffect(() => {
    initSmoothScroll();
    return () => {
      destroySmoothScroll();
    };
  }, []);

  // AOS scroll-reveal initialization (fade + 40px slide)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    AOS.init({
      disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      duration: isMobile ? 650 : 850,
      offset: 40,
      once: true,
      easing: "ease-out-cubic",
    });
    AOS.refresh();
  }, []);

  // Back to Top button visibility
  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050507] text-white selection:bg-[#ef5b4f]/30 selection:text-white">
      {/* Background Noise / Grain Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-grain opacity-50"
        aria-hidden="true"
      />

      {/* Subtle Coral Ambient Radial Glows */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 -z-10 h-[700px] w-[900px] rounded-full coral-glow-bg opacity-75"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed top-1/2 -left-40 -z-10 h-[600px] w-[600px] rounded-full coral-glow-soft opacity-60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-10 right-0 -z-10 h-[700px] w-[700px] rounded-full coral-glow-soft opacity-60"
        aria-hidden="true"
      />

      {/* Particles, Spotlight & Parallax Blobs */}
      <ParticleField />
      <CursorSpotlight />
      <ParallaxBlobs />
      <CustomCursor />

      {/* Full-Bleed Hero */}
      <Hero />

      {/* Full-Bleed Infinite Skills Marquee */}
      <SkillsMarquee />

      {/* Full-Bleed Pinned WebGL Silk Shader About Section */}
      <About />

      {/* Containerized Core Sections with 120px bottom padding for floating pill nav */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-[120px] overflow-x-clip">
        <Focus />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Research />
        <SectionDivider />
        <Certifications />
        <SectionDivider />
        <Education />
        <SectionDivider />
        <Contact />
      </main>

      {/* Smooth Back to Top Button */}
      <button
        type="button"
        onClick={() => scrollToTarget(0)}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[#0c0c11]/90 text-[var(--accent)] shadow-xl shadow-black/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white hover:shadow-[0_0_20px_rgba(239,91,79,0.4)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer ${
          showTopBtn
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none translate-y-4"
        }`}
      >
        <FiArrowUp size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export default App;
