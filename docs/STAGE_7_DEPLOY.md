# Stage 7: Deploy to Vercel

Goal: KidCheck live on a public URL, with the Gemini key kept on Vercel's servers.

## Already prepared and tested locally

| What | Where | Tested |
|---|---|---|
| Opening `/cases/KC-...` or `/new` directly, or reloading them, loads the app | `vercel.json` rewrites (everything except `/api/`) | Deep link and reload on the production build |
| Security headers: Content Security Policy (own files only, no framing), nosniff, referrer policy, camera/mic/location off | `vercel.json` headers | Full journey under the policy with no violations |
| API answers are never cached | `vercel.json` (`Cache-Control: no-store` on `/api/`) | `npm run preview` |
| `/api/extract` serverless function | `api/extract.js` | 3 tests of Vercel's request/response contract (`server/vercel-handler.test.js`) |
| Node 20 or newer | `package.json` `engines` | |
| Production build checked locally with the same headers and API | `npm run build`, then `npm run preview` (http://localhost:4173) | Yes |

Vercel detects Vite and runs `npm run build`, serving `dist/`. No build settings to change.

## Your steps

### 1. Put the code on GitHub

Create an **empty** repository named `kidcheck` at https://github.com/new under `a3gissss` (no README, no .gitignore, no licence). Then, in PowerShell inside the `kidcheck` project folder (the one with `package.json`):

```powershell
git init
git add .
git status
```

Check that `git status` does **not** list `.env.local`, `node_modules` or `dist`. Then:

```powershell
git commit -m "KidCheck: Stages 1 to 7"
git branch -M main
git remote add origin https://github.com/a3gissss/kidcheck.git
git push -u origin main
```

### 2. Import into Vercel

1. Go to https://vercel.com and choose **Continue with GitHub** (free Hobby plan).
2. **Add New → Project**, then **Import** next to `kidcheck`.
3. Framework Preset: **Vite** (detected). Leave the build settings as they are.
4. Open **Environment Variables** and add:
   - `GEMINI_API_KEY`: your key from AI Studio. Paste it here, never in the code.
   - Optional: `GEMINI_MODEL` (default `gemini-3.5-flash-lite`).
5. **Deploy.** Your URL looks like `https://kidcheck-xxxx.vercel.app`.

Changing an environment variable later needs a **Redeploy** (Deployments → ⋯ → Redeploy) before it takes effect.

### 3. Check the live site

| Check | Expected |
|---|---|
| Open the URL | Landing page, amber disclaimer, teal check icon in the tab |
| Demo "Fast breathing, vomiting" → Fill checklist with AI | Answers filled with AI badges (not the amber "AI unavailable") |
| Finish and save | Red full-screen alert, then *Refer urgently* |
| Reload the case page | Same case, no alert |
| "Fill checklist myself" | Works the same without AI |
| Phone browser | No sideways scroll |
| `curl.exe -I https://YOUR-URL` | `Content-Security-Policy` and `X-Frame-Options: DENY` present |
| F12 → Console | No red errors |

If the AI shows "AI unavailable": check the variable name is exactly `GEMINI_API_KEY`, redeploy, then look at Vercel → Project → **Logs** for `extract failed:` lines (they never include the CHW's text).

## Live result (Nov 3, 2026)

Deployed at **https://kidcheck-three.vercel.app** from `github.com/a3gissss/kidcheck` (branch `main`).

| Check | Result |
|---|---|
| Security headers | CSP, X-Frame-Options DENY, nosniff, Referrer-Policy and Permissions-Policy present; Vercel adds HSTS |
| Addresses `/new`, `/cases/KC-...`, `/nowhere` | All load the app (rewrite works) |
| `/.env`, `/.env.local`, `/server/extract.js` | Return only the app page; no files exposed |
| API: GET / empty / 1,100 characters | 405 / 400 / 400, `Cache-Control: no-store` |
| Real Gemini call (demo "Fast breathing, vomiting") | 200 in about 3.6 s: age 18, male, vomits everything, cough 3 days; breaths correctly left empty |
| Full journey in the browser | 5 AI answers badged, red alert "Vomits everything", *Refer urgently*, "checklist filled by AI (gemini-3.5-flash-lite), checked by CHW" |
| Reload of the case page | Same case, no alert |
| Phone width on `/`, `/new`, `/cases` | No sideways scroll |
| Browser console | Empty |

## Limits to know

- **Rate limit** (10 AI requests a minute per IP) is per server instance, so it is best effort. The Gemini free quota is the real cap.
- **Free Gemini inputs may be used by Google.** The app already tells users this and blocks phone numbers.
- **Vercel Hobby** is for non-commercial use, which suits a hackathon demo.
