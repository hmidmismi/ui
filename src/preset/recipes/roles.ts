import { defineRecipe } from '@pandacss/dev';
import type { StepName, TypeSystem } from '../type-scale';

/**
 * Text roles: one recipe per kind of text a page sets. Each holds the whole look of its role (face, step, weight,
 * case, tracking, color). Size, line height and the Capsize trim come from `type-scale.ts`, so every role sits on the
 * same scale and baseline.
 *
 * The `trim` variant removes the space above the capitals and below the baseline. It is on by default and turned off
 * when a role renders an inline element, because the trim needs a block box.
 */

const TITLE_STEPS = {
  1: '5xl',
  2: '4xl',
  3: '3xl',
  4: '2xl',
  5: 'xl',
  6: 'lg',
} as const satisfies Record<number, StepName>;

type TitleLevel = keyof typeof TITLE_STEPS;

const titleLevels = (textSize: TypeSystem['textSize']) =>
  Object.fromEntries(
    (Object.keys(TITLE_STEPS) as unknown as TitleLevel[]).map((level) => [
      level,
      textSize('display', TITLE_STEPS[level]),
    ])
  );

/**
 * The text-role recipes for a type system.
 *
 * @param t - the type system (a design's sizes and trim).
 * @returns `title`, `text`, `label` and `numeral`.
 */
export function createRoles({ textSize, textTrim, labelCaps }: TypeSystem) {
  /** A heading in the display face. `level` picks the step: 1 is the largest. */
  const title = defineRecipe({
    className: 'title',
    staticCss: ['*'],
    base: { fontFamily: 'display', fontWeight: 'medium', color: 'fg.default' },
    defaultVariants: { level: '2', trim: true },
    variants: {
      level: titleLevels(textSize),
      trim: { true: {} },
    },
    compoundVariants: (Object.keys(TITLE_STEPS) as unknown as TitleLevel[]).map((level) => ({
      level: String(level),
      trim: true,
      css: textTrim('display', TITLE_STEPS[level]),
    })),
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
