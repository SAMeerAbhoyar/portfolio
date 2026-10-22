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

## Backend setup

The portfolio includes Vercel Serverless Functions in `/api` for contact form submissions (`/api/contact`) and anonymous visit tracking (`/api/visit`).

### Environment Variables

Configure these environment variables in your Vercel Project Settings (or in a local `.env` for local testing with Vercel CLI). Do not commit real keys to source control:

- `SUPABASE_URL`: Your Supabase Project URL (e.g. `https://your-project.supabase.co`).
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase `service_role` secret key (used strictly server-side by serverless functions to insert rows).
- `RESEND_API_KEY`: *(Optional)* Your Resend API key to receive notification emails when someone contacts you.
- `CONTACT_TO_EMAIL`: *(Optional)* The destination email address where contact messages should be delivered (required if `RESEND_API_KEY` is provided).

### Supabase SQL Schema

Execute the following SQL in your Supabase SQL Editor to create the `visits` and `messages` tables:

```sql
-- 1. Anonymous visit logging table
create table if not exists visits (
  id bigint generated always as identity primary key,
  created_at timestamptz default now() not null,
  ip text,
  country text,
  region text,
  city text,
  user_agent text,
  referrer text,
  path text,
  language text
);

-- 2. Contact form messages table
create table if not exists messages (
  id bigint generated always as identity primary key,
  created_at timestamptz default now() not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  ip text
);
```

> **Security Note:** Anonymous visit logs and messages are only recorded on the server and are never exposed or fetched anywhere in the frontend.

## Deploy under a sub-path (GitHub Pages)
Set `VITE_BASE_PATH=/your-repo-name/` before `npm run build`.
