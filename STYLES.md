# Styles

`@hmidmismi/ui` owns all look and feel: the Panda preset, tokens, type scale, recipes and components. It is machinery with no look of its own: a project declares every value (fonts, scale, colors, sizes, wording) as plain data and hands it to `createPreset`. Apps import components and variants. They never write styles.

Paths are from `packages/ui`. After any theme change run `pnpm codegen` (Panda codegen + cssgen). Tests: `pnpm test`.

## Principle

Styling names say how something looks or lays out, never what content it holds. Content decides which primitive and variant to use, at the call site.

1. **Name by function.** `Stack`, `List`, `Grid`, `Split`, `Surface`, `Title`, `Text`, `Label`. Never `CreditsList`, `TechniqueHeader`, `Eyebrow` or `PersonName`.
2. **Variants are props.** A new look is a new variant on an existing primitive first. A new recipe is the last resort, used only when no primitive fits.
3. **Two uses with different looks means a variant is missing.** Add the variant. Do not create a second primitive.
4. **Panda patterns first.** `stack`, `hstack`, `vstack`, `wrap`, `grid`, `gridItem`, `container`, `center`, `divider`, `spacer`, `visuallyHidden`. Write a layout recipe only for what they do not cover (ruled list, measure, media row).
5. **A semantic name, if wanted, is a mapping at the call site.** It is never a recipe or a component.
6. **Semantics live in tokens.** `canvas`, `fg.muted`, `border` and spacing names are the right place for meaning. Recipes use them and never decide what a section means.
7. **Site chrome is the only exception.** The header, footer and navigation are slot recipes by nature. They consume primitives and tokens and do not define new looks.

## Rules

- **No look in the library.** Recipes read tokens and nothing else. A size, a weight, a color step or a word is a project value, not a number in a recipe.
- **No literal lengths in recipes.** Spacing, sizes, radii, rule widths and tracking are tokens (`spacing.4`, `sizes.plate`, `borderWidths.hairline`). `src/preset/rhythm.test.ts` fails on a literal `px` or `rem`. A look used twice is a variant first, then a fragment or a recipe.
- **No ad hoc styles in apps.** No `css()`, `style`, raw `className` strings or style props. Import a component and pick a variant. Apps import only `@hmidmismi/ui` and its stylesheet.
- **Font sizes and line heights come only from `textSize` / `textTrim`** in `type-scale.ts`, never typed by hand.
- **No fixed wording in components.** Accessible names, placeholders and visible words come from the text map (`tests/wording.test.ts` fails otherwise).
- **No content names.** A component or recipe is named for what it does, never for what it holds (see Principle). Domain meaning enters through props, variants and the call-site mapping.
- **Never reset browser defaults in a recipe.** Preflight already zeroes margin, padding, list markers and heading size.
- **State comes from one place.** Hover, active and current states are in `src/preset/interaction.ts` and `conditions.ts`. Hover is gated on `(hover: hover)`. Focus is the global `:focus-visible` ring in `global-css.ts`.
- **Components that call `createSlotRecipeContext` start with `'use client'`,** or server pages cannot import them. A typecheck will not catch it; `next build` will. Components import the generated system by relative path (`../../styled-system/...`), so any bundler resolves it.
- **Repeated logic goes in a helper file;** repeated styling goes in a variant, recipe or primitive.

## What a project declares

`createPreset(design, theme, options)` takes:

| Input | Says |
|---|---|
| `design.grid` | `baseline`, `unit` (two baselines) and `root` in px; `snap` to put text baselines on the grid. Every spacing step is its Park UI name times the baseline. |
| `design.type` | `base` px, `ratio`, `leading` (`body`, `falloff`, `floor`), `headings` (h1 to h6) and `roles` (eyebrow, name, term, entry, prose, value, caption, count, tagline, fieldLabel, notice). Line heights are whole baselines. |
| `design.controls` | Height, side padding and icon size per control size (`2xs` to `2xl`), in baselines. |
| `design.sizes`, `radii`, `shadows`, `letterSpacings`, `fontWeights`, `breakpoints`, `motion` | Named values. A size name the library does not declare is an error. |
| `theme.faces` | `display`, `body`, `mono`: family, fallbacks, files and the font's vertical metrics (for Capsize trim). |
| `theme.scales` | `neutral`, `accent`, `danger`, `success`, `warning`, `info` as 12 steps per mode; `secondary`; `categorical` and `wash` as named maps (the project names its hues and section tones). |
| `options.recipes` | Replace a recipe by name, or add one. Use only when a look cannot be expressed as values. |

Defaults for each input are in `src/design/default.ts` and `src/theme/`. The library validates names and scale lengths and throws on a mistake.

## Fixed wording

`UiText` (`src/components/ui-text.tsx`) lists every word a component shows by itself: `close`, `clear`, `saved`, `noMatches`, the nav labels, the player's buttons. Holes such as `Remove {name}` are filled with `fill()`.

- Components call `useUiText()`.
- An app wraps its root in `<UiTextProvider text={…}>` with the entries it wants to change; the rest keep the English defaults.
- To add a word: add a key to `defaultText`, read it with `useUiText()`.

## Where things live

| What | Where |
|---|---|
| The grid: numbers, spacing scale, control sizes, baseline math, no-height rules, overlay, check script | `src/grid/` (README there) |
| Panda preset: tokens, type system, text styles, global CSS, utilities | `src/preset/` |
| Recipes (one file per component family) | `src/preset/recipes/`, registered in `recipes/index.ts` |
| Shared fragments and states | `src/preset/fragments.ts`, `interaction.ts`, `conditions.ts` |
| Components, the only code that imports the generated `styled-system` | `src/components/` |
| Hooks and text helpers (`@hmidmismi/ui/text`) | `src/hooks/`, `src/text/` |
| What a project may say (types and defaults) | `src/design/`, `src/theme/` |
| Playground: every component, a theme switch, dark mode, grid overlays | `playground/` |

## Type and trim

Every size is `base * ratio^step`. A text role asks the type system for a size at a step and, for block text, the trim, which removes the space above the capitals and below the baseline. The trim and the baseline shifts are worked out from the theme's face metrics when the preset is built (`createTypeSystem(design, theme.faces)`) and written as plain lengths, so a different face needs a rebuild. It uses the arithmetic a browser uses to place a baseline (half the leftover line height below the top of the line), without each engine's rounding, so the glyph baseline sits at the bottom of the trimmed box to within a pixel (checked from rendered pixels, not from box edges). Do not put margin on a trimmed element.

- Do not put margin on a trimmed element; use padding, which is measured from the cap and baseline edges.
- Inline elements (`span`, `strong`, `a`, `small`) cannot be trimmed; the typography components turn trim off for them.

## Baseline grid

With `design.grid.snap`, every trimmed text block is rounded up to whole baselines, with the space added above the capitals, so the baseline of the text sits on a grid line and the next block starts on one. It uses CSS `round()` (Chrome 125, Safari 15.4, Firefox 118). Hairline rules are drawn as inset shadows (`ruleAbove`, `ruleBelow`, `ruleBoth` in `fragments.ts`) so they add no height; a border would push everything under it a pixel off. Control heights are whole baselines. Check it in the playground with the baseline grid on: library text baselines are on a line, to within a pixel. Anything above a block that is not a whole number of baselines tall (a raw border, a fixed height) shifts it.

## The default grid and type scale

The defaults a project gets when it declares nothing (`src/design/default.ts`, `src/grid/definition.ts`): a 5px baseline, a 10px unit and a minor-third type scale (ratio 1.2) from a 16px body, with a leading floor of 1.3.

Spacing and size tokens are named by their number of baselines: `spacing.4` is 20px at the default baseline, `spacing.1` is 5px. Even tokens are the unit scale; odd tokens are the baseline steps (an icon beside its label, a tight padding). These replace Panda's defaults entirely, so no 4px value exists.

| token | px | token | px | token | px |
| --- | --- | --- | --- | --- | --- |
| 1 | 5 | 8 | 40 | 20 | 100 |
| 2 | 10 | 9 | 45 | 24 | 120 |
| 3 | 15 | 10 | 50 | 32 | 160 |
| 4 | 20 | 12 | 60 | 40 | 200 |
| 5 | 25 | 14 | 70 | 48 | 240 |
| 6 | 30 | 16 | 80 | 64 | 320 |
| 7 | 35 | 18 | 90 | | |

`sizes` has the same numeric scale plus named widths (`prose`, `inset` and the dialog and layout widths). Components that stack (`Stack`, `List`, dialogs) use these tokens, so every block is a whole number of baselines tall and the rhythm holds. Set `data-baseline-grid` on `<html>` to overlay the grid.

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

Every line height is a multiple of the baseline: the leading ratio is 1.5 at body size and below, falls 0.05 per step to a floor, is rounded to a baseline, and is raised if rounding left it under the minimum leading. `fontSizes`, `lineHeights` and `textStyles` (`xs` to `7xl`, plus `label`) are generated from this one model. Tracking tightens from `4xl` up.

## Text in recipes

A slot that holds text is one of: a block that is its own box (`textLine`, `labelCapsLine`, `microLabelLine`, `longFormLine`), a flex or grid item or text that clips (`lineMargins`), centered in a fixed-height box (`lineCentered`), in a box whose height is its padding (`linePadded`), or trimmed to the capitals (`textRole`). A container that only sets the inherited font uses `textSize`. Bare text next to other items needs its own slot. Do not write a font size without one of these on a slot that holds text.

## Tints

`toneFill` and `toneEdge` take a step from 10 to 90 and mix the current `--tone` into the canvas or the border color. The `hue` recipe sets `--tone` from `colors.categorical.<name>`, so a tile, a plate and a card take the color of their hue.

## Primitives

### Text

Text is a small fixed set of primitives on the type scale: `Title` (levels 1 to 6, display face), `Text` (`body`, `small`, `caption`), `Label` (uppercase, tracked) and `Numeral` (display face, for index numerals).

```tsx
<Title level={1}>Technique</Title>
<Text variant="small">Ikkyo</Text>
<Label>Chapter</Label>
```

A new text look is a variant on one of these, not a new role. Do not add a recipe named for content (`eyebrow`, `personName`, `term`, `entry`, `value`).

The variants today:

| Primitive | Props |
| --- | --- |
| `Text` | `variant` (`body`, `small`, `caption`), `size` (`xs` to `4xl`, replaces the one `variant` sets), `face` (`body`, `display`), `tone` (`default`, `muted`, `accent`, `hue`), `weight` (`normal`, `medium`, `semibold`), `figures` (tabular, no wrap) |
| `Label` | `tone` (`muted` by default, `default`, `accent`) |
| `ItemList` | `as` (`ul`, `ol`, `dl`), `layout` (`stack`, `pairs`, `flow`), `size` (`lg`), `gap`, `ruled`, `closed`, `inline`, `marker` |
| `Row` | `layout` (`plain`, `plated`, `numbered`, `dated`), `lead`, `title`, `meta`, `aside`, and `link` (a builder), or `onToggle` with `open` and `controls` (a button with a chevron) |
| `Card` | `as` (`div`, `article`, `button`), `layout` (`stack`, `corners`, `plate`), `hue`, `tint` (`soft`, `full`), `interactive`, `end`, `link`; `Text` and `Label` take `tone="hue"` inside it |
| `Stack` | `gap`, `padBlock`, `padInline`, `align` (`start`, `center`, `end`), `ruled`, `after`, `as` |
| `Wrap` | `gap`, `align` (`center`, `baseline`, `end`), `justify` (`between`), `after` |
| `Surface` | `as`, `tone` (a named wash), `pad` (`none`, `normal`, `loose`), `min` (`third`, `screen`), `place` (`center`), `label`; a full-width block with the content in the page column |
| `Cover` | `as`, `media`, `min`, `place`, `scrim` (`top`), `tone`; media behind content |
| `Layers` | `place` (`center`), `blend` (`difference`); children over one another in one place |
| `Pinned` | `length` (screens), `rise`, `short`, `label`, `ref`; a scroll track with a pinned stage |
| `Pair` | `label`; one label and value inside an `ItemList` with `as="dl"` |

An eyebrow is `<Label tone="accent">`, a count is `<Text as="span" size="sm" tone="muted" figures>`, a tagline is `<Text face="display" size="2xl" weight="medium">`. Keep such names in the call-site mapping below.

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

Build layout from Panda patterns and re-export them as components, so apps get layout without writing styles.

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

Components use semantic names (`canvas`, `fg.default|muted|subtle|disabled`, `border`, `error`, `shadow`) or `colorPalette.*`, never raw steps. A palette has steps `1` to `12`, alpha steps `a1` to `a12`, and the Park UI variants `solid`, `subtle`, `surface`, `outline` and `plain` that recipes read through `colorPalette`. The values come from the project's `theme.scales`. Dark mode: add the `dark` class to `<html>`.

## Add a recipe

1. Check order: a Panda pattern, then a variant on an existing recipe, then a new recipe.
2. If the name describes content (credits, release, person, eyebrow), rename it by function or move it to the call-site mapping.
3. Create it in `src/preset/recipes/` with `defineRecipe` (one element) or `defineSlotRecipe` (several parts), using tokens and fragments only.
4. If a variant value comes from a prop or a variable, set `staticCss: ['*']`.
5. Register it in `recipes/index.ts`.
6. Run `pnpm codegen`, then wrap it in a component. Type the variant prop with `VariantOf<typeof recipe, 'variant'>`. A variant whose names come from the project (hues, tones) is built from the theme in `createRecipes` and typed `string`; pass it through `declared()`.
7. The component name must match the recipe name or be listed in the recipe's `jsx` option, or extraction emits no CSS.

```tsx
// src/components/layout.tsx
import { measure } from '../../styled-system/recipes';
import type { VariantOf } from './variants';

type MeasureProps = { size?: VariantOf<typeof measure, 'size'>; children: ReactNode };

export function Measure({ size = 'prose', children }: MeasureProps) {
  return <div className={measure({ size })}>{children}</div>;
}
```

## Site chrome

The site header, footer and navigation (`siteNav`, `siteFooter`, `siteMasthead`, `jumpNav`, `breadcrumbs` and the `SiteHeader`, `SiteMasthead` and `SiteFooter` components) are slot recipes by nature. `SiteMasthead` is the centered wordmark and tabs over a page's first screen, with a menu on phones. Apps pass labels and links; they never style the shell. Chrome is the one place a content-shaped recipe is allowed. It uses primitives and tokens and adds no new looks.

## Open items

From the guide:

- `Numeral` becomes a `Text` or `Title` variant (display face, tabular figures).
- `IndexRow` becomes a composition of a ruled list item, display text and muted small caps, kept as one component only if it is used in more than one place. It and the guide's `Surface` and `Split` do not exist here yet (`SplitGrid` does).
- Audit `recipes/` for any recipe named for content and fold it into a variant.

The audit so far, in the order to fold them (the text roles are done: `Eyebrow`, `Name`, `Term`, `Entry`, `Prose`, `Value`, `Caption`, `Tagline`, `FieldLabel`, `Notice` and `Count` no longer exist, and `design.type.roles` is gone):

1. **Lists and rows:** done except `CardItem`, which goes with the blocks. `TermList`, `TermRow`, `ColumnList`, `ColumnRow` and `NameList` are `ItemList` (`layout`, `size`) and `Pair`. `CountedList`, `CountedItem`, `DatedList`, `DatedRow`, `ExpandableRow` and `LinkRow` are one `Row` (`layout`: `plain`, `plated`, `numbered`, `dated`; a link, a button, or neither) in an `ItemList` with `gap="0"` and `closed`. `RowDrawer`, `RowPanel` and `DrawerItem` stay: they are named for what they do, and `DrawerItem` should become a `Row` when the catalog pieces are decided.
2. **Blocks:** `Tile`, `Plate`, `FeatureCard`, `TileGrid` and `CardItem` are done: a `Card` (`layout`, `hue`, `tint`, `interactive`, `end`), `Layout kind="cards"` and a `Stack`. `Hero` is left: it should become a `Card` or a `Split` of an art block and a stack of primitives. `CountTile` and `CountTileGrid` (in `page-text`) go with the page pieces. The `hue` and `scrollList` recipes still live in `recipes/tile.ts`; rename the file when it is next touched.
3. **Page and filter pieces:** `PageHeader`, `CenteredLines`, `ListHeader`, `CountTile` and `CountTileGrid` are done: a `Stack` (`align`, `ruled`, `after`), a `Wrap` (`justify`, `align`, `after`) and a `Card` that takes a `link`. The filter controls (`FilterRow`, `FilterSet`, `ListFilter`, `SearchField`, `Chip`) are named for what they do, like `Select`, so they stay; `Chip` should become a `Button` variant if it is used with a second look. `PageColumn` is the page's container and stays. The `Page*` text family is done: `PageArticle` is `Measure`, `PageTitle`/`PageH2`/`PageH3` are `Title`, `PageLede`/`PageP` are `Text`, `PageList`/`PageKv` are `ItemList` and `Pair`, `PageTable` is `Table`, `PageCode` is `CodeBlock`, and `PageLayout`, `PageSideGroup` and `pageSideLinkClass` are `Sidebar`, `SidebarGroup` and `sidebarLinkClass`. The two-column `board` list look was dropped (no consumer).
4. **Catalog pieces:** `Player`, `Browse` (`browseNav`, `letterBar`, `rangeColumns`, `rangeNav`, `rangeSections`), `Record` and `playableRow` serve one project's music catalog. They do not belong in the shared library: move them to that project's app when it adopts this version. They are not folded.
5. **Font sets:** the guide describes shipped, pluggable sets (`d`, `e`, `f`) selected when Panda runs. Here faces are project data in `theme.faces`; decide whether to ship the sets as themes.

Each fold is one change: add the variant, move the consumers, delete the old name. New work must not add to this list.

## Modules

The core is always in: text, layout, surfaces, cards, rows, buttons, fields, chrome. Three kinds of component are opt-in, so a project that never uses one carries none of its code or CSS:

| Module | Subpath | Holds | Needs |
|---|---|---|---|
| `forms` | `@hmidmismi/ui/forms` | `Select`, `Combobox`, `ComboboxSelect`, `Typeahead` | none |
| `admin` | `@hmidmismi/ui/admin` | the editing bar, field status, sign-in form, the editable fields | `forms` |
| `catalog` | `@hmidmismi/ui/catalog` | `Player`, the record header, browsing by letter and range, `PlayableRow` | `forms` |

A project chooses them in the preset: `createPreset(design, theme, { modules: ['forms'] })`. A module it leaves out adds no recipes; the ones a module needs come with it. When `modules` is left out, every module is included. The root `@hmidmismi/ui` still exports everything, so existing imports work; a component imported from the root whose module the preset left out has no CSS, and in development it logs one console error naming the module (the preset writes the included modules to `--ui-modules` on `:root`; `requireModule` reads it). The module lists live in `src/preset/recipes/modules.ts`, and a test checks that every name in them is a recipe of the system. A new specialised component goes in a module, not in the core.

## Extraction

Panda emits a recipe variant only when it sees a literal use or `staticCss` lists it. A missing variant in the browser almost always means a prop-driven variant without `staticCss: ['*']`.

## Checking it

The grid is `src/grid/` (see its README for the invariant and which helper to use for which text). `check-baseline <url> --grid <baseline> --paths … --widths …` loads a page in Chrome with its real fonts, reads the baseline of every element that holds text, and exits 1 when more than `--max` are over 1px (`--tolerance`) from a line, in Chrome, WebKit (`--browser webkit`) or Firefox (`check:baseline:firefox`); it groups the offenders by element and parent class. Run it against the playground (`--grid 5`) and an app at several widths. The package's own tests use a bundled font.

## Seeing it

```sh
pnpm playground     # http://localhost:5190
```

Every component and variant on one page, with the neutral theme and a second theme, light and dark. Buttons toggle two overlays on `<html>`:

- **Baseline grid** (`data-baseline-grid`, `?grid`): horizontal red lines, one every baseline. Text baselines and block edges should sit on them.
- **Spacing grid** (`data-spacing-grid`, `?spacing`): vertical blue lines every baseline, so with both overlays on the page is graph paper in squares of one baseline, to check that gaps and insets line up.

Both read the spacing tokens, so they follow whatever grid the design declares.

## Commands

```sh
pnpm codegen        # Panda codegen and styles.css; after editing the library
pnpm test           # tokens, recipes, rhythm, design inputs, CSS validity, wording, render, browser type and color
pnpm typecheck      # two projects, about 18s cold and 2s warm (see "Typecheck: two projects")
pnpm playground
pnpm check:baseline <url> --grid 5   # at the repo root, with a page running: fails when text is off a grid line
```

The generated `styled-system/` is gitignored. A project builds its own stylesheet from the preset it declares; see its config package.

## Typecheck: two projects

`pnpm typecheck` runs `tsconfig.json` (`src/preset`, `theme`, `grid`, `design`, `text`; the build-time code) and then `tsconfig.components.json` (`components`, `hooks`, `rich-text`, `index.ts`). They are separate because Panda's generated `styled-system/types/global.d.ts` redefines `defineRecipe` and `defineSlotRecipe` against the token-aware style type, and Panda gives no option to turn that off. In one program every recipe was checked against it (272s cold); split, it takes about 18s cold and 2s warm. Rule: nothing in `src/preset`, `theme`, `grid`, `design` or `text` imports `styled-system`, and nothing in `src/components` imports `preset`. `incremental` is on for every package through `@hmidmismi/tsconfig`.

## Notes

- A slot recipe's CSS sits in a lower layer than a plain recipe's, so a slot recipe cannot override the color of a `Button` or `IconButton` placed inside it. Use the control that is itself a slot recipe (`ThemeToggle` without `inUtility`) or set the color through the component.
- After a structural change, `pnpm codegen` cleans `styled-system/` first (`--clean`); stale files from an earlier generation break imports.
