// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE to personalise the site.
// Anything written as "[Like this]" renders as a dashed placeholder.
// Empty links ("") are hidden automatically — nothing broken is shown.
// ─────────────────────────────────────────────────────────────

export const COLLEGE_NAME = "Symbiosis Institute of Technology, Nagpur"; // edit if the official name differs

export const profile = {
  name: "Sameera Bhoyar",
  shortHandle: "SAMeerAbhoyar",
  tagline: "BUILDING INTELLIGENT SYSTEMS.",
  availability: "Open to Work / Collaboration",
  role: "Computer Science and Engineering Student",
  specialization: "Artificial Intelligence and Machine Learning",
  intro:
    "I'm a Computer Science and Engineering student specializing in Artificial Intelligence and Machine Learning. I'm interested in AI/ML, software development and research, and I enjoy turning ideas into practical technology solutions.",
  about: [
    "I am Sameera Bhoyar, a Computer Science Engineering student at Symbiosis Institute of Technology, Nagpur, specializing in Artificial Intelligence and Machine Learning.",
    "I build intelligent systems that solve real problems: a multimodal deepfake detector, an AI agent that recommends government schemes, and a contract risk analysis tool, backed by AI and machine learning internships at Elevate Labs and Maincrafts Technology.",
    "I co-authored a research paper on IoT-enabled health monitoring, presented at IEEE ICETET-SIP 2025, and as Student Placement Representative I learned to communicate clearly and coordinate with people.",
    "I turn curiosity into working technology, and I am always looking for the next hard problem to solve.",
  ],
  quickFacts: [
    { label: "Degree", value: "B.Tech, Computer Science and Engineering" },
    { label: "Specialization", value: "Artificial Intelligence and Machine Learning" },
    { label: "Institution", value: COLLEGE_NAME },
    { label: "Interests", value: "AI/ML, Software Development, Research" },
  ],

  // Photo: drop a file into src/assets/profile/ and set its path here.
  // If the file is missing, a placeholder is shown.
  photo: "profile/photo-2.jpg",

  // Resume: drop a PDF into src/assets/resume/ and set its path here (or use a full https URL).
  // If the file is missing, the Download Resume button is hidden in production.
  resume: "resume/Sameera_Bhoyar_Resume.pdf",
  resumeDownloadName: "Sameera_Bhoyar_Resume.pdf",

  // Real URLs only. Leave "" to hide.
  links: {
    github: "https://github.com/SAMeerAbhoyar",
    linkedin: "https://www.linkedin.com/in/sameera-bhoyar-a48394307/",
    leetcode: "",
    hackerrank: "",
    codechef: "",
    email: "sameerabhoyar009@gmail.com",
  },
};

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "certifications", label: "Certifications" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];
