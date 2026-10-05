import { defineConfig } from '@pandacss/dev';
import { preset } from './src/preset';

/**
 * Panda config for `@baikikai/ui`, the only place Panda runs. The theme lives in the preset; this file adds the source
 * files to scan. `staticCss` emits every recipe variant, because components are used by apps that Panda never scans.
 * The generated `styled-system/styles.css` is what apps import.
 */
export default defineConfig({
  preflight: true,
  jsxFramework: 'react',
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda', preset],
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  staticCss: { recipes: '*' },
});
