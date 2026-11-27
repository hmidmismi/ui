import { defineSlotRecipe } from '@pandacss/dev';
import { siteInset } from '../fragments';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';

/**
 * The masthead over the first screen of the home page: light text on the media behind it. From `md` the wordmark is
 * centered at the top with the utility links at its start and the controls at its end, on the wordmark's midline, and the
 * tabs are centered under it. Below `md`
 * it is a menu button at the start, the wordmark in the middle and one control at the end; the menu opens a panel with the
 * tabs and the utility links.
 */
export const siteMasthead = (t: TypeSystem) => {
  const { textSize } = t;
  return defineSlotRecipe({
    className: 'site-masthead',
    staticCss: ['*'],
    slots: ['root', 'start', 'end', 'wordmark', 'full', 'short', 'nav', 'tab', 'menu', 'summary', 'panel', 'language'],
    base: {
      root: {
        position: 'absolute',
        insetInline: '0',
        insetBlockStart: '0',
        zIndex: 'docked',
        display: 'grid',
        gridTemplateColumns: { base: '1fr auto 1fr', md: '1fr auto 1fr' },
        gridTemplateAreas: {
          base: '"menu wordmark language"',
          md: '"start wordmark end" "nav nav nav"',
        },
        alignItems: 'center',
        columnGap: '6',
        paddingBlockStart: '2',
        paddingBlockEnd: { base: '2', md: '10' },
        color: 'white',
        ...siteInset,
      },
      start: {
        gridArea: 'start',
        display: { base: 'none', md: 'flex' },
        alignItems: 'center',
        gap: '6',
        ...textSize('body', 'md'),
      },
      end: {
        gridArea: 'end',
        display: { base: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '6',
        ...textSize('body', 'md'),
        '& button': { color: 'inherit' },
      },
      wordmark: {
        gridArea: 'wordmark',
        justifySelf: 'center',
        color: 'inherit',
        whiteSpace: 'nowrap',
        fontFamily: 'display',
        ...responsive(textSize('display', '3xl'), textSize('display', '7xl'), 'md'),
      },
      full: { display: { base: 'none', md: 'inline' } },
      short: { display: { base: 'inline', md: 'none' } },
      nav: {
        gridArea: 'nav',
        display: { base: 'none', md: 'flex' },
        justifyContent: 'center',
        gap: '8',
      },
      tab: {
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 'control.md',
        color: 'inherit',
        whiteSpace: 'nowrap',
        ...textSize('body', 'lg'),
        _hover: { textDecoration: 'underline' },
      },
      menu: { gridArea: 'menu', justifySelf: 'start', display: { base: 'block', md: 'none' } },
      summary: {
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 'control.md',
        cursor: 'pointer',
        listStyle: 'none',
        ...textSize('body', 'md'),
        '&::-webkit-details-marker': { display: 'none' },
      },
      panel: {
        position: 'absolute',
        insetInline: '0',
        insetBlockStart: '100%',
        display: 'grid',
        gap: '4',
        padding: '4',
        background: 'canvas',
        color: 'fg.default',
        ...siteInset,
      },
      language: { gridArea: 'language', justifySelf: 'end', display: { base: 'inline-flex', md: 'none' } },
    },
  });
};
