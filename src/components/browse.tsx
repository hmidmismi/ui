import type { ReactNode } from 'react';
import { browseNav, letterBar, neighborNav, rangeColumns } from '../../styled-system/recipes';
import { useUiText } from './ui-text';

/**
 * A row of links that choose a group of a browse list. Recipe `browseNav`.
 *
 * @param props - the links, whose class names come from {@link browseLinkClass}.
 * @returns the navigation.
 */
export function BrowseNav({ label, children }: { label: string; children: ReactNode }) {
  return (
    <nav aria-label={label} className={browseNav().root}>
      {children}
    </nav>
  );
}

/**
 * The class name for a link inside a {@link BrowseNav}.
 *
 * @param current - whether the link is for the group being shown.
 * @returns the class name.
 */
export function browseLinkClass(current: boolean) {
  return browseNav({ current }).link;
}

/**
 * The grid that holds the columns of a browse list: one column on phones, two from 640px, three from 960px and five
 * from 1200px. Slot recipe `rangeColumns`.
 *
 * @param props - the columns.
 * @returns the grid.
 */
export function RangeColumns({ children }: { children: ReactNode }) {
  return <div className={rangeColumns().root}>{children}</div>;
}

/** Props for {@link RangeColumn}. */
type RangeColumnProps = {
  /** The range label, such as `Ad–At`, or `null` for a single column. */
  label: string | null;
  /** How many names the column holds, shown in the warm color at the end of the heading. */
  count: number;
  /** The rows, from {@link RangeItem}. */
  children: ReactNode;
};

/**
 * One column of a browse list: the range label and the number of names over a foreground rule, then the names.
 *
 * @param props - the label, the count and the rows.
 * @returns the column.
 */
export function RangeColumn({ label, count, children }: RangeColumnProps) {
  const classes = rangeColumns();

  return (
    <section className={classes.column} aria-label={label ?? undefined}>
      {label && (
        <h2 className={classes.heading}>
          <span className={classes.label}>{label}</span>
          <span className={classes.count}>{count.toLocaleString('en-US')}</span>
        </h2>
      )}
      <ul className={classes.list}>{children}</ul>
    </section>
  );
}

/** Props for {@link RangeItem}. */
type RangeItemProps = {
  /** The small muted note at the end, such as a lifespan. */
  note?: ReactNode;
  /** Builds the row's link from the slot class and the row content. */
  link: (className: string, content: ReactNode) => ReactNode;
  /** The name. */
  children: ReactNode;
};

/**
 * One name in a {@link RangeColumn}, as a link with its note at the end.
 *
 * @param props - the note, the link builder and the name.
 * @returns the row.
 */
export function RangeItem({ note, link, children }: RangeItemProps) {
  const classes = rangeColumns();

  return (
    <li>
      {link(
        classes.link,
        <>
          <span className={classes.name}>{children}</span>
          {note && <small className={classes.note}>{note}</small>}
        </>
      )}
    </li>
  );
}

/** Props for {@link LetterBar}. */
type LetterBarProps = {
  /** The accessible name of the navigation. */
  label: string;
  /** The keys, from {@link LetterKey}. */
  children: ReactNode;
};

/**
 * The sticky strip of letter keys above a letter list. Slot recipe `letterBar`.
 *
 * @param props - the name and the keys.
 * @returns the navigation.
 */
export function LetterBar({ label, children }: LetterBarProps) {
  const classes = letterBar();

  return (
    <nav aria-label={label} className={classes.root}>
      <div className={classes.list}>{children}</div>
    </nav>
  );
}

/** Props for {@link LetterKeyLink}. */
type LetterKeyProps = {
  /** The letter shown. */
  letter: string;
  /** The accessible name, such as `E, 142 entries`. */
  label: string;
  /** Whether this is the letter being shown. */
  current: boolean;
  /** Whether the letter has no entries; it is then not a link. */
  disabled: boolean;
  /** Builds the key's link from the props it must carry and its content. */
  link: (props: LetterLinkProps, content: ReactNode) => ReactNode;
};

/** The props a letter key's link must carry. */
export type LetterLinkProps = {
  className: string;
  'aria-label': string;
  'aria-current'?: 'page' | undefined;
};

/**
 * One key of a {@link LetterBar}: a link, or a dimmed dashed block when the letter is empty.
 *
 * @param props - the letter, its name, its state and the link builder.
 * @returns the key.
 */
export function LetterKeyLink({ letter, label, current, disabled, link }: LetterKeyProps) {
  const className = letterBar().key;

  if (disabled) {
    return (
      <span className={className} aria-disabled="true" aria-label={label}>
        {letter}
      </span>
    );
  }
  return link(
    { className, 'aria-label': label, 'aria-current': current ? 'page' : undefined },
    letter
  );
}

/** Props for {@link NeighborNav}. */
type NeighborNavProps = {
  /** The link to the previous letter, from the link builder, or `null` at the start. */
  previous: ReactNode;
  /** The link to the next letter, or `null` at the end. */
  next: ReactNode;
};

/**
 * The previous and next links under a letter list. Slot recipe `neighborNav`.
 *
 * @param props - the two links.
 * @returns the navigation.
 */
export function NeighborNav({ previous, next }: NeighborNavProps) {
  const t = useUiText();
  const classes = neighborNav();

  return (
    <nav aria-label={t.adjacentNav} className={classes.root}>
      <span>{previous}</span>
      <span>{next}</span>
    </nav>
  );
}

/**
 * The class for a link inside a {@link NeighborNav}.
 *
 * @returns the class name.
 */
export function neighborLinkClass() {
  return neighborNav().link;
}
