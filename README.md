<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=230&section=header&text=Resolve&fontSize=76&fontAlignY=36&animation=fadeIn&desc=AI%20Front%20Desk%20%26%20Operations%20Hub&descSize=22&descAlignY=58" alt="Resolve banner" width="100%"/>

<a href="https://github.com/vivekanand9/resolve-ai-front-desk">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=22&duration=3000&pause=900&color=6246D8&center=true&vCenter=true&width=640&lines=Customer+care%2C+handled.;Book+repairs+in+one+chat.;Emergencies+escalated+instantly.;Powered+by+Groq+%2B+Supabase.;Deployed+on+Vercel." alt="Typing animation" />
</a>

<br/>

![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203.3-F55036?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Build](https://img.shields.io/badge/Build%20step-none-6246D8?style=for-the-badge)

</div>

---

## ✨ What is Resolve?

**Resolve** is an AI front desk and operations hub for service and repair businesses. A chat concierge on the left handles visitors, and a live operations feed on the right lets your team manage every booking, ticket and lead.

| 💬 Front Desk AI | 📋 Operations Hub | 📚 Knowledge Base |
|---|---|---|
| Books repairs, quotes fees, escalates emergencies | Status, technician assignment, staff notes, CSV export | Edit answers once, the AI uses them instantly |

---

## 🧠 How it works

```mermaid
flowchart LR
    A[👤 Visitor] --> B[🌐 Browser app]
    B -->|booking / emergency / pricing / lead| C[⚙️ Rule-based flows]
    B -->|everything else| D[☁️ /api/chat on Vercel]
    D --> E[🤖 Groq LLM]
    C --> F[(🗄️ Supabase)]
    B <-->|records + knowledge base| F
```

Booking, emergency, pricing and lead flows are rule-based, so records are always created correctly. Everything else goes to Groq, grounded in your Knowledge Base. If Groq is unreachable, keyword matching takes over.

---

## 🚀 Features

- 🪄 **Two-step visitor check-in** with name, phone, address and PIN validation
- 📅 **Guided booking** with appliance, time slot and a downloadable `.ics` calendar invite
- 🚨 **Emergency detection** for smoke, sparks and leaks, which raises a priority ticket and a safety warning
- 🎯 **Lead capture** for AMC and callback requests
- 🗂️ **Operations drawer** with status, technician, notes and an activity timeline
- 🔎 **Search and filters**, plus `Ctrl + K` to jump to search
- 🎙️ **Voice** input (speech-to-text) and optional read-aloud replies
- 🌗 **Light and dark themes**
- ☁️ **Cloud sync** through Supabase, with a localStorage fallback

---

## 📁 Project structure

```text
resolve/
├── index.html        # app markup
├── style.css         # styles
├── app.js            # app logic, Supabase + chat engine
├── config.js         # Supabase URL + publishable key
├── api/
│   └── chat.js       # Vercel serverless function → Groq
├── supabase.sql      # tables + demo policies
├── server.js         # local dev server
├── open.bat          # Windows launcher
├── vercel.json
├── package.json
└── .env.example      # template for GROQ_API_KEY
```

---

## ⚡ Quick start

**1. Create the database**
Open Supabase → SQL Editor → paste `supabase.sql` → Run.

**2. Add your keys**
```js
// config.js  (public values)
window.RESOLVE_CONFIG = {
  SUPABASE_URL: 'https://YOUR-PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_PUBLISHABLE_KEY'
};
```
```bash
# .env  (private, never commit)
GROQ_API_KEY=your_groq_key
```

**3. Run locally** (Node 18+)
```bash
node server.js
```
Then open **http://localhost:3000**.

---

## ▲ Deploy to Vercel

1. Push this folder to GitHub (`.env` is git-ignored).
2. Import the repo on [vercel.com](https://vercel.com), with framework **Other** and no build command.
3. Add the environment variable `GROQ_API_KEY`.
4. Click **Deploy** 🎉

---

## 🔐 Before going to production

> [!WARNING]
> - The demo SQL policies let anyone with the public key read and write all rows. Add **Supabase Auth** and tighter row-level security before real customers use it.
> - The check-in form is not authentication.
> - Add proper rate limiting (Upstash or Vercel KV) to `/api/chat`.
> - Never commit `.env` or your Groq and Supabase secret keys.

---

## ⌨️ Shortcuts

| Key | Action |
|---|---|
| `Ctrl` / `Cmd` + `K` | Focus search |
| `Esc` | Close drawer or modal |
| `Enter` | Send message |

---

<div align="center">

Built with ❤️ using vanilla JS, Groq, Supabase and Vercel

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=110&section=footer" width="100%" alt="footer"/>

</div>
