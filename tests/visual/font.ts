// packages/ui/tests/visual/font.ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** The face the visual tests draw with: one font file shipped with the tests, so the same text is measured on every machine. */
const FACES = [
  ['Regular', 400],
  ['Medium', 500],
  ['SemiBold', 600],
] as const;

/** CSS that loads the test face and sets it as the theme's display and body faces. */
export const testFont = `${FACES.map(
  ([file, weight]) =>
    `@font-face{font-family:"Test Face";font-weight:${weight};src:url(data:font/woff2;base64,${readFileSync(join(import.meta.dirname, 'fonts', `Inter-${file}.woff2`)).toString('base64')}) format("woff2")}`
).join('')}:root{--ui-font-display:"Test Face",sans-serif;--ui-font-body:"Test Face",sans-serif}`;
