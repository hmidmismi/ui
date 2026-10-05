import ibmPlexMono from '@capsizecss/metrics/iBMPlexMono';
import shipporiMincho from '@capsizecss/metrics/shipporiMincho';
import zenKakuGothicNew from '@capsizecss/metrics/zenKakuGothicNew';

/**
 * Vertical metrics of the three faces, from Capsize's published metrics for the Google Fonts files. `display` is
 * Shippori Mincho (titles), `body` is Zen Kaku Gothic New (interface and running text), `mono` is IBM Plex Mono (index
 * numerals and data). The type scale feeds them to Capsize to trim text boxes and to match x-heights across faces.
 */
export const fontMetrics = {
  display: shipporiMincho,
  body: zenKakuGothicNew,
  mono: ibmPlexMono,
} as const;
