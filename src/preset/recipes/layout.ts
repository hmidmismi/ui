import { defineRecipe } from '@pandacss/dev';
import { column, ruleAbove, ruleBelow, ruleNone } from '../fragments';
import type { TypeSystem } from '../type-scale';

/** One gap variant per spacing step in common use, named by the step. */
const gaps = {
  '1': { gap: '1' },
  '2': { gap: '2' },
  '4': { gap: '4' },
  '6': { gap: '6' },
  '8': { gap: '8' },
} as const;

/** A list without markers (preflight removes them). Markers, rules between items and a row layout are opt-in. */
export const itemList = defineRecipe({
  className: 'item-list',
  staticCss: ['*'],
  base: { ...column },
  defaultVariants: { gap: '2' },
  variants: {
    gap: gaps,
    inline: { true: { flexDirection: 'row', flexWrap: 'wrap' } },
    marker: { true: { paddingInlineStart: '6', listStyle: 'decimal' } },
    ruled: {
      true: {
        gap: '0',
        '& > li': { paddingBlock: '4', ...ruleBelow },
        '& > li:first-child': { paddingBlockStart: '0' },
        '& > li:last-child': { ...ruleNone },
      },
    },
  },
});

/** A column of children with a gap, and the page's side and block padding when it is the page's own box. */
export const layoutStack = defineRecipe({
  className: 'layout-stack',
  staticCss: ['*'],
  base: { ...column },
  variants: {
    gap: gaps,
    padBlock: { '4': { paddingBlock: '4' }, '8': { paddingBlock: '8' } },
    padInline: { '4': { paddingInline: '4' } },
  },
});

/** A row of children that wraps, with a gap. */
export const layoutWrap = defineRecipe({
  className: 'layout-wrap',
  staticCss: ['*'],
  base: { display: 'flex', flexWrap: 'wrap' },
  variants: { gap: gaps, align: { center: { alignItems: 'center' } } },
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

/** A layout item that spans the full width from the `md` breakpoint up. */
export const fullRow = defineRecipe({
  className: 'full-row',
  base: { ...column, gap: '2', gridColumn: { md: '1 / -1' } },
});

/** A two-column list of labels and values that collapses to one column on narrow screens. */
export const termList = (t: TypeSystem) => {
  const { textSize, lineShift } = t;
  return defineRecipe({
    className: 'term-list',
    base: {
      display: 'grid',
      gridTemplateColumns: { base: '1fr', sm: 'minmax(token(sizes.label), max-content) 1fr' },
      columnGap: '6',
      rowGap: { base: '0', sm: '2' },
      ...textSize('body', 'md'),
      '& dd': { marginBlockEnd: { base: '2', sm: '0' }, ...lineShift('body', 'md') },
      '& dt': { paddingBlockStart: { base: '0', sm: '1' } },
    },
  });
};

/** Lets a term row's `dt` and `dd` take part in the list's grid. */
export const termRow = defineRecipe({
  className: 'term-row',
  base: { display: 'contents' },
});

/** A list of terms that flows into columns, so long lists stay compact. */
export const columnList = (t: TypeSystem) => {
  const { textSize, lineShift } = t;
  return defineRecipe({
    className: 'column-list',
    staticCss: ['*'],
    base: {
      ...textSize('body', 'md'),
      columnGap: '8',
      '& > div': { breakInside: 'avoid', marginBlockEnd: '4' },
      '& dd': { ...lineShift('body', 'md') },
    },
    variants: { width: { wide: { columnWidth: 'column' }, single: {} } },
  });
};

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
  defaultVariants: { gap: 'md' },
  variants: {
    gap: {
      md: { gap: '8' },
      lg: { gap: { base: '8', md: '12' } },
    },
  },
});

/**
 * The label tiles: two across below 960px, four from 960px.
 */
export const tileGrid = defineRecipe({
  className: 'label-grid',
  base: {
    display: 'grid',
    gridTemplateColumns: { base: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
    gap: '4',
    '& > li': { display: 'flex' },
  },
});
