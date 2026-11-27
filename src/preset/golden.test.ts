import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { design } from '../design';
import { neutral } from '../theme';
import { createPreset } from './index';

/**
 * The strict baseline grid is the mode every project that has not chosen another one keeps getting, so its output is
 * held to a saved copy: the whole preset (tokens, recipes, type scale, global styles) built from the default design.
 * The test fails on any difference, even one character. When a change to that mode is meant, regenerate the file with
 * `pnpm vitest run src/preset/golden.test.ts -u` and review the diff.
 */
const GOLDEN = join(import.meta.dirname, '__golden__/baseline.json');

describe('the baseline grid mode', () => {
  it('builds the same preset as the saved copy', async () => {
    const baseline = { ...design, grid: { ...design.grid, mode: 'baseline' } };
    const preset = createPreset(baseline as typeof design, neutral);
    await expect(`${JSON.stringify(preset, null, 1)}\n`).toMatchFileSnapshot(GOLDEN);
  });
});
