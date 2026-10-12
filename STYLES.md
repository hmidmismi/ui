# Styles

`@baikikai/ui` owns all look and feel: the Panda preset, tokens, palettes, type scale, recipes and components. Apps import components and variants. They never write styles.

Paths are from `packages/ui`. After any theme change run `pnpm codegen` (Panda codegen + cssgen). Tests: `pnpm test`.

## Principle

Styling names say how something looks or lays out, never what content it holds. Content decides which primitive and variant to use, at the call site.

1. **Name by function.** `Stack`, `List`, `Grid`, `Split`, `Surface`, `Title`, `Text`, `Label`. Never `CreditsList`, `TechniqueHeader`, `Eyebrow` or `PersonName`.
2. **Variants are props.** A new look is a new variant on an existing primitive first. A new recipe is the last resort, used only when no primitive fits.
3. **Two uses with different looks means a variant is missing.** Add the variant. Do not create a second primitive.
4. **Panda patterns first.** `stack`, `hstack`, `vstack`, `wrap`, `grid`, `gridItem`, `container`, `center`, `divider`, `spacer`, `visuallyHidden`. Write a layout recipe only for what they do not cover (ruled list, measure, media row).
5. **A semantic name, if wanted, is a mapping at the call site.** It is never a recipe or a component.
6. **Semantics live in tokens.** `canvas`, `fg.muted`, `border` and spacing names are the right place for meaning. Recipes use them and never decide what a section means.
7. **The announcement, header, menu and footer are the only exception.** The header, footer, announcement and menu are slot recipes by nature. They consume primitives and tokens and do not define new looks.

## Rules

- No ad hoc styles in app code: no `css()`, `style`, raw `className` strings or style props. Use `@baikikai/ui` components and their variants.
- No literal lengths in recipes. Spacing, sizes, radii, rule widths and tracking are tokens. A look used twice is a variant first, then a fragment or a recipe. `src/preset/rhythm.test.ts` fails on a stray `px` or `rem`.
- Font sizes and line heights come only from `textSize` / `textTrim` in `type-scale.ts`, never typed by hand.
- Never reset browser defaults in a recipe; preflight already does.
- Components that call `createStyleContext` must start with `'use client'` or server pages cannot import them (a typecheck will not catch it; `next build` will). Components import the generated system by relative path (`../../styled-system/...`), so any bundler resolves it. Apps import only `@baikikai/ui` and `@baikikai/ui/styles.css`.
- Repeated logic goes in a helper file; repeated styling goes in a variant, recipe or primitive.

## The grid

One unit drives everything: **the 5px baseline**.

| Grid | Value | Used for |
| --- | --- | --- |
| Baseline | 5px | every line height; the utility step (`spacing.1`, `3`, `5`, `7`, `9`) |
| Unit | 10px | the main spacing step (`spacing.2`, `4`, `6`, `8`, `10`, `12`, ...) |

Spacing and size tokens are named by their number of baselines: `spacing.4` is 20px, `spacing.1` is 5px.

| token | px | token | px | token | px |
| --- | --- | --- | --- | --- | --- |
| 1 | 5 | 8 | 40 | 20 | 100 |
| 2 | 10 | 9 | 45 | 24 | 120 |
| 3 | 15 | 10 | 50 | 32 | 160 |
| 4 | 20 | 12 | 60 | 40 | 200 |
| 5 | 25 | 14 | 70 | 48 | 240 |
| 6 | 30 | 16 | 80 | 64 | 320 |
| 7 | 35 | 18 | 90 | | |

Even tokens are the 10px scale; odd tokens are the 5px utility steps (an icon beside its label, a tight padding). `sizes` has the same numeric scale plus named widths (`xs` 320px to `7xl` 1360px, `prose`, `inset`) for dialogs and layout. These replace Panda's defaults entirely, so no 4px value exists.

Components that stack (`Stack`, `List`, dialogs) use these tokens, so every block is a whole number of baselines tall and the rhythm holds. Set `data-baseline-grid` on `<html>` to overlay the grid (faint line every 5px, stronger every 10px) and check alignment.

## Type scale

Minor third (ratio 1.2) from a 16px body. Constants are in `src/preset/type-scale.ts`:

```ts
export const BASE_SIZE = 16;
export const RATIO = 1.2;
export const MIN_LEADING = 1.3;
```

| step | size | line height | leading |
| --- | --- | --- | --- |
| xs | 11.1px | 15px | 1.35 |
| sm | 13.3px | 20px | 1.50 |
| md | 16px | 25px | 1.56 |
| lg | 19.2px | 30px | 1.56 |
| xl | 23.0px | 30px | 1.30 |
| 2xl | 27.6px | 40px | 1.45 |
| 3xl | 33.2px | 45px | 1.36 |
| 4xl | 39.8px | 55px | 1.38 |
| 5xl | 47.8px | 65px | 1.36 |
| 6xl | 57.3px | 75px | 1.31 |
| 7xl | 68.8px | 90px | 1.31 |

Every line height is a multiple of 5px: the leading ratio is 1.5 at body size and below, falls 0.05 per step to a floor of 1.1, is rounded to a baseline, and is raised if rounding left it under `MIN_LEADING`. `fontSizes`, `lineHeights` and `textStyles` (`xs` to `7xl`, plus `label`) are generated from this one model. Tracking tightens from `4xl` up.

Faces (set D, the default): `display` Shippori Mincho (titles), `body` Zen Kaku Gothic New (interface and prose), `mono` IBM Plex Mono (code and data only, never labels, eyebrows or breadcrumbs). They load through `next/font` in the app's root layout into `--font-display`, `--font-body`, `--font-mono`; the `fonts` tokens read those variables.

## Trim (Capsize)

Text roles remove the space above the capitals and below the baseline with negative margins on `::before` / `::after`. The margins are `calc()` expressions over the theme's per-face variables (derived from Capsize metrics in `theme/toCss.ts`; the formula is `trimValues` in `preset/type-scale.ts`, tested against Capsize itself), so they follow whatever face the theme sets. The box is then exactly as tall as its letters and the gap between blocks is the gap you see. Sizes are also adjusted per face (`--ui-<role>-adj`) so the lowercase x-height matches the body face at the same step.

- Do not put margin on a trimmed element; use padding, which is measured from the cap and baseline edges.
- Inline elements (`span`, `strong`, `a`, `small`) cannot be trimmed; the typography components turn trim off for them.

## Primitives

### Text

Text is a small fixed set of primitives on the `xs` to `7xl` scale (`src/preset/recipes/roles.ts`, components in `src/components/typography.tsx`): `Title` (levels 1 to 6, display face), `Text` (`body`, `small`, `caption`), `Label` (uppercase, tracked), `Numeral` (display face, for index numerals).

```tsx
<Title level={1}>Technique</Title>
<Text variant="small">Ikkyo</Text>
<Label>Chapter</Label>
```

A new text look is a variant on one of these, not a new role. Do not add a recipe named for content (`eyebrow`, `personName`, `term`, `entry`, `value`).

```ts
// src/preset/recipes/roles.ts (shape of a new variant)
variants: {
  tone: {
    default: { color: 'fg.default' },
    muted: { color: 'fg.muted' },
  },
  face: {
    body: { fontFamily: 'body' },
    display: { fontFamily: 'display' },
  },
}
```

### Layout

Inside `packages/ui`, build layout from Panda patterns and re-export them as components, so apps get layout without writing styles.

```tsx
// src/components/layout.tsx
export { Stack } from './stack';
export { Wrap } from '../../styled-system/jsx';
export { Grid } from '../../styled-system/jsx';
export { Container } from '../../styled-system/jsx';
```

Pattern props take breakpoint objects directly. Put breakpoints on the prop (`columns={{ base: 1, md: 3 }}`), never inside a breakpoint key, or the pattern is skipped. If a pattern is wrapped in your own component, add the wrapper's name to the pattern's `jsx` option so extraction still sees its props:

```ts
// panda.config.ts
patterns: {
  extend: {
    stack: { jsx: ['Stack', 'Section'] },
  },
},
```

Write a layout recipe only for what patterns do not cover, and use tokens only:

```ts
// src/preset/recipes/layout.ts
import { defineRecipe } from '@pandacss/dev';

/** Limits running text to a readable line length. */
export const measure = defineRecipe({
  className: 'measure',
  staticCss: ['*'],
  base: { maxWidth: 'prose' },
});

/** A picture with text beside it, stacked on narrow screens. */
export const mediaRow = defineRecipe({
  className: 'media-row',
  base: {
    display: 'flex',
    flexDirection: { base: 'column', sm: 'row' },
    alignItems: 'flex-start',
    gap: '6',
  },
});
```

### Call-site mapping

When content roles are useful, map them to variants in one file in the app. The styling layer never learns the words.

```ts
// apps/web/src/lib/roles.ts
export const ROLE = {
  eyebrow: { as: 'p', tone: 'muted' },
  lede: { variant: 'body' },
} as const;
```

```tsx
<Label {...ROLE.eyebrow}>Chimes</Label>
```

Changing what an eyebrow looks like is one edit in this file.

## Colors

The raw inputs are the theme's palette (`src/theme/`): `ink`, `paper`, `line`, `accent`, `accentSoft`, `danger`, `dangerSoft`. They are written as CSS variables on `:root` (`--ui-ink`, `--ui-paper`, ...) and the Panda tokens `colors.pigment.*` only reference those variables. Every other shade is a `color-mix` of them (`colors/scale.ts`), so the palette cannot drift and a theme change needs no rebuild: load a project's `theme.css` (from `toCss(theme)`) after `styles.css`. The Baikikai theme (`src/brand/palette.ts`) is ink `#14171C`, paper `#ECEDE8`, line `#C4C8C0`, accent `#2C3E72` with soft `#9AA7D4`, danger `#B4432F` with soft `#E3A596`; the neutral default is in `src/theme/neutral.ts`.

- `gray`: paper (1, the canvas) to line (7, borders) to ink (12, text) in light mode; ink to paper in dark mode.
- `accent` (alias `brand`): the theme accent; step 9 is `accent` in light mode and `accentSoft` in dark mode.
- `red`: errors.
- Each palette has steps `1` to `12`, alpha steps `a1` to `a12`, and the Park UI variants `solid`, `subtle`, `surface`, `outline`, `plain` that recipes read through `colorPalette`.
- Semantic: `canvas`, `fg.default|muted|subtle|disabled`, `border` (`muted`, `emphasized`), `error`, `shadow`.

Components use semantic names or `colorPalette.*`, never raw steps. Dark mode: add the `dark` class to `<html>`.

## Park UI components

Installed in `src/components` with their recipes in `src/preset/recipes`: Accordion, Badge, Button (+ IconButton, CloseButton, ButtonGroup), Checkbox, Dialog, Field, FilterGroup, Group, Icon, Input, Link, List, Loader, Popover, RadioGroup, Select, Spinner, Stack, Tabs, ToggleGroup, Tooltip, plus the typography roles and the browse pieces: `Surface` (paper or ink; `ink` adds the `dark` class so every color inside flips), `Split` (two-column page, stacks on small screens), `IndexRow` (big ruled row: Roman numeral, display-face name, kanji, small-caps aside; pass `as={Link}`), `Breadcrumbs` and `Placeholder` (flat video or photo field). They follow Park UI's structure (Ark UI parts + a Panda recipe + `createStyleContext`) and were ported from the DRAM design system with every length moved to the 5px grid. To add another, copy that pattern: recipe in `recipes/`, registered in `recipes/index.ts`, wrapper in `components/`, exported from `components/index.ts`.

## Add a recipe

1. Check order: a Panda pattern, then a variant on an existing recipe, then a new recipe.
2. If the name describes content (credits, release, person, eyebrow), rename it by function or move it to the call-site mapping.
3. `defineRecipe` (one element) or `defineSlotRecipe` (several parts) in `src/preset/recipes/`, using tokens only.
4. Register it in `recipes/index.ts`.
5. `pnpm codegen`. `staticCss: { recipes: '*' }` emits every variant, so props may be dynamic.
6. Add the component wrapper and export it. The component name must match the recipe name or be listed in the recipe's `jsx` option, or extraction emits no CSS.

## Announcement, header, menu and footer

`announcement`, `header`, `menu` and `footer` (one file each in `src/preset/recipes`) with `Announcement`, `Header`, `Menu`, `Footer` components. Header: brand left, nav, language select and theme toggle flush right via `headerUtility`, on every page; `Menu` is its own component, controlled by the app (`open`, `onClose`), and carries the nav and the footer utility nav, with kana numerals (い ろ は に ほ), a clip-path wipe and staggered items, scroll lock and Esc to close. Footer: the utility nav (`footerUtility`: Contact, Accessibility, Instagram), then copyright left and the 501(c)(3) line right. Apps pass labels and links; they never style the shell. These are the one place a content-shaped recipe is allowed. It uses primitives and tokens and adds no new looks.

## Font sets

Faces belong to the theme. `src/brand/faces.ts` holds this brand's sets, each a `display`, `body` and `mono` face with its Capsize metrics: `d` Shippori Mincho + Zen Kaku Gothic New (default), `e` Archivo, `f` Fraunces + Karla; mono is IBM Plex Mono in all. `UI_FACES=d|e|f pnpm codegen` picks which set the Baikikai theme uses (`BAIKIKAI_FACES` still works). The `fonts` tokens read `--ui-font-*`, which hold `var(<app variable>, "<Family>", <generic>)`: the app's `--font-display|body|mono` first, then the family name and a generic inside the `var()` fallback, so the stack stays valid when an app sets no variable. Because the metrics are variables too, a theme that swaps faces at runtime gets the correct x-height matching and trim. Apps load the matching files: `web` aliases `@/fonts/active` to `src/fonts/{d,e,f}.ts` from the same variable, so set it for both `codegen` and `next build`. To add a set, add its metrics to `brand/faces.ts` and a static `next/font` module to each app.

## Design and theme

One package, no brand inside the machinery. Structure and look are separate typed objects:

- **`src/design/`: `Design`** is the structure (grid baseline, unit and root size; type base, ratio and minimum leading; motion durations). It is computed into the tokens and into the text roles inside recipes when Panda runs, so it is fixed per build. `design/default.ts` is the 5px / 10px / 16px / 1.2 default. Every recipe that sets text is a function of the design's type system (`createTypeSystem(design)`, `createRecipes(type)`), so a different grid or type scale reaches all of them.
- **`src/theme/`: `Theme`** is the look: the palette and the three faces **with their font metrics**. It becomes CSS variables (`--ui-*`), including the per-face numbers the type system reads (`--ui-<role>-adj|cap|base|normal`), so palette, faces, x-height matching and trim all change at runtime and per part of a site. `toCss(theme, selector?)` writes a theme as CSS text. `theme/neutral.ts` is the neutral default (Inter and IBM Plex Mono).
- **`src/brand/`** is the only place this repo's brand lives: `palette.ts` (the five colors, importable alone), `faces.ts` (font sets `d|e|f`) and `baikikai.ts` (the theme `panda.config.ts` builds with). A project in another repo would have its own `theme.ts` and none of `brand/`.
- **`createPreset(design?, theme?)`** (`src/preset/index.ts`) builds the Panda preset; `preset` is the neutral default. `panda.config.ts` calls `createPreset(design, baikikai)`.
- A project supplies a `theme.ts` and loads its `theme.css` after `styles.css`. Nothing else is needed, and Panda does not run in the project. `@baikikai/ui/theme`, `/design`, `/brand` and `/palette` export the data without React or Panda.
- Header, menu, footer and announcement are slot shells; apps pass the content.

**Playground:** `pnpm --filter @baikikai/ui playground` (Vite, `playground/`) shows the type scale, spacing, color scales and components, with buttons for dark mode, the baseline grid overlay and three themes (neutral, baikikai, warm). `?dark&grid&theme=warm` in the URL sets them. `playground:build` builds it.

**Tests:** `pnpm test` runs the unit tests (grid, scale, design, theme, Capsize formula) and, when Chrome and a generated `styles.css` exist, the browser tests. `pnpm test:browser` runs `codegen` first. The browser tests use `playwright-core` with the installed Chrome (`CHROME_PATH` overrides the macOS default) and check, in a real browser, that every text role's size, line height and trim equal Capsize's numbers for the built-in theme and for a theme loaded at runtime, that every line height is on the baseline, that text contrast is at least 7:1 (muted 4.5:1) in light and dark for two themes, and that a runtime theme re-colors the page and falls back to its family when the app sets no font variable.

Not done yet: nothing in the plan above; open follow-ups are a color-contrast check for every palette step and visual regression screenshots.

## Other frameworks

Expected to work, not yet tested; check Panda's current framework guides before relying on this.

- The preset, tokens and generated CSS are framework-agnostic.
- **TanStack Start (Vite):** replace `next/font` with a loader that sets `--font-display`, `--font-body` and `--font-mono`; pass the router's link to `as={...}` (`IndexRow`, `Link`).
- **Astro:** render the React components through `@astrojs/react`; interactive ones (Menu, Dialog, Select, Popover, Tabs) need a client directive.
- `'use client'` is harmless outside Next. Components import the generated system by relative path, so any bundler resolves it.

## Rules proven in the comps

- Every page needs `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- Class names in the system must not be generic (`.pi`, `.go`, `.x`); a clash hides content.
- One variable drives anything that must move together (see Header stack in `handoff.md`); never animate the pieces separately.
- Touch: iOS needs a touch handler for `:active`; hover states are not available on touch, so every hover state needs a pressed or focus equivalent.

## Commands

```sh
pnpm --filter @baikikai/ui codegen   # panda codegen + cssgen -> styled-system/, styles.css
pnpm --filter @baikikai/ui test      # grid, type scale, trim formula, design, theme, literal-length checks (+ browser tests if Chrome and styles.css exist)
pnpm --filter @baikikai/ui test:browser  # codegen, then the Chrome tests
pnpm --filter @baikikai/ui dev       # watch mode
pnpm --filter @baikikai/ui playground  # component sheet on http://localhost:5190
```

## Open items

- `Numeral` becomes a `Text` or `Title` variant (display face, tabular figures).
- `IndexRow` becomes a composition of a ruled list item, display text and muted small caps, kept as one component only if it is used in more than one place.
- Audit `recipes/` for any recipe named for content and fold it into a variant.
