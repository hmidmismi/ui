import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { type Browser, chromium, type Page } from 'playwright-core';

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/** Whether a Chrome is available. The browser tests skip when it is not. */
export const hasChrome = existsSync(CHROME);

/** The grid modes the stylesheet is built for (see `panda.config.ts`). */
export type Mode = 'baseline' | 'scaled' | 'free';

const stylesPath = (mode: Mode) => resolve(import.meta.dirname, `../../styled-system/styles.${mode}.css`);

/** Whether the generated stylesheet exists (run `pnpm codegen` first). */
export const hasStyles = existsSync(stylesPath('baseline'));

/** The generated stylesheet text for a grid mode: the strict `baseline` unless a test asks for another. */
export const styles = (mode: Mode = 'baseline') => readFileSync(stylesPath(mode), 'utf8');

export function launch(): Promise<Browser> {
  return chromium.launch({ executablePath: CHROME, headless: true });
}

/**
 * Opens a blank page with the generated stylesheet and some body markup.
 *
 * @param browser - the browser.
 * @param body - the markup for `<body>`.
 * @param extraCss - CSS added after the stylesheet, such as a theme.
 * @param htmlClass - classes for `<html>`, such as `dark`.
 * @param mode - the grid mode of the stylesheet. Defaults to `baseline`.
 * @param width - the viewport width in px.
 * @returns the page.
 */
export async function open(
  browser: Browser,
  body: string,
  extraCss = '',
  htmlClass = '',
  mode: Mode = 'baseline',
  width = 1000
): Promise<Page> {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.setContent(
    `<!doctype html><html class="${htmlClass}"><head><style>${styles(mode)}</style><style>${extraCss}</style></head><body>${body}</body></html>`
  );
  return page;
}
