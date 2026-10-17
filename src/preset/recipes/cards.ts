import { defineSlotRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';
import { boxed, column } from '../fragments';

/**
 * A feature card: a bordered block with a label, a display title, a blurb, a counts line and a link at the bottom. With
 * a hue (`hue` recipe sets `--tone`) the border, the 10% tint and the label take the label's color.
 */
export const featureCard = (t: TypeSystem) => {
  const textSize = t.textSize;
  const microLabel = t.microLabel;
  return defineSlotRecipe({
  className: 'feature-card',
  staticCss: ['*'],
  slots: ['root', 'label', 'title', 'text', 'meta', 'link'],
  base: {
    root: {
      ...boxed,
      ...column,
      gap: '2',
      minHeight: 'card',
      padding: { base: '4', sm: '6' },
    },
    label: { ...microLabel },
    title: {
      color: 'fg.default',
      fontFamily: 'display',
      fontWeight: 'medium',
      letterSpacing: 'card',
      ...responsive(textSize('display', '2xl'), textSize('display', '4xl'), 'sm'),
    },
    text: { color: 'fg.muted', ...textSize('body', 'md') },
    meta: { color: 'fg.muted', ...textSize('body', 'md') },
    link: {
      alignSelf: 'flex-start',
      marginBlockStart: 'auto',
      color: 'accent',
      borderBlockEndWidth: 'hairline',
      borderBlockEndStyle: 'solid',
      borderBlockEndColor: 'accent',
      ...textSize('body', 'md'),
    },
  },
  variants: {
    tinted: {
      true: {
        root: {
          borderColor: 'var(--tone)',
          toneFill: '10',
        },
        label: { color: 'var(--tone)' },
      },
    },
  },
});
};

/**
 * A label tile: a tinted button with a 4px top edge in the label's color, the name over a small line at the top, and the
 * release count in the display face at the bottom right. It reads its hue from `hue`.
 */
export const tile = (t: TypeSystem) => {
  const textSize = t.textSize;
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
      borderWidth: 'hairline',
      borderStyle: 'solid',
      toneEdge: '40',
      borderBlockStartWidth: 'edge',
      borderBlockStartColor: 'var(--tone)',
      toneFill: '10',
      transitionProperty: 'background-color',
      transitionDuration: 'fast',
      _hover: { toneFill: '20' },
    },
    name: {
      display: 'block',
      fontFamily: 'display',
      fontWeight: 'medium',
      ...textSize('display', 'xl'),
    },
    note: {
      display: 'block',
      marginBlockStart: '1',
      color: 'fg.muted',
      ...textSize('body', 'sm'),
    },
    figure: {
      alignSelf: 'flex-end',
      color: 'var(--tone)',
      fontFamily: 'display',
      fontVariantNumeric: 'tabular-nums',
      ...textSize('display', '4xl'),
    },
  },
});
};
