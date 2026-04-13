import { definePreset } from '@pandacss/dev';

export const preset = definePreset({
  name: 'ikkyo',
  theme: {
    extend: {
      tokens: {
        colors: {
          brand: { value: '#f8074d' },
        },
      },
    },
  },
});
