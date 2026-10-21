# Sameera Bhoyar — Portfolio (React + Vite + Tailwind)

## Run
    npm install
    npm run dev
    npm run build

## Where to edit (everything is data-driven)
- Name, intro, links (GitHub, LinkedIn, LeetCode, HackerRank, CodeChef, email), photo and resume paths: `src/content/profile.js`
- Skills: `src/content/skills.js`
- Projects: `src/content/projects.js`
- Research papers: `src/content/research.js`
- Certifications: `src/content/certifications.js`
- Experience / positions (SPR is first): `src/content/experience.js`
- Education: `src/content/education.js`

Notes:
- Values written as `[Like this]` show as dashed placeholders until you replace them.
- Empty links (`""`) are hidden automatically.
- Drop files into `src/assets/` (`profile/photo.jpg`, `resume/Sameera_Bhoyar_Resume.pdf`, `projects/`, `certificates/`, `papers/`) and reference them by path, e.g. `"certificates/ml.png"`.
- The Download Resume button is hidden in production until the PDF exists.

## Contact form
Copy `.env.example` to `.env` and set `VITE_CONTACT_ENDPOINT` (e.g. a Formspree URL). Without it the form validates but clearly says the message was NOT sent. Never put secrets in frontend code.

## Deploy under a sub-path (GitHub Pages)
Set `VITE_BASE_PATH=/your-repo-name/` before `npm run build`.
