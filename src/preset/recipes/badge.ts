import { defineRecipe } from '@pandacss/dev';

export const badge = defineRecipe({
  className: 'badge',
  base: {
    alignItems: 'center',
    borderRadius: 'l1',
    display: 'inline-flex',
    fontWeight: 'medium',
    gap: '1',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    px: '2',
    h: '5',
    textStyle: 'xs',
  },
  defaultVariants: { variant: 'subtle' },
  variants: {
    variant: {
      solid: { bg: 'colorPalette.solid.bg', color: 'colorPalette.solid.fg' },
      subtle: { bg: 'colorPalette.subtle.bg', color: 'colorPalette.subtle.fg' },
      outline: {
        borderWidth: 'hairline',
        borderColor: 'colorPalette.outline.border',
        color: 'colorPalette.outline.fg',
      },
    },
  },
});
