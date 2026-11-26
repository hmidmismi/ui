import type { ElementType, ReactNode } from 'react';
import { label, numeral, text, title } from '../../styled-system/recipes';

/**
 * Text roles as components. Each renders one element with its role recipe. Block elements are trimmed with Capsize
 * (the space above the capitals and below the baseline is removed); inline elements (`span`, `strong`, `small`) cannot
 * be, so the trim is turned off for them.
 */

const INLINE = new Set(['span', 'strong', 'em', 'small', 'a', 'code', 'b', 'i']);

const trims = (tag: string) => !INLINE.has(tag);

type Props<T extends ElementType> = { as?: T; children?: ReactNode; className?: string };

export type TitleLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type TitleProps = Props<ElementType> & { level?: TitleLevel; tone?: 'inherit' };

/**
 * A page or section title. `level` picks the design's heading style and is also the rendered tag unless `as`
 * overrides it (when the outline and the visual size differ).
 */
export function Title({ level = 'h1', as, tone, children }: TitleProps) {
  const Tag = as ?? level;
  return <Tag className={title({ level, tone })}>{children}</Tag>;
}

/** The steps a {@link Text} can be set at. */
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

/** The colors of a {@link Text} or a {@link Label}. */
/** `hue` is the color of the hue the text sits in (see `Card`); `inherit` takes the color of the block it is in (see `Surface`). */
export type Tone = 'default' | 'muted' | 'accent' | 'hue' | 'inherit';

/** What `variant` sets when `size` is not given. */
const VARIANT_SIZE: Record<NonNullable<TextProps['variant']>, TextSize> = { body: 'md', small: 'sm', caption: 'xs' };

export type TextProps = Props<ElementType> & {
  /** The common sizes: `body`, `small` and `caption` (small and muted). */
  variant?: 'body' | 'small' | 'caption';
  /** Any step, replacing the one `variant` sets. */
  size?: TextSize;
  /** The face. Defaults to `body`. */
  face?: 'body' | 'display';
  /** The color. Left out, the text is the default color, or muted for a `caption`. */
  tone?: Tone;
  /** The weight. Left out, it is the face's. */
  weight?: 'normal' | 'medium' | 'semibold';
  /** Tabular figures that do not wrap, for numbers that line up. */
  figures?: boolean;
};

/**
 * Text in the body or display face. A look is a few variants (size, face, tone, weight, figures), set at the call site;
 * a content name for a look belongs in the app's call-site mapping, not here.
 */
export function Text({
  as: Tag = 'p',
  variant = 'body',
  size,
  face = 'body',
  tone,
  weight,
  figures,
  children,
}: TextProps) {
  const scale = `${face}-${size ?? VARIANT_SIZE[variant]}${trims(String(Tag)) ? '' : '-inline'}`;
  return (
    <Tag
      className={text({
        scale: scale as 'body-md',
        tone: tone ?? (variant === 'caption' ? 'muted' : undefined),
        weight,
        figures,
      })}
    >
      {children}
    </Tag>
  );
}

export type LabelProps = Props<ElementType> & {
  /** The color. Defaults to `muted`. */
  tone?: Tone;
};

export function Label({ as: Tag = 'span', tone, children }: LabelProps) {
  return <Tag className={label({ trim: trims(String(Tag)), tone })}>{children}</Tag>;
}

export type NumeralProps = Props<ElementType>;

export function Numeral({ as: Tag = 'span', children }: NumeralProps) {
  return <Tag className={numeral({ trim: trims(String(Tag)) })}>{children}</Tag>;
}
