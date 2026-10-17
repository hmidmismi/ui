import { defineRecipe } from '@pandacss/dev';
import { responsive, type TypeSystem } from '../type-scale';

/**
 * Text roles: one recipe per kind of text a page sets. Each holds the whole look of its role (face, step, weight,
 * case, tracking, color). Size, line height and the Capsize trim come from `type-scale.ts`, so every role sits on the
 * same scale and baseline.
 *
 * The `trim` variant removes the space above the capitals and below the baseline. It is on by default and turned off
 * when a role renders an inline element, because the trim needs a block box.
 */

/** The heading levels, in order. */
const LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

/**
 * The text-role recipes for a type system.
 *
 * @param t - the type system (a design's sizes, trim and headings).
 * @returns `title`, `text`, `label` and `numeral`.
 */
export function createRoles({ textRole, textSize, textTrim, labelCaps, headings }: TypeSystem) {
  /**
   * A heading in the display face. `level` picks one of the design's heading styles: its size (and the larger size
   * from `md` up), weight, tracking, case and color. Titles are block elements, so the trim is always on.
   */
  const title = defineRecipe({
    className: 'title',
    jsx: ['Title'],
    staticCss: ['*'],
    base: { fontFamily: 'display', textWrap: 'balance', color: 'fg.default' },
    defaultVariants: { level: 'h1' },
    variants: {
      level: Object.fromEntries(
        LEVELS.map((level) => {
          const { step, wide, weight, tracking, uppercase, color } = headings[level];
          const to = wide ?? step;
          return [
            level,
            {
              ...responsive(textRole('display', step), textRole('display', to)),
              fontWeight: weight ?? 'normal',
              ...(tracking ? { letterSpacing: tracking } : {}),
              ...(uppercase ? { textTransform: 'uppercase' } : {}),
              ...(color ? { color } : {}),
            },
          ];
        })
      ),
    },
  });

  /** Running text and interface copy in the body face. */
  const text = defineRecipe({
    className: 'text',
    staticCss: ['*'],
    base: { fontFamily: 'body', color: 'fg.default' },
    defaultVariants: { variant: 'body', trim: true },
    variants: {
      variant: {
        body: textSize('body', 'md'),
        small: textSize('body', 'sm'),
        caption: { ...textSize('body', 'xs'), color: 'fg.muted' },
      },
      trim: { true: {} },
    },
    compoundVariants: [
      { variant: 'body', trim: true, css: textTrim('body', 'md') },
      { variant: 'small', trim: true, css: textTrim('body', 'sm') },
      { variant: 'caption', trim: true, css: textTrim('body', 'xs') },
    ],
  });

  /** The small uppercase tracked label that opens a section or names a field. */
  const label = defineRecipe({
    className: 'label',
    staticCss: ['*'],
    base: { color: 'fg.muted', ...labelCaps },
    defaultVariants: { trim: true },
    variants: { trim: { true: textTrim('body', 'xs') } },
  });

  /** An index numeral, such as a Roman numeral: display face, tracked, muted. */
  const numeral = defineRecipe({
    className: 'numeral',
    staticCss: ['*'],
    base: {
      color: 'fg.muted',
      fontFamily: 'display',
      fontWeight: 'normal',
      letterSpacing: 'numeral',
      ...textSize('display', 'sm'),
    },
    defaultVariants: { trim: true },
    variants: { trim: { true: textTrim('display', 'sm') } },
  });

  return { title, text, label, numeral };
}
