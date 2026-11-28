import { describe, expect, it } from 'vitest';
import { design as defaultDesign } from '../design';
import { createScale } from '../grid';
import { createTypeSystem, STEPS, type StepName } from './type-scale';

/** Common modular scale ratios by name. */
const RATIOS = { 'major second': 1.125, 'minor third': 1.2, 'major third': 1.25, 'perfect fourth': 4 / 3, 'perfect fifth': 1.5 };
const names = Object.keys(STEPS) as StepName[];

describe('type scale ratios', () => {
  for (const [name, ratio] of Object.entries(RATIOS)) {
    it(`scales from the root by a ${name} (${ratio.toFixed(3)}) and keeps lines on the baseline`, () => {
      const design = { ...defaultDesign, type: { ...defaultDesign.type, ratio } };
      const { BASELINE, ROOT_SIZE } = createScale(design);
      const { textSize } = createTypeSystem(design);
      const px = (value: unknown) => Number.parseFloat(String(value)) * ROOT_SIZE;
      const rows: string[] = [];
      for (const step of names) {
        const style = textSize('body', step) as { fontSize: string; lineHeight: string };
        const size = px(style.fontSize);
        const line = px(style.lineHeight);
        rows.push(`${step} ${size.toFixed(1)}/${line.toFixed(0)}`);
        expect(line % BASELINE, `${step} line height`).toBeCloseTo(0, 5);
        expect(line / size, `${step} leading`).toBeGreaterThanOrEqual(1.1);
        expect(line / size, `${step} leading`).toBeLessThanOrEqual(1.7);
        if (step === 'md') expect(size).toBeCloseTo(design.type.base, 1);
      }
      console.log(name, rows.join('  '));
    });
  }
});
