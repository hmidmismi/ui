import { defineRecipe } from '@pandacss/dev';
import { column, ruleAbove, ruleBelow, ruleNone } from '../fragments';
import type { TypeSystem } from '../type-scale';

/** One gap variant per spacing step in common use, named by the step. */
const gaps = {
  '0': { gap: '0' },
  '1': { gap: '1' },
  '2': { gap: '2' },
  '3': { gap: '3' },
  '4': { gap: '4' },
  '6': { gap: '6' },
  '8': { gap: '8' },
  '10': { gap: '10' },
  pair: { gap: 'rhythm.pair' },
  item: { gap: 'rhythm.item' },
  group: { gap: 'rhythm.group' },
  section: { gap: 'rhythm.section' },
} as const;

/**
 * A list without markers (preflight removes them). Markers, rules between items and a row layout are opt-in. `layout`
 * sets how the items sit: `stack` (a column), `pairs` (a `dl` of label and value pairs in two columns, one when narrow) or
 * `flow` (the items run into columns and do not split across them). `size` sets the items' text size.
 */
export const itemList = (t: TypeSystem) => {
  const { textSize, lineShift } = t;
  return defineRecipe({
    className: 'item-list',
    staticCss: ['*'],
    base: { ...column },
    defaultVariants: { gap: '2', layout: 'stack' },
    variants: {
      gap: gaps,
      layout: {
        stack: {},
        pairs: {
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'minmax(token(sizes.label), max-content) 1fr' },
          columnGap: '6',
          rowGap: { base: '0', sm: '2' },
          ...textSize('body', 'md'),
          '& > div': { display: 'contents' },
          '& dd': { marginBlockEnd: { base: '2', sm: '0' }, ...lineShift('body', 'md') },
          '& dt': { paddingBlockStart: { base: '0', sm: '1' } },
        },
        flow: {
          display: 'block',
          columnWidth: 'token(sizes.column)',
          columnGap: '8',
          ...textSize('body', 'md'),
          '& > li': { breakInside: 'avoid', marginBlockEnd: 'rhythm.pair' },
          '& > div': { breakInside: 'avoid', marginBlockEnd: 'rhythm.item' },
          '& dt': { marginBlockEnd: 'rhythm.pair' },
          '& dd': { ...lineShift('body', 'md') },
        },
      },
      size: {
        lg: { '& > li': { ...textSize('body', 'lg'), ...lineShift('body', 'lg') } },
      },
      closed: { true: { ...ruleBelow } },
      inline: { true: { flexDirection: 'row', flexWrap: 'wrap' } },
      marker: { true: { paddingInlineStart: '6', listStyle: 'decimal' } },
      ruled: {
        true: {
          gap: '0',
          '& > li': { paddingBlock: 'rhythm.item', ...ruleBelow },
          '& > li:first-child': { paddingBlockStart: '0' },
          '& > li:last-child': { ...ruleNone },
          '&:is(dl)': { rowGap: '0', columnGap: '0', ...ruleAbove },
          '& dt, & dd': { ...ruleBelow, paddingBlock: 'rhythm.pair', marginBlockEnd: '0' },
          '& dd': { paddingInlineStart: 'rhythm.item' },
        },
      },
    } as never,
  });
};

/** A column of children with a gap, and the page's side and block padding when it is the page's own box. */
export const layoutStack = defineRecipe({
  className: 'layout-stack',
  staticCss: ['*'],
  base: { ...column },
  variants: {
    gap: gaps,
    padBlock: { '4': { paddingBlock: '4' }, '8': { paddingBlock: '8' } },
    padInline: { '4': { paddingInline: '4' } },
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center', textAlign: 'center' },
      end: { alignItems: 'flex-end' },
    },
    ruled: { true: { ...ruleBelow } },
    after: { '4': { marginBlockEnd: '4' }, '6': { marginBlockEnd: '6' }, '8': { marginBlockEnd: '8' } },
  },
});

/** A row of children that wraps, with a gap. */
export const layoutWrap = defineRecipe({
  className: 'layout-wrap',
  staticCss: ['*'],
  base: { display: 'flex', flexWrap: 'wrap' },
  variants: {
    gap: gaps,
    align: { center: { alignItems: 'center' }, baseline: { alignItems: 'baseline' }, end: { alignItems: 'flex-end' } },
    justify: { between: { justifyContent: 'space-between' } },
    nowrap: { true: { flexWrap: 'nowrap' } },
    after: { '4': { marginBlockEnd: '4' }, '6': { marginBlockEnd: '6' }, '8': { marginBlockEnd: '8' } },
  },
});

/** Limits running text to a readable line length: the `prose` size, or `narrow`. */
export const measure = defineRecipe({
  className: 'measure',
  staticCss: ['*'],
  defaultVariants: { size: 'prose' },
  variants: { size: { prose: { maxWidth: 'prose' }, narrow: { maxWidth: 'narrow' } } },
});

/** A block set off by a hairline rule above it, with space under the rule. The section that holds it adds the space below. */
export const ruled = defineRecipe({
  className: 'ruled',
  base: {
    ...column,
    gap: '4',
    paddingBlockStart: '16',
    paddingBlockEnd: '8',
    ...ruleAbove,
  },
});

/** A picture with text beside it, stacked on narrow screens. */
export const mediaRow = defineRecipe({
  className: 'media-row',
  base: {
    display: 'flex',
    flexDirection: { base: 'column', sm: 'row' },
    alignItems: 'flex-start',
    gap: '8',
  },
});

/** Holds a block to the `inset` width and centers it. */
export const inset = defineRecipe({
  className: 'inset',
  base: { width: 'full', maxWidth: 'inset', marginInline: 'auto' },
});

/** A grid with one of the named responsive layouts. */
export const layout = defineRecipe({
  className: 'layout',
  staticCss: ['*'],
  base: { display: 'grid' },
  variants: {
    kind: {
      overview: {
        gridTemplateColumns: { base: '1fr', lg: 'minmax(token(sizes.aside), 1fr) 2fr' },
        gap: { base: '4', lg: '8' },
        alignItems: 'start',
      },
      credits: { gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' }, gap: '6' },
      beside: {
        gridTemplateColumns: { base: 'minmax(0, 1fr)', xl: 'minmax(0, 3fr) minmax(0, 2fr)' },
        columnGap: '12',
        alignItems: 'start',
      },
      cards: {
        gridTemplateColumns: { base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: '4',
      },
      gallery: {
        gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
        gap: '4',
      },
      pair: { gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: '4' },
    },
  },
});

/** The columns of the page grid. A column grid in the Swiss manner: twelve equal columns, a gutter between them. */
export const COLUMNS = 12;

/**
 * The page's column grid: twelve equal columns with the `item` gap between them and between rows, so every gutter and row
 * gap is a whole number of baselines. Content is placed with {@link columnCell}; a cell is the full width below `md` and
 * takes its span from `md` up.
 */
export const columnGrid = defineRecipe({
  className: 'column-grid',
  staticCss: ['*'],
  base: {
    display: 'grid',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: `repeat(${COLUMNS}, minmax(0, 1fr))` },
    columnGap: 'rhythm.item',
    rowGap: 'rhythm.group',
    alignItems: 'start',
  },
});

/** One cell of the column grid: how many columns it spans from `md` up (it is the full width below). */
export const columnCell = defineRecipe({
  className: 'column-cell',
  staticCss: ['*'],
  base: { minWidth: '0' },
  variants: {
    span: Object.fromEntries(
      Array.from({ length: COLUMNS }, (_, i) => [
        String(i + 1),
        { gridColumn: { base: 'auto', md: `span ${i + 1}` } },
      ])
    ),
  },
  defaultVariants: { span: String(COLUMNS) },
});

/** A layout item that spans the full width from the `md` breakpoint up. */
export const fullRow = defineRecipe({
  className: 'full-row',
  base: { ...column, gap: '2', gridColumn: { md: '1 / -1' } },
});

/**
 * Two equal columns from 960px, one below: two cards or two lists side by side. `gap`
 * is 32px (`md`) or 48px (`lg`).
 */
export const splitGrid = defineRecipe({
  className: 'split-grid',
  staticCss: ['*'],
  base: {
    display: 'grid',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
  },
  defaultVariants: { gap: 'md', ratio: 'even' },
  variants: {
    gap: {
      none: { gap: '0' },
      md: { gap: '8' },
      lg: { gap: { base: '8', md: '12' } },
    },
    ratio: {
      even: {},
      wide: { gridTemplateColumns: { md: 'minmax(0, 7fr) minmax(0, 5fr)' } },
    },
    // The first column stays in view while the second scrolls past, and lets go when the second ends.
    sticky: {
      true: {
        alignItems: 'start',
        '& > :first-child': {
          position: { md: 'sticky' },
          top: { md: 'calc(var(--bh, token(sizes.bar)) + var(--ut, 0px) + token(spacing.16))' },
        },
      },
    },
  },
});
