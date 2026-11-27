import { defineSlotRecipe } from '@pandacss/dev';
import { ringed } from '../fragments';
import type { TypeSystem } from '../type-scale';

/** A sticky sidebar of links beside the content from 960px, and a disclosure above the content below that. */
export const sidebar = (t: TypeSystem) => {
  const { textLine, microLabelLine, linePadded } = t;
  return defineSlotRecipe({
    className: 'sidebar',
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
      sideLabel: { marginBlockEnd: '2', ...microLabelLine, fontWeight: 'semibold' },
      sideLink: {
        display: 'block',
        paddingBlock: '1',
        paddingInlineStart: '3',
        marginInlineStart: '-3',
        ...textLine('body', 'md'),
        borderInlineStartWidth: 'rail',
        borderInlineStartStyle: 'solid',
        borderInlineStartColor: 'transparent',
        color: 'fg.muted',
        transitionProperty: 'color, border-color',
        transitionDuration: 'fast',
        _hover: { color: 'fg.default' },
        '&[aria-current="page"]': { color: 'fg.default', borderInlineStartColor: 'accent' },
      },
      disclosure: { ...ringed, display: { base: 'block', md: 'none' }, paddingInline: '4' },
      summary: {
        ...linePadded('body', 'md', { block: 'token(spacing.3)' }),
        cursor: 'pointer',
        listStyle: 'none',
        '&::-webkit-details-marker': { display: 'none' },
      },
      current: { color: 'fg.muted' },
      nav: { paddingBlockEnd: '3' },
    },
  });
};
