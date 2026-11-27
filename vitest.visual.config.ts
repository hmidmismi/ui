import { defineConfig } from 'vitest/config';

/**
 * The visual tests: they render the style book and a masthead in each grid mode in a real Chrome, at several widths, and
 * check the layout and take screenshots. They are opt-in, so the default test run stays fast: `pnpm test:visual`.
 * `UPDATE_VISUAL=1 pnpm test:visual` replaces the saved screenshots after a change meant to alter the look.
 */
export default defineConfig({
  test: { include: ['tests/visual/**/*.test.tsx'], testTimeout: 90_000, hookTimeout: 60_000, fileParallelism: false },
});
