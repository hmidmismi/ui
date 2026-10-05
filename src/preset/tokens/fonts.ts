import { defineTokens } from '@pandacss/dev';

/**
 * Font families. Each reads the CSS variable that `next/font` sets in the app's root layout, with the Google family
 * name and a generic family as fallbacks. `sans` and `serif` alias `body` and `display` so Panda utilities such as
 * `fontFamily: 'serif'` use the brand faces.
 */
const DISPLAY = 'var(--font-display), "Shippori Mincho", serif';
const BODY = 'var(--font-body), "Zen Kaku Gothic New", sans-serif';
const MONO = 'var(--font-mono), "IBM Plex Mono", monospace';

export const fonts = defineTokens.fonts({
  display: { value: DISPLAY },
  body: { value: BODY },
  mono: { value: MONO },
  serif: { value: DISPLAY },
  sans: { value: BODY },
});
