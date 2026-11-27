import { defaultControls, defaultGrid } from '../grid';
import type { Design, HeadingLevel, HeadingStyle } from './types';

/** The headings of the default design: six levels, each a step smaller, in medium weight. */
export const defaultHeadings = {
  h1: { step: '5xl', weight: 'medium' },
  h2: { step: '4xl', weight: 'medium' },
  h3: { step: '3xl', weight: 'medium' },
  h4: { step: '2xl', weight: 'medium' },
  h5: { step: 'xl', weight: 'medium' },
  h6: { step: 'lg', weight: 'medium' },
} as const satisfies Record<HeadingLevel, HeadingStyle>;

export { defaultControls };

/** The default design: the default grid and a minor-third type scale from a 16px body. */
export const design = {
  grid: defaultGrid,
  type: { base: 16, ratio: 1.2, leading: { body: 1.5, falloff: 0.05, floor: 1.3 } },
  motion: {
    durations: {
      fastest: '50ms',
      faster: '100ms',
      fast: '150ms',
      normal: '200ms',
      slow: '250ms',
      slower: '300ms',
      slowest: '400ms',
    },
  },
} as const satisfies Design;
