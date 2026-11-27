import { defineSlotRecipe } from '@pandacss/dev';
import { ruleBelow } from '../fragments';
import { currentMark, hoverAccent } from '../interaction';
import type { TypeSystem } from '../type-scale';

/** A row of links that choose one of a group: a letter, a decade or a view. The current one is marked. */
export const linkNav = (t: TypeSystem) => {
  const labelCapsLine = t.labelCapsLine;
  return defineSlotRecipe({
    className: 'link-nav',
    staticCss: ['*'],
    slots: ['root', 'link'],
    base: {
      root: { display: 'flex', flexWrap: 'wrap', gap: '1', paddingBlock: '2', ...ruleBelow },
      link: {
        paddingBlock: '1',
        paddingInline: '2',
        color: 'fg.muted',
        ...labelCapsLine,
        ...hoverAccent,
      },
    },
    variants: {
      current: {
        true: { link: currentMark },
        false: {},
      },
    },
  });
};
