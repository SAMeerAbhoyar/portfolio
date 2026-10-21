import { SiGooglegemini, SiMediapipe } from "react-icons/si";
import { FiDatabase, FiCpu, FiLayers, FiShare2, FiMessageSquare, FiSearch, FiEye, FiSliders } from "react-icons/fi";

// logo = file name (no .svg) in public/assets/skills. icon + color = fallback when no logo file exists.
// level (1-5) is OPTIONAL: leave it out to hide the dots. Only add it if it is honest.
export const skillGroups = [
  { title: "Languages", color: "#22c55e", skills: [
    { name: "Python", logo: "python" }, { name: "C", logo: "c" }, { name: "Java", logo: "java" },
    { name: "JavaScript", logo: "javascript" }, { name: "SQL", icon: FiDatabase, color: "#38bdf8" },
    { name: "HTML5", logo: "html5" }, { name: "CSS3", logo: "css3" } ] },
  { title: "AI & ML", color: "#8b5cf6", skills: [
    { name: "Machine Learning", icon: FiCpu, color: "#a78bfa" }, { name: "Deep Learning", icon: FiLayers, color: "#a78bfa" },
    { name: "Neural Networks", icon: FiShare2, color: "#a78bfa" }, { name: "NLP", icon: FiMessageSquare, color: "#a78bfa" },
    { name: "RAG", icon: FiSearch, color: "#a78bfa" }, { name: "Computer Vision", icon: FiEye, color: "#a78bfa" } ] },
  { title: "ML Libraries & APIs", color: "#14b8a6", skills: [
    { name: "TensorFlow", logo: "tensorflow" }, { name: "Keras", logo: "keras" }, { name: "scikit-learn", logo: "scikitlearn" },
    { name: "Pandas", logo: "pandas" }, { name: "NumPy", logo: "numpy" }, { name: "Matplotlib", logo: "matplotlib" },
    { name: "OpenCV", logo: "opencv" }, { name: "MediaPipe", icon: SiMediapipe, color: "#0097A7" },
    { name: "Gemini API", icon: SiGooglegemini, color: "#8E75B2" } ] },
  { title: "Frontend", color: "#0ea5e9", skills: [
    { name: "React", logo: "react" }, { name: "Vite", logo: "vite" }, { name: "Tailwind CSS", logo: "tailwindcss" },
    { name: "Framer Motion", logo: "framermotion" } ] },
  { title: "Backend", color: "#f97316", skills: [
    { name: "Node.js", logo: "nodejs" }, { name: "FastAPI", logo: "fastapi" }, { name: "Gradio", icon: FiSliders, color: "#f97316" } ] },
  { title: "Databases", color: "#ec4899", skills: [
    { name: "Oracle", logo: "oracle" }, { name: "SQLite", logo: "sqlite" }, { name: "Firebase", logo: "firebase" } ] },
  { title: "Deployment & CI/CD", color: "#6366f1", skills: [
    { name: "Vercel", logo: "vercel" }, { name: "GitHub Actions", logo: "githubactions" } ] },
  { title: "Tools & More", color: "#eab308", skills: [
    { name: "Git", logo: "git" }, { name: "GitHub", logo: "github" }, { name: "VS Code", logo: "vscode" },
    { name: "Jupyter Notebook", logo: "jupyter" }, { name: "Google Colab", logo: "googlecolab" }, { name: "Eclipse", logo: "eclipse" } ] },
];
