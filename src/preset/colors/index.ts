import { defineSemanticTokens } from '@pandacss/dev';
import { neutralScale, ref, tonalScale, variants } from './scale';

const onSolid = { base: ref('paper'), _dark: ref('ink') };

/** The neutral palette: canvas, borders and text. `colorPalette: gray` is the page default. */
const gray = defineSemanticTokens.colors({
  ...neutralScale(),
  ...variants({
    name: 'gray',
    solid: 12,
    solidHover: 11,
    solidFg: { base: ref('paper'), _dark: ref('ink') },
    text: 12,
  }),
});

/** The accent palette: indigo, with light indigo as the dark-mode solid. */
const accent = defineSemanticTokens.colors({
  ...tonalScale('indigo', 'indigo.light'),
  DEFAULT: { value: { base: '{colors.accent.9}', _dark: '{colors.accent.9}' } },
  ...variants({ name: 'accent', solid: 9, solidHover: 10, solidFg: onSolid, text: 11 }),
});

/** The error palette. */
const red = defineSemanticTokens.colors({
  ...tonalScale('red', 'red.light'),
  ...variants({ name: 'red', solid: 9, solidHover: 10, solidFg: onSolid, text: 11 }),
});

/** Semantic colors, plus the palettes. `brand` is the accent. */
export const semanticColors = defineSemanticTokens.colors({
  canvas: { value: '{colors.gray.1}' },
  fg: {
    default: { value: '{colors.gray.12}' },
    muted: { value: '{colors.gray.11}' },
    subtle: { value: '{colors.gray.10}' },
    disabled: { value: '{colors.gray.8}' },
  },
  border: {
    DEFAULT: { value: '{colors.gray.7}' },
    muted: { value: '{colors.gray.5}' },
    emphasized: { value: '{colors.gray.9}' },
  },
  error: { value: '{colors.red.9}' },
  shadow: { value: { base: '{colors.gray.a6}', _dark: '{colors.black.a8}' } },
  gray,
  accent,
  brand: accent,
  red,
});
