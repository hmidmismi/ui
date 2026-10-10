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
7. **Site chrome is the only exception.** The header, footer, strip and sheet are slot recipes by nature. They consume primitives and tokens and do not define new looks.

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

Text roles remove the space above the capitals and below the baseline with negative margins on `::before` / `::after`, computed per face and step from `@capsizecss/metrics` (`src/preset/font-metrics.ts`). The box is then exactly as tall as its letters and the gap between blocks is the gap you see. Sizes are also adjusted per face so the lowercase x-height matches the body face at the same step (display x 0.998, mono x 0.928).

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

Primitives (`tokens/colors.ts`): `ink #14171C`, `paper #ECEDE8`, `stone #C4C8C0`, `indigo #2C3E72` with `indigo.light #9AA7D4`, `red #B4432F`. Every other shade is a `color-mix` of these (`colors/scale.ts`), so the palette cannot drift from the brand.

- `gray`: paper (1, the canvas) to stone (7, borders) to ink (12, text) in light mode; ink to paper in dark mode.
- `accent` (alias `brand`): indigo; step 9 is `indigo` in light mode and `indigo.light` in dark mode.
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

## Site chrome

`siteStrip`, `siteHeader`, `siteSheet` and `siteFooter` (`src/preset/recipes/chrome.ts`) with `SiteStrip`, `SiteHeader`, `SiteFooter` components. Header: brand left, nav, language select and theme toggle flush right via `tools`, on every page; the sheet carries the nav only, with kana numerals (い ろ は に ほ), a clip-path wipe and staggered items, scroll lock and Esc to close. Footer: links, then copyright left and the 501(c)(3) line right. Apps pass labels and links; they never style the shell. Chrome is the one place a content-shaped recipe is allowed. It uses primitives and tokens and adds no new looks.

## Font sets

Faces are pluggable. `src/preset/faces.ts` holds the sets, each a `display`, `body` and `mono` face with its Capsize metrics: `d` Shippori Mincho + Zen Kaku Gothic New (default), `e` Archivo, `f` Fraunces + Karla; mono is IBM Plex Mono in all. Pick one when Panda runs with `BAIKIKAI_FACES=d|e|f pnpm codegen`. Token names, CSS variable names (`--font-display`, `--font-body`, `--font-mono`), steps and line heights are the same in every set, so no component or recipe changes; only the trim and x-height adjustment are recomputed from the set's metrics. Apps load the matching files: `web` aliases `@/fonts/active` to `src/fonts/{d,e,f}.ts` from the same variable, so set it for both `codegen` and `next build`. To add a set, add its metrics to `faces.ts` and a static `next/font` module to each app.

## Commands

```sh
pnpm --filter @baikikai/ui codegen   # panda codegen + cssgen -> styled-system/, styles.css
pnpm --filter @baikikai/ui test      # grid, type scale, trim and literal-length checks
pnpm --filter @baikikai/ui dev       # watch mode
```

## Open items

- `Numeral` becomes a `Text` or `Title` variant (display face, tabular figures).
- `IndexRow` becomes a composition of a ruled list item, display text and muted small caps, kept as one component only if it is used in more than one place.
- Audit `recipes/` for any recipe named for content and fold it into a variant.
