import type { TypeSystem } from '../type-scale';
import { defineRecipe } from '@pandacss/dev';
import { column, siteInset } from '../fragments';
import { linkStyles } from '../interaction';

/** The page: full width with one gutter at each side and no gap between blocks. Links in page content use `linkStyles` (see `interaction.ts`). */
export const pageColumn = defineRecipe({
  className: 'page-column',
  base: {
    ...column,
    width: 'full',
    paddingBlockStart: { base: '4', sm: '8' },
    paddingBlockEnd: { base: '4', sm: '24' },
    ...siteInset,
    // Plain content links only: a link with a class is a component (a pill, a row, a tile) and sets its own states.
    '& :where(a:not(.button, [class]))': linkStyles,
  },
  variants: {
    flushTop: { true: { paddingBlockStart: '0' } },
  },
});

/** The skip-to-content link: off screen until it receives keyboard focus. */
export const skipLink = (t: TypeSystem) =>
  defineRecipe({
    className: 'skip-link',
    base: {
      position: 'absolute',
      insetInlineStart: '2',
      insetBlockStart: '-16',
      zIndex: 'skipLink',
      paddingInline: '4',
      ...t.textSize('body', 'md'),
      ...t.linePadded('body', 'md', { block: 'token(spacing.2)' }),
      borderRadius: 'l2',
      background: 'accent',
      color: 'canvas',
      _focus: { insetBlockStart: '2' },
    },
  });
