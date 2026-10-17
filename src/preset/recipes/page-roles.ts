import { defineRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';

/**
 * Text roles: one config recipe per kind of text a page sets. Each recipe holds the whole look of its role (face,
 * step, weight, case, tracking, color), so a role is defined in exactly one place. Size, line height and the Capsize
 * trim come from `type.ts`, so every role sits on the same scale and baseline.
 *
 * The `trim` variant removes the space above the capital letters and below the baseline. It is on by default and is
 * turned off when the role renders an inline element (`span`, `strong`), because the trim needs a block box. The
 * variants are listed with `staticCss`, so components may pass them from props. Components pick a role by calling the
 * generated recipe function; they never set type properties themselves.
 */

/** The label that opens a section: small, uppercase, tracked, accent colored. */
export const eyebrow = (t: TypeSystem) => {
  const textTrim = t.textTrim;
  const labelCaps = t.caps('sm', 'normal');
  return defineRecipe({
  className: 'eyebrow',
  staticCss: ['*'],
  base: { color: 'accent', ...labelCaps },
  defaultVariants: { trim: true },
  variants: { trim: { true: textTrim('body', 'sm') } },
});
};

/** A person's or group's name set as a heading: uppercase sans with light tracking. */
export const personName = (t: TypeSystem) => {
  const textSize = t.textSize;
  const textTrim = t.textTrim;
  return defineRecipe({
  className: 'person-name',
  staticCss: ['*'],
  base: {
    color: 'accent',
    fontFamily: 'body',
    fontWeight: 'semibold',
    letterSpacing: 'name',
    textTransform: 'uppercase',
    ...textSize('body', 'sm'),
  },
  defaultVariants: { trim: true },
  variants: { trim: { true: textTrim('body', 'sm') } },
});
};

/** A term: credit headings, instrument and role names, metadata labels. Small, semibold, muted. */
export const term = (t: TypeSystem) => {
  const textSize = t.textSize;
  const textTrim = t.textTrim;
  return defineRecipe({
  className: 'term',
  staticCss: ['*'],
  base: {
    color: 'fg.muted',
    fontFamily: 'body',
    fontWeight: 'semibold',
    ...textSize('body', 'sm'),
  },
  defaultVariants: { trim: true },
  variants: { trim: { true: textTrim('body', 'sm') } },
});
};

/** The title of an item in a list, such as an article or a timeline year. Set in the heading face. */
export const entry = (t: TypeSystem) => {
  const textSize = t.textSize;
  const textTrim = t.textTrim;
  return defineRecipe({
  className: 'entry',
  staticCss: ['*'],
  base: { fontFamily: 'display', fontWeight: 'normal', ...textSize('display', 'lg') },
  defaultVariants: { trim: true },
  variants: {
    block: { true: { display: 'block' } },
    trim: { true: textTrim('display', 'lg') },
  },
});
};

/** Running text: biographies and descriptions. Serif by default, with a sans face at body size. */
export const prose = (t: TypeSystem) => {
  const textSize = t.textSize;
  const textTrim = t.textTrim;
  return defineRecipe({
  className: 'prose',
  staticCss: ['*'],
  base: {},
  defaultVariants: { face: 'serif', trim: true },
  variants: {
    face: {
      serif: { fontFamily: 'serif', ...textSize('display', 'lg') },
      sans: { fontFamily: 'body', ...textSize('body', 'md') },
    },
    trim: { true: {} },
  },
  compoundVariants: [
    { face: 'serif', trim: true, css: textTrim('display', 'lg') },
    { face: 'sans', trim: true, css: textTrim('body', 'md') },
  ],
});
};

/** A content value in the interface face at body size. */
export const value = (t: TypeSystem) => {
  const textSize = t.textSize;
  const textTrim = t.textTrim;
  return defineRecipe({
  className: 'value',
  staticCss: ['*'],
  base: { fontFamily: 'body', ...textSize('body', 'md') },
  defaultVariants: { trim: true },
  variants: { trim: { true: textTrim('body', 'md') } },
});
};

/** Secondary text: dates, captions, credits under media, notes. Small and muted. */
export const caption = (t: TypeSystem) => {
  const textSize = t.textSize;
  const textTrim = t.textTrim;
  return defineRecipe({
  className: 'caption',
  staticCss: ['*'],
  base: { color: 'fg.muted', fontFamily: 'body', ...textSize('body', 'sm') },
  defaultVariants: { trim: true },
  variants: { trim: { true: textTrim('body', 'sm') } },
});
};

/** A count beside a label, such as the number on a header tab: small, tabular figures in the warm color. */
export const count = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineRecipe({
  className: 'count',
  base: {
    color: 'secondary',
    fontFamily: 'body',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
    ...textSize('body', 'sm'),
  },
});
};

/** The masthead sentence on the home page: display face, 24/32, weight 500, at most 52 characters wide. */
export const tagline = (t: TypeSystem) => {
  const textRole = t.textRole;
  return defineRecipe({
  className: 'tagline',
  base: {
    maxWidth: '52ch',
    paddingBlockStart: { base: '8', sm: '16' },
    color: 'fg.default',
    fontFamily: 'display',
    fontWeight: 'medium',
    letterSpacing: 'tagline',
    ...textRole('display', '2xl'),
  },
});
};

/** The small muted label over a field, a filter group or a list column. `spaced` adds the gap before what it labels. */
export const fieldLabel = (t: TypeSystem) => {
  const microLabel = t.microLabel;
  return defineRecipe({
  className: 'field-label',
  staticCss: ['*'],
  base: { ...microLabel },
  variants: { spaced: { true: { display: 'block', marginBlockEnd: '4' } } },
});
};

/** A short message where content would be, such as "No matches": muted, with room above and below. */
export const notice = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineRecipe({
  className: 'notice',
  base: { paddingBlock: '8', color: 'fg.muted', ...textSize('body', 'lg') },
});
};
