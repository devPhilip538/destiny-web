# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev`
- **Build**: `npm run build` (runs `tsc -b && vite build`)
- **Lint**: `npm run lint`
- **Preview production build**: `npm run preview`

No test framework is configured.

## Architecture

Destiny is a Korean fortune-telling (사주팔자 / Four Pillars) mobile-first web app. Users enter birth date/time/gender, and the app calculates their Saju pillars, five-element balance, personality, fortune, luck cycles, ten gods, and compatibility with others.

### Tech Stack

React 19 + TypeScript, Vite 7, Tailwind CSS 4, Zustand (state), React Router 7, Motion (animations), Zod (validation), React Query.

### Path Alias

`@/` maps to `./src/` (configured in both `tsconfig.app.json` and `vite.config.ts`).

### Data Flow

`InputPage (4-step form)` → `calculateSaju()` + analysis functions → result stored in Zustand → `ResultPage` displays it. History is persisted to localStorage (max 50 entries).

### Key Layers

- **`src/lib/`** — Pure calculation functions with no React dependencies. This is the core domain logic:
  - `constants.ts` — All shared constants: Cheongan/Jiji arrays, five-element relationship maps (`GENERATING`, `OVERCOMING`, `GENERATED_BY`, `OVERCOME_BY`), yin-yang sets, time periods, stem lookup tables.
  - `saju-calculator.ts` — Main entry: converts lunar↔solar dates, computes four pillars (year/month/day/hour) using sexagenary cycle.
  - `lunar-calendar.ts` — Lunar-solar calendar conversion using hex-encoded data (valid range: 1900–2100).
  - `five-elements.ts` — Counts element occurrences across pillars, determines dominant/lacking with priority-based tie-breaking.
  - `ten-gods.ts` — Determines 10-god relationships relative to day master.
  - `compatibility.ts` — Scores two people's Saju compatibility (element relations, Cheongan/Jiji harmony, complementarity).
  - `daily-fortune.ts` — Daily fortune based on today's pillar vs user's day pillar.
  - `luck-cycle.ts` — 10-year luck cycle (대운) calculation.

- **`src/types/saju.ts`** — Central type definitions (`Cheongan`, `Jiji`, `FiveElement`, `Pillar`, `SajuResult`, `SavedReading`, `FormData`, etc.).

- **`src/store/saju-store.ts`** — Zustand store with localStorage persistence. Holds `formData`, `result`, and `history[]`. Only `history` is persisted.

- **`src/pages/`** — Route-level components: `HomePage`, `InputPage` (4-step wizard), `ResultPage`, `HistoryPage`, `CompatibilityPage`.

- **`src/components/`** — Organized by feature: `form/`, `result/`, `history/`, `home/`, `compatibility/`, `layout/`, `ui/`.

### Styling

Tailwind CSS 4 with custom theme tokens defined in `src/index.css` using `@theme`. Glass-morphism utilities (`glass`, `glass-strong`, `glass-purple`) and gradient text (`text-gradient`) are defined as `@utility`. Dark purple/indigo background theme throughout.

### All UI text is in Korean.
