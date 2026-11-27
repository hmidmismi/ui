import { configDefaults, defineConfig } from 'vitest/config';

/** The default run: everything except the visual tests, which are opt-in (`pnpm test:visual`, see `vitest.visual.config.ts`). */
export default defineConfig({
  test: { exclude: [...configDefaults.exclude, 'tests/visual/**'] },
});
