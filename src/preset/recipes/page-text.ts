import { defineSlotRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';
import { boxed, ruleAbove, ruleBelow } from '../fragments';

/**
 * The article of a page of text (Rev 19 §10.1): at most 72 characters wide, the serif title at 51/56 (35/40 on phones),
 * a 24/32 lede (20/28 on phones), 24/32 section heads with 48px above, uppercase labels for minor heads and 17/28 body
 * text (14/20 on phones). It also holds what the pages use: lists, key-value list, table, code block and label tiles.
 */
export const pageText = (t: TypeSystem) => {
  const textSize = t.textSize;
  const textRole = t.textRole;
  const microLabel = t.microLabel;
  const longForm = t.longForm;
  return defineSlotRecipe({
  className: 'page-text',
  staticCss: ['*'],
  slots: [
    'root',
    'title',
    'lede',
    'h2',
    'h3',
    'p',
    'list',
    'kv',
    'term',
    'detail',
    'table',
    'th',
    'td',
    'code',
    'tileGrid',
    'tile',
    'tileName',
    'tileCount',
  ],
  base: {
    root: {
      minWidth: '0',
      maxWidth: 'article',
      '& a:not([data-bare])': { color: 'accent', textDecoration: 'underline' },
      '& p + p': { marginBlockStart: '4' },
      '& :is(ol, ul, dl, table, div) + p': { marginBlockStart: '6' },
      '& code': { fontFamily: 'mono', fontSize: '1em' },
    },
    title: {
      marginBlockEnd: '6',
      color: 'fg.default',
      fontFamily: 'display',
      fontWeight: 'medium',
      letterSpacing: 'display',
      ...responsive(textRole('display', '4xl'), textRole('display', '6xl'), 'sm'),
    },
    lede: {
      maxWidth: '52ch',
      marginBlockEnd: '8',
      color: 'fg.default',
      fontFamily: 'display',
      ...responsive(textSize('display', 'xl'), textSize('display', '2xl'), 'sm'),
    },
    h2: {
      marginBlockStart: { base: '8', sm: '12' },
      marginBlockEnd: '4',
      color: 'fg.default',
      fontFamily: 'display',
      fontWeight: 'medium',
      ...responsive(textSize('display', 'xl'), textSize('display', '2xl'), 'sm'),
    },
    h3: {
      marginBlockStart: '8',
      marginBlockEnd: '2',
      ...microLabel,
      fontWeight: 'semibold',
    },
    p: { ...longForm },
    list: {
      ...longForm,
      marginBlockStart: '4',
      paddingInlineStart: '6',
      listStyle: 'disc',
      '& li': { ...longForm },
    },
    kv: {
      display: 'grid',
      gridTemplateColumns: { base: 'minmax(0, 1fr)', sm: 'token(sizes.term) minmax(0, 1fr)' },
      columnGap: '6',
      marginBlockStart: '4',
      ...ruleAbove,
      '& > *': { paddingBlock: '3', ...ruleBelow },
    },
    term: { color: 'fg.muted', '&&': { paddingBlockEnd: { base: '0', sm: '3' } } },
    detail: { ...textSize('body', 'md') },
    table: {
      width: 'full',
      marginBlockStart: '4',
      borderCollapse: 'collapse',
      ...textSize('body', 'md'),
    },
    th: {
      paddingBlock: '2',
      paddingInlineEnd: '4',
      textAlign: 'start',
      ...microLabel,
      fontWeight: 'semibold',
      borderBlockEndWidth: 'hairline',
      borderBlockEndStyle: 'solid',
      borderBlockEndColor: 'fg.default',
      '&[data-num]': {
        textAlign: 'end',
        fontVariantNumeric: 'tabular-nums',
        paddingInlineEnd: '0',
      },
    },
    td: {
      paddingBlock: '3',
      paddingInlineEnd: '4',
      verticalAlign: 'top',
      ...ruleBelow,
      '&[data-num]': {
        textAlign: 'end',
        fontVariantNumeric: 'tabular-nums',
        paddingInlineEnd: '0',
      },
    },
    code: {
      ...boxed,
      display: 'block',
      marginBlockStart: '4',
      padding: '4',
      overflow: 'auto',
      background: 'gray.surface.bg.hover',
      fontFamily: 'mono',
      ...textSize('body', 'md'),
      whiteSpace: 'pre',
    },
    tileGrid: {
      display: 'grid',
      gridTemplateColumns: { base: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
      gap: '4',
      marginBlockStart: '4',
    },
    tile: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '4',
      paddingBlock: '3',
      paddingInline: '4',
      color: 'fg.default',
      borderWidth: 'hairline',
      borderStyle: 'solid',
      toneEdge: '40',
      borderInlineStartWidth: 'edge',
      borderInlineStartColor: 'var(--tone)',
      toneFill: '10',
      transitionProperty: 'background-color',
      transitionDuration: 'fast',
      '&&': { textDecoration: 'none', color: 'fg.default' },
      _hover: { toneFill: '20' },
    },
    tileName: { fontFamily: 'display', fontWeight: 'medium', ...textSize('display', 'xl') },
    tileCount: {
      color: 'var(--tone)',
      fontFamily: 'display',
      fontVariantNumeric: 'tabular-nums',
      ...textSize('display', '2xl'),
    },
  },
  variants: {
    columns: {
      true: {
        list: {
          columnCount: { base: 1, sm: 2 },
          columnGap: '12',
          marginBlockStart: '2',
          listStyle: 'none',
          '& li': { paddingBlock: '2px' },
        },
      },
    },
    board: {
      true: {
        list: {
          '& li': {
            paddingBlock: '3',
            breakInside: 'avoid',
            fontFamily: 'display',
            ...textSize('display', 'xl'),
            ...ruleBelow,
          },
        },
      },
    },
  },
});
};

/** The page layout: the section sidebar beside the article, or a disclosure above it below 960px. */
export const pageLayout = (t: TypeSystem) => {
  const textSize = t.textSize;
  const microLabel = t.microLabel;
  return defineSlotRecipe({
  className: 'page-layout',
  slots: [
    'root',
    'side',
    'sideGroup',
    'sideLabel',
    'sideLink',
    'disclosure',
    'summary',
    'current',
    'nav',
  ],
  base: {
    root: {
      display: 'grid',
      gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'token(sizes.sidebar) minmax(0, 1fr)' },
      columnGap: '16',
      rowGap: '6',
      alignItems: 'start',
    },
    side: {
      display: { base: 'none', md: 'block' },
      position: 'sticky',
      top: 'calc(var(--bh, token(sizes.bar)) + var(--ut, 0px) + token(spacing.6))',
      transitionProperty: 'top',
      transitionDuration: 'slower',
      transitionTimingFunction: 'ease-in-out',
    },
    sideGroup: { '& + &': { marginBlockStart: '6' } },
    sideLabel: { marginBlockEnd: '2', ...microLabel, fontWeight: 'semibold' },
    sideLink: {
      display: 'block',
      paddingBlock: '1',
      paddingInlineStart: '3',
      marginInlineStart: '-3',
      ...textSize('body', 'md'),
      borderInlineStartWidth: 'rail',
      borderInlineStartStyle: 'solid',
      borderInlineStartColor: 'transparent',
      color: 'fg.muted',
      transitionProperty: 'color, border-color',
      transitionDuration: 'fast',
      _hover: { color: 'fg.default' },
      '&[aria-current="page"]': { color: 'fg.default', borderInlineStartColor: 'accent' },
    },
    disclosure: { ...boxed, display: { base: 'block', md: 'none' }, paddingInline: '4' },
    summary: {
      paddingBlock: '3',
      cursor: 'pointer',
      listStyle: 'none',
      '&::-webkit-details-marker': { display: 'none' },
    },
    current: { color: 'fg.muted' },
    nav: { paddingBlockEnd: '3' },
  },
});
};
