import { defineSlotRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';

export const filterGroup = ({ labelCaps }: TypeSystem) =>
  defineSlotRecipe({
  className: 'filter-group',
  slots: ['root', 'label'],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '2' },
    label: { color: 'fg.muted', ...labelCaps },
  },
});
