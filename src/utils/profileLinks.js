import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { SiLeetcode, SiHackerrank, SiCodechef } from "react-icons/si";
import { profile } from "../content/profile";
import { isValidUrl } from "./assets";

const defs = [
  { key: "github", label: "GitHub", icon: FiGithub },
  { key: "linkedin", label: "LinkedIn", icon: FiLinkedin },
  { key: "leetcode", label: "LeetCode", icon: SiLeetcode },
  { key: "hackerrank", label: "HackerRank", icon: SiHackerrank },
  { key: "codechef", label: "CodeChef", icon: SiCodechef },
];

export const getProfileLinks = (only) => {
  const l = profile.links;
  const out = defs
    .filter((d) => (!only || only.includes(d.key)) && isValidUrl(l[d.key]))
    .map((d) => ({ ...d, href: l[d.key] }));
  if ((!only || only.includes("email")) && l.email && /^\S+@\S+\.\S+$/.test(l.email)) {
    out.push({ key: "email", label: "Email", icon: FiMail, href: `mailto:${l.email}` });
  }
  return out;
};

