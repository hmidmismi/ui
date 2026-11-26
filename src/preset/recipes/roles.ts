import { defineRecipe } from '@pandacss/dev';
import { responsive, type TypeSystem } from '../type-scale';

/**
 * Text roles: one recipe per kind of text a page sets. Each holds the whole look of its role (face, step, weight,
 * case, tracking, color). Size, line height and the trim come from `type-scale.ts`, so every role sits on the
 * same scale and baseline.
 *
 * The `trim` variant removes the space above the capitals and below the baseline. It is on by default and turned off
 * when a role renders an inline element, because the trim needs a block box.
 */

/** The faces and steps a `Text` can be set in. */
export const TEXT_FACES = ['body', 'display'] as const;
export const TEXT_STEPS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'] as const;

/** The heading levels, in order. */
const LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

/**
 * The text-role recipes for a type system.
 *
 * @param t - the type system (a design's sizes, trim and headings).
 * @returns `title`, `text`, `label` and `numeral`.
 */
export function createRoles({
  lineMargins,
  textRole,
  textSize,
  textTrim,
  labelCaps,
  headings,
}: TypeSystem) {
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
      tone: { inherit: { color: 'inherit' } },
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

  /**
   * Running text and interface copy. A look is a few independent variants: `scale` (a face and a step, trimmed, or
   * `-inline` with its baseline moved by margins for a span in a flex row; they are separate variants, not a trim flag,
   * because Panda does not generate the style of a compound variant that is never used literally), `tone`, `weight` and
   * `figures`. `tone` and `weight` have no default, so a variant that sets its own color (the caption) keeps it.
   */
  const text = defineRecipe({
    className: 'text',
    staticCss: ['*'],
    base: { color: 'fg.default' },
    defaultVariants: { scale: 'body-md' },
    variants: {
      scale: Object.fromEntries(
        TEXT_FACES.flatMap((face) =>
          TEXT_STEPS.flatMap((step) => [
            [`${face}-${step}`, { fontFamily: face, ...textSize(face, step), ...textTrim(face, step) }],
            [`${face}-${step}-inline`, { fontFamily: face, ...textSize(face, step), ...lineMargins(face, step) }],
          ])
        )
      ),
      tone: {
        default: { color: 'fg.default' },
        muted: { color: 'fg.muted' },
        accent: { color: 'accent' },
        hue: { color: 'var(--tone)' },
        inherit: { color: 'inherit' },
      },
      weight: {
        normal: { fontWeight: 'normal' },
        medium: { fontWeight: 'medium' },
        semibold: { fontWeight: 'semibold' },
      },
      figures: { true: { fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } },
    } as never,
  });

  /** The small uppercase tracked label. `tone` is `muted` unless set. */
  const label = defineRecipe({
    className: 'label',
    staticCss: ['*'],
    base: { color: 'fg.muted', ...labelCaps },
    defaultVariants: { trim: true },
    variants: {
      trim: { true: textTrim('body', 'xs'), false: lineMargins('body', 'xs') },
      tone: {
        default: { color: 'fg.default' },
        muted: { color: 'fg.muted' },
        accent: { color: 'accent' },
        hue: { color: 'var(--tone)' },
        inherit: { color: 'inherit' },
      },
    },
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
    variants: { trim: { true: textTrim('display', 'sm'), false: lineMargins('display', 'sm') } },
  });

  return { title, text, label, numeral };
}
