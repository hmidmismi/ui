import { definePreset } from '@pandacss/dev';
import { animationStyles } from './animation-styles';
import { semanticColors } from './colors';
import { conditions } from './conditions';
import { globalCss } from './global-css';
import { keyframes } from './keyframes';
import { layerStyles } from './layer-styles';
import { recipes, slotRecipes } from './recipes';
import { spacing } from './spacing';
import { textStyles } from './text-styles';
import {
  borderWidths,
  colors,
  durations,
  fonts,
  letterSpacings,
  radii,
  shadows,
  sizes,
  zIndex,
} from './tokens';
import { fontSizeTokens, lineHeightTokens } from './type-scale';

/**
 * The Baikikai design system: tokens, palettes, type scale, recipes and global styles. It sits on top of Panda's base
 * and default presets and replaces their scales (spacing, sizes, font sizes, line heights, colors) outright, so the
 * only values in the system are the ones defined here.
 */
export const preset = definePreset({
  name: '@baikikai/ui',
  conditions,
  globalCss,
  theme: {
    // Outside `extend`: these replace the default preset's scales instead of adding to them.
    tokens: {
      borderWidths,
      colors,
      fontSizes: fontSizeTokens,
      fonts,
      letterSpacings,
      lineHeights: lineHeightTokens,
      radii,
      sizes,
      spacing,
    },
    semanticTokens: { colors: semanticColors },
    extend: {
      tokens: { durations, shadows, zIndex },
      keyframes,
      textStyles,
      layerStyles,
      animationStyles,
      recipes,
      slotRecipes,
    },
  },
});
