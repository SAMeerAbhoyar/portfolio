import { COLLEGE_NAME } from "./profile";

// Experience & positions of responsibility. Add internships, research, volunteering, etc. as new entries.
// type: "Position of Responsibility" | "Internship" | "Research" | "Volunteering" | "Other"
// Keep only responsibilities that accurately match what you actually did.
export const experiences = [
  {
    id: "spr",
    featured: true,
    type: "Position of Responsibility",
    title: "Student Placement Representative (SPR)",
    organization: COLLEGE_NAME,
    duration: "",
    responsibilities: [
      "Coordinated communication between students and the college placement team.",
      "Shared placement updates and announcements with students.",
      "Supported placement-related activities.",
    ],
    impact: [],
  },
  {
    id: "maincrafts",
    type: "Internship",
    title: "AI & Machine Learning Intern (Virtual)",
    organization: "Maincrafts Technology",
    duration: "May 2026 – June 2026",
    responsibilities: [
      "Completed four sequential machine learning tasks during a one-month virtual internship.",
      "Built a linear regression model on the California Housing dataset.",
      "Compared multiple models with feature engineering, then applied cross-validation and hyperparameter tuning.",
      "Built a binary classifier on the Breast Cancer Wisconsin dataset.",
      "Documented the work in an internship report and presentation.",
    ],
    impact: [],
  },
  {
    id: "elevate-labs",
    type: "Internship",
    title: "Artificial Intelligence and Machine Learning Intern",
    organization: "Elevate Labs",
    duration: "10 Nov 2025 – 25 Dec 2025",
    responsibilities: [
      "Completed hands-on tasks in supervised learning, data preprocessing and model evaluation using Python, scikit-learn and Pandas.",
      "Received a Certificate of Completion with a Best Performer recognition.",
    ],
    impact: [],
  },
];
