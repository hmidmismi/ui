import { defineRecipe } from '@pandacss/dev';

/**
 * Sets a hue for everything inside the element: it defines `--tone`, which `tile`, `plate` and
 * `card` read. Apply it to the element itself or to a wrapper. The hues are the names of the theme's
 * `categorical` colors, so a project says how many there are and what they are called.
 */
export const hue = (hues: readonly string[]) =>
  defineRecipe({
    className: 'hue',
    staticCss: ['*'],
    variants: {
      hue: Object.fromEntries(
        hues.map((hue) => [hue, { '--tone': `token(colors.categorical.${hue})` }])
      ),
    },
  });

/** A scrolling list with a fixed maximum height: a drawer's items or a list of names. */
export const scrollList = defineRecipe({
  className: 'scroll-list',
  base: {
    maxHeight: 'scrollList',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    scrollbarWidth: 'thin',
  },
});
