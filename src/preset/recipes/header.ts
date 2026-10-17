import { defineSlotRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';
import { hoverLift } from './hover-lift';

/** The header: brand left, navigation, then language select and theme toggle flush right. */
export const header = ({ labelCaps, textRole }: TypeSystem) =>
  defineSlotRecipe({
    className: 'header',
    slots: ['root', 'inner', 'brand', 'nav', 'navLink', 'utility', 'control', 'burger', 'bar'],
    base: {
      root: {
        bg: 'canvas',
        borderBottomColor: 'border',
        borderBottomStyle: 'solid',
        borderBottomWidth: 'hairline',
        color: 'fg.default',
        position: 'relative',
        zIndex: 'sticky',
      },
      inner: {
        alignItems: 'center',
        display: 'flex',
        gap: '8',
        height: '28',
        marginInline: 'auto',
        maxWidth: 'inset',
        paddingInline: '6',
      },
      brand: {
        ...textRole('display', 'lg'),
        color: 'inherit',
        flexShrink: 0,
        fontWeight: 'medium',
        ...hoverLift,
        _hover: { color: 'accent.9' },
      },
      nav: { alignItems: 'center', display: 'flex', gap: '8', marginInlineStart: 'auto' },
      navLink: {
        ...labelCaps,
        color: 'fg.muted',
        paddingBlock: '2',
        position: 'relative',
        ...hoverLift,
        _hover: { color: 'fg.default' },
        '&[aria-current=page]': {
          color: 'fg.default',
          textDecorationLine: 'underline',
          textUnderlineOffset: '0.6em',
        },
      },
      utility: { alignItems: 'center', display: 'flex', flexShrink: 0, gap: '4' },
      control: {
        ...labelCaps,
        alignItems: 'center',
        appearance: 'none',
        bg: 'transparent',
        borderColor: 'border',
        borderStyle: 'solid',
        borderWidth: 'hairline',
        color: 'fg.default',
        cursor: 'pointer',
        display: 'inline-flex',
        height: '10',
        paddingInline: '3',
        ...hoverLift,
        _hover: { borderColor: 'accent.9', color: 'accent.9' },
      },
      burger: {
        alignItems: 'center',
        bg: 'transparent',
        color: 'fg.default',
        cursor: 'pointer',
        display: 'none',
        flexDirection: 'column',
        gap: '2',
        height: '10',
        justifyContent: 'center',
        width: '10',
        focusVisibleRing: 'outside',
      },
      bar: {
        bg: 'currentColor',
        display: 'block',
        height: '2px',
        transitionDuration: 'normal',
        transitionProperty: 'transform, opacity',
        width: '6',
      },
    },
    variants: {
      // Below the breakpoint the nav moves into the menu and the burger appears.
      compact: {
        true: {
          inner: { gap: '4', height: '24', paddingInline: '4' },
          nav: { display: 'none' },
          burger: { display: 'flex' },
        },
      },
      open: {
        true: {
          bar: {
            '&:nth-child(1)': {
              transform: 'translateY(calc(token(spacing.2) + 2px)) rotate(45deg)',
            },
            '&:nth-child(2)': { opacity: 0 },
            '&:nth-child(3)': {
              transform: 'translateY(calc(-1 * (token(spacing.2) + 2px))) rotate(-45deg)',
            },
          },
        },
      },
    },
  });
