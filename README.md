# Locus (Vite + React + Vercel Functions)

This app is configured for Vercel deployment with serverless API routes so sensitive keys stay server-side.

## Local development

1. Install dependencies:
   `npm install`
2. Copy env template:
   `cp .env.example .env`
3. Fill in `.env` values.
4. Start dev server:
   `npm run dev`

## Environment variables

### Client-side (visible in browser bundle)
- `VITE_GOOGLE_MAPS_API_KEY`

Use this only for Google Maps JS SDK, and lock it down with:
- HTTP referrer restrictions (`https://your-domain/*`, preview domain, localhost)
- API restrictions (only APIs the UI needs)

### Server-side (keep secret)
- `GEMINI_API_KEY`
- `RAPIDAPI_KEY`
- `GOOGLE_MAPS_SERVER_API_KEY`
- `MAPCN_API_KEY` (optional)

These are used by:
- `/api/gemini`
- `/api/listings`
- `/api/geocode`
- `/api/route`

## Deploy to Vercel

1. Push repo to GitHub.
2. Import project in Vercel.
3. Framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add environment variables in Vercel Project Settings:
   - `VITE_GOOGLE_MAPS_API_KEY`
   - `GEMINI_API_KEY`
   - `RAPIDAPI_KEY`
   - `GOOGLE_MAPS_SERVER_API_KEY`
   - `MAPCN_API_KEY` (optional)
7. Deploy.

`vercel.json` already includes:
- SPA rewrite for React Router routes.
- Function max duration of 60 seconds.

## Security checklist

- Never commit real `.env` values.
- Rotate any keys that were previously exposed in client-side `VITE_*` vars.
- Keep RapidAPI and Gemini keys server-only.
