import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export let lenis = null;
let tickerCallback = null;

export function initSmoothScroll() {
  if (typeof window === "undefined") return null;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return null;
  }

  if (lenis) {
    return lenis;
  }

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  // Connect Lenis to ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  // Drive Lenis RAF with GSAP's ticker
  tickerCallback = (time) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  // Refresh ScrollTrigger on window resize, image load, and font ready
  const refreshST = () => {
    ScrollTrigger.refresh();
  };

  window.addEventListener("resize", refreshST);
  window.addEventListener("load", refreshST);
  if (document.fonts) {
    document.fonts.ready.then(refreshST).catch(() => {});
  }

  return lenis;
}

export function destroySmoothScroll() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

export function getLenis() {
  return lenis;
}

export function scrollToTarget(target, options = {}) {
  const opts = { offset: 0, duration: 1.2, ...options };
  if (lenis) {
    lenis.scrollTo(target, opts);
  } else {
    if (target === 0 || target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
}
