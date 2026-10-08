import { precomputeValues } from '@capsizecss/core';
import { describe, expect, it } from 'vitest';
import { DEFAULT_FACE_SET, faceSets, fontStack, resolveFaceSet } from './faces';
import { stepLineHeight, stepSize, STEPS, type StepName } from './type-scale';

const names = Object.keys(STEPS) as StepName[];

describe('font sets', () => {
  it('defaults to D and falls back for unknown names', () => {
    expect(DEFAULT_FACE_SET).toBe('d');
    expect(resolveFaceSet(undefined)).toBe('d');
    expect(resolveFaceSet('nope')).toBe('d');
    expect(resolveFaceSet('F')).toBe('f');
  });

  it('gives every set the same three roles with metrics', () => {
    for (const [name, set] of Object.entries(faceSets)) {
      for (const role of ['display', 'body', 'mono'] as const) {
        expect(set[role].metrics.unitsPerEm, `${name} ${role}`).toBeGreaterThan(0);
        expect(set[role].metrics.xHeight, `${name} ${role}`).toBeGreaterThan(0);
      }
    }
  });

  it('keeps the CSS variable names identical across sets', () => {
    for (const set of Object.values(faceSets)) {
      expect(fontStack('display', set.display)).toMatch(/^var\(--font-display\), "/);
      expect(fontStack('body', set.body)).toMatch(/^var\(--font-body\), "/);
      expect(fontStack('mono', set.mono)).toMatch(/^var\(--font-mono\), "/);
    }
  });

  it('trims every face of every set at every step, with the same line height', () => {
    for (const [name, set] of Object.entries(faceSets)) {
      const reference = set.body.metrics;
      for (const role of ['display', 'body', 'mono'] as const) {
        const metrics = set[role].metrics;
        const adjust =
          reference.xHeight / reference.unitsPerEm / (metrics.xHeight / metrics.unitsPerEm);
        for (const step of names) {
          const v = precomputeValues({
            fontSize: stepSize(step) * adjust,
            leading: stepLineHeight(step),
            fontMetrics: metrics,
          });
          expect(Number.parseFloat(v.capHeightTrim), `${name} ${role} ${step}`).toBeLessThan(0);
          expect(Number.parseFloat(v.baselineTrim), `${name} ${role} ${step}`).toBeLessThan(0);
        }
      }
    }
  });
});
