import { defineTokens } from '@pandacss/dev';
import { activeFaces, fontStack } from '../faces';

/**
 * Font families, from the active set in `faces.ts`. Each reads the CSS variable that `next/font` sets in the app's root
 * layout, with the family name and a generic family as fallbacks. `sans` and `serif` alias `body` and `display` so
 * Panda utilities such as `fontFamily: 'serif'` use the brand faces.
 */
const DISPLAY = fontStack('display', activeFaces.display);
const BODY = fontStack('body', activeFaces.body);
const MONO = fontStack('mono', activeFaces.mono);

export const fonts = defineTokens.fonts({
  display: { value: DISPLAY },
  body: { value: BODY },
  mono: { value: MONO },
  serif: { value: DISPLAY },
  sans: { value: BODY },
});
