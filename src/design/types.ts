/** The type steps, `xs` to `7xl`. */
export type TypeStep = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

/** The heading levels a title can be set at. */
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/** How one heading level looks. Opinionated, so it is the project's to say. */
export type HeadingStyle = {
  /** The size step on phones, and from the `md` breakpoint when `wide` is not given. */
  step: TypeStep;
  /** The size step from the `md` breakpoint, when larger screens set the heading bigger. */
  wide?: TypeStep;
  /** The weight. Defaults to normal. */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** A tracking token (`letterSpacings`), such as `title`. */
  tracking?: string;
  /** Sets the heading in capitals. */
  uppercase?: boolean;
  /** A color token. Defaults to `fg.default`. */
  color?: string;
};

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
    /**
     * The rhythm of the line heights: the leading (line height over font size) is `body` at the body size and below,
     * falls by `falloff` per step above it, and never goes under `floor`. Each result is rounded to a whole number of
     * baselines, then raised until it is at least `floor`.
     */
    leading: {
      body: number;
      falloff: number;
      floor: number;
    };
    /** How each heading level looks. Left out, the system's own (`defaultHeadings`). */
    headings?: Partial<Record<HeadingLevel, HeadingStyle>>;
  };
  motion: {
    /** Named durations, as CSS times. */
    durations: Record<
      'fastest' | 'faster' | 'fast' | 'normal' | 'slow' | 'slower' | 'slowest',
      string
    >;
  };
};
