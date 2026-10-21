import { useState, useEffect } from "react";

export default function Typewriter({
  words = [
    "Computer Science and Engineering Student",
    "Software Developer",
    "Research Enthusiast",
  ],
  typeSpeed = 70,
  deleteSpeed = 40,
  pauseTime = 1800,
}) {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setDisplayed(words[0]);
      return;
    }

    const currentWord = words[wordIdx];
    let timeout;

    if (!isDeleting && displayed === currentWord) {
      // Pause at full word
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && displayed === "") {
      // Finished deleting, move to next word
      setIsDeleting(false);
      setWordIdx((prev) => (prev + 1) % words.length);
    } else {
      // Typing or deleting
      const nextLength = isDeleting ? displayed.length - 1 : displayed.length + 1;
      timeout = setTimeout(
        () => {
          setDisplayed(currentWord.slice(0, nextLength));
        },
        isDeleting ? deleteSpeed : typeSpeed
      );
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIdx, words, typeSpeed, deleteSpeed, pauseTime]);

  return (
    <span className="inline-flex items-center" aria-live="polite">
      <span>{displayed}</span>
      <span
        className="ml-0.5 inline-block h-4 w-[2px] bg-[var(--accent)] animate-pulse"
        aria-hidden="true"
      />
    </span>
  );
}
