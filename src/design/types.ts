/** The type steps, `xs` to `7xl`. */
export type TypeStep = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

/** The sizes a control (button, input, select, tab) comes in. */
export type ControlSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** One size of a control, in baselines (so it scales with the grid). Half baselines are allowed. */
export type ControlStyle = {
  /** The height, and the minimum width of an icon-only control. */
  height: number;
  /** The padding at each side. */
  padX: number;
  /** The icon beside the label. */
  icon: number;
};

/** The text roles a page sets, other than headings. */
export type RoleName =
  | 'eyebrow'
  | 'personName'
  | 'term'
  | 'entry'
  | 'prose'
  | 'value'
  | 'caption'
  | 'count'
  | 'tagline'
  | 'fieldLabel'
  | 'notice';

/** How one text role looks. Opinionated, so it is the project's to say. */
export type RoleStyle = {
  /** The face: `display`, `body` or `mono`. Defaults to `body`. */
  face?: 'display' | 'body' | 'mono';
  /** A font family token to use instead of the face's, such as a serif for running text. */
  family?: string;
  /** The size step on phones, and from the `md` breakpoint when `wide` is not given. */
  step: TypeStep;
  /** The size step from the `md` breakpoint. */
  wide?: TypeStep;
  /** The weight. */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** A tracking token (`letterSpacings`). */
  tracking?: string;
  /** Sets the text in capitals. */
  uppercase?: boolean;
  /** A color token. */
  color?: string;
  /** Always trims the space above the capitals and below the baseline (for block text that has no trim variant). */
  trim?: boolean;
  /** More style properties this role sets (padding, a measure, tabular figures). */
  extra?: Record<string, unknown>;
};

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
    /** How each text role looks. Left out, the system's own (`defaultRoles`). */
    roles?: Partial<Record<RoleName, RoleStyle>>;
  };
  /**
   * Values for the named sizes the components read (`site`, `prose`, `plate`, `hero`, ...), as CSS lengths. Left out, the
   * system's own. A name the system does not declare is an error.
   */
  sizes?: Record<string, string>;
  /** How tall, how padded and how large the icon is at each control size. Left out, the system's own. */
  controls?: Partial<Record<ControlSize, ControlStyle>>;
  motion: {
    /** Named durations, as CSS times. */
    durations: Record<
      'fastest' | 'faster' | 'fast' | 'normal' | 'slow' | 'slower' | 'slowest',
      string
    >;
  };
};
