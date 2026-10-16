import { defineTokens } from '@pandacss/dev';
import { type Design, design } from '../../design';
import { createScale } from '../scale';
import { scaleValuesFor } from '../spacing';

/**
 * Sizes: the spacing scale (for control heights, icons and boxes) plus named widths for layout and dialogs. The
 * named widths are horizontal measures, so they are on the 10px scale but not tied to the vertical rhythm.
 */
export const sizesFor = (d: Pick<Design, 'grid'>) => {
  const { rem } = createScale(d);
  return defineTokens.sizes({
  ...scaleValuesFor(d),
  xs: { value: rem(320) },
  sm: { value: rem(380) },
  md: { value: rem(440) },
  lg: { value: rem(500) },
  xl: { value: rem(560) },
  '2xl': { value: rem(640) },
  '3xl': { value: rem(760) },
  '4xl': { value: rem(900) },
  '5xl': { value: rem(1060) },
  '6xl': { value: rem(1200) },
  '7xl': { value: rem(1360) },
  /** The widest the content column gets, side inset included. */
  site: { value: rem(1280) },
  /** The shortest the header bar gets. */
  bar: { value: rem(64) },
  /** The readable line length of running text. */
  prose: { value: '65ch' },
  /** The page's centered inset. */
  inset: { value: rem(1120) },
  });
};

export const sizes = sizesFor(design);
