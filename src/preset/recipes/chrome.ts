import { defineSlotRecipe } from '@pandacss/dev';
import { labelCaps, textRole } from '../type-scale';

/**
 * Site chrome: the parts of the shell every page of every app shares. One slot recipe per region, so an app composes
 * the shell from `SiteStrip`, `SiteHeader`, `SiteSheet` and `SiteFooter` and never styles it. All lengths are spacing
 * tokens and all type is a text role, so the shell sits on the 5px baseline in whichever font set is active. Light and
 * dark come from the semantic palette; there is no shell-only color.
 */

/** Stagger: item n waits 120ms plus 40ms per item before it rises, while the sheet is open. */
const stagger = Object.fromEntries(
  Array.from({ length: 7 }, (_, i) => [`[data-open] &:nth-child(${i + 1})`, { transitionDelay: `${120 + i * 40}ms` }])
);

const hoverLift = {
  transitionProperty: 'color, background-color, border-color, opacity',
  transitionDuration: 'fast',
  focusVisibleRing: 'outside',
};

/** The announcement strip above the header (the anti-racism statement). */
export const siteStrip = defineSlotRecipe({
  className: 'siteStrip',
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

/** The header: brand left, navigation, then language select and theme toggle flush right. */
export const siteHeader = defineSlotRecipe({
  className: 'siteHeader',
  slots: ['root', 'inner', 'brand', 'nav', 'navLink', 'tools', 'control', 'burger', 'bar'],
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
      '&[aria-current=page]': { color: 'fg.default', textDecorationLine: 'underline', textUnderlineOffset: '0.6em' },
    },
    tools: { alignItems: 'center', display: 'flex', flexShrink: 0, gap: '4' },
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
    // Below the breakpoint the nav moves into the sheet and the burger appears.
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
          '&:nth-child(1)': { transform: 'translateY(calc(token(spacing.2) + 2px)) rotate(45deg)' },
          '&:nth-child(2)': { opacity: 0 },
          '&:nth-child(3)': { transform: 'translateY(calc(-1 * (token(spacing.2) + 2px))) rotate(-45deg)' },
        },
      },
    },
  },
});

/** The full-screen menu on small screens: wipes down, items stagger in, kana numerals lead each item. */
export const siteSheet = defineSlotRecipe({
  className: 'siteSheet',
  slots: ['root', 'list', 'item', 'numeral', 'label', 'foot'],
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
      transitionTimingFunction: 'ease-out',
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
    foot: { ...labelCaps, alignItems: 'center', color: 'fg.muted', display: 'flex', gap: '4' },
  },
});

/** The footer: Contact, Accessibility and Instagram links, then copyright left and the 501(c)(3) line right. */
export const siteFooter = defineSlotRecipe({
  className: 'siteFooter',
  slots: ['root', 'inner', 'links', 'link', 'meta', 'legal'],
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
    links: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '8' },
    link: {
      ...labelCaps,
      color: 'fg.default',
      ...hoverLift,
      _hover: { color: 'accent.9', textDecorationLine: 'underline', textUnderlineOffset: '0.4em' },
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
