# Chimera — Premium Phishing Scanner (Next.js)

Apple-inspired scroll storytelling, dual themes, and a fully client-side scan pipeline.

## Run

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

## Features

- **Apple scroll hero** — `useScroll` + `useTransform` + spring-smoothed progress; headline scales/blurs while dashboard clip-expands into view
- **Themes** — Space Black (dark) / White-Hat Lab (light) with clip-path ripple toggle
- **Scan state machine** — `idle` → `connecting` → `analyzing` → `done` with timed terminal logs
- **Mock engine** — Flags URLs containing `paypal`, `bank`, `secure-login`, etc., plus deterministic heuristics
- **Tabs** — Quick Scan, Deep Analysis, Global Threat Map with `AnimatePresence` + `layoutId` indicator
- **tsparticles** — Interactive dark/light particle backgrounds
- **3D tilt cards** + magnetic buttons

## Architecture

| Path | Role |
|------|------|
| `src/hooks/useScanSession.ts` | Central scan + tab state |
| `src/lib/scan-engine.ts` | Client-side URL evaluation |
| `src/lib/scan-timeline.ts` | Phased terminal log schedule |
| `src/components/scroll/AppleScrollHero.tsx` | Scroll-driven hero + sticky dashboard |
| `src/components/scanner/ScanConsole.tsx` | Tabbed scanner UI |
| `src/context/ThemeContext.tsx` | Theme + ripple transition |

## Try malicious detection

```
https://paypal-secure-login.example.com
https://my-bank-verify.net
```

## Try safe

```
https://google.com
```
