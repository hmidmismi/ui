import { defineSlotRecipe } from '@pandacss/dev';
import { column, ringed, ruleBelowOf, toneRing } from '../fragments';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';

/**
 * A feature card: a bordered block with a label, a display title, a blurb, a counts line and a link at the bottom. With
 * a hue (`hue` recipe sets `--tone`) the border, the 10% tint and the label take the hue.
 */
export const featureCard = (t: TypeSystem) => {
  const { textLine, microLabelLine } = t;
  return defineSlotRecipe({
    className: 'feature-card',
    staticCss: ['*'],
    slots: ['root', 'label', 'title', 'text', 'meta', 'link'],
    base: {
      root: {
        ...ringed,
        ...column,
        gap: '2',
        minHeight: 'card',
        padding: { base: '4', sm: '6' },
      },
      label: { ...microLabelLine },
      title: {
        color: 'fg.default',
        fontFamily: 'display',
        fontWeight: 'medium',
        letterSpacing: 'card',
        ...responsive(textLine('display', '2xl'), textLine('display', '4xl'), 'sm'),
      },
      text: { color: 'fg.muted', ...textLine('body', 'md') },
      meta: { color: 'fg.muted', ...textLine('body', 'md') },
      link: {
        alignSelf: 'flex-start',
        marginBlockStart: 'auto',
        color: 'accent',
        ...ruleBelowOf('accent'),
        ...textLine('body', 'md'),
      },
    },
    variants: {
      tinted: {
        true: {
          root: {
            ...toneRing(100),
            toneFill: '10',
          },
          label: { color: 'var(--tone)' },
        },
      },
    },
  });
};

/**
 * A count tile: a tinted button with a 4px top edge in the hue, the name over a small line at the top, and the
 * count in the display face at the bottom right. It reads its hue from `hue`.
 */
export const tile = (t: TypeSystem) => {
  const textLine = t.textLine;
  return defineSlotRecipe({
    className: 'tile',
    slots: ['root', 'name', 'note', 'figure'],
    base: {
      root: {
        ...column,
        flex: '1',
        justifyContent: 'space-between',
        width: 'full',
        minHeight: { base: 'tileCompact', sm: 'tile' },
        padding: '4',
        color: 'fg.default',
        textAlign: 'start',
        cursor: 'pointer',
        ...toneRing(40, 'top'),
        toneFill: '10',
        transitionProperty: 'background-color',
        transitionDuration: 'fast',
        _hover: { toneFill: '20' },
      },
      name: {
        display: 'block',
        fontFamily: 'display',
        fontWeight: 'medium',
        ...textLine('display', 'xl'),
      },
      note: {
        display: 'block',
        marginBlockStart: '1',
        color: 'fg.muted',
        ...textLine('body', 'sm'),
      },
      figure: {
        alignSelf: 'flex-end',
        color: 'var(--tone)',
        fontFamily: 'display',
        fontVariantNumeric: 'tabular-nums',
        ...textLine('display', '4xl'),
      },
    },
  });
};
