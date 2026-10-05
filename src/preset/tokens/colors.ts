import { defineTokens } from '@pandacss/dev';
import { black, white } from './black-white';

/**
 * The brand primitives. Everything else is a mix of these (see `../colors/`): `ink` and `paper` are the text and canvas
 * colors, `stone` the line color, `indigo` the accent with `indigo.light` as its dark-mode solid, `red` the error hue.
 */
export const colors = defineTokens.colors({
  ink: { value: '#14171C' },
  paper: { value: '#ECEDE8' },
  stone: { value: '#C4C8C0' },
  indigo: {
    DEFAULT: { value: '#2C3E72' },
    light: { value: '#9AA7D4' },
  },
  red: {
    DEFAULT: { value: '#B4432F' },
    light: { value: '#E3A596' },
  },
  black,
  white,
});
