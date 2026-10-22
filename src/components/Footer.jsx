import React from "react";
import { profile } from "../content/profile";
import { getAsset } from "../utils/assets";
import { getProfileLinks } from "../utils/profileLinks";
import { FiGithub, FiLinkedin, FiDownload } from "react-icons/fi";

export default function Footer() {
  const resume = getAsset(profile.resume);
  const githubLink = getProfileLinks(["github"])[0]?.href || profile.links?.github;
  const linkedinLink = getProfileLinks(["linkedin"])[0]?.href || profile.links?.linkedin;

  return (
    <footer className="relative z-10 mt-32 border-t border-[var(--border)] bg-[#050507] py-12 pb-24 md:pb-16 select-none">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 md:flex-row text-center md:text-left">
        <div>
          <p className="text-xl font-extrabold text-white tracking-tight">
            {profile.name}
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            {profile.role} · {profile.specialization}
          </p>
          {resume && (
            <a
              href={resume}
              download={profile.resumeDownloadName || "Sameera_Bhoyar_Resume.pdf"}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
            >
              <FiDownload aria-hidden="true" />
              <span>Download resume</span>
            </a>
          )}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >
              <FiGithub size={18} aria-hidden="true" />
            </a>
          )}
          {linkedinLink && (
            <a
              href={linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >
              <FiLinkedin size={18} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-[var(--muted)] flex flex-col gap-1.5 items-center">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        <p className="text-[11px] text-zinc-500 max-w-xl mx-auto">
          This site records anonymous visit data (IP address, approximate location, device) for analytics and security.
        </p>
      </div>
    </footer>
  );
}
