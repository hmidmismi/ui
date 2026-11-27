import { describe, expect, it } from 'vitest';
import { design as defaultDesign } from '../design';
import type { GridMode } from '../grid';
import { neutral } from '../theme';
import { createPreset } from './index';
import { createRecipes } from './recipes';
import { createTypeSystem, STEPS, type StepName } from './type-scale';

/** The default design with one grid mode. */
const inMode = (mode: GridMode) => ({ ...defaultDesign, grid: { ...defaultDesign.grid, mode } });

const names = Object.keys(STEPS) as StepName[];
const faces = ['display', 'body', 'mono'] as const;

describe('the default', () => {
  it('is the free mode', () => {
    expect(defaultDesign.grid.mode).toBe('free');
    expect(createTypeSystem(defaultDesign).mode).toBe('free');
  });
});

describe('the free mode', () => {
  const t = createTypeSystem(inMode('free'));

  it('moves no line: every correction is empty', () => {
    for (const face of faces) {
      for (const name of names) {
        expect(t.lineShift(face, name), `${face} ${name} lineShift`).toEqual({});
        expect(t.lineMargins(face, name), `${face} ${name} lineMargins`).toEqual({});
        expect(t.lineRelative(face, name), `${face} ${name} lineRelative`).toEqual({});
        expect(t.lineCentered(face, name, { height: 'token(sizes.5)', items: false })).toEqual({});
        expect(t.linePadded(face, name, { block: 'token(spacing.2)' })).toEqual({});
        expect(t.textTrim(face, name), `${face} ${name} textTrim`).toEqual({});
      }
    }
  });

  it('still sets the size and the line height of every step', () => {
    for (const face of faces) {
      for (const name of names) {
        const style = t.textLine(face, name);
        expect(Object.keys(style).sort(), `${face} ${name}`).toEqual(['fontSize', 'lineHeight']);
        expect(String(style.fontSize)).toMatch(/rem$/);
        expect(String(style.lineHeight)).toMatch(/rem$/);
      }
    }
  });

  it('keeps every line height a whole number of baselines, so neighbouring columns share a rhythm', () => {
    const baseline = defaultDesign.grid.baseline;
    for (const name of names) {
      const px = t.stepLineHeight(name);
      expect(px % baseline, name).toBe(0);
    }
  });

  it('grows the root size with the viewport, from the reader size to the scale', () => {
    // 1em at 360px wide, 1.2em at 1440px wide: (1.2 - 1) * 16 / (1440 - 360) px of root per px of viewport.
    expect(t.rootSize()).toBe('clamp(1em, calc(1em + (100vw - 360px) * 0.002963), 1.2em)');
  });

  it('sizes a picture by its aspect ratio and a cover by the viewport, unrounded', () => {
    expect(t.rowsHigh('2 / 3')).toBe('calc(100cqw * 2 / 3)');
    expect(t.viewportHeight('100')).toBe('100dvh');
  });

  it('leaves no snapped length in a recipe', () => {
    const { recipes, slotRecipes } = createRecipes(t);
    const css = JSON.stringify({ recipes, slotRecipes });
    expect(css).not.toContain('round(up');
    expect(css).not.toContain('round(down');
  });

  it('builds a preset whose html font size is the fluid root', () => {
    const preset = createPreset(inMode('free'), neutral);
    const html = (preset.globalCss?.extend as Record<string, Record<string, unknown>>).html;
    expect(html?.fontSize).toBe(t.rootSize());
  });
});

describe('the scaled mode', () => {
  const t = createTypeSystem(inMode('scaled'));

  it('keeps the corrections of the strict grid', () => {
    expect(t.lineShift('body', 'md')).not.toEqual({});
    expect(t.textTrim('body', 'md')).not.toEqual({});
  });

  it('moves the root in steps that keep the baseline a whole number of pixels', () => {
    // 16px root / 5px baseline: the root moves 3.2px at a time, so the baseline moves 1px at a time.
    expect(t.rootSize()).toBe('round(clamp(1em, calc(1em + (100vw - 360px) * 0.002963), 1.2em), 3.2px)');
  });

  it('rounds the viewport height to a baseline, so what sits under a full-screen block stays on the grid', () => {
    expect(t.viewportHeight('100')).toBe('round(down, 100dvh, token(spacing.1))');
    expect(t.rowsHigh('1')).toBe('round(up, calc(100cqw * 1), token(spacing.1))');
  });
});

describe('the baseline mode', () => {
  const t = createTypeSystem(inMode('baseline'));

  it('keeps the reader size as the root', () => {
    expect(t.rootSize()).toBe('100%');
  });

  it('keeps the viewport heights as they were', () => {
    expect(t.viewportHeight('100')).toBe('100dvh');
    expect(t.viewportHeight('33.333')).toBe('33.333dvh');
  });
});

describe('the fluid setting', () => {
  it('can be set per design, and stays within what zoom allows', () => {
    const wide = createTypeSystem({
      ...inMode('free'),
      type: { ...defaultDesign.type, fluid: { from: 320, to: 1280, scale: 1.25 } },
    });
    expect(wide.rootSize()).toContain('100vw - 320px');
    expect(wide.rootSize()).toContain('1.25em)');
    expect(defaultDesign.type.fluid.scale).toBeLessThanOrEqual(2.5);
  });
});
