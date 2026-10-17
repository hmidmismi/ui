import { defineSlotRecipe, defineRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';
import { anchorOffset, column, ruleAbove } from '../fragments';

/** The fill, text color and heading color of a toned section, from one tint. */
const toned = (tone: 'sand' | 'green' | 'blue' | 'salmon') => ({
  root: {
    paddingInline: '8',
    borderBlockStartWidth: '0',
    background: `wash.${tone}.bg`,
    color: `wash.${tone}.fg`,
  },
  label: { color: `wash.${tone}.label` },
});

/**
 * A page section: a hairline above, 32px of padding, and 48px of space before it. Its header row holds the label (small,
 * uppercase, muted) with an optional count in the warm color, and an optional action link at the end. A tone fills the
 * section with a tint and drops the rule. `space="loose"` pads 64px; `full` runs it past the page gutters; `nested` is a
 * subsection inside a group, with no rule; `compact` is a results group, with 32px before it instead of 48px.
 */
export const section = (t: TypeSystem) => {
  const microLabel = t.microLabel;
  return defineSlotRecipe({
  className: 'section',
  staticCss: ['*'],
  slots: ['root', 'header', 'label', 'action'],
  base: {
    root: {
      ...column,
      paddingBlockStart: '8',
      paddingBlockEnd: '0',
      marginBlockStart: '12',
      ...ruleAbove,
      ...anchorOffset,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '4',
      marginBlockEnd: '4',
    },
    label: {
      ...microLabel,
      fontWeight: 'semibold',
      display: 'flex',
      alignItems: 'baseline',
      gap: '2',
    },
    action: {
      color: 'fg.default',
      textDecoration: 'underline',
      textUnderlineOffset: 'token(borderWidths.bar)',
      transitionProperty: 'color',
      transitionDuration: 'fast',
      _hover: { color: 'accent' },
    },
  },
  variants: {
    tone: {
      plain: {},
      sand: toned('sand'),
      green: toned('green'),
      blue: toned('blue'),
      salmon: toned('salmon'),
    },
    space: {
      normal: {},
      loose: { root: { paddingBlock: '16' } },
    },
    full: {
      true: { root: { marginInline: '-4' } },
    },
    nested: {
      true: {
        root: { borderBlockStartWidth: '0', marginBlockStart: '0', scrollMarginBlockStart: '0' },
      },
    },
    lead: {
      true: {
        root: {
          borderBlockStartWidth: '0',
          marginBlockStart: '2',
          paddingBlockStart: '0',
        },
      },
    },
    compact: {
      true: { root: { marginBlockStart: { base: '6', sm: '8' } } },
    },
  },
  defaultVariants: { tone: 'plain', space: 'normal' },
});
};

/** A group of subsections under one ruled heading, such as Media and Research. */
export const sectionGroup = defineRecipe({
  className: 'section-group',
  base: { ...column, paddingBlockStart: '8', ...ruleAbove, ...anchorOffset },
});
