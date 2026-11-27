import { defineConfig } from '@pandacss/dev';
import { design as defaultDesign } from './src/design';
import { createPreset } from './src/preset';
import type { GridMode } from './src/grid';
import { neutral } from './src/theme';

/**
 * Panda config for `@hmidmismi/ui`, the only place Panda runs. The preset is built from the default design and the
 * neutral theme; this file adds the source files to scan. `staticCss` emits every recipe variant, because components are used by apps that Panda never scans.
 * The generated `styled-system/styles.css` is what apps import.
 */
/**
 * The grid mode of this build: `free` (the default), `scaled` or `baseline`. `pnpm codegen` builds a stylesheet for each,
 * `styles.css` for the default and `styles.<mode>.css` for the others, because the browser tests and the style book
 * compare them. Only the stylesheet differs; the generated recipe functions are the same.
 */
const mode = (process.env.GRID_MODE ?? defaultDesign.grid.mode) as GridMode;
const design = { ...defaultDesign, grid: { ...defaultDesign.grid, mode } };

export default defineConfig({
  preflight: true,
  jsxFramework: 'react',
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda', createPreset(design, neutral)],
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  staticCss: { recipes: '*' },
});
