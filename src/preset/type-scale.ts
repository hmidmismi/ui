import { precomputeValues } from '@capsizecss/core';
import type { SystemStyleObject } from '@pandacss/dev';
import { fontMetrics } from './font-metrics';
import { BASELINE, ROOT_SIZE, rem, round } from './scale';

/**
 * The type system, generated from a few constants so every size, line height and trim comes from one model.
 *
 * Scale: sizes follow a minor-third modular scale, `BASE_SIZE * RATIO ** step`, with `md` at step 0 (the body size).
 *
 * Line height: every line height is a whole number of 5px baselines (`BASELINE`), the same unit the spacing tokens use,
 * so stacked lines and blocks stay on one vertical rhythm. The leading ratio is 1.5 at body size and below and falls
 * 0.05 per step to a floor of 1.1; the result is rounded to a baseline, then raised if rounding left it under
 * `MIN_LEADING`.
 *
 * Trim (Capsize): text roles remove the space above the capitals and below the baseline with negative margins on
 * `::before` and `::after`, computed per face and step from the font metrics, so a text box is exactly as tall as its
 * letters and the gaps between blocks are the gaps you see. Sizes are also adjusted per face so the lowercase x-height
 * matches the body face's at the same step.
 */

/** The body size in px, at step 0. */
export const BASE_SIZE = ROOT_SIZE;

/** The modular scale ratio. 1.2 is the minor third. */
export const RATIO = 1.2;

/** The tightest line height as a multiple of the font size, after rounding to the baseline. */
export const MIN_LEADING = 1.3;

/** The named steps. `md` is the body size; negative steps are smaller. */
export const STEPS = {
  xs: -2,
  sm: -1,
  md: 0,
  lg: 1,
  xl: 2,
  '2xl': 3,
  '3xl': 4,
  '4xl': 5,
  '5xl': 6,
  '6xl': 7,
  '7xl': 8,
} as const;

/** A step name: `xs` to `7xl`. */
export type StepName = keyof typeof STEPS;

/** The font families that have metrics. */
export type Face = keyof typeof fontMetrics;

/** The face whose x-height every other face is matched to. */
const REFERENCE_FACE: Face = 'body';

type Styles = SystemStyleObject;
type Loose = Record<string, unknown>;

/**
 * The nominal size of a step in px, before any per-face x-height adjustment.
 *
 * @param step - the step name.
 * @returns the size in px.
 */
export function stepSize(step: StepName) {
  return BASE_SIZE * RATIO ** STEPS[step];
}

/**
 * The line height of a step in px: a multiple of the baseline.
 *
 * @param step - the step name.
 * @returns the line height in px.
 */
export function stepLineHeight(step: StepName) {
  const index = STEPS[step];
  const size = stepSize(step);
  const leading = index <= 0 ? 1.5 : Math.max(1.1, 1.5 - 0.05 * index);
  let lines = Math.round((size * leading) / BASELINE);
  while ((lines * BASELINE) / size < MIN_LEADING) lines += 1;
  return lines * BASELINE;
}

/**
 * How much larger a face is set so its x-height equals the reference face's at the same step.
 *
 * @param face - the face.
 * @returns the multiplier, 1 for the reference face.
 */
export function xHeightAdjust(face: Face) {
  const reference = fontMetrics[REFERENCE_FACE];
  const metrics = fontMetrics[face];
  return reference.xHeight / reference.unitsPerEm / (metrics.xHeight / metrics.unitsPerEm);
}

/**
 * The size and line height of a step in a face. The line height is the step's, so every face has the same rhythm at
 * the same step.
 *
 * @param face - the face.
 * @param step - the step name.
 * @returns `fontSize` and `lineHeight` in rem.
 */
export function textSize(face: Face, step: StepName): Styles {
  return {
    fontSize: rem(round(stepSize(step) * xHeightAdjust(face))),
    lineHeight: rem(stepLineHeight(step)),
  };
}

/**
 * The Capsize trim of a step in a face: negative margins on `::before` and `::after`. It needs a block box, so roles
 * turn it off for inline elements. Do not put margin on a trimmed element; padding is measured from the cap and
 * baseline edges.
 *
 * @param face - the face.
 * @param step - the step name.
 * @returns the pseudo-element styles.
 */
export function textTrim(face: Face, step: StepName): Styles {
  const { capHeightTrim, baselineTrim } = precomputeValues({
    fontSize: stepSize(step) * xHeightAdjust(face),
    leading: stepLineHeight(step),
    fontMetrics: fontMetrics[face],
  });
  return {
    '&::before': { content: '""', display: 'table', marginBottom: capHeightTrim },
    '&::after': { content: '""', display: 'table', marginTop: baselineTrim },
  };
}

/**
 * Size, line height and trim together, for text that is always a block.
 *
 * @param face - the face.
 * @param step - the step name.
 * @returns the combined style fragment.
 */
export function textRole(face: Face, step: StepName): Styles {
  return { ...(textSize(face, step) as Loose), ...(textTrim(face, step) as Loose) } as Styles;
}

/** The uppercase, tracked, small label. One definition, so every label looks the same. */
export const labelCaps: Styles = {
  fontFamily: 'body',
  fontWeight: 'medium',
  letterSpacing: 'caps',
  textTransform: 'uppercase',
  ...textSize('body', 'xs'),
};

/**
 * Merges two style fragments into one whose differing values switch at a breakpoint.
 *
 * @param base - the styles for small screens.
 * @param wide - the styles from the breakpoint up.
 * @param breakpoint - the Panda breakpoint name. Defaults to `md`.
 * @returns the responsive style object.
 */
export function responsive(base: Styles, wide: Styles, breakpoint = 'md'): Styles {
  return mergeResponsive(base as Loose, wide as Loose, breakpoint) as Styles;
}

function mergeResponsive(base: Loose, wide: Loose, breakpoint: string): Loose {
  const merged: Loose = {};
  for (const key of Object.keys(base)) {
    const a = base[key];
    const b = wide[key];
    if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
      merged[key] = mergeResponsive(a as Loose, b as Loose, breakpoint);
    } else if (a === b) {
      merged[key] = a;
    } else {
      merged[key] = { base: a, [breakpoint]: b };
    }
  }
  return merged;
}

const NAMES = Object.keys(STEPS) as StepName[];

/** The `fontSizes` tokens: every step in rem, in the reference face's size. */
export const fontSizeTokens = Object.fromEntries(
  NAMES.map((name) => [name, { value: rem(round(stepSize(name))) }])
);

/** The `lineHeights` tokens: every step's line height in rem, a whole number of baselines. */
export const lineHeightTokens = Object.fromEntries(
  NAMES.map((name) => [name, { value: rem(stepLineHeight(name)) }])
);

/** The shared text styles, one per step: size and line height, with tighter tracking from `4xl` up. */
export const scaleTextStyles = Object.fromEntries(
  NAMES.map((name) => [
    name,
    {
      value: {
        fontSize: name,
        lineHeight: name,
        ...(STEPS[name] >= STEPS['4xl'] ? { letterSpacing: 'display' } : {}),
      },
    },
  ])
);
