import { defineSlotRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';
import { boxed, ruleBelow, scrollRow, siteInset, stickBelowHeader } from '../fragments';

/**
 * The sticky bar of jump pills under the header (Rev 19 §5.5): 14/20 pills with a hairline border, muted; the current
 * section's pill is inverted. It sticks at `--bh`, the height of the header bar, and scrolls sideways on phones.
 */
export const jumpNav = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineSlotRecipe({
  className: 'jump-nav',
  slots: ['root', 'link'],
  base: {
    root: {
      ...stickBelowHeader,
      zIndex: 'docked',
      ...scrollRow,
      gap: '2',
      marginBlockStart: '2',
      paddingBlock: '3',
      background: 'canvas',
      ...ruleBelow,
    },
    link: {
      ...boxed,
      flexShrink: 0,
      paddingBlock: '2',
      paddingInline: '4',
      borderRadius: 'full',
      color: 'fg.muted',
      ...textSize('body', 'md'),
      whiteSpace: 'nowrap',
      transitionProperty: 'background-color, border-color, color',
      transitionDuration: 'fast',
      _hover: { borderColor: 'fg.default', color: 'fg.default' },
      '&[aria-current="true"]': {
        background: 'fg.default',
        borderColor: 'fg.default',
        color: 'canvas',
      },
    },
  },
});
};

/** The breadcrumb trail. */
export const breadcrumbs = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineSlotRecipe({
  className: 'breadcrumbs',
  slots: ['root', 'list', 'item', 'link', 'current'],
  base: {
    root: {
      marginBlockEnd: { base: '6', md: '12' },
      ...textSize('body', 'md'),
      color: 'fg.muted',
    },
    list: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2' },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      minWidth: '0',
      '&:not(:first-child)::before': { content: '"/"', color: 'fg.subtle' },
    },
    link: { color: 'fg.muted', _hover: { color: 'fg.default' } },
    current: {
      color: 'fg.default',
      fontWeight: 'medium',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: 'crumb',
    },
  },
});
};

/**
 * The site header: one grid for the utility links, the wordmark, the browse tabs, the signed-in institution block and
 * the theme button, so each is a single element that moves between placements by grid area.
 *
 * - From 640px: row 1 is the utility row (links at the end); row 2 is the bar (wordmark, tabs, institution block, theme
 *   button).
 * - Below 640px: row 1 holds the institution block at the start and the links; row 2 the wordmark and the theme button;
 *   row 3 the tabs under a hairline, scrolling sideways. There is no menu button.
 *
 * The whole header is sticky with a negative `top` equal to the utility row's height, so the utility row scrolls away
 * and the bar stays. The hairline under the utility row is drawn by the header's background at that height. Variant
 * `signedIn` says whether the institution block is present, so the phone grid gives it a column only when it is.
 */
export const siteNav = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineSlotRecipe({
  className: 'site-nav',
  staticCss: ['*'],
  slots: [
    'root',
    'links',
    'linkList',
    'link',
    'wordmark',
    'tabs',
    'tab',
    'institution',
    'institutionIcon',
    'signedIn',
    'name',
    'themeButton',
  ],
  base: {
    root: {
      position: 'sticky',
      top: 'calc(-1 * token(sizes.utility) + token(borderWidths.hairline) + var(--ut, 0px))',
      transitionProperty: 'top',
      transitionDuration: 'slower',
      transitionTimingFunction: 'ease-in-out',
      zIndex: 'sticky',
      display: 'grid',
      alignItems: 'center',
      gridTemplateRows: {
        base: 'token(sizes.utility) minmax(token(sizes.barCompact), auto) auto',
        sm: 'token(sizes.utility) minmax(token(sizes.bar), auto)',
      },
      background: 'canvas',
      backgroundImage:
        'linear-gradient(to bottom, transparent calc(token(sizes.utility) - token(borderWidths.hairline)), token(colors.border) calc(token(sizes.utility) - token(borderWidths.hairline)), token(colors.border) token(sizes.utility), transparent token(sizes.utility))',
      ...siteInset,
      ...ruleBelow,
    },
    links: {
      gridArea: 'links',
      alignSelf: 'stretch',
      minWidth: '0',
      justifySelf: { base: 'stretch', sm: 'end' },
      marginInline: 'calc(-1 * token(spacing.3))',
    },
    linkList: { ...scrollRow, height: '100%', alignItems: 'stretch' },
    link: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      height: '100%',
      paddingInline: '3',
      borderBlockEndWidth: 'rail',
      borderBlockEndStyle: 'solid',
      borderBlockEndColor: 'transparent',
      color: 'fg.muted',
      ...textSize('body', 'md'),
      whiteSpace: 'nowrap',
      transitionProperty: 'color, background-color, border-color',
      transitionDuration: 'fast',
      _hover: { color: 'fg.default', background: 'gray.plain.bg.hover' },
      _active: { background: 'gray.plain.bg.active' },
      '&[aria-current="page"]': { color: 'fg.default', borderBlockEndColor: 'accent' },
    },
    wordmark: {
      gridArea: 'mark',
      marginInlineEnd: { sm: '6', md: '12' },
      color: 'fg.default',
      fontFamily: 'display',
      ...textSize('display', '2xl'),
      fontWeight: 'semibold',
      letterSpacing: 'wordmark',
      textTransform: 'uppercase',
    },
    tabs: {
      ...scrollRow,
      gridArea: 'tabs',
      alignSelf: 'stretch',
      alignItems: 'stretch',
      gap: { base: '6', sm: '8' },
      minWidth: '0',
      marginInline: { base: 'calc(-1 * var(--inset))', sm: '0' },
      paddingInline: { base: 'var(--inset)', sm: '0' },
      borderBlockStartWidth: { base: 'hairline', sm: '0' },
      borderColor: 'border',
    },
    tab: {
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
      gap: '2',
      paddingBlock: { base: '2', sm: '0' },
      color: 'fg.muted',
      fontFamily: 'body',
      ...responsive(textSize('body', 'md'), textSize('body', 'lg'), 'sm'),
      whiteSpace: 'nowrap',
      position: 'relative',
      transitionProperty: 'color',
      transitionDuration: 'fast',
      _hover: { color: 'fg.default' },
      '&::after': {
        content: '""',
        position: 'absolute',
        insetInline: '0',
        insetBlockEnd: '0',
        height: 'rail',
        background: 'accent',
        transform: 'scaleX(0)',
        transformOrigin: 'center',
        transitionProperty: 'transform',
        transitionDuration: 'normal',
        transitionTimingFunction: 'ease-out',
      },
      '&[aria-current="page"]': { color: 'fg.default' },
      '&[aria-current="page"]::after': { transform: 'scaleX(1)' },
    },
    institution: {
      gridArea: 'inst',
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      minWidth: '0',
      marginInlineEnd: { sm: '4' },
      paddingBlock: '1',
      paddingInlineStart: '2',
      paddingInlineEnd: { base: '2', sm: '4' },
      borderWidth: 'hairline',
      borderStyle: 'solid',
      borderColor: 'border',
      color: 'fg.default',
      cursor: 'pointer',
      transitionProperty: 'border-color, background-color',
      transitionDuration: 'fast',
      '& > span': { minWidth: '0' },
      _hover: { borderColor: 'fg.default', background: 'gray.plain.bg.hover' },
      _active: { background: 'gray.plain.bg.active' },
    },
    institutionIcon: {
      flexShrink: 0,
      color: 'accent',
      width: { base: 'glyphSm', sm: 'glyph' },
      height: { base: 'glyphSm', sm: 'glyph' },
    },
    signedIn: {
      display: { base: 'none', sm: 'block' },
      color: 'fg.muted',
      ...textSize('body', 'sm'),
    },
    name: {
      display: 'block',
      maxWidth: { base: 'none', sm: '16ch', md: 'none' },
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 'medium',
      color: 'fg.default',
      ...responsive(textSize('body', 'sm'), textSize('body', 'md'), 'sm'),
    },
    themeButton: {
      gridArea: 'theme',
      justifySelf: 'end',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: 'control',
      height: 'control',
      borderWidth: 'hairline',
      borderStyle: 'solid',
      borderColor: 'border',
      background: 'transparent',
      color: 'fg.default',
      cursor: 'pointer',
      transitionProperty: 'border-color, color, background-color',
      transitionDuration: 'fast',
      _hover: { borderColor: 'fg.default', color: 'accent', background: 'gray.plain.bg.hover' },
      _active: { background: 'gray.plain.bg.active' },
    },
  },
  variants: {
    signedIn: {
      true: {
        root: {
          gridTemplateAreas: {
            base: '"inst links" "mark theme" "tabs tabs"',
            sm: '"links links links links" "mark tabs inst theme"',
          },
          gridTemplateColumns: {
            base: 'minmax(0, auto) minmax(0, 1fr)',
            sm: 'auto minmax(0, 1fr) auto auto',
          },
          columnGap: { base: '4', sm: '0' },
        },
      },
      false: {
        root: {
          gridTemplateAreas: {
            base: '"links links" "mark theme" "tabs tabs"',
            sm: '"links links links links" "mark tabs inst theme"',
          },
          gridTemplateColumns: {
            base: 'minmax(0, 1fr) auto',
            sm: 'auto minmax(0, 1fr) auto auto',
          },
        },
      },
    },
  },
  defaultVariants: { signedIn: false },
});
};

/**
 * The site footer (Rev 19 §4.3): a hairline above and two columns on one grid (`minmax(0, 1fr) auto`), stacked on
 * phones. The left holds the footer links and the copyright line; the right holds the status link with its green dot and
 * the made-in line, right-aligned (start-aligned on phones). There are no rules between the rows.
 */
export const siteFooter = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineSlotRecipe({
  className: 'site-footer',
  slots: ['root', 'start', 'end', 'links', 'link', 'note', 'status', 'dot'],
  base: {
    root: {
      flex: 'none',
      display: 'grid',
      gridTemplateColumns: { base: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) auto' },
      alignItems: 'start',
      columnGap: '12',
      rowGap: '2',
      marginBlockStart: '8',
      paddingBlock: '8',
      ...siteInset,
      borderBlockStartWidth: 'hairline',
      borderBlockStartStyle: 'solid',
      borderBlockStartColor: 'border',
    },
    start: { display: 'grid', gap: '2' },
    end: {
      display: 'grid',
      gap: '2',
      justifyItems: { base: 'start', sm: 'end' },
    },
    links: { display: 'flex', flexWrap: 'wrap', columnGap: '8', rowGap: '2' },
    link: {
      color: 'fg.default',
      transitionProperty: 'color',
      transitionDuration: 'fast',
      _hover: { color: 'accent' },
    },
    note: { color: 'fg.muted', ...textSize('body', 'sm') },
    status: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2',
      color: 'fg.muted',
      ...textSize('body', 'sm'),
      transitionProperty: 'color',
      transitionDuration: 'fast',
      _hover: { color: 'fg.default' },
    },
    dot: {
      width: 'dot',
      height: 'dot',
      borderRadius: 'full',
      background: 'success',
      boxShadow:
        '0 0 0 token(sizes.halo) color-mix(in srgb, token(colors.success) 25%, transparent)',
    },
  },
});
};
