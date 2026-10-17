import { defineRecipe } from '@pandacss/dev';

/** A one-line status strip: green when `ok`, red when not. */
export const statusBadge = defineRecipe({
  className: 'status-badge',
  staticCss: ['*'],
  base: { padding: '2', color: 'white' },
  defaultVariants: { state: 'ok' },
  variants: {
    state: {
      ok: { background: 'success.9' },
      bad: { background: 'red.9' },
    },
  },
});
