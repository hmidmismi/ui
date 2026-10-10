# @baikikai/ui

Panda CSS preset and Park UI/Ark UI components for Brooklyn Aikikai. Read `STYLES.md` first.

## Rules
- Styling lives in preset recipes and tokens. No ad hoc styles, no inline `style`, no literal px/rem in recipes (`rhythm.test.ts` fails on them).
- Baseline is 5px (`src/preset/scale.ts`). Type is a 1.2 minor-third scale with Capsize trim from `src/preset/type-scale.ts`.
- Two font families at most per set, no monospace in design work except IBM Plex Mono for data.
- Follow the official Panda CSS and Park UI docs; check them before using an API or option.
- Components that use `createStyleContext` start with `'use client'`. Apps import only `@baikikai/ui` and `@baikikai/ui/styles.css`.

## Font sets
`src/preset/faces.ts` holds sets `d` (default: Shippori Mincho + Zen Kaku Gothic New), `e` (Archivo), `f` (Fraunces + Karla). Select with `BAIKIKAI_FACES=d|e|f pnpm codegen`. Token and CSS variable names never change between sets. The web app must use the same value (see `apps/web` `next.config.ts`).

## Site chrome
`siteStrip`, `siteHeader`, `siteSheet`, `siteFooter` recipes and `SiteStrip`, `SiteHeader`, `SiteFooter` components (`src/preset/recipes/chrome.ts`, `src/components/site-chrome.tsx`). Language select and theme toggle sit flush right on every page. The mobile sheet uses kana numerals (い ろ は に ほ へ) and carries nav only. Footer: © left, 501(c)(3) right.

## Commands
`pnpm codegen`, `pnpm test`, `pnpm typecheck`.
