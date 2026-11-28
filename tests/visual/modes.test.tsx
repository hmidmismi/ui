import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Browser } from 'playwright-core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
// @ts-expect-error: a plain script, measured in the page
import { measureText } from '../../src/grid/check/measure.mjs';
import { hasChrome, hasStyles, launch, type Mode, open, ratioStyles, styles } from '../browser/page';
import { defaultGrid } from '../../src/grid/definition';
import { describeStep } from '../../src/style-book/readout';
import { fixture } from './fixture';
import { testFont } from './font';
import { guides } from './guides.mjs';

const run = hasChrome && hasStyles ? describe : describe.skip;

const MODES: Mode[] = ['baseline', 'scaled', 'free'];
const WIDTHS = [320, 390, 600, 768, 900, 1024, 1100, 1279, 1280, 1440, 1600];
const SHOTS = [390, 1440];
const DIR = join(import.meta.dirname, '__screenshots__');

const PAGES = join(import.meta.dirname, 'pages');

let browser: Browser;

/** The fixture in a grid mode at a width, drawn with the test face once it has loaded. */
const openWithFont = async (mode: Mode, width: number) => {
  const page = await open(browser, fixture, testFont, '', mode, width);
  await page.evaluate(() => document.fonts.ready);
  return page;
};
beforeAll(async () => {
  browser = await launch();
});
afterAll(async () => {
  await browser?.close();
});

/** The root font size in px of the page. */
const rootSize = (page: Awaited<ReturnType<typeof open>>) =>
  page.evaluate(() => Number.parseFloat(getComputedStyle(document.documentElement).fontSize));

/** The type scale ratios the report can switch between, besides the default minor third (see `pnpm codegen`). */
const RATIOS = [1.125, 1.25, 1.333, 1.5];

/** Writes one standalone page per grid mode and per ratio, with the guides drawn on it, for the report to show live. */
run('the pages the report shows', () => {
  it('writes a page for each grid mode and ratio', () => {
    mkdirSync(PAGES, { recursive: true });
    const page = (css: string) =>
      `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><style>${testFont}</style></head><body>${fixture}<script>(${guides.toString()})(${defaultGrid.baseline}, ${describeStep.toString()})</script></body></html>`;
    for (const mode of MODES) writeFileSync(join(PAGES, `${mode}.html`), page(styles(mode)));
    for (const ratio of RATIOS) writeFileSync(join(PAGES, `scaled-${ratio}.html`), page(ratioStyles(ratio)));
  });
});

run('the layout in every grid mode', () => {
  for (const mode of MODES) {
    describe(mode, () => {
      it('sets the root size the mode promises at every width', async () => {
        const sizes: number[] = [];
        for (const width of WIDTHS) {
          const page = await openWithFont(mode, width);
          sizes.push(await rootSize(page));
          await page.close();
        }
        if (mode === 'baseline') expect(new Set(sizes)).toEqual(new Set([16]));
        else {
          // Never under the reader's 16px, never over the scale (18px), and never shrinking as the window grows.
          for (const size of sizes) {
            expect(size).toBeGreaterThanOrEqual(16);
            expect(size).toBeLessThanOrEqual(19.2 + 0.001);
          }
          expect([...sizes].sort((a, b) => a - b)).toEqual(sizes);
          if (mode === 'free') expect(sizes.at(-1)).toBeCloseTo(18, 1);
          // `scaled` moves in whole-pixel baselines: 16px or 19.2px.
          if (mode === 'scaled') for (const size of sizes) expect([16, 19.2]).toContain(Math.round(size * 10) / 10);
        }
      });

      for (const width of WIDTHS) {
        it(`has no horizontal overflow and a masthead that never collides at ${width}px`, async () => {
          const page = await openWithFont(mode, width);
          const result = await page.evaluate((viewport) => {
            const masthead = document.querySelector('[data-fixture="masthead"] header') as HTMLElement;
            const shown = (element: Element | null): element is HTMLElement =>
              element instanceof HTMLElement && getComputedStyle(element).display !== 'none';
            /** The box that holds what an element shows: the union of its visible children, or the element itself. */
            const content = (element: HTMLElement) => {
              const kids = [...element.children].filter(shown).filter((kid) => kid.getBoundingClientRect().width > 0);
              const boxes = (kids.length ? kids : [element]).map((kid) => kid.getBoundingClientRect());
              return { left: Math.min(...boxes.map((b) => b.left)), right: Math.max(...boxes.map((b) => b.right)) };
            };
            const parts = [
              ['menu', masthead.querySelector('details')],
              ['start', masthead.querySelector('[class*="start"]')],
              ['wordmark', masthead.querySelector('a[class*="wordmark"]')],
              ['end', masthead.querySelector('[class*="end"]')],
            ] as const;
            const boxes = parts
              .filter(([, element]) => shown(element))
              .map(([name, element]) => ({ name, ...content(element as HTMLElement) }))
              .sort((a, b) => a.left - b.left);
            const collisions = boxes.flatMap((box, index) => {
              const before = boxes[index - 1];
              return before && before.right > box.left ? [`${before.name} runs into ${box.name}`] : [];
            });
            const outside = boxes.filter((box) => box.left < -0.5 || box.right > viewport + 0.5).map((box) => `${box.name} leaves the screen`);
            const nav = masthead.querySelector('nav');
            const navBox = shown(nav) ? content(nav) : null;
            if (navBox && (navBox.left < -0.5 || navBox.right > viewport + 0.5)) outside.push('tabs leave the screen');
            return {
              overflow: document.documentElement.scrollWidth - viewport,
              problems: [...collisions, ...outside],
              wordmark: masthead.querySelector('a[class*="wordmark"]')?.textContent,
            };
          }, width);
          await page.close();
          expect(result.problems, `${result.wordmark}`).toEqual([]);
          expect(result.overflow).toBeLessThanOrEqual(0);
        });
      }

      for (const width of SHOTS) {
        it(`draws the same page at ${width}px as the saved screenshot`, async () => {
          const page = await openWithFont(mode, width);
          await page.waitForTimeout(300);
          const shot = await page.screenshot({ fullPage: true, animations: 'disabled' });
          await page.close();
          const file = join(DIR, `${mode}-${width}.png`);
          if (process.env.UPDATE_VISUAL || !existsSync(file)) {
            mkdirSync(DIR, { recursive: true });
            writeFileSync(file, shot);
            return;
          }
          expect(shot.equals(readFileSync(file)), `${file} differs; run UPDATE_VISUAL=1 pnpm test:visual if the change is meant`).toBe(true);
        });
      }
    });
  }
});

/** A reader who has raised their browser's default size keeps at least that size: the grid rounding never takes the root under it. */
run('the root and the reader\'s own default size', () => {
  for (const defaultSize of [16, 20, 24]) {
    it(`is never under a ${defaultSize}px default, and never over 1.2 times it`, async () => {
      const reader = await launch([`--blink-settings=defaultFontSize=${defaultSize}`]);
      try {
        for (const width of [360, 768, 1440]) {
          const page = await open(reader, fixture, testFont, '', 'scaled', width);
          const size = await rootSize(page);
          await page.close();
          expect(size, `${width}px`).toBeGreaterThanOrEqual(defaultSize - 0.001);
          expect(size, `${width}px`).toBeLessThanOrEqual(defaultSize * 1.2 + 0.001);
        }
      } finally {
        await reader.close();
      }
    });
  }
});

/**
 * The strict modes hold text to the baseline grid within a tolerance. The page here is the style book, which is mostly
 * text, drawn with the embedded test face; the counts are how many lines are further than a pixel and a half from a grid line,
 * and a change must not add to them (the budgets are what it measured, with the embedded test face). The free mode has no grid to hold.
 */
const BUDGET: Record<'baseline' | 'scaled', Record<number, number>> = {
  baseline: { 390: 0, 1440: 0 },
  // The one line is the fixture's own bare "Night" button in the masthead, which is not a ui button.
  scaled: { 390: 0, 1440: 1 },
};

run('the baseline in the strict modes', () => {
  for (const mode of ['baseline', 'scaled'] as const) {
    for (const width of SHOTS) {
      it(`keeps ${mode} text on the grid within budget at ${width}px`, async () => {
        const page = await openWithFont(mode, width);
        const root = await rootSize(page);
        // The viewport height is a multiple of the grid row, as `scaled` rounds a full-screen block to one.
        const rows = await page.evaluate(measureText, { grid: (defaultGrid.baseline * root) / 16, tolerance: 1.5 });
        await page.close();
        const off = rows.filter((row: { bad: boolean }) => row.bad).length;
        expect(off).toBeLessThanOrEqual(BUDGET[mode][width] ?? 0);
      });
    }
  }
});
