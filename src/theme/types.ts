/** The vertical metrics of a font file, in font units. Capsize publishes them for every Google Fonts file. */
export type FaceMetrics = {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  capHeight: number;
  xHeight: number;
};

/** One file of a face: a weight and style of its family. */
export type FontFile = {
  /** The file name, such as `univers-regular.woff2`. The app decides where it is served from (see `fontFaces`). */
  file: string;
  weight: number;
  style?: 'normal' | 'italic';
};

/** A font face in a theme: the family, its fallbacks, its metrics and optionally the app's CSS variable for it. */
export type Face = {
  family: string;
  generic: 'serif' | 'sans-serif' | 'monospace';
  /**
   * The font files of this family, for apps that serve their own (see `fontFaces`). Leave it out when the family comes
   * from elsewhere (a system font, `next/font`).
   */
  files?: readonly FontFile[];
  /**
   * What follows the family in the stack, in order, written as CSS (`ui-sans-serif`, `"Segoe UI"`). Leave it out for
   * just the generic. A project with symbols its face lacks puts the system fonts that have them here.
   */
  fallbacks?: readonly string[];
  /** The file's vertical metrics. They become variables, so trim and x-height matching follow the face at runtime. */
  metrics: FaceMetrics;
  /** A CSS variable the app sets with the loaded file (for example `next/font`), tried before the family name. */
  cssVar?: string;
};

/** The three roles a theme fills. Components ask for a role, never for a family. */
export type Role = 'display' | 'body' | 'mono';

/**
 * Seven colors the system builds every scale from. They become CSS variables, so a project (or a part of a site) can
 * change them at runtime without rebuilding the stylesheet.
 */
export type Palette = {
  /** Text and the darkest surface. */
  ink: string;
  /** The canvas and the lightest surface. */
  paper: string;
  /** Rules and borders. */
  line: string;
  /** The accent, as the solid in light mode. */
  accent: string;
  /** The accent's soft tint: the solid in dark mode and a light-mode tone. */
  accentSoft: string;
  /** The error hue, as the solid in light mode. */
  danger: string;
  /** The error hue's soft tint. */
  dangerSoft: string;
};

/**
 * A project's own color scales, as a tree of Panda semantic tokens (`{ value: { base, _dark } }`, with nested groups
 * such as the Park UI variants `solid`, `subtle`, `surface`, `outline` and `plain`). The roles below are what the
 * components read, so every one must be present; any other key (more scales, tints, label hues) is the project's own
 * and is passed through untouched.
 *
 * - `gray`, `accent` and `red`: scales with steps `1` to `12`, alpha steps `a1` to `a12` and the Park UI variants.
 * - `canvas`, `fg` (`default`, `muted`, `subtle`, `disabled`), `border` (`DEFAULT`, `muted`, `emphasized`), `error` and
 *   `shadow`: the semantic roles, usually references to the scales.
 */
export type ColorTokens = {
  canvas: unknown;
  fg: { default: unknown; muted: unknown; subtle: unknown; disabled: unknown };
  border: { DEFAULT: unknown; muted: unknown; emphasized: unknown };
  error: unknown;
  shadow: unknown;
  gray: unknown;
  accent: unknown;
  red: unknown;
  [name: string]: unknown;
};

type ThemeBase = {
  name: string;
  faces: Record<Role, Face>;
};

/**
 * The look of a brand: colors and faces. Colors come one of two ways, and a theme gives at least one:
 *
 * - `palette`: seven colors the system generates every scale from. They become CSS variables, so the look can change
 *   at runtime with no rebuild.
 * - `colors`: the project's own scales, which replace the generated ones. They are baked into the stylesheet, so a
 *   project with a designed palette (hand-picked steps, light and dark) plugs it in as is.
 *
 * With both, `colors` supplies the scales and `palette` still sets its variables (for the parts that read them). The
 * faces become CSS variables in either case.
 */
export type Theme = ThemeBase &
  ({ palette: Palette; colors?: ColorTokens } | { palette?: Palette; colors: ColorTokens });
