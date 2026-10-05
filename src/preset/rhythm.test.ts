import { describe, expect, it } from 'vitest';
import { recipes, slotRecipes } from './recipes';
import { BASELINE, ROOT_SIZE } from './scale';
import { scaleValues } from './spacing';
import {
  BASE_SIZE,
  MIN_LEADING,
  RATIO,
  STEPS,
  type StepName,
  stepLineHeight,
  stepSize,
  textSize,
  textTrim,
  xHeightAdjust,
} from './type-scale';

const names = Object.keys(STEPS) as StepName[];
const px = (rem: string) => Number.parseFloat(rem) * ROOT_SIZE;

describe('type scale', () => {
  it('is a minor third from a 16px body', () => {
    expect(BASE_SIZE).toBe(16);
    expect(RATIO).toBe(1.2);
    expect(stepSize('md')).toBe(16);
    for (let i = 1; i < names.length; i++) {
      const prev = names[i - 1] as StepName;
      const next = names[i] as StepName;
      expect(stepSize(next) / stepSize(prev)).toBeCloseTo(RATIO, 10);
    }
  });

  it('puts every line height on the 5px baseline', () => {
    for (const name of names) {
      expect(stepLineHeight(name) % BASELINE, name).toBe(0);
    }
  });

  it('keeps leading between the minimum and 1.6', () => {
    for (const name of names) {
      const leading = stepLineHeight(name) / stepSize(name);
      expect(leading, name).toBeGreaterThanOrEqual(MIN_LEADING);
      expect(leading, name).toBeLessThanOrEqual(1.6);
    }
  });

  it('gives every face the same line height at the same step', () => {
    for (const name of names) {
      const heights = (['display', 'body', 'mono'] as const).map((face) =>
        px(String(textSize(face, name).lineHeight))
      );
      expect(new Set(heights).size, name).toBe(1);
      expect(heights[0]! % BASELINE, name).toBe(0);
    }
  });

  it('matches x-heights to the body face', () => {
    expect(xHeightAdjust('body')).toBe(1);
    expect(xHeightAdjust('display')).toBeGreaterThan(0.5);
    expect(xHeightAdjust('mono')).toBeGreaterThan(0.5);
  });

  it('trims every face and step', () => {
    for (const face of ['display', 'body', 'mono'] as const) {
      for (const name of names) {
        const trim = textTrim(face, name) as Record<
          string,
          { marginBottom?: string; marginTop?: string }
        >;
        expect(
          Number.parseFloat(trim['&::before']?.marginBottom ?? 'NaN'),
          `${face} ${name}`
        ).toBeLessThan(0);
        expect(
          Number.parseFloat(trim['&::after']?.marginTop ?? 'NaN'),
          `${face} ${name}`
        ).toBeLessThan(0);
      }
    }
  });
});

describe('spacing scale', () => {
  it('has only whole 5px baselines, from 0 to 320px', () => {
    for (const [name, { value }] of Object.entries(scaleValues)) {
      const size = px(value);
      expect(size % BASELINE, name).toBe(0);
      expect(size, name).toBe(Number(name) * BASELINE);
    }
  });

  it('puts even tokens on the 10px scale and odd tokens on the 5px half step', () => {
    for (const name of Object.keys(scaleValues)) {
      const size = Number(name) * BASELINE;
      expect(size % (name === '0' || Number(name) % 2 === 0 ? 10 : 5), name).toBe(0);
    }
  });
});

describe('recipes', () => {
  const ALLOWED = new Set(['1px', '-1px', '2px', '0px', '0.5px']);
  // Font sizes and line heights come from the type scale through `textSize`, never typed by hand.
  for (const face of ['display', 'body', 'mono'] as const) {
    for (const name of names) {
      const { fontSize, lineHeight } = textSize(face, name);
      ALLOWED.add(String(fontSize));
      ALLOWED.add(String(lineHeight));
    }
  }

  it('use no literal px or rem lengths outside the allow-list', () => {
    const found = new Set<string>();
    const source = JSON.stringify({ recipes, slotRecipes });
    for (const match of source.matchAll(/-?\d*\.?\d+(?:px|rem)\b/g)) {
      if (!ALLOWED.has(match[0])) found.add(match[0]);
    }
    expect([...found]).toEqual([]);
  });
});
