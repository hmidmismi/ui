import { defineRecipe } from '@pandacss/dev';
import { hoverAccentUnderline, linkStyles } from '../interaction';

/**
 * A text link. `tone` picks the resting color: `accent` for links in content, `muted` for quiet links such as
 * breadcrumbs. Apply it with `className={link()}` on a router `Link` or an anchor. States come from `interaction.ts`.
 */
export const link = defineRecipe({
  className: 'link',
  staticCss: ['*'],
  base: linkStyles,
  defaultVariants: { tone: 'accent' },
  variants: {
    tone: {
      accent: {},
      muted: { color: 'fg.muted', ...hoverAccentUnderline },
    },
  },
});
