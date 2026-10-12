import { precomputeValues } from '@capsizecss/core';
import type { Browser } from 'playwright-core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { baikikai } from '../../src/brand';
import { design } from '../../src/design';
import { stepLineHeight, stepSize } from '../../src/preset/type-scale';
import { neutral, type Role, type Theme, toCss, xHeightAdjust } from '../../src/theme';
import { label, numeral, text, title } from '../../styled-system/recipes';
import { hasChrome, hasStyles, launch, open } from './page';

const run = hasChrome && hasStyles ? describe : describe.skip;

type Case = { name: string; cls: string; role: Role; step: Parameters<typeof stepSize>[0] };

const cases: Case[] = [
  ...([1, 2, 3, 4, 5, 6] as const).map((level, i) => ({
    name: `title ${level}`,
    cls: title({ level: String(level) as '1' }),
    role: 'display' as const,
    step: (['5xl', '4xl', '3xl', '2xl', 'xl', 'lg'] as const)[i] as Case['step'],
  })),
  { name: 'text body', cls: text({ variant: 'body' }), role: 'body', step: 'md' },
  { name: 'text small', cls: text({ variant: 'small' }), role: 'body', step: 'sm' },
  { name: 'text caption', cls: text({ variant: 'caption' }), role: 'body', step: 'xs' },
  { name: 'label', cls: label(), role: 'body', step: 'xs' },
  { name: 'numeral', cls: numeral(), role: 'display', step: 'sm' },
];

/** What Capsize says the box should be for a theme's face at a step. */
function expected(theme: Theme, c: Case) {
  const metrics = theme.faces[c.role].metrics;
  const adjust = xHeightAdjust(theme.faces.body.metrics, metrics);
  const fontSize = stepSize(c.step) * adjust;
  const leading = stepLineHeight(c.step);
  const v = precomputeValues({ fontSize, leading, fontMetrics: metrics });
  return {
    fontSize,
    leading,
    before: Number.parseFloat(v.capHeightTrim) * fontSize,
    after: Number.parseFloat(v.baselineTrim) * fontSize,
  };
}

async function measure(browser: Browser, theme: Theme | null) {
  const body = cases.map((c, i) => `<div id="e${i}" class="x">Hamburgefonstiv</div>`).join('');
  const page = await open(browser, body, theme ? toCss(theme) : '');
  const out = await page.evaluate((classes) => {
    return classes.map((cls, i) => {
      const el = document.getElementById(`e${i}`) as HTMLElement;
      el.className = cls;
      const cs = getComputedStyle(el);
      return {
        fontSize: Number.parseFloat(cs.fontSize),
        lineHeight: Number.parseFloat(cs.lineHeight),
        before: Number.parseFloat(getComputedStyle(el, '::before').marginBottom),
        after: Number.parseFloat(getComputedStyle(el, '::after').marginTop),
      };
    });
  }, cases.map((c) => c.cls));
  await page.close();
  return out;
}

run('type system in a browser', () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launch();
  });
  afterAll(async () => {
    await browser?.close();
  });

  it('puts every line height on the baseline', async () => {
    const rows = await measure(browser, null);
    for (const [i, row] of rows.entries()) {
      expect(row.lineHeight % design.grid.baseline, cases[i]?.name).toBe(0);
    }
  });

  // The stylesheet is built with the Baikikai theme; the others are loaded after it, as a project would, with no rebuild.
  const themes: [string, Theme | null][] = [
    ['the built-in theme', null],
    ['a neutral theme loaded at runtime', neutral],
  ];
  for (const [label_, theme] of themes) {
    it(`sizes and trims every role to Capsize's numbers with ${label_}`, async () => {
      const used = theme ?? baikikai;
      const rows = await measure(browser, theme);
      for (const [i, row] of rows.entries()) {
        const c = cases[i] as Case;
        const want = expected(used, c);
        expect(row.fontSize, `${c.name} size`).toBeCloseTo(want.fontSize, 1);
        expect(row.lineHeight, `${c.name} line height`).toBeCloseTo(want.leading, 1);
        expect(row.before, `${c.name} top trim`).toBeCloseTo(want.before, 1);
        expect(row.after, `${c.name} bottom trim`).toBeCloseTo(want.after, 1);
      }
    });
  }
});

run('fonts in a browser', () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launch();
  });
  afterAll(async () => {
    await browser?.close();
  });

  it('falls back to the theme family when the app sets no font variable', async () => {
    const page = await open(browser, '<p id="p">x</p>', toCss(neutral));
    const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    await page.close();
    expect(family).toContain('Inter');
  });
});
