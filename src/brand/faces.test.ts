import { precomputeValues } from '@capsizecss/core';
import { describe, expect, it } from 'vitest';
import { fontStack, xHeightAdjust } from '../theme';
import { DEFAULT_FACE_SET, faceSets, resolveFaceSet } from './faces';
import { stepLineHeight, stepSize, STEPS, type StepName, trimValues } from '../preset/type-scale';

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
      for (const role of ['display', 'body', 'mono'] as const) {
        const face = { family: set[role].family, generic: set[role].generic, cssVar: `--font-${role}` };
        expect(fontStack(face)).toMatch(new RegExp(`^var\\(--font-${role}, "`));
      }
    }
  });

  it('trims every face of every set at every step, with the same line height', () => {
    for (const [name, set] of Object.entries(faceSets)) {
      const reference = set.body.metrics;
      for (const role of ['display', 'body', 'mono'] as const) {
        const metrics = set[role].metrics;
        const adjust = xHeightAdjust(reference, metrics);
        for (const step of names) {
          const v = precomputeValues({
            fontSize: stepSize(step) * adjust,
            leading: stepLineHeight(step),
            fontMetrics: metrics,
          });
          expect(Number.parseFloat(v.capHeightTrim), `${name} ${role} ${step}`).toBeLessThan(0);
          expect(Number.parseFloat(v.baselineTrim), `${name} ${role} ${step}`).toBeLessThan(0);
          // our formula, which the generated calc() expresses, must equal Capsize's
          const ours = trimValues(metrics, stepSize(step) * adjust, stepLineHeight(step));
          expect(ours.capHeightTrim, `${name} ${role} ${step}`).toBeCloseTo(Number.parseFloat(v.capHeightTrim), 3);
          expect(ours.baselineTrim, `${name} ${role} ${step}`).toBeCloseTo(Number.parseFloat(v.baselineTrim), 3);
        }
      }
    }
  });
});
