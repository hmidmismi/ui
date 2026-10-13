import type { SystemStyleObject } from '@pandacss/dev';
import { type Design, design } from '../design';
import { type FaceMetrics, faceVar, type Role } from '../theme';
import { createScale, round } from './scale';

/**
 * The type system, generated from a design so every size, line height and trim comes from one model.
 *
 * Scale: sizes follow a modular scale, `base * ratio ** step`, with `md` at step 0 (the body size).
 *
 * Line height: every line height is a whole number of baselines, the same unit the spacing tokens use, so stacked
 * lines and blocks stay on one vertical rhythm. The leading ratio is the design's `leading.body` at body size and
 * below and falls by `leading.falloff` per step; it is clamped to `leading.floor`, the result is rounded to a baseline,
 * then raised if rounding left it under the floor. Those three numbers are the rhythm a design plugs in.
 *
 * Trim (Capsize): text roles remove the space above the capitals and below the baseline with negative margins on
 * `::before` and `::after`. The margins are `calc()` over the theme's per-face variables (see `theme/toCss.ts`), so
 * they follow the face the theme sets, at runtime. Sizes are adjusted the same way so the lowercase x-height matches
 * the body face's at the same step.
 */

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

/** The text roles that have a face: `display`, `body` and `mono`. */
export type Face = Role;

type Styles = SystemStyleObject;
type Loose = Record<string, unknown>;

const NAMES = Object.keys(STEPS) as StepName[];

/**
 * The Capsize trim of a block in em, from a face's metrics. This is the formula the generated `calc()` expresses; the
 * tests check it against Capsize itself and the browser tests check the rendered margins against it.
 *
 * @param metrics - the face's metrics.
 * @param fontSize - the set font size in px.
 * @param leading - the line height in px.
 * @returns the margins in em: `capHeightTrim` goes above, `baselineTrim` below (both negative).
 */
export function trimValues(metrics: FaceMetrics, fontSize: number, leading: number) {
  const upm = metrics.unitsPerEm;
  const descent = Math.abs(metrics.descent);
  const normal = (metrics.ascent + metrics.lineGap + descent) / upm;
  const extra = (normal - leading / fontSize) / 2;
  return {
    capHeightTrim: extra - (metrics.ascent - metrics.capHeight + metrics.lineGap / 2) / upm,
    baselineTrim: extra - (descent + metrics.lineGap / 2) / upm,
  };
}

/**
 * The type system of a design: step sizes and line heights, tokens, and the text styles roles use.
 *
 * @param d - the design (its grid and type are read).
 * @returns the functions, tokens and fragments.
 */
export function createTypeSystem(d: Pick<Design, 'grid' | 'type'>) {
  const scale = createScale(d);
  const num = (value: number) => String(round(value));

  /** The nominal size of a step in px, before any per-face x-height adjustment. */
  const stepSize = (step: StepName) => d.type.base * d.type.ratio ** STEPS[step];

  /** The line height of a step in px: a multiple of the baseline. */
  const stepLineHeight = (step: StepName) => {
    const index = STEPS[step];
    const size = stepSize(step);
    const { body, falloff, floor } = d.type.leading;
    const leading = index <= 0 ? body : Math.max(floor, body - falloff * index);
    let lines = Math.round((size * leading) / scale.BASELINE);
    while ((lines * scale.BASELINE) / size < floor) lines += 1;
    return lines * scale.BASELINE;
  };

  /** The `fontSizes` tokens: every step in rem, in the reference face's size. */
  const fontSizeTokens = Object.fromEntries(
    NAMES.map((name) => [name, { value: scale.rem(round(stepSize(name))) }])
  );

  /** The `lineHeights` tokens: every step's line height in rem, a whole number of baselines. */
  const lineHeightTokens = Object.fromEntries(
    NAMES.map((name) => [name, { value: scale.rem(stepLineHeight(name)) }])
  );

  /** The shared text styles, one per step: size and line height, with tighter tracking from `4xl` up. */
  const scaleTextStyles = Object.fromEntries(
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

  /**
   * The size and line height of a step in a role. The size is the step's, scaled by the role's x-height adjustment
   * variable; the line height is the step's, so every role has the same rhythm at the same step.
   */
  const textSize = (role: Role, step: StepName): Styles => ({
    fontSize: `calc(${num(stepSize(step))} / ${scale.ROOT_SIZE} * var(${faceVar(role, 'adj')}) * 1rem)`,
    lineHeight: scale.rem(stepLineHeight(step)),
  });

  /**
   * The Capsize trim of a step in a role: negative margins on `::before` and `::after`, as `calc()` over the role's
   * variables. It needs a block box, so roles turn it off for inline elements. Do not put margin on a trimmed element;
   * padding is measured from the cap and baseline edges.
   */
  const textTrim = (role: Role, step: StepName): Styles => {
    const size = num(stepSize(step));
    const leading = num(stepLineHeight(step));
    const extra = `(var(${faceVar(role, 'normal')}) - ${leading} / (${size} * var(${faceVar(role, 'adj')}))) / 2`;
    return {
      '&::before': {
        content: '""',
        display: 'table',
        marginBottom: `calc((${extra} - var(${faceVar(role, 'cap')})) * 1em)`,
      },
      '&::after': {
        content: '""',
        display: 'table',
        marginTop: `calc((${extra} - var(${faceVar(role, 'base')})) * 1em)`,
      },
    };
  };

  /** Size, line height and trim together, for text that is always a block. */
  const textRole = (role: Role, step: StepName): Styles =>
    ({ ...(textSize(role, step) as Loose), ...(textTrim(role, step) as Loose) }) as Styles;

  /** The uppercase, tracked, small label. One definition, so every label looks the same. */
  const labelCaps: Styles = {
    fontFamily: 'body',
    fontWeight: 'medium',
    letterSpacing: 'caps',
    textTransform: 'uppercase',
    ...textSize('body', 'xs'),
  };

  return {
    stepSize,
    stepLineHeight,
    fontSizeTokens,
    lineHeightTokens,
    scaleTextStyles,
    textSize,
    textTrim,
    textRole,
    labelCaps,
  };
}

/** The type system's functions, bound to one design. Recipes are built from this. */
export type TypeSystem = ReturnType<typeof createTypeSystem>;

/** The body size in px, at step 0, in the default design. */
export const BASE_SIZE: number = design.type.base;

/** The modular scale ratio in the default design. 1.2 is the minor third. */
export const RATIO: number = design.type.ratio;

/** The tightest line height as a multiple of the font size, in the default design. */
export const MIN_LEADING: number = design.type.leading.floor;

const defaults = createTypeSystem(design);

export const {
  stepSize,
  stepLineHeight,
  fontSizeTokens,
  lineHeightTokens,
  scaleTextStyles,
  textSize,
  textTrim,
  textRole,
  labelCaps,
} = defaults;

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
