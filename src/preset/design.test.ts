import { describe, expect, it } from 'vitest';
import { type Design, design } from '../design';
import { neutral, themeVariables, toCss } from '../theme';
import { createPreset } from './index';
import { createScale } from './scale';
import { scaleValuesFor } from './spacing';
import { createTypeSystem, STEPS, type StepName } from './type-scale';

const names = Object.keys(STEPS) as StepName[];

/** A design nothing in the code knows about: a 4px baseline and a major-third scale. */
const other: Design = {
  grid: { baseline: 4, unit: 8, root: 16 },
  type: { base: 16, ratio: 1.25, minLeading: 1.3 },
  motion: { durations: { ...design.motion.durations } },
};

describe('design', () => {
  it('has a unit of two baselines', () => {
    expect(design.grid.unit).toBe(design.grid.baseline * 2);
    expect(other.grid.unit).toBe(other.grid.baseline * 2);
  });

  it('keeps every spacing step a whole number of baselines, for any grid', () => {
    for (const d of [design, other]) {
      const { ROOT_SIZE, BASELINE } = createScale(d);
      for (const [name, token] of Object.entries(scaleValuesFor(d))) {
        const px = Number.parseFloat(token.value) * ROOT_SIZE;
        expect(px % BASELINE, `${d.grid.baseline}px grid, spacing ${name}`).toBeCloseTo(0, 2);
      }
    }
  });

  it('puts every line height on the baseline, for any design', () => {
    for (const d of [design, other]) {
      const scale = createTypeSystem(d);
      for (const name of names) {
        expect(scale.stepLineHeight(name) % d.grid.baseline, `${d.grid.baseline}px ${name}`).toBe(0);
      }
    }
  });

  it('builds a preset from a design', () => {
    const preset = createPreset(other);
    const tokens = (preset.theme?.tokens ?? {}) as Record<string, Record<string, { value: string }>>;
    expect(tokens.spacing?.['2']?.value).toBe('0.5rem');
    expect(tokens.fontSizes?.md?.value).toBe('1rem');
  });
});

describe('theme', () => {
  it('turns every palette entry and face into a CSS variable', () => {
    const vars = themeVariables(neutral);
    // 7 palette colors, 3 font stacks, and 4 type numbers for each of the 3 roles
    expect(Object.keys(vars)).toHaveLength(7 + 3 + 12);
    for (const value of Object.values(vars)) expect(value.length).toBeGreaterThan(0);
  });

  it('keeps a font stack valid when the app never sets its variable', () => {
    const css = themeVariables(neutral)['--ui-font-body'] ?? '';
    // the family and generic are the var()'s fallback, not siblings of it
    expect(css).toMatch(/^var\(--font-body, "Inter", sans-serif\)$/);
  });

  it('writes CSS for a selector', () => {
    const css = toCss(neutral, '[data-theme="x"]');
    expect(css.startsWith('[data-theme="x"] {')).toBe(true);
    expect(css).toContain(`--ui-ink: ${neutral.palette.ink};`);
  });
});
