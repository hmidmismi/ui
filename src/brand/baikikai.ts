import type { Theme } from '../theme';
import { activeFaces } from './faces';
import { palette } from './palette';

/**
 * The Baikikai theme: the five brand colors and the active font set. Faces read the CSS variables `next/font` sets
 * (`--font-display`, `--font-body`, `--font-mono`) before the family name. This is the only place the brand's values
 * live; everything else in the package takes a `Theme`.
 */
export const baikikai = {
  name: 'baikikai',
  palette,
  faces: {
    display: { ...activeFaces.display, cssVar: '--font-display' },
    body: { ...activeFaces.body, cssVar: '--font-body' },
    mono: { ...activeFaces.mono, cssVar: '--font-mono' },
  },
} as const satisfies Theme;
