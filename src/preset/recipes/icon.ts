import { defineRecipe } from '@pandacss/dev';

export const icon = defineRecipe({
  className: 'icon',
  base: {
    color: 'currentcolor',
    display: 'inline-block',
    flexShrink: '0',
    verticalAlign: 'middle',
    lineHeight: '1em',
  },
  defaultVariants: { size: 'md' },
  variants: {
    size: {
      '2xs': { boxSize: '2' },
      xs: { boxSize: '3' },
      sm: { boxSize: '3' },
      md: { boxSize: '4' },
      lg: { boxSize: '4' },
      xl: { boxSize: '5' },
    },
  },
});
