import { defineSlotRecipe } from '@pandacss/dev';

/**
 * A two-column page: a main column and a side column, ruled between. Stacks below the `md` breakpoint. `ratio`
 * picks the column widths: `drill` for an index list beside its preview, `page` for media beside its details.
 */
export const split = defineSlotRecipe({
  className: 'split',
  slots: ['root', 'main', 'side'],
  base: {
    root: {
      display: 'grid',
      flex: '1',
      gridTemplateColumns: 'minmax(0, 1fr)',
      minH: '0',
    },
    main: {
      borderColor: 'border',
      display: 'flex',
      flexDirection: 'column',
      minH: '0',
      md: { borderInlineEndWidth: 'hairline' },
    },
    side: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6',
      minH: '0',
      p: '8',
    },
  },
  defaultVariants: { ratio: 'drill' },
  variants: {
    ratio: {
      drill: { root: { md: { gridTemplateColumns: 'minmax(0, 6fr) minmax(0, 5fr)' } } },
      page: { root: { md: { gridTemplateColumns: 'minmax(0, 8fr) minmax(0, 5fr)' } } },
    },
  },
});
