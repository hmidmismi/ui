# The grid

The one place that defines how things line up, vertically and horizontally. A project declares the numbers in its config (`design.grid`); everything else in the library imports from here and defines no grid number of its own.

## What is here

| File | Holds |
|---|---|
| `definition.ts` | The `Grid` type (`baseline`, `unit`, `root`, `snap`), the default, and the px to rem converters. |
| `controls.ts` | Control sizes (`2xs` to `2xl`), each a height, side padding and icon size in baselines. |
| `spacing.ts` | The spacing scale: Park UI's ladder, every step its name times the baseline. |
| `lines.ts` | Putting the baseline of text on a grid line: `lineShift`, `lineMargins`, `centeredLine`, `paddedLine`, `trim`. |
| `rules.ts` | Rules and outlines that take no space: `createRules`. |
| `calibrate.ts` | Measures where the running browser puts each baseline and hands the numbers to the CSS (`useBaselineCalibration`). |
| `overlay.ts` | The graph-paper overlay, red baselines and blue verticals one baseline apart. |
| `check/check-baseline.mjs` | The script that measures a live page. |

The tests are `lines.test.ts` and `guard.test.ts` here, and `tests/browser/grid.test.ts`, which renders real text with a bundled font (Inter, SIL OFL) and asserts exact baselines for every function.

## The invariant

If these hold, everything composes and every baseline lands on a grid line, however the layout is built:

1. Every block of text has its first baseline a whole number of rows below the top of its box, and its box is a whole number of rows tall.
2. Every other box is a whole number of rows tall: heights are rows, padding is rows, gaps are rows.
3. Rules and outlines take no space (they are shadows, not borders).
4. Text that a flex or grid box centers is moved by padding or margin so its baseline still lands on a line.

## Why it is needed

A browser draws the first baseline of a line at a fixed distance below the top of its line box. The distance depends on the font and the size, and browsers round the font's ascent and descent to whole pixels, so it is almost never a whole number of rows. `lines.ts` computes that distance in CSS from the font's own metrics (three numbers per face, held in CSS variables) and moves the line, or trims the box, to the nearest grid line.

## Which function for which text

| Text | Use |
|---|---|
| A block that is its own box (a paragraph, a title, a label) | `lineShift`, or `trim` to cut it to the capitals |
| An item of a flex or grid container, or text that clips with an ellipsis | `lineMargins` |
| One line centered in a fixed-height box (a control, a tab, a badge) | `centeredLine` |
| A box whose height is its own padding | `paddedLine` |
| A block that can use neither pseudo-elements nor margins (a disclosure summary) | `lineRelative` |
| A container that only sets the inherited font | none; its children carry the text |

In recipes these are `textLine`, `lineMargins`, `lineCentered`, `linePadded`, `lineRelative` and `textRole` on the type system (`preset/type-scale.ts`). Text that sits next to other items needs its own slot; bare text in a flex row cannot be moved. Text with no style of its own is the `md` body step (the body's default), so it is on the type scale and `check-baseline` measures it; a slot that holds text but sets no helper is what the check finds first.

A role that is used both as a block and as a span has two variants, `body` and `bodyInline` (the same for `prose`): a block is trimmed, a span has its baseline moved by margins. They are separate variants rather than a flag because Panda does not generate the style of a compound variant that is never used literally.

When a page is off, `check-baseline --why` prints where the offset enters: the highest element that is off the grid under a parent that is on it, and what sits above it.

## Seeing it

Press `Shift+G` on a running app in development (`useGridOverlay`) to cycle none, red baseline lines, then red lines with blue verticals. The playground has buttons for both (`?grid&spacing`). The lines read the spacing tokens, so they follow the design's grid.

## Checking it

`pnpm check:baseline <url> --grid 4 --paths / /about --widths 390 1440` (from the repo root, with the page running) loads the page in Chrome with its real fonts, reads the baseline of every element that holds text, groups the ones more than 0.25px off a line by element and parent class, and exits 1 when more than `--max` are off. Run it in CI against a page that uses every component.

`check-spacing` does the same for horizontal spacing: every side padding, side margin and gap on a live page is a whole or half baseline (vertical values are left to the baseline check, because the helpers move them by a fraction of a row on purpose). `guard.test.ts` keeps raw borders out of recipes: a border adds to a block's height, so only the listed controls may have one. `pnpm check:baseline:dram` starts DRAM, runs the check over its pages at phone and desktop widths with a budget, and stops it; it is the command for CI or a pre-push hook (it needs the local database).

## Other browsers

The CSS works the baseline offset out the way Chrome does (it rounds the font's ascent and descent to whole pixels). Firefox does not: with the same font it was up to a pixel off. So each face and step also has a CSS variable (`--ui-baseline-<face>-<step>`) that `calibrateBaselines` fills in with the offset measured in the running browser; the CSS uses it when it is set and falls back to the calculation. Call `useBaselineCalibration()` once at the root of an app. Nothing changes in Chrome.

Checked in Firefox 149 on macOS two ways. First, by rendering a page with the bundled font and screenshotting the measured numbers in headless Firefox: before calibration `lineShift`, `lineMargins`, `trim`, `paddedLine` and `centeredLine` were 0.5 to 1px off a line, after it all were exactly on one at all ten sizes. Second, on DRAM itself: Firefox's own BiDi protocol (`--remote-debugging-port`) runs the same measurement as `check-baseline` in a real Firefox, and on 17 pages at 5 widths 0 of 40,859 text elements are off a line (`check-baseline-firefox.mjs`, run by `pnpm check:baseline:firefox`). The Safari engine is checked through Playwright's WebKit (`check-baseline --browser webkit`, and the same flag on `check-spacing`): 0 of 40,859 text elements and 0 of 77,649 spacing values. Safari.app itself is not driven (its scripting needs a setting turned on).

All three runners share one in-page measurement, `check/measure.mjs`, so they cannot drift. `pnpm check:baseline:dram` runs Chrome, then WebKit and Firefox (`ENGINES=` skips the last two).

Long-form body text has its own measured value (`--ui-baseline-body-longform`). Centered text is placed by padding from the top, not by the browser's centering, so it is exact in both.
