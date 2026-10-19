import type { SystemStyleObject } from '@pandacss/dev';
import { createRules } from '../grid';

/**
 * Style fragments used by more than one recipe. A fragment is spread into a recipe (`...ruleBelow`), so a repeated look
 * is defined once. Browser defaults (margin, padding, list markers, border style, link color) are removed by Panda's
 * preflight, so recipes never reset them. Text fragments are on the type system (`type-scale.ts`), state fragments are
 * in `interaction.ts`.
 */

/** A column of children: the base of most block recipes. Set `gap` beside it. */
export const column: SystemStyleObject = { display: 'flex', flexDirection: 'column' };

const rules = createRules({
  hairline: 'token(borderWidths.hairline)',
  border: 'token(colors.border)',
  edge: 'token(borderWidths.edge)',
});

/** Hairline rules and outlines drawn as inset shadows, so they take no height (see `../grid`). */
export const ruleAbove = rules.ruleAbove as SystemStyleObject;
export const ruleBelow = rules.ruleBelow as SystemStyleObject;
export const ruleBoth = rules.ruleBoth as SystemStyleObject;
export const ringed = rules.ringed as SystemStyleObject;
export const ruleNone = rules.ruleNone as SystemStyleObject;
export const ruleBelowOf = (color: string) =>
  rules.ruleBelowOf(`token(colors.${color})`) as SystemStyleObject;
export const toneRing = (percent: number, edge?: 'top' | 'left') =>
  rules.toneRing(percent, edge) as SystemStyleObject;

/** A hairline box: the border of a field, a chip, a button or a card. Set the color where it differs. */
export const boxed: SystemStyleObject = {
  borderWidth: 'hairline',
  borderStyle: 'solid',
  borderColor: 'border',
};

/** Hides the scrollbar of a scrolling row or list. */
export const hideScrollbar: SystemStyleObject = {
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
};

/** A row that scrolls sideways instead of wrapping, with the scrollbar hidden. Children set `flexShrink: 0`. */
export const scrollRow: SystemStyleObject = {
  display: 'flex',
  flexWrap: 'nowrap',
  minWidth: '0',
  overflowX: 'auto',
  overscrollBehaviorX: 'contain',
  touchAction: 'pan-x',
  ...hideScrollbar,
};

/**
 * Where a sticky element under the header sticks: below the bar (`--bh`, measured at runtime) and below the utility row
 * while it is shown (`--ut`, set on `<html>` by the header when the reader scrolls up).
 */
export const belowHeader = 'calc(var(--bh, token(sizes.bar)) + var(--ut, 0px))';

/** Sticks an element under the header and moves it with the utility row as that row slides in and out. */
export const stickBelowHeader: SystemStyleObject = {
  position: 'sticky',
  top: belowHeader,
  transitionProperty: 'top',
  transitionDuration: 'slower',
  transitionTimingFunction: 'in-out',
};

/** Keeps a jump target clear of the sticky header and jump bar (`--bh` and `--jh` are measured at runtime). */
export const anchorOffset: SystemStyleObject = {
  scrollMarginBlockStart:
    'calc(var(--bh, token(sizes.bar)) + var(--jh, token(sizes.14)) + token(spacing.2))',
};

/**
 * The side inset of the content column: one gutter on phones, a wider one from 600px and from 1024px, and on wide
 * screens the extra space that centers a column as wide as `sizes.site`. Full-width bars (the utility row, the header)
 * use it so their content lines up with the page. It sets `--inset` for children that need the same measure.
 */
export const siteInset: SystemStyleObject = {
  '--inset': { base: 'token(spacing.4)', sm: 'token(spacing.6)', md: 'token(spacing.8)' },
  paddingInline: 'max(var(--inset), calc((100% - token(sizes.site)) / 2 + var(--inset)))',
};
