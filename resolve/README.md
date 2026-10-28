# Resolve – AI Front Desk & Operations Hub

Static front end + one serverless function.
- **AI**: Groq (`llama-3.3-70b-versatile`) via `api/chat.js` – key stays on the server.
- **Database**: Supabase (records + knowledge base). Falls back to browser localStorage if not configured.
- **Hosting**: Vercel (no build step).

Booking, emergency, pricing and lead flows are rule-based (reliable record creation). Everything else goes to Groq, grounded in your Knowledge Base; if Groq is unreachable the old keyword matching is used.

## Files
| File | Purpose |
|---|---|
| `index.html`, `style.css`, `app.js` | The app |
| `config.js` | Your Supabase URL + anon key (public values) |
| `api/chat.js` | Groq proxy (Vercel serverless function) |
| `supabase.sql` | Tables + demo policies, run once |
| `server.js`, `open.bat` | Local dev server (Windows: double-click `open.bat`) |
| `.env.example` | Template for the Groq key |

## 1. Supabase (5 min)
1. Create a project at supabase.com.
2. SQL Editor -> paste `supabase.sql` -> Run.
3. Settings -> API: copy **Project URL** and **anon public** key into `config.js`.
The first load seeds the sample records and knowledge base automatically.

## 2. Groq key
Create a key at console.groq.com. **Never put it in any front-end file or commit it.**

## 3. Run locally
```
copy .env.example .env      (then edit .env and paste your key)
node server.js              (or double-click open.bat)
```
Opens http://localhost:3000. Needs Node 18+.

## 4. Deploy to Vercel
1. Push this folder to a GitHub repo (`.env` is git-ignored).
2. vercel.com -> Add New Project -> import repo. Framework: **Other**, no build command, no output dir.
3. Settings -> Environment Variables -> add `GROQ_API_KEY` (all environments) -> Deploy.
(Or CLI: `npm i -g vercel`, `vercel`, `vercel env add GROQ_API_KEY`, `vercel --prod`.)

## Before real customers use it
- The check-in form is not authentication; it only personalizes the chat and is stored in the browser.
- The SQL ships with **open demo policies**: anyone with your anon key can read/write all rows (including customer phones/addresses). Add Supabase Auth and tighten RLS for production.
- `/api/chat` has only a basic in-memory rate limit. Add Upstash/Vercel KV limits for production.
- If a key was ever pasted anywhere public, revoke it and make a new one.

## Shortcuts
`Ctrl/Cmd+K` search · `Esc` close panels · `Enter` send
