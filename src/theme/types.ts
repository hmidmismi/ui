/** The vertical metrics of a font file, in font units. Capsize publishes them for every Google Fonts file. */
export type FaceMetrics = {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  capHeight: number;
  xHeight: number;
};

/** A font face in a theme: the family, its generic fallback, its metrics and optionally the app's CSS variable for it. */
export type Face = {
  family: string;
  generic: 'serif' | 'sans-serif' | 'monospace';
  /** The file's vertical metrics. They become variables, so trim and x-height matching follow the face at runtime. */
  metrics: FaceMetrics;
  /** A CSS variable the app sets with the loaded file (for example `next/font`), tried before the family name. */
  cssVar?: string;
};

/** The three roles a theme fills. Components ask for a role, never for a family. */
export type Role = 'display' | 'body' | 'mono';

/**
 * The look of a brand: colors and faces. Everything here becomes a CSS variable, so a project (or a part of a site)
 * can change it at runtime without rebuilding the stylesheet.
 */
export type Theme = {
  name: string;
  palette: {
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
  faces: Record<Role, Face>;
};
