# Getting API Keys

Only one key is needed: **Gemini**.

## Gemini (about 2 minutes, free, no card)

1. Go to https://aistudio.google.com and sign in with Google.
2. Accept the terms.
3. Open **Get API key** (https://aistudio.google.com/apikey).
4. Click **Create API key**; let it create a default project.
5. Copy the key (starts with `AIza...`) into a password manager.

Do not add billing; that moves you off the free tier.

## Keeping it safe

- Never put it in React code, GitHub or screenshots.
- Locally: `.env.local` (git-ignored).
- Production: Vercel environment variables (Stage 7).
- Leaked? Delete it in AI Studio and create a new one.

## Accounts (not keys)

- **GitHub:** github.com/a3gissss
- **Vercel:** vercel.com, "Continue with GitHub", free Hobby plan.

## Node

`node -v` must be 20 or higher. Installed: v24.
