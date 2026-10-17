import { defineRecipe, defineSlotRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';
import { boxed, ruleAbove, ruleBelow } from '../fragments';

/** A list of names with their counts at the end, one hairline between rows. Used for categories and instruments. */
export const countedList = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineSlotRecipe({
  className: 'counted-list',
  slots: ['root', 'item', 'link', 'count'],
  base: {
    root: { ...ruleAbove },
    item: {},
    link: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '4',
      width: 'full',
      paddingBlock: '3',
      background: 'transparent',
      color: 'fg.default',
      cursor: 'pointer',
      textAlign: 'start',
      ...textSize('body', 'md'),
      ...ruleBelow,
      transitionProperty: 'color',
      transitionDuration: 'fast',
      _hover: { color: 'accent' },
    },
    count: { color: 'fg.muted', fontVariantNumeric: 'tabular-nums' },
  },
});
};

/** The text filter over a list: a boxed input, accent border on focus. */
export const listFilter = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineRecipe({
  className: 'list-filter',
  base: {
    ...boxed,
    width: 'full',
    marginBlockEnd: '2',
    paddingBlock: '2',
    paddingInline: '3',
    background: 'transparent',
    outline: 'none',
    color: 'fg.default',
    ...textSize('body', 'md'),
    '&::placeholder': { color: 'fg.muted' },
    transitionProperty: 'border-color',
    transitionDuration: 'fast',
    _focus: { borderColor: 'accent' },
  },
});
};

/**
 * A release row: a full-width button (or a link, for a plain row) with the cover plate, the title over its meta line, the
 * year and track count, and a chevron that turns when the row is open. Rows are ruled, and hover and open take the
 * hover ground. `plain` has no plate or chevron.
 */
export const expandableRow = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineSlotRecipe({
  className: 'expandable-row',
  staticCss: ['*'],
  slots: ['root', 'title', 'meta', 'aside', 'chevron'],
  base: {
    root: {
      display: 'grid',
      alignItems: 'center',
      columnGap: '4',
      width: 'calc(100% + token(spacing.4) * 2)',
      marginInline: '-4',
      paddingBlock: '3',
      paddingInline: '4',
      background: 'transparent',
      borderBlockStartWidth: 'hairline',
      borderBlockStartStyle: 'solid',
      borderBlockStartColor: 'border',
      color: 'fg.default',
      cursor: 'pointer',
      textAlign: 'start',
      transitionProperty: 'background-color',
      transitionDuration: 'fast',
      _hover: { background: 'gray.surface.bg.hover' },
      '&[aria-expanded="true"]': { background: 'gray.surface.bg.hover' },
    },
    title: {
      display: 'block',
      minWidth: '0',
      fontFamily: 'display',
      fontWeight: 'medium',
      ...responsive(textSize('display', 'lg'), textSize('display', 'xl'), 'sm'),
      '& mark': { background: 'transparent', color: 'accent' },
    },
    meta: {
      display: 'block',
      color: 'fg.muted',
      fontFamily: 'body',
      fontWeight: 'normal',
      ...textSize('body', 'md'),
      '& mark': { background: 'transparent', color: 'accent' },
    },
    aside: {
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
      release: {
        root: {
          gridTemplateColumns: {
            base: 'token(sizes.plateCompact) minmax(0, 1fr) token(sizes.glyph)',
            sm: 'token(sizes.plate) minmax(0, 1fr) auto token(sizes.glyph)',
          },
        },
      },
      plain: {
        root: { gridTemplateColumns: { base: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) auto' } },
        chevron: { display: 'none' },
      },
    },
  },
  defaultVariants: { layout: 'release' },
});
};

/**
 * The drawer under an open release row: the hover ground, a header line with the track count and the link to the
 * release, and a track list at most 224px tall that scrolls. The list is indented to line up under the title.
 */
export const rowDrawer = defineSlotRecipe({
  className: 'row-drawer',
  slots: ['root', 'head', 'link', 'list', 'row', 'number', 'title', 'time'],
  base: {
    root: {
      marginInline: '-4',
      paddingBlockStart: '0',
      paddingBlockEnd: { base: '4', sm: '6' },
      paddingInlineEnd: '4',
      paddingInlineStart: { base: '4', sm: '24' },
      background: 'gray.surface.bg.hover',
      ...ruleAbove,
    },
    head: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '4',
      paddingBlockStart: '4',
      paddingBlockEnd: '2',
      color: 'fg.muted',
    },
    link: {
      color: 'accent',
      borderBlockEndWidth: 'hairline',
      borderBlockEndStyle: 'solid',
      borderBlockEndColor: 'accent',
    },
    list: {
      ...ruleAbove,
      ...ruleBelow,
      maxHeight: 'scrollList',
      overflowY: 'auto',
      scrollbarWidth: 'thin',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '3ch minmax(0, 1fr) auto',
      alignItems: 'baseline',
      columnGap: '3',
      paddingBlock: '2',
      borderBlockStartWidth: 'hairline',
      borderBlockStartStyle: 'solid',
      borderBlockStartColor: 'border',
      '&:first-child': { borderBlockStartWidth: '0' },
      '&:hover [data-part="title"]': { color: 'accent' },
    },
    number: { color: 'fg.muted', fontVariantNumeric: 'tabular-nums' },
    title: { transitionProperty: 'color', transitionDuration: 'fast' },
    time: { color: 'fg.muted', fontVariantNumeric: 'tabular-nums' },
  },
});

/** The upcoming events: a ruled list, each row a date block, the title with its composer, and the venue. */
export const datedList = (t: TypeSystem) => {
  const textSize = t.textSize;
  const microLabel = t.microLabel;
  return defineSlotRecipe({
  className: 'dated-list',
  slots: ['root', 'row', 'date', 'month', 'title', 'with', 'where'],
  base: {
    root: { ...ruleAbove },
    row: {
      display: 'grid',
      gridTemplateColumns: {
        base: 'token(sizes.dateColumnCompact) minmax(0, 1fr)',
        sm: 'token(sizes.dateColumn) minmax(0, 1fr) auto',
      },
      alignItems: 'baseline',
      columnGap: '6',
      paddingBlock: '4',
      ...ruleBelow,
    },
    date: {
      fontFamily: 'display',
      ...textSize('display', '2xl'),
      fontVariantNumeric: 'tabular-nums',
    },
    month: { display: 'block', ...microLabel, color: 'secondary', fontWeight: 'normal' },
    title: {
      display: 'block',
      fontFamily: 'display',
      fontWeight: 'medium',
      ...textSize('display', 'xl'),
    },
    with: { color: 'fg.muted', '& a': { color: 'accent' } },
    where: {
      gridColumn: { base: '2', sm: 'auto' },
      color: 'fg.muted',
      textAlign: { base: 'start', sm: 'end' },
    },
  },
});
};
