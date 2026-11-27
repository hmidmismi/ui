import { defineSlotRecipe } from '@pandacss/dev';
import { column, ringed, toneRing } from '../fragments';
import { hoverRow } from '../interaction';
import type { TypeSystem } from '../type-scale';

/**
 * A block set off from the page by a hairline ring. `layout` sets how its content sits: `stack` (a column that grows to
 * the card height), `corners` (the content at the start and an `end` at the bottom corner) or `plate` (a small square
 * with the content at the upper corner and an `end` at the lower one). `tint` fills it with the current hue (`hue` sets
 * `--tone`) and rings it in the hue, softly or fully. `interactive` makes the whole block a control: it takes the hover
 * ground and the hue text turns to the secondary color.
 */
export const card = (t: TypeSystem) => {
  const { textSize, lineMargins } = t;
  return defineSlotRecipe({
    className: 'card',
    staticCss: ['*'],
    slots: ['root', 'start', 'end'],
    base: {
      root: { ...column, ...ringed, color: 'fg.default', textAlign: 'start' },
    },
    defaultVariants: { layout: 'stack' },
    variants: {
      layout: {
        stack: {
          root: { gap: '2', minHeight: 'card', padding: { base: '4', sm: '6' } },
        },
        corners: {
          root: {
            flex: '1',
            justifyContent: 'space-between',
            width: 'full',
            minHeight: { base: 'tileCompact', sm: 'tile' },
            padding: '4',
          },
          end: { display: 'grid', justifyItems: 'end', alignSelf: 'flex-end' },
        },
        plate: {
          root: {
            justifyContent: 'space-between',
            // In a row of varying height the plate stays at the top, on a grid line, instead of being centered between them.
            alignSelf: 'start',
            flexShrink: 0,
            width: { base: 'plateCompact', sm: 'plate' },
            height: { base: 'plateCompact', sm: 'plate' },
            padding: '1',
            color: 'var(--tone)',
            fontFamily: 'body',
            fontVariantNumeric: 'tabular-nums',
            ...textSize('body', 'sm'),
          },
          start: {
            alignSelf: 'flex-start',
            maxWidth: 'full',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: 'semibold',
            ...lineMargins('body', 'sm'),
          },
          end: {
            alignSelf: 'flex-end',
            maxWidth: 'full',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            ...lineMargins('body', 'sm'),
          },
        },
      },
      tint: {
        soft: { root: { ...toneRing(40), toneFill: '10' } },
        full: { root: { ...toneRing(100), toneFill: '10' } },
      },
      interactive: {
        true: {
          root: { cursor: 'pointer', ...hoverRow, '&:hover .text--tone_hue': { color: 'secondary' } },
        },
      },
    } as never,
  });
};
