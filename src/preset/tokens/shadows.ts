import { defineTokens } from '@pandacss/dev';

/** Elevation: one ink shadow color (the `shadow` semantic color) at five distances. */
export const shadows = defineTokens.shadows({
  xs: { value: '0px 1px 2px {colors.shadow}' },
  sm: { value: '0px 2px 5px {colors.shadow}' },
  md: { value: '0px 5px 10px {colors.shadow}' },
  lg: { value: '0px 10px 20px {colors.shadow}' },
  xl: { value: '0px 20px 30px {colors.shadow}' },
  '2xl': { value: '0px 30px 50px {colors.shadow}' },
});
