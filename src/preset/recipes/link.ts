import { defineRecipe } from '@pandacss/dev';

/** An inline link. Preflight removes the browser color and underline, so the recipe sets both. */
export const link = defineRecipe({
  className: 'link',
  base: {
    color: 'accent.11',
    cursor: 'pointer',
    textDecorationLine: 'underline',
    textDecorationColor: 'accent.7',
    textUnderlineOffset: '0.2em',
    transitionProperty: 'color, text-decoration-color',
    transitionDuration: 'fast',
    focusVisibleRing: 'outside',
    _hover: { color: 'accent.12', textDecorationColor: 'accent.9' },
  },
  defaultVariants: { tone: 'accent' },
  variants: {
    tone: {
      accent: {},
      muted: {
        color: 'fg.muted',
        textDecorationColor: 'border',
        _hover: { color: 'fg.default', textDecorationColor: 'border.emphasized' },
      },
      plain: {
        textDecorationLine: 'none',
        color: 'inherit',
        _hover: { textDecorationLine: 'underline' },
      },
    },
  },
});
