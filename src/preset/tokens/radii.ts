import { defineTokens } from '@pandacss/dev';

/** Flat, near-square corners. `l1` to `l3` are the names Park UI recipes use. */
export const radii = defineTokens.radii({
  none: { value: '0' },
  xs: { value: '1px' },
  sm: { value: '2px' },
  md: { value: '3px' },
  lg: { value: '5px' },
  full: { value: '9999px' },
  l1: { value: '{radii.xs}' },
  l2: { value: '{radii.sm}' },
  l3: { value: '{radii.md}' },
});
