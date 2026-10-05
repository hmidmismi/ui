import type { RecipeConfig } from '@pandacss/dev';

const invalid = { focusRingColor: 'error', borderColor: 'error' };

export const input = {
  className: 'input',
  jsx: ['Input', 'Field.Input'],
  base: {
    appearance: 'none',
    borderRadius: 'l2',
    height: 'var(--input-height)',
    minHeight: 'var(--input-height)',
    minW: 'var(--input-height)',
    outline: '0',
    position: 'relative',
    textAlign: 'start',
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionDuration: 'fast',
    width: '100%',
    _disabled: { layerStyle: 'disabled' },
  },
  defaultVariants: { size: 'md', variant: 'outline' },
  variants: {
    variant: {
      outline: {
        borderWidth: 'hairline',
        borderColor: 'gray.outline.border',
        focusVisibleRing: 'inside',
        _invalid: invalid,
      },
      surface: {
        bg: 'gray.surface.bg',
        borderWidth: 'hairline',
        borderColor: 'gray.surface.border',
        focusVisibleRing: 'inside',
        _invalid: invalid,
      },
      subtle: {
        borderWidth: 'hairline',
        borderColor: 'transparent',
        bg: 'gray.subtle.bg',
        color: 'gray.subtle.fg',
        focusVisibleRing: 'inside',
        _invalid: invalid,
      },
      flushed: {
        borderBottomWidth: 'hairline',
        borderBottomColor: 'gray.outline.border',
        borderRadius: '0',
        color: 'fg.default',
        px: '0',
        _invalid: { borderColor: 'error' },
        _focus: {
          borderColor: 'colorPalette.solid.bg',
          boxShadowColor: 'colorPalette.solid.bg',
          boxShadow: '0 1px 0 0 var(--shadow-color)',
          _invalid: { borderColor: 'error', boxShadowColor: 'error' },
        },
      },
    },
    size: {
      '2xs': { textStyle: 'xs', px: '2', '--input-height': 'sizes.5' },
      xs: { textStyle: 'sm', px: '2', '--input-height': 'sizes.6' },
      sm: { textStyle: 'sm', px: '3', '--input-height': 'sizes.7' },
      md: { textStyle: 'md', px: '3', '--input-height': 'sizes.8' },
      lg: { textStyle: 'md', px: '4', '--input-height': 'sizes.9' },
      xl: { textStyle: 'lg', px: '4', '--input-height': 'sizes.10' },
      '2xl': { textStyle: '3xl', px: '6', '--input-height': 'sizes.12' },
    },
  },
} satisfies RecipeConfig;
