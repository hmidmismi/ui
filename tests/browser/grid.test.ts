import { existsSync, readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { resolve } from 'node:path';
import inter from '@capsizecss/metrics/inter';
import { chromium } from 'playwright-core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  centeredLine,
  type FaceVars,
  lineMargins,
  lineShift,
  paddedLine,
  type Style,
  trim,
  CALIBRATED_STEPS,
  measuredOffsetVar,
} from '../../src/grid';

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const run = existsSync(CHROME) ? describe : describe.skip;

/** A five pixel grid, the line height of each size a whole number of rows, and a bundled font so the result never depends on what the machine has. */
const GRID = 5;
const SIZES = [11.11, 13.33, 16, 19.2, 23.04, 27.65, 33.18, 39.81, 47.78, 57.34];
const font = readFileSync(
  resolve(import.meta.dirname, '../fixtures/inter-latin-400.woff2')
).toString('base64');
const vars: FaceVars = { asc: '--asc', desc: '--desc', capHeight: '--cap' };
const lineOf = (size: number) => Math.ceil((size * 1.4) / GRID) * GRID;

/** Turns a style object into CSS rules for a selector. */
function css(selector: string, style: Style): string {
  let own = '';
  let nested = '';
  for (const [key, value] of Object.entries(style)) {
    if (typeof value === 'object' && value !== null)
      nested += css(key.replace('&', selector), value as Style);
    else own += `${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${value};`;
  }
  return `${own ? `${selector}{${own}}` : ''}${nested}`;
}

run('baseline grid with a bundled font', () => {
  let browser: Awaited<ReturnType<typeof chromium.launch>>;
  beforeAll(async () => {
    browser = await chromium.launch({ executablePath: CHROME, headless: true });
  });
  afterAll(async () => {
    await browser?.close();
  });

  /** Renders one block per size with a style, stacked with a row-sized gap, and reads where each baseline falls. */
  async function measure(style: Style) {
    const page = await browser.newPage({ viewport: { width: 800, height: 800 } });
    const rows = SIZES.map(
      (size, i) =>
        `<div class="t" style="font-size:${size}px;--line:${lineOf(size)}px;line-height:var(--line)"><span><b id="p${i}" style="display:inline-block;width:0;height:0"></b>Hamburgefonstiv</span></div>`
    ).join('<div style="height:20px"></div>');
    // A flex column, so no margin collapses with a neighbor's.
    await page.setContent(`<!doctype html><style>
      @font-face{font-family:T;src:url(data:font/woff2;base64,${font}) format("woff2")}
      :root{--asc:${inter.ascent / inter.unitsPerEm};--desc:${Math.abs(inter.descent) / inter.unitsPerEm};--cap:${inter.capHeight / inter.unitsPerEm}}
      body{margin:0;font-family:T}.stack{display:flex;flex-direction:column}${css('.t', style)}</style><body><div class="stack">${rows}</div></body>`);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => document.fonts.load('16px T'));
    const out = await page.evaluate(
      (n) =>
        Array.from({ length: n }, (_, i) => {
          const probe = document.getElementById(`p${i}`) as HTMLElement;
          const block = (probe.parentElement as HTMLElement).parentElement as HTMLElement;
          return {
            baseline: probe.getBoundingClientRect().bottom + scrollY,
            top: block.getBoundingClientRect().top + scrollY,
            height: block.getBoundingClientRect().height,
          };
        }),
      SIZES.length
    );
    await page.close();
    return out;
  }

  const offGrid = (y: number) => {
    const rest = ((y % GRID) + GRID) % GRID;
    return Math.min(rest, GRID - rest);
  };

  it('puts the first baseline on a grid line at every size, with the box unchanged', async () => {
    const rows = await measure(lineShift('var(--line)', vars, `${GRID}px`));
    for (const [i, row] of rows.entries()) {
      expect(offGrid(row.baseline), `${SIZES[i]}px`).toBeLessThan(0.1);
      expect(row.height, `${SIZES[i]}px`).toBeCloseTo(lineOf(SIZES[i] as number), 1);
    }
  });

  it('does the same with margins, for flex items and text that clips', async () => {
    const rows = await measure(lineMargins('var(--line)', vars, `${GRID}px`));
    for (const [i, row] of rows.entries())
      expect(offGrid(row.baseline), `${SIZES[i]}px`).toBeLessThan(0.1);
  });

  it('trims to the capitals and rounds up to whole rows, with the baseline at the bottom edge', async () => {
    const rows = await measure(trim('var(--line)', vars, `${GRID}px`, true));
    for (const [i, row] of rows.entries()) {
      expect(offGrid(row.height), `${SIZES[i]}px height`).toBeLessThan(0.1);
      expect(
        Math.abs(row.baseline - (row.top + row.height)),
        `${SIZES[i]}px baseline`
      ).toBeLessThan(0.1);
      expect(offGrid(row.baseline), `${SIZES[i]}px`).toBeLessThan(0.1);
    }
  });

  it('puts the baseline of centered text in a fixed-height box on a grid line, with the box unchanged', async () => {
    const height = 24 * GRID;
    const rows = await measure({
      display: 'flex',
      alignItems: 'center',
      height: `${height}px`,
      boxSizing: 'border-box',
      ...centeredLine('var(--line)', vars, `${GRID}px`, { height: `${height}px` }),
    });
    for (const [i, row] of rows.entries()) {
      expect(row.height, `${SIZES[i]}px height`).toBeCloseTo(height, 1);
      expect(offGrid(row.baseline), `${SIZES[i]}px`).toBeLessThan(0.1);
    }
  });

  it('puts the baseline on a grid line in a box whose height is its padding, with the box unchanged', async () => {
    const pad = 2 * GRID;
    const rows = await measure({
      boxSizing: 'border-box',
      ...paddedLine('var(--line)', vars, `${GRID}px`, { block: `${pad}px` }),
    });
    for (const [i, row] of rows.entries()) {
      expect(row.height, `${SIZES[i]}px height`).toBeCloseTo(
        lineOf(SIZES[i] as number) + 2 * pad,
        1
      );
      expect(offGrid(row.baseline), `${SIZES[i]}px`).toBeLessThan(0.1);
    }
  });

  it('measures the offsets in the running browser and keeps every helper on a grid line', async () => {
    const steps = CALIBRATED_STEPS.slice(0, SIZES.length);
    const withMeasured = (step: string): FaceVars => ({
      ...vars,
      measured: measuredOffsetVar('body', step),
    });
    const line = (step: string) => `var(--line-heights-${step})`;
    const styles: Record<string, (step: string) => Style> = {
      shift: (step) => lineShift(line(step), withMeasured(step), `${GRID}px`),
      margins: (step) => lineMargins(line(step), withMeasured(step), `${GRID}px`),
      trim: (step) => trim(line(step), withMeasured(step), `${GRID}px`, true),
      padded: (step) => ({
        boxSizing: 'border-box',
        ...paddedLine(line(step), withMeasured(step), `${GRID}px`, { block: `${2 * GRID}px` }),
      }),
      centered: (step) => ({
        display: 'flex',
        height: `${24 * GRID}px`,
        boxSizing: 'border-box',
        ...centeredLine(line(step), withMeasured(step), `${GRID}px`, { height: `${24 * GRID}px` }),
      }),
    };
    const rules = Object.entries(styles)
      .flatMap(([name, build]) => steps.map((step) => css(`.${name}-${step}`, build(step))))
      .join('');
    const tokens = steps
      .map(
        (step, i) =>
          `--font-sizes-${step}:${SIZES[i]}px;--line-heights-${step}:${lineOf(SIZES[i] as number)}px`
      )
      .join(';');
    const body = Object.keys(styles)
      .map(
        (name) =>
          `<div class="stack" id="${name}">${steps.map((step, i) => `<div class="${name}-${step}" style="font-size:var(--font-sizes-${step});line-height:var(--line-heights-${step})"><span><b id="${name}${i}" style="display:inline-block;width:0;height:0"></b>Hamburgefonstiv</span></div><div style="height:20px"></div>`).join('')}</div>`
      )
      .join('');
    const calibrate = stripTypeScriptTypes(
      readFileSync(resolve(import.meta.dirname, '../../src/grid/calibrate.ts'), 'utf8')
    ).replace(/export /g, '');
    const page = await browser.newPage({ viewport: { width: 800, height: 800 } });
    await page.setContent(`<!doctype html><style>
      @font-face{font-family:T;src:url(data:font/woff2;base64,${font}) format("woff2")}
      :root{--asc:${inter.ascent / inter.unitsPerEm};--desc:${Math.abs(inter.descent) / inter.unitsPerEm};--cap:${inter.capHeight / inter.unitsPerEm};${tokens};--fonts-body:T;--fonts-display:T;--fonts-mono:T;--ui-body-adj:1;--ui-display-adj:1;--ui-mono-adj:1}
      body{margin:0;font-family:T}.stack{display:flex;flex-direction:column}${rules}</style><body>${body}</body>`);
    await page.evaluate(() => document.fonts.load('16px T'));
    await page.evaluate(`${calibrate}\nwindow.__measured = calibrateBaselines();`);
    const measured = (await page.evaluate('window.__measured')) as Record<string, string>;
    expect(Object.keys(measured).length).toBe(3 * 11 + 1);
    for (const [name] of Object.entries(styles)) {
      const baselines = await page.evaluate(
        ([group, n]) =>
          Array.from(
            { length: n as number },
            (_, i) =>
              (document.getElementById(`${group}${i}`) as HTMLElement).getBoundingClientRect()
                .bottom + scrollY
          ),
        [name, steps.length] as const
      );
      for (const [i, y] of baselines.entries())
        expect(offGrid(y), `${name} ${steps[i]}`).toBeLessThan(0.1);
    }
    await page.close();
  });
});
