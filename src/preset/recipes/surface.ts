import { defineRecipe } from '@pandacss/dev';

/**
 * A full-width ground. `paper` is the light canvas and `ink` the dark one; the component adds the `dark` class for
 * `ink`, which flips every semantic color inside it.
 */
export const surface = defineRecipe({
  className: 'surface',
  base: {
    bg: 'canvas',
    color: 'fg.default',
    display: 'flex',
    flexDirection: 'column',
  },
  variants: {
    fill: {
      true: { flex: '1', minH: '0' },
    },
  },
});
