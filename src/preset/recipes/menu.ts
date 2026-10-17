import { defineSlotRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';
import { hoverLift } from './hover-lift';

/** Stagger: item n waits 120ms plus 40ms per item before it rises, while the menu is open. */
const stagger = Object.fromEntries(
  Array.from({ length: 7 }, (_, i) => [
    `[data-open] &:nth-child(${i + 1})`,
    { transitionDelay: `${120 + i * 40}ms` },
  ])
);

/** The full-screen menu on small screens: wipes down, items stagger in, kana numerals lead each item. */
export const menu = ({ labelCaps, textRole }: TypeSystem) =>
  defineSlotRecipe({
    className: 'menu',
    slots: ['root', 'list', 'item', 'numeral', 'label', 'utility', 'utilityLink'],
    base: {
      root: {
        bg: 'canvas',
        clipPath: 'inset(0 0 100% 0)',
        color: 'fg.default',
        display: 'flex',
        flexDirection: 'column',
        inset: 0,
        justifyContent: 'space-between',
        paddingBlock: '8',
        paddingInline: '6',
        position: 'fixed',
        transitionDuration: 'slow',
        transitionProperty: 'clip-path',
        transitionTimingFunction: 'out',
        visibility: 'hidden',
        zIndex: 'overlay',
        '&[data-open]': { clipPath: 'inset(0 0 0 0)', visibility: 'visible' },
      },
      list: { display: 'flex', flexDirection: 'column', listStyle: 'none', marginBlockStart: '28' },
      item: {
        alignItems: 'baseline',
        borderBottomColor: 'border.muted',
        borderBottomStyle: 'solid',
        borderBottomWidth: 'hairline',
        color: 'inherit',
        display: 'flex',
        gap: '4',
        opacity: 0,
        paddingBlock: '4',
        transform: 'translateY(1em)',
        transitionDuration: 'slow',
        transitionProperty: 'opacity, transform, color',
        '[data-open] &': { opacity: 1, transform: 'none' },
        ...stagger,
        focusVisibleRing: 'outside',
        _hover: { color: 'accent.9' },
      },
      numeral: { ...textRole('display', 'md'), color: 'fg.subtle', minWidth: '8' },
      label: { ...textRole('display', '3xl') },
      utility: { ...labelCaps, alignItems: 'center', color: 'fg.muted', display: 'flex', gap: '4' },
      utilityLink: { color: 'inherit', ...hoverLift, _hover: { color: 'accent.9' } },
    },
  });
