import { activeFaces } from './faces';

/**
 * Vertical metrics of the active set's three faces, from Capsize's published metrics for the Google Fonts files.
 * `display` is for titles, `body` for interface and running text, `mono` for index numerals and data. The type scale
 * feeds them to Capsize to trim text boxes and to match x-heights across faces. Which faces these are is decided in
 * `faces.ts`.
 */
export const fontMetrics = {
  display: activeFaces.display.metrics,
  body: activeFaces.body.metrics,
  mono: activeFaces.mono.metrics,
} as const;
