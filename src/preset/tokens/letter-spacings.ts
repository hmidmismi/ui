import { defineTokens } from '@pandacss/dev';

/** Tracking for the roles that need it. Components use these names, never raw `em` values. */
export const letterSpacings = defineTokens.letterSpacings({
  display: { value: '-0.02em' },
  normal: { value: '0em' },
  wide: { value: '0.04em' },
  caps: { value: '0.14em' },
  numeral: { value: '0.08em' },
});
