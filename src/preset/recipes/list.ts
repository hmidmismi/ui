import { defineSlotRecipe } from '@pandacss/dev';

export const list = defineSlotRecipe({
  className: 'list',
  slots: ['root', 'item'],
  base: {
    root: { display: 'flex', flexDirection: 'column', listStyle: 'none', m: '0', p: '0' },
    item: {
      textStyle: 'sm',
      color: 'fg.default',
      borderBottomWidth: 'hairline',
      borderColor: 'border',
      py: '2',
    },
  },
});
