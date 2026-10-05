import { defineRecipe } from '@pandacss/dev';

/**
 * Layout primitives. Gaps are spacing tokens on the 10px scale: `sm` 10px, `md` 20px, `lg` 40px, `xl` 80px. Because
 * every gap is a whole number of baselines, stacked blocks keep the vertical rhythm.
 */
export const layoutStack = defineRecipe({
  className: 'layout-stack',
  base: {
    display: 'flex',
    flexDirection: 'column',
  },
  variants: {
    gap: {
      none: { gap: '0' },
      xs: { gap: '1' },
      sm: { gap: '2' },
      md: { gap: '4' },
      lg: { gap: '8' },
      xl: { gap: '16' },
    },
    inset: {
      true: { p: '8' },
    },
  },
  defaultVariants: {
    gap: 'md',
  },
});

export const layoutWrap = defineRecipe({
  className: 'layout-wrap',
  base: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  variants: {
    gap: {
      xs: { gap: '1' },
      sm: { gap: '2' },
      md: { gap: '4' },
    },
  },
  defaultVariants: {
    gap: 'sm',
  },
});
