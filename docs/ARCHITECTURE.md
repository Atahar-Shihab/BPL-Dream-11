# BPL Dream 11 — Architecture & Technical Specifications

## 1. System Overview
**BPL Dream 11** is an interactive fantasy cricket team management platform built with **React 19**, **Vite**, **Three.js**, and **Tailwind CSS v4**. It allows cricket enthusiasts to draft players, assign leadership multipliers, inspect pitch tactics in 2.5D, run simulated T20 matches with ball-by-ball commentary, and export roster graphics.

---

## 2. Directory & Component Architecture

```
src/
├── components/
│   ├── layout/            # Shell chrome: Navbar, Footer, LiveTicker, ScrollProgress
│   └── ui/                # Atomic UI: AnimatedCounter, TiltCard3D, PlayerGridSkeleton
├── context/
│   ├── SquadContext.jsx   # Squad drafting, coin balance, leadership multipliers, localStorage
│   └── ThemeContext.jsx   # Night/Day match mode, Bengali/English i18n
├── features/
│   ├── hero/              # Banner hero, 3D Three.js cricket ball stadium, StatsMarquee
│   ├── players/           # Roster catalog, filters, search, modal inspect, player compare
│   ├── squad/             # Selected team list, 2.5D tactical pitch formation, team analytics
│   ├── simulator/         # BPL match simulator mini-game, ball-by-ball engine
│   └── tournament/        # Points table standings, trophy room, claim coins modal
├── data/                  # Static datasets (players, fixtures, venues, scoring rules, records)
├── hooks/                 # Scroll reveals, animation timing, audio controls
├── locales/               # Internationalization dictionaries (en.json, bn.json)
└── utils/                 # Asset resolvers, Web Audio API synthesizers, HTML5 Canvas poster export
```

---

## 3. State Management & Persistence Layer
State is managed using React Context to prevent prop-drilling:
- **`SquadContext`**:
  - `selectedPlayers`: Array of selected cricketers (maximum squad limit of 6).
  - `coin`: User's virtual fantasy currency, auto-credited with daily claims or match wins.
  - `captainId` / `viceCaptainId`: Role assignments for 2.0x and 1.5x score multipliers.
  - All states persist in browser `localStorage` using keys `bpl_dream11_*`.
- **`ThemeContext`**:
  - `isDarkMode`: Day match vs Floodlight Night Match, synced with `document.documentElement.classList`.
  - `language`: `'en'` vs `'bn'` with instant UI string substitution.

---

## 4. 3D WebGL Graphics & Sound Architecture
- **Three.js Engine**: Custom procedural WebGL sphere with genuine red cricket ball textures, white seam geometry, orbiting golden aura particles, and scroll-reactive rotation physics.
- **Web Audio API Engine**: Zero-dependency audio synthesizer creating organic sound effects:
  - Bat strike impact ("CRACK!")
  - Coin transaction chimes ("CHING!")
  - Stadium crowd fanfare
  - Global volume toggle persisted in state.

---

## 5. Performance & Deployment
- **Relative Path Portability**: Base URL resolver (`getAssetUrl`) in `src/utils/assets.js` ensures assets resolve accurately on custom domains, subpaths, and GitHub Pages.
- **Vite Tree-Shaking**: Lightweight component design with zero heavy, unused dependencies.
