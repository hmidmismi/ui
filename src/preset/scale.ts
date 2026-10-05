/**
 * The grid every size in the system sits on.
 *
 * - `BASELINE` is the vertical rhythm unit: every line height is a multiple of it.
 * - `UNIT` is the spacing step. It is two baselines, so a spacing step never breaks the rhythm.
 * - `HALF` (= `BASELINE`) is the half step, for utility gaps such as an icon beside its label.
 *
 * Spacing and size tokens are named by their number of baselines, so token `4` is 20px and token `1` is 5px. Even
 * tokens are on the 10px scale; odd tokens are the 5px utility steps.
 */

/** The root font size in px that `rem` values are computed against. */
export const ROOT_SIZE = 16;

/** The vertical rhythm unit in px. */
export const BASELINE = 5;

/** The primary spacing step in px. */
export const UNIT = BASELINE * 2;

/**
 * Rounds to four decimal places, so generated rem values stay short.
 *
 * @param value - the number.
 * @returns the rounded number.
 */
export function round(value: number) {
  return Math.round(value * 10000) / 10000;
}

/**
 * Converts px to a rem string.
 *
 * @param px - the length in px.
 * @returns the length in rem.
 */
export function rem(px: number) {
  return `${round(px / ROOT_SIZE)}rem`;
}

/**
 * Converts a number of baselines to a rem string.
 *
 * @param count - the number of 5px baselines.
 * @returns the length in rem.
 */
export function baselines(count: number) {
  return rem(count * BASELINE);
}
