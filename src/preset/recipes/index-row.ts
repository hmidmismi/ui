import { defineSlotRecipe } from '@pandacss/dev';
import { labelCaps } from '../type-scale';

/**
 * One row of an index list: a Roman numeral, a name in the display face with an optional kanji, and a small caps
 * aside. Rows are big, ruled and stretch to share the height of their list. Hovering slides the row's content in.
 */
export const indexRow = defineSlotRecipe({
  className: 'index-row',
  slots: ['root', 'numeral', 'label', 'kanji', 'aside'],
  base: {
    root: {
      alignItems: 'center',
      borderBottomWidth: 'hairline',
      borderColor: 'border.muted',
      color: 'fg.default',
      columnGap: '4',
      cursor: 'pointer',
      display: 'grid',
      flex: '1',
      gridTemplateColumns: '{sizes.20} minmax(0, 1fr) auto',
      minH: '16',
      px: '8',
      transitionProperty: 'background-color, padding-inline-start',
      transitionDuration: 'slow',
      focusVisibleRing: 'inside',
      _hover: { bg: 'gray.2', paddingInlineStart: '10' },
    },
    numeral: { color: 'accent.9', fontFamily: 'display', textStyle: 'xl' },
    label: { fontFamily: 'display', fontWeight: 'normal', minW: '0' },
    kanji: { color: 'fg.muted', fontFamily: 'display', marginInlineStart: '3', textStyle: 'xl' },
    aside: { color: 'fg.muted', ...labelCaps },
  },
  defaultVariants: { size: 'md' },
  variants: {
    size: {
      md: { label: { textStyle: '3xl' } },
      lg: { label: { textStyle: '5xl' }, kanji: { textStyle: '2xl' } },
    },
    active: {
      true: { root: { bg: 'gray.2' } },
    },
  },
});
