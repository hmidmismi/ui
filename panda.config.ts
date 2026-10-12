import { defineConfig } from '@pandacss/dev';
import { baikikai } from './src/brand';
import { design } from './src/design';
import { createPreset } from './src/preset';

/**
 * Panda config for `@baikikai/ui`, the only place Panda runs. The preset is built from the default design and the
 * Baikikai theme (`src/brand`); this file adds the source files to scan. `staticCss` emits every recipe variant, because components are used by apps that Panda never scans.
 * The generated `styled-system/styles.css` is what apps import.
 */
export default defineConfig({
  preflight: true,
  jsxFramework: 'react',
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda', createPreset(design, baikikai)],
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  staticCss: { recipes: '*' },
});
