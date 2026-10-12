import type { Design } from './types';

/** The default design: a 5px baseline, a 10px spacing unit and a minor-third type scale from a 16px body. */
export const design = {
  grid: { baseline: 5, unit: 10, root: 16 },
  type: { base: 16, ratio: 1.2, minLeading: 1.3 },
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
