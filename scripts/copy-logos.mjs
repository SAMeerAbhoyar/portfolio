import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
const map = {
  python: "python/python-original.svg", c: "c/c-original.svg", java: "java/java-original.svg",
  javascript: "javascript/javascript-original.svg", html5: "html5/html5-original.svg", css3: "css3/css3-original.svg",
  react: "react/react-original.svg", vite: "vite/vite-original.svg", tailwindcss: "tailwindcss/tailwindcss-original.svg",
  framermotion: "framermotion/framermotion-original.svg", nodejs: "nodejs/nodejs-original.svg", fastapi: "fastapi/fastapi-original.svg",
  tensorflow: "tensorflow/tensorflow-original.svg", keras: "keras/keras-original.svg", scikitlearn: "scikitlearn/scikitlearn-original.svg",
  pandas: "pandas/pandas-original.svg", numpy: "numpy/numpy-original.svg", matplotlib: "matplotlib/matplotlib-original.svg",
  opencv: "opencv/opencv-original.svg", oracle: "oracle/oracle-original.svg", sqlite: "sqlite/sqlite-original.svg",
  firebase: "firebase/firebase-original.svg", vercel: "vercel/vercel-original.svg", githubactions: "githubactions/githubactions-original.svg",
  git: "git/git-original.svg", github: "github/github-original.svg", vscode: "vscode/vscode-original.svg",
  jupyter: "jupyter/jupyter-original.svg", googlecolab: "googlecolab/googlecolab-original.svg", eclipse: "eclipse/eclipse-original.svg",
};
const src = join("node_modules", "devicon", "icons");
const out = join("public", "assets", "skills");
mkdirSync(out, { recursive: true });
let missing = 0;
for (const [name, rel] of Object.entries(map)) {
  const from = join(src, rel);
  if (!existsSync(from)) { console.error("MISSING", rel); missing++; continue; }
  copyFileSync(from, join(out, `${name}.svg`));
}
console.log(missing ? `Done with ${missing} missing` : `Copied ${Object.keys(map).length} logos to ${out}`);
