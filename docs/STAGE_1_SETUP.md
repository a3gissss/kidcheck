# Stage 1: Project Setup (Windows PowerShell)

Goal: a React app that runs locally with routing, Tailwind, tests, safe env vars, and a GitHub repo.

> If you use the code in this folder, the files below already exist. Just run `npm install`, add `.env.local`, and skip to step 5.

## 1. Create the project

```powershell
npm create vite@latest kidcheck -- --template react
```
If Vite asks "Install with npm and start now?", answer **No**. Answering Yes starts the dev server, and pasting more commands then kills it (that caused error `3221225786` on Oct 28).

```powershell
cd kidcheck
npm install
```

## 2. Install dependencies (one line at a time)

```powershell
npm install react-router-dom
npm install tailwindcss @tailwindcss/vite
npm install -D vitest
npm pkg set 'scripts.test=vitest run'
mkdir src/components, src/pages, src/lib, api -Force
Remove-Item src/App.css -ErrorAction SilentlyContinue
```

Check: `npm pkg get scripts.test` prints `"vitest run"`.

## 3. Files

Create these in VS Code (`code .`). Full code is in this repo:

| File | Purpose |
|---|---|
| `vite.config.js` | React + Tailwind plugins, Vitest config |
| `src/index.css` | `@import "tailwindcss";` |
| `src/main.jsx` | Wraps the app in `BrowserRouter` |
| `src/App.jsx` | Routes: `/`, `/new`, `/cases`, `*` |
| `src/components/Layout.jsx` | Disclaimer bar, nav, footer |
| `src/pages/Landing.jsx` | Heading and "Start a new case" button |
| `src/pages/NewCase.jsx` | Placeholder |
| `src/pages/CaseLog.jsx` | Placeholder |
| `src/pages/NotFound.jsx` | 404 page |
| `src/lib/sanity.test.js` | Proves tests run (delete in Stage 3) |

## 4. Secrets

`.gitignore` must contain:
```
.env
.env.local
.vercel
```

`.env.example` (committed):
```
GEMINI_API_KEY=your_key_here
```

`.env.local` (never committed; create it in VS Code so Windows doesn't add `.txt`):
```
GEMINI_API_KEY=AIza...your_real_key
```

Never use the `VITE_` prefix: Vite bundles those into browser code.

## 5. Run

```powershell
npm run dev
```
Open http://localhost:5173. Use a **second terminal** for:
```powershell
npm test
```

## 6. Push to GitHub

Create an **empty** repo `kidcheck` on github.com (no README), then:
```powershell
git init
git add .
git status          # .env.local must NOT be listed
git commit -m "Stage 1: project setup"
git branch -M main
git remote add origin https://github.com/a3gissss/kidcheck.git
git push -u origin main
```

## Checklist

| Check | Expected |
|---|---|
| `npm run dev` | Page loads, no red errors |
| Landing page | Amber disclaimer bar, heading, teal button |
| "Start a new case" | Goes to `/new` instantly |
| Active nav link | Teal background |
| `/abc` | "Page not found" |
| Phone width (F12, device icon) | No sideways scroll |
| `npm test` | `1 passed` |
| GitHub | No `.env.local` |

## Windows gotchas

| Problem | Fix |
|---|---|
| `mkdir -p` fails | PowerShell: `mkdir a, b, c -Force` |
| `npm pkg set` "expects key=value" | Wrap in single quotes: `'scripts.test=vitest run'` |
| Commands glued together on paste | Paste and run one line at a time |
| Error `3221225786` | Dev server was stopped (Ctrl+C); not a real error |
