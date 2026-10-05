import { defineSlotRecipe } from '@pandacss/dev';
import { labelCaps } from '../type-scale';

/** A breadcrumb trail: small caps links separated by slashes, the current page last and unlinked. */
export const crumbs = defineSlotRecipe({
  className: 'crumbs',
  slots: ['root', 'list', 'item', 'link', 'separator'],
  base: {
    root: { ...labelCaps, color: 'fg.muted' },
    list: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '2', listStyle: 'none' },
    item: { alignItems: 'center', display: 'inline-flex', gap: '2' },
    link: {
      color: 'inherit',
      _hover: { color: 'fg.default', textDecorationLine: 'underline' },
      focusVisibleRing: 'outside',
    },
    separator: { color: 'fg.subtle' },
  },
});
