import { defineSlotRecipe } from '@pandacss/dev';
import { labelCaps } from '../type-scale';

export const filterGroup = defineSlotRecipe({
  className: 'filter-group',
  slots: ['root', 'label'],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '2' },
    label: { color: 'fg.muted', ...labelCaps },
  },
});
