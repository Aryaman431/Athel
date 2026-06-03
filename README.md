# Aethel — Intelligent Wellness

A production-ready Progressive Web App for calm, premium fitness and nutrition tracking.

## Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite 8** with `@tailwindcss/vite`
- **Tailwind CSS 4**
- **Framer Motion 12** — smooth page transitions & animations
- **React Router 7** — client-side routing
- **Recharts** — minimal wellness charts
- **vite-plugin-pwa** — offline support, service worker, web manifest
- **Local Storage** — all data persisted client-side

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

## AI Integration

Add your OpenAI API key to `.env`:

```env
VITE_AI_API_KEY=sk-...
```

Without a key, Aethel uses intelligent mock responses for all AI features. The app is fully functional without an API key.

## Features

| Feature | Description |
|---|---|
| Dashboard | Wellness score, calories, water tracking, daily insight |
| Workout Generator | AI-personalized workouts by time/location/level |
| Nutrition Tracker | Natural language food logging + mock AI macros |
| Wellness Insights | Weekly trend charts with Recharts |
| Journal | Daily mood + reflection entries |
| Settings | Light/dark mode, custom goals, data export |

## Architecture

```
src/
├── components/ui/     # Card, Button, Input, ProgressRing, etc.
├── pages/             # Landing, Dashboard, Workouts, Nutrition, Insights, Journal, Settings
├── layouts/           # AppLayout (sidebar + mobile nav)
├── context/           # AppContext (global state + localStorage)
├── services/          # ai.ts (OpenAI + mock fallbacks)
├── utils/             # Helpers, animations, date utils
├── types/             # All TypeScript interfaces
└── data/              # Mock/sample data
```

## PWA

The app is installable and works offline. Icons are generated in `public/`. Service worker is auto-registered via `vite-plugin-pwa`.

## Deployment

The `dist/` folder is static and ready for any host:

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir dist
```

---

*Crafted with care for your wellbeing.*
