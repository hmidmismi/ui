import { defineSlotRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';
import { hoverLift } from './hover-lift';

/** The footer: Contact, Accessibility and Instagram links, then copyright left and the 501(c)(3) line right. */
export const footer = ({ labelCaps, textRole }: TypeSystem) =>
  defineSlotRecipe({
    className: 'footer',
    slots: ['root', 'inner', 'utility', 'utilityLink', 'meta', 'legal'],
    base: {
      root: {
        bg: 'canvas',
        borderTopColor: 'border',
        borderTopStyle: 'solid',
        borderTopWidth: 'hairline',
        color: 'fg.muted',
      },
      inner: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6',
        marginInline: 'auto',
        maxWidth: 'inset',
        paddingBlock: '8',
        paddingInline: '6',
      },
      utility: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '8' },
      utilityLink: {
        ...labelCaps,
        color: 'fg.default',
        ...hoverLift,
        _hover: {
          color: 'accent.9',
          textDecorationLine: 'underline',
          textUnderlineOffset: '0.4em',
        },
      },
      meta: {
        ...textRole('body', 'xs'),
        alignItems: 'baseline',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4',
        justifyContent: 'space-between',
      },
      legal: { color: 'fg.subtle' },
    },
  });
