import { defineSlotRecipe } from '@pandacss/dev';
import { column, ruleAbove, ruleBelow, stickBelowHeader } from '../fragments';
import { currentMark, hoverAccent } from '../interaction';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';

/** A row of links that choose a group of a browse list: a letter, a decade or a view. The current one is marked. */
export const browseNav = (t: TypeSystem) => {
  const labelCaps = t.caps('sm', 'normal');
  return defineSlotRecipe({
    className: 'browse-nav',
    staticCss: ['*'],
    slots: ['root', 'link'],
    base: {
      root: { display: 'flex', flexWrap: 'wrap', gap: '1', paddingBlock: '2', ...ruleBelow },
      link: {
        paddingBlock: '1',
        paddingInline: '2',
        color: 'fg.muted',
        ...labelCaps,
        ...hoverAccent,
      },
    },
    variants: {
      current: {
        true: { link: currentMark },
        false: {},
      },
    },
  });
};

/**
 * The columns of a browse list. Each column is a range of names under its label, such as `Ad–At`, with the number of
 * names at the end of the heading row over a foreground rule. The grid shows one column on phones, two from 640px, three
 * from 960px and five from 1200px, and wraps any further columns onto new rows. A row is a name with a small muted note
 * (a date) at the end, a hairline under it, and accent on hover.
 */
export const rangeColumns = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineSlotRecipe({
    className: 'range-columns',
    slots: ['root', 'column', 'heading', 'label', 'count', 'list', 'link', 'note'],
    base: {
      root: {
        display: 'grid',
        gridTemplateColumns: {
          base: 'minmax(0, 1fr)',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(5, minmax(0, 1fr))',
        },
        columnGap: '6',
        rowGap: { base: '8', sm: '12' },
      },
      column: { ...column, minWidth: '0' },
      heading: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '2',
        paddingBlockEnd: '2',
        marginBlockEnd: '1',
        borderBlockEndWidth: 'hairline',
        borderBlockEndStyle: 'solid',
        borderBlockEndColor: 'fg.default',
      },
      label: { fontFamily: 'display', fontWeight: 'medium', ...textSize('display', '2xl') },
      count: { color: 'secondary', ...textSize('body', 'sm'), fontVariantNumeric: 'tabular-nums' },
      list: { ...column },
      link: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '2',
        paddingBlock: '1',
        color: 'fg.default',
        ...textSize('body', 'md'),
        ...ruleBelow,
        transitionProperty: 'color',
        transitionDuration: 'fast',
        _hover: { color: 'accent' },
      },
      note: { flexShrink: 0, color: 'fg.muted', whiteSpace: 'nowrap', ...textSize('body', 'sm') },
    },
  });
};

/**
 * The strip of letters above a letter list: 40px square keys (36px on phones) set in the display face, sticky under the
 * header bar. The current letter is inverted; a letter with no entries is dashed and dimmed and is not a link.
 */
export const letterBar = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineSlotRecipe({
    className: 'letter-bar',
    slots: ['root', 'list', 'key'],
    base: {
      root: {
        ...stickBelowHeader,
        zIndex: 'docked',
        paddingBlock: '3',
        marginBlockEnd: '6',
        background: 'canvas',
        ...ruleBelow,
      },
      list: { display: 'flex', flexWrap: 'wrap', gap: '1' },
      key: {
        display: 'grid',
        placeItems: 'center',
        width: { base: 'keyCompact', sm: 'squareControl' },
        height: { base: 'keyCompact', sm: 'squareControl' },
        color: 'fg.default',
        fontFamily: 'display',
        ...responsive(textSize('display', 'lg'), textSize('display', 'xl'), 'sm'),
        borderWidth: 'hairline',
        borderStyle: 'solid',
        borderColor: 'border',
        transitionProperty: 'background-color, border-color, color',
        transitionDuration: 'fast',
        _hover: { borderColor: 'fg.default' },
        '&[aria-current="page"]': {
          background: 'fg.default',
          borderColor: 'fg.default',
          color: 'canvas',
        },
        '&[aria-disabled="true"]': {
          color: 'fg.muted',
          opacity: '0.45',
          borderStyle: 'dashed',
          pointerEvents: 'none',
        },
      },
    },
  });
};

/** The previous and next links under a letter list: a hairline above, the two links at the ends. */
export const neighborNav = defineSlotRecipe({
  className: 'neighbor-nav',
  slots: ['root', 'link'],
  base: {
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBlockStart: '12',
      paddingBlockStart: '4',
      color: 'fg.muted',
      ...ruleAbove,
    },
    link: {
      color: 'fg.default',
      transitionProperty: 'color',
      transitionDuration: 'fast',
      _hover: { color: 'accent' },
    },
  },
});

/** The title row of a list page: the page title at the start and the number of entries, muted, at the end. */
export const listHeader = (t: TypeSystem) => {
  const textSize = t.textSize;
  const textRole = t.textRole;
  return defineSlotRecipe({
    className: 'list-header',
    slots: ['root', 'title', 'count'],
    base: {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        columnGap: '6',
        rowGap: '2',
        marginBlockEnd: '6',
      },
      title: {
        color: 'fg.default',
        fontFamily: 'display',
        fontWeight: 'medium',
        letterSpacing: 'display',
        ...responsive(textRole('display', '4xl'), textRole('display', '6xl'), 'sm'),
      },
      count: { color: 'fg.muted', ...textSize('body', 'md') },
    },
  });
};
