import { defineRecipe } from '@pandacss/dev';
import { siteInset } from '../fragments';
import type { TypeSystem } from '../type-scale';

/** The fill and text color of a toned surface, from one named wash. */
const toned = (tone: string) => ({ background: `wash.${tone}.bg`, color: `wash.${tone}.fg` });

/**
 * A block that runs the full width of the page: the page's own background, or a tone (a named wash) behind its content,
 * which sits in the page column. `pad` is the space above and below, `min` a minimum height (a third of the screen, or the
 * whole screen) and `place` centers the content in it.
 */
export const surface = (tones: readonly string[], t: TypeSystem) =>
  defineRecipe({
    className: 'surface',
    staticCss: ['*'],
    base: { display: 'grid', width: 'full', ...siteInset },
    defaultVariants: { tone: 'plain', pad: 'normal' },
    variants: {
      tone: {
        plain: {},
        ...Object.fromEntries(tones.map((tone) => [tone, toned(tone)])),
      },
      pad: {
        none: {},
        tight: { paddingBlock: '3' },
        normal: { paddingBlock: '16' },
        loose: { paddingBlock: { base: '16', md: '24' } },
      },
      min: {
        third: { minHeight: t.viewportHeight('33.333') },
        screen: { minHeight: t.viewportHeight('100') },
      },
      place: { center: { alignContent: 'center', justifyItems: 'start' } },
    },
  });
