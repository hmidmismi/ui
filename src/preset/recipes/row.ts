import { defineSlotRecipe } from '@pandacss/dev';
import { ruleAbove } from '../fragments';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';

/**
 * A row of a list: an optional lead (a plate, a number, a date), a title over a meta line, an aside at the end and, for a
 * row that opens something, a chevron. A rule sits above the row. A row that is a link or a button (`interactive`) takes
 * the hover ground, and a button that is open keeps it. `layout` sets the columns: `plain` (title and aside), `plated` and
 * `numbered` (a lead and a chevron) and `dated` (a lead set on the text's baseline, the aside always shown).
 */
export const row = (t: TypeSystem) => {
  const textLine = t.textLine;
  return defineSlotRecipe({
    className: 'row',
    staticCss: ['*'],
    slots: ['root', 'text', 'title', 'meta', 'aside', 'chevron'],
    base: {
      root: {
        display: 'grid',
        alignItems: 'center',
        columnGap: '4',
        paddingBlock: '3',
        background: 'transparent',
        ...ruleAbove,
        color: 'fg.default',
        textAlign: 'start',
      },
      // The title and meta start at the top of the row, a whole row from the lead's top, instead of being centered by a
      // half row that may not be a whole number of baselines.
      text: { alignSelf: 'baseline', minWidth: '0' },
      title: {
        display: 'block',
        minWidth: '0',
        fontFamily: 'display',
        fontWeight: 'medium',
        ...responsive(textLine('display', 'lg'), textLine('display', 'xl'), 'sm'),
        '& mark': { background: 'transparent', color: 'accent' },
      },
      meta: {
        display: 'block',
        color: 'fg.muted',
        fontFamily: 'body',
        fontWeight: 'normal',
        ...textLine('body', 'md'),
        '& mark': { background: 'transparent', color: 'accent' },
        '& a': { color: 'accent' },
      },
      aside: {
        ...textLine('body', 'md'),
        alignSelf: 'baseline',
        display: { base: 'none', sm: 'block' },
        color: 'fg.muted',
        textAlign: 'end',
        whiteSpace: 'nowrap',
      },
      chevron: {
        justifySelf: 'center',
        width: 'chevron',
        height: 'chevron',
        marginBlockStart: '-1',
        borderInlineEndWidth: 'rail',
        borderBlockEndWidth: 'rail',
        borderInlineEndStyle: 'solid',
        borderBlockEndStyle: 'solid',
        borderColor: 'fg.muted',
        transform: 'rotate(45deg)',
        transitionProperty: 'transform, margin',
        transitionDuration: 'fast',
        '[aria-expanded="true"] > &': { transform: 'rotate(-135deg)', marginBlockStart: '1' },
      },
    },
    variants: {
      layout: {
        plain: {
          root: { gridTemplateColumns: { base: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) auto' } },
          chevron: { display: 'none' },
        },
        plated: {
          root: {
            gridTemplateColumns: {
              base: 'token(sizes.plateCompact) minmax(0, 1fr) token(sizes.glyph)',
              sm: 'token(sizes.plate) minmax(0, 1fr) auto token(sizes.glyph)',
            },
          },
        },
        thumb: {
          root: {
            gridTemplateColumns: {
              base: 'token(sizes.plateCompact) minmax(0, 1fr)',
              sm: 'token(sizes.plate) minmax(0, 1fr) auto',
            },
          },
          chevron: { display: 'none' },
        },
        numbered: {
          root: {
            gridTemplateColumns: {
              base: 'token(spacing.6) minmax(0, 1fr) token(sizes.glyph)',
              sm: 'token(spacing.8) minmax(0, 1fr) auto token(sizes.glyph)',
            },
          },
        },
        dated: {
          root: {
            gridTemplateColumns: {
              base: 'token(sizes.dateColumnCompact) minmax(0, 1fr)',
              sm: 'token(sizes.dateColumn) minmax(0, 1fr) auto',
            },
            alignItems: 'baseline',
            columnGap: '6',
            paddingBlock: '4',
          },
          chevron: { display: 'none' },
          aside: {
            display: 'block',
            gridColumn: { base: '2', sm: 'auto' },
            textAlign: { base: 'start', sm: 'end' },
          },
        },
      },
      interactive: {
        true: {
          root: {
            width: 'calc(100% + token(spacing.4) * 2)',
            marginInline: '-4',
            paddingInline: '4',
            cursor: 'pointer',
            transitionProperty: 'background-color',
            transitionDuration: 'fast',
            _hover: { background: 'gray.surface.bg.hover' },
            '&[aria-expanded="true"]': { background: 'gray.surface.bg.hover' },
          },
        },
      },
    },
    defaultVariants: { layout: 'plain' },
  });
};
