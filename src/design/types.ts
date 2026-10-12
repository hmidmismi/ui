/**
 * The structure of the system: values that decide how big and how far apart everything is. They are computed into
 * tokens when Panda runs, so they are fixed per build. Anything that should change at runtime (colors, faces) is a
 * `Theme` instead (see `../theme`).
 */
export type Design = {
  grid: {
    /** The vertical rhythm unit in px. Every line height is a multiple of it. */
    baseline: number;
    /** The primary spacing step in px. Two baselines, so a spacing step never breaks the rhythm. */
    unit: number;
    /** The root font size in px that `rem` values are computed against. */
    root: number;
  };
  type: {
    /** The body size in px, at step 0. */
    base: number;
    /** The modular scale ratio. 1.2 is the minor third. */
    ratio: number;
    /** The tightest line height as a multiple of the font size, after rounding to the baseline. */
    minLeading: number;
  };
  motion: {
    /** Named durations, as CSS times. */
    durations: Record<'fastest' | 'faster' | 'fast' | 'normal' | 'slow' | 'slower' | 'slowest', string>;
  };
};
