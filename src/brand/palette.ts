import type { Palette } from '../theme';

/**
 * The Baikikai palette, on its own so code that only needs the colors (the Sanity studio's text-color options) can
 * import it without pulling in fonts or reading the environment.
 */
export const palette = {
  ink: '#14171C',
  paper: '#ECEDE8',
  line: '#C4C8C0',
  accent: '#2C3E72',
  accentSoft: '#9AA7D4',
  danger: '#B4432F',
  dangerSoft: '#E3A596',
} as const satisfies Palette;
