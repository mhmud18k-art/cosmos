<div align="center">

# Cosmos

**A bilingual solar system explorer — where every planet surface is drawn in code, not downloaded.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-A78BFA)](LICENSE)

English · [العربية](#بالعربية)

</div>

---

## What this is

Cosmos is a multi-page web app about the solar system, built in Arabic and English with true right-to-left support. It is not a template with stock photos dropped into it — the eight planets are **rendered procedurally on a 2D canvas from real astronomical coordinates**, so there is no image to fail to load and nothing to license.

## Why it is interesting

**Planets drawn from real data.** `src/lib/planet-texture.ts` paints each surface from documented features at their actual latitudes and longitudes:

| Planet | What is real about it |
|---|---|
| Mercury | Dense crater field, Caloris Basin (30.5°N, 189.8°E), Kuiper and Debussy ray systems |
| Venus | Cloud deck only — no visible rock surface, mapped with its super-rotation |
| Earth | Real coastlines from lat/long, the 15–35° arid band, cloud bands by atmospheric circulation |
| Mars | Syrtis Major, Hellas, Valles Marineris, Olympus Mons, Acidalia — each placed by coordinate |
| Jupiter | Belts and zones at their true latitudinal widths, Great Red Spot at 22°S |
| Saturn | Faint banding, rings at real radii with the Cassini Division |
| Uranus | Nearly featureless — which is the accurate description of it |
| Neptune | Great Dark Spot at 22°S with its companion methane clouds |

Canvas 2D was chosen over WebGL deliberately: eight simultaneous WebGL contexts exceed the browser limit, and the oldest get silently dropped — blanking cards as the user scrolls.

**Bilingual, not just translated.** Switching to Arabic flips `dir` on the document, so arrows, alignment and element order invert with it. Numbers are formatted per-locale (Eastern Arabic numerals in Arabic). Subject content carries both languages inside the data as `{ ar, en }`, so a missing translation shows up immediately instead of vanishing as an absent key. `index.html` reads the stored language before React boots, so the page never flashes in the wrong direction.

**Accessibility treated as a requirement.** Every interactive element keeps a 2px focus ring with offset — none were removed. `prefers-reduced-motion` is honoured in CSS, in the hero, and in the starfield. Each planet card is a single tab stop. Table values are wrapped in `<bdi>`, without which the bidi algorithm reorders `5.68 × 10²⁶` into `10²⁶ × 5.68`.

**A design system with contrast measured, not guessed.** All tokens live in `src/index.css`; no hex values appear in components.

| Token | Value | Use | Contrast on background |
|---|---|---|---|
| `--color-void` | `#05060D` | Page background | — |
| `--color-ink` | `#F8FAFC` | Primary text | 19.3:1 |
| `--color-ink-muted` | `#94A3B8` | Secondary text | 7.9:1 |
| `--color-violet-soft` | `#A78BFA` | Text emphasis | 7.4:1 |
| `--color-celeste` | `#5FD8FF` | Links, focus ring | 12.3:1 |
| `--color-violet` | `#7C3AED` | Glow and fills **only** | 3.6:1 — never text |

All eight planet colours clear 4.5:1; the lowest is Neptune at 5.4:1.

## Tech stack

React 19 · TypeScript 5.7 · Vite 6 · Tailwind CSS v4 · React Router 7 · Framer Motion · shadcn/ui

## Getting started

```bash
npm install
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check, then build for production |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check without emitting |
| `npm run sync-preview` | Regenerate the generated blocks in `preview.html` |

### Instant preview, no install

`preview.html` is fully self-contained — open it directly in a browser. It carries the hero with the same canvas maths, the planet cards, the data table, and the palette with contrast ratios computed live.

## Project structure

```
src/
├── components/      Starfield, Planet, PlanetCard, Navbar, LanguageToggle
│   └── ui/          Shared primitives
├── data/            planets.ts, timeline.ts — bilingual subject content
├── i18n/            strings.ts, LanguageProvider.tsx
├── lib/             planet-texture.ts — the procedural surface generator
└── pages/           Home, Planets, PlanetDetail, Timeline, NotFound
```

## Sources

- Physical and orbital data — [NASA Planetary Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/)
- Moon counts — [IAU Minor Planet Center](https://www.iau.org/). Counts change, so every figure carries a `moonsAsOf` field beside it.
- Age of the universe and epoch sequence — Planck 2018 cosmology (13.787 billion years)

Two hero components are vendored from [21st.dev](https://21st.dev) and left unmodified, themed entirely from outside via `className` so they stay updatable.

## License

[MIT](LICENSE) © Mohammad Almoslly

---

<div dir="rtl">

## بالعربية

**كوزموس** — موقع متعدد الصفحات عن المجموعة الشمسية، بالعربية والإنجليزية مع دعم كامل للاتجاه من اليمين إلى اليسار.

الكواكب الثمانية **مرسومة بالكود** على كانفاس ثنائي الأبعاد من إحداثيات فلكية حقيقية — لا صور تُحمَّل، فلا شيء يمكن أن يفشل في التحميل. كل معلَم على كل كوكب موضوع بخط طوله وعرضه الفعليَّين: حوض كالوريس على عطارد، وفاليس مارينيريس على المريخ، والبقعة الحمراء العظيمة على المشتري عند ٢٢° جنوباً.

تبديل اللغة ليس استبدال نصوص: العربية تقلب اتجاه المستند كله، فتنعكس معه الأسهم والمحاذاة وترتيب العناصر، وتُنسَّق الأرقام بالأرقام الهندية.

نظام التصميم كامل في `src/index.css` بنسب تباين محسوبة — أدنى قيمة نصية ٧.٤:١، وكل ألوان الكواكب فوق ٤.٥:١.

### التشغيل

```bash
npm install
npm run dev
```

أو افتح `preview.html` مباشرة في المتصفح بدون أي تنصيب.

</div>
