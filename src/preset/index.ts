import { definePreset, type SystemStyleObject } from '@pandacss/dev';
import { type Design, design as defaultDesign } from '../design';
import { neutral, type Theme, themeVariables } from '../theme';
import { animationStyles } from './animation-styles';
import { semanticColors } from './colors';
import { conditions } from './conditions';
import { globalCss } from './global-css';
import { keyframes } from './keyframes';
import { layerStyles } from './layer-styles';
import { createRecipes } from './recipes';
import { spacingFor } from './spacing';
import { textStylesFor } from './text-styles';
import {
  borderWidths,
  colors,
  durationsFor,
  fonts,
  letterSpacings,
  radii,
  shadows,
  sizesFor,
  zIndex,
} from './tokens';
import { createTypeSystem } from './type-scale';

/**
 * Builds the design system's Panda preset: tokens, palettes, type scale, recipes and global styles. It sits on top of
 * Panda's base and default presets and replaces their scales (spacing, sizes, font sizes, line heights, colors)
 * outright, so the only values in the system are the ones defined here.
 *
 * - `design` is the structure (grid, type scale, motion). It is computed into the tokens and into the text roles inside
 *   recipes, so it is fixed per build.
 * - `theme` is the look (palette, faces and their metrics). It is emitted as CSS variables on `:root`, and tokens and
 *   text roles only reference the variables, so a theme can be swapped at runtime with a stylesheet of its own (see
 *   `toCss`). Trim and x-height matching follow the swapped faces.
 *
 * @param design - the structure. Defaults to the default design.
 * @param theme - the look. Defaults to the neutral theme.
 * @returns the preset.
 */
export function createPreset(design: Design = defaultDesign, theme: Theme = neutral) {
  const type = createTypeSystem(design);
  const { recipes, slotRecipes } = createRecipes(type);
  return definePreset({
    name: '@baikikai/ui',
    conditions,
    globalCss: {
      extend: { ...globalCss.extend, ':root': themeVariables(theme) as SystemStyleObject },
    },
    theme: {
      // Outside `extend`: these replace the default preset's scales instead of adding to them.
      tokens: {
        borderWidths,
        colors,
        fontSizes: type.fontSizeTokens,
        fonts,
        letterSpacings,
        lineHeights: type.lineHeightTokens,
        radii,
        sizes: sizesFor(design),
        spacing: spacingFor(design),
      },
      semanticTokens: { colors: semanticColors },
      extend: {
        tokens: { durations: durationsFor(design), shadows, zIndex },
        keyframes,
        textStyles: textStylesFor(type.scaleTextStyles),
        layerStyles,
        animationStyles,
        recipes,
        slotRecipes,
      },
    },
  });
}

/** The preset for the default design and the neutral theme. */
export const preset = createPreset();
