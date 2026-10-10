import { defineSlotRecipe } from '@pandacss/dev';
import { textRole } from '../type-scale';
import { hoverLift } from './hover-lift';

/** The announcement bar above the header (the anti-racism statement). */
export const announcement = defineSlotRecipe({
  className: 'announcement',
  slots: ['root', 'text', 'link'],
  base: {
    root: {
      alignItems: 'center',
      bg: 'gray.12',
      color: 'gray.1',
      display: 'flex',
      justifyContent: 'center',
      minHeight: '12',
      paddingBlock: '2',
      paddingInline: '4',
    },
    text: { ...textRole('body', 'xs'), textAlign: 'center' },
    link: {
      color: 'inherit',
      textDecorationLine: 'underline',
      textUnderlineOffset: '0.2em',
      ...hoverLift,
      _hover: { color: 'accent.7' },
    },
  },
});
