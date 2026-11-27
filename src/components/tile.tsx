import type { ReactNode } from 'react';
import { card, hue, scrollList, splitGrid } from '../../styled-system/recipes';
import { declared } from './variants';

/** A hue: a name from the theme's `categorical` colors. */
export type Hue = string;

/** Props for {@link Card}. */
type CardProps = {
  /** The element: a block, an `article`, or a `button` for a card that is a control. Defaults to `div`. */
  as?: 'div' | 'article' | 'button';
  /** How the content sits: a `stack`, `corners` (the content at the start and `end` at the bottom corner) or a small square `plate`. Defaults to `stack`. */
  layout?: 'stack' | 'corners' | 'plate';
  /** The hue of the card, from the theme's `categorical` colors. Text in `tone="hue"` takes its color. */
  hue?: Hue;
  /** Fills the card with the hue and rings it in it: `soft` or `full`. Needs a hue. */
  tint?: 'soft' | 'full';
  /** Makes the whole card a control that takes the hover ground. Use with `as="button"`. */
  interactive?: boolean;
  /** What sits at the bottom corner in the `corners` and `plate` layouts. */
  end?: ReactNode;
  /** Called when a button card is pressed. */
  onClick?: () => void;
  /** Makes the whole card a link: builds the link from the card's class and its content. Use with `interactive`. */
  link?: (className: string, content: ReactNode) => ReactNode;
  /** The content. */
  children: ReactNode;
};

/**
 * A block set off by a hairline ring, optionally tinted in a hue. Its look is the props: how the content sits, the hue,
 * the tint and whether it is a control. What it holds is up to the caller: a label, a title and a link in a stack, a name
 * with a count in the corners, a name and a code on a plate. Recipes `hue` and `card`.
 *
 * @param props - the element, layout, hue, tint, control state, corner content, press handler and content.
 * @returns the card.
 */
export function Card({
  as: Tag = 'div',
  layout = 'stack',
  hue: color,
  tint,
  interactive = false,
  end,
  onClick,
  link,
  children,
}: CardProps) {
  const classes = card({ layout, tint, interactive });
  const root = color ? `${hue({ hue: declared(color) })} ${classes.root}` : classes.root;
  const corners = layout !== 'stack';
  const content = (
    <>
      {corners ? <span className={classes.start}>{children}</span> : children}
      {corners && end !== undefined && <span className={classes.end}>{end}</span>}
    </>
  );
  if (link) return <>{link(root, content)}</>;
  return (
    <Tag
      className={root}
      {...(Tag === 'button' ? { type: 'button' as const, onClick } : {})}
    >
      {content}
    </Tag>
  );
}

/** Props for {@link SplitGrid}. */
type SplitGridProps = {
  /** The space between the columns: `md` is 32px, `lg` is 48px. Defaults to `md`. */
  gap?: 'none' | 'md' | 'lg';
  /** The widths of the columns: `even`, or `wide` (the first about 7 to 5). Defaults to `even`. */
  ratio?: 'even' | 'wide';
  /** Keeps the first column in view while the second scrolls past, from 960px. */
  sticky?: boolean;
  /** The two columns. */
  children: ReactNode;
};

/**
 * Two columns from 960px, one below. Recipe `splitGrid`.
 *
 * @param props - the gap, the ratio, whether the first column sticks, and the two columns.
 * @returns the grid.
 */
export function SplitGrid({ gap = 'md', ratio = 'even', sticky = false, children }: SplitGridProps) {
  return <div className={splitGrid({ gap, ratio, sticky })}>{children}</div>;
}

/** Props for {@link ScrollList}. */
type ScrollListProps = {
  /** The element. Defaults to `div`. */
  as?: 'div' | 'ol' | 'ul';
  /** The accessible name, which says the area scrolls. */
  label: string;
  /** The content. */
  children: ReactNode;
};

/**
 * A list or block with a fixed maximum height that scrolls. It takes focus so a keyboard user can scroll it with the
 * arrow keys. Recipe `scrollList`.
 *
 * @param props - the element, the name and the content.
 * @returns the scrolling area.
 */
export function ScrollList({ as: Tag = 'div', label, children }: ScrollListProps) {
  return (
    <Tag className={scrollList()} tabIndex={0} aria-label={label}>
      {children}
    </Tag>
  );
}
