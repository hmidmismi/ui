import { defineRecipe, defineSlotRecipe } from '@pandacss/dev';
import { boxed, ruleAbove, ruleBelowOf, ruleBoth, ruleNone } from '../fragments';
import type { TypeSystem } from '../type-scale';

/** The text filter over a list: a boxed input, accent border on focus. */
export const listFilter = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineRecipe({
    className: 'list-filter',
    base: {
      ...boxed,
      width: 'full',
      marginBlockEnd: '2',
      height: 'control.md',
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
 * The drawer under an open expandable row: the hover ground, a header line with the item count and the link to the
 * row's page, and an item list at most 224px tall that scrolls. The list is indented to line up under the title.
 */
export const rowDrawer = defineSlotRecipe({
  className: 'row-drawer',
  slots: ['root', 'head', 'link', 'list', 'row', 'number', 'title', 'time'],
  variants: {
    indent: {
      plate: {},
      number: { root: { paddingInlineStart: { base: '4', sm: '12' } } },
    },
  },
  defaultVariants: { indent: 'plate' },
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
      ...ruleBelowOf('accent'),
    },
    list: {
      ...ruleBoth,
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
      ...ruleAbove,
      '&:first-child': { ...ruleNone },
      '&:hover [data-part="title"]': { color: 'accent' },
    },
    number: { color: 'fg.muted', fontVariantNumeric: 'tabular-nums' },
    title: { transitionProperty: 'color', transitionDuration: 'fast' },
    time: { color: 'fg.muted', fontVariantNumeric: 'tabular-nums' },
  },
});
