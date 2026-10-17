import { defineTokens } from '@pandacss/dev';

/** The font weights recipes name. */
export const fontWeights = defineTokens.fontWeights({
  normal: { value: '400' },
  medium: { value: '500' },
  semibold: { value: '600' },
  bold: { value: '700' },
});
