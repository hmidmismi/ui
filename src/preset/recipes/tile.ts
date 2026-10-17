import { defineRecipe, defineSlotRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';

/** The hue numbers `1` to `8`. */
const HUES = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

/**
 * Sets a hue for everything inside the element: it defines `--tone`, which `tile`, `plate` and
 * `card` read. Apply it to the element itself or to a wrapper. The hue numbers are the `hue` colors in
 * `theme/colors/hues.ts`.
 */
export const hue = defineRecipe({
  className: 'hue',
  staticCss: ['*'],
  variants: {
    hue: Object.fromEntries(
      HUES.map((hue) => [hue, { '--tone': `token(colors.categorical.${hue})` }])
    ),
  },
});

/**
 * A plate: a square in the hue, tinted, with the label's short name at the upper left and the catalog number at the
 * lower right, both small and in the body face in the hue's color. It is 64px square, 56px on phones.
 */
export const plate = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineSlotRecipe({
    className: 'plate',
    slots: ['root', 'name', 'number'],
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        width: { base: 'plateCompact', sm: 'plate' },
        height: { base: 'plateCompact', sm: 'plate' },
        padding: '1',
        borderWidth: 'hairline',
        borderStyle: 'solid',
        toneEdge: '40',
        toneFill: '10',
        color: 'var(--tone)',
        fontFamily: 'body',
        fontVariantNumeric: 'tabular-nums',
        ...textSize('body', 'sm'),
      },
      name: {
        alignSelf: 'flex-start',
        maxWidth: 'full',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontWeight: 'semibold',
      },
      number: {
        alignSelf: 'flex-end',
        maxWidth: 'full',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
  });
};

/** A scrolling list with a fixed maximum height: the track drawer and the instrument list. */
export const scrollList = defineRecipe({
  className: 'scroll-list',
  base: {
    maxHeight: 'scrollList',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    scrollbarWidth: 'thin',
  },
});
