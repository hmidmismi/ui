import type { ReactNode } from 'react';
import { rowDrawer, row } from '../../styled-system/recipes';

/** What every {@link Row} has. */
type RowBase = {
  /** The columns: `plain` (title and aside), `plated` or `numbered` (a lead at the start and a chevron), `thumb` (a lead at the start, no chevron), `card` (a large picture at the start, the title over each line of the meta on its own line, a stronger hover), `dated` (a lead on the text's baseline). Defaults to `plain`. */
  layout?: 'plain' | 'plated' | 'numbered' | 'dated' | 'thumb' | 'card';
  /** What leads the row: a picture, a number or a date. */
  lead?: ReactNode;
  /** The title. */
  title: ReactNode;
  /** The line under the title; a list is one line for each item. */
  meta?: ReactNode | ReactNode[];
  /** The text at the end. Phones hide it, except in a `dated` row. */
  aside?: ReactNode;
};

/** What makes a row a link (`link`), or a button that opens something (`onToggle`, with `open` and `controls`), or neither. */
type RowAction = {
  /** Builds the row's link from the slot class and the row content. */
  link?: (className: string, content: ReactNode) => ReactNode;
  /** Whether what the row opens is open. */
  open?: boolean;
  /** The id of what the row opens. */
  controls?: string;
  /** Called when the row is pressed. Makes the row a button. */
  onToggle?: () => void;
};

/** Props for {@link Row}. */
export type RowProps = RowBase & RowAction;

/**
 * A row of a list: a lead, the title over its meta line, an aside and, for a button, a chevron that turns when it is
 * open. With `link` the whole row is the link; with `onToggle` it is a button. Put each row in an `li` of an `ItemList`
 * (`gap="0"`, `closed`), which draws the rule under the last. Slot recipe `row`.
 *
 * @param props - the layout, the parts and the link or the toggle.
 * @returns the row.
 */
export function Row(props: RowProps) {
  const { layout = 'plain', lead, title, meta, aside } = props;
  const button = props.onToggle !== undefined;
  const classes = row({ layout, interactive: props.link !== undefined || button });
  // A lead layout keeps its aside column, so the chevron stays in its own.
  const asideColumn = aside !== undefined || layout === 'plated' || layout === 'numbered';
  const content = (
    <>
      {lead}
      <span className={classes.text}>
        <span className={classes.title} data-part="title">
          {title}
        </span>
        {Array.isArray(meta)
          ? meta.filter(Boolean).map((line, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: the lines are a fixed list that never reorders
              <span key={index} className={classes.meta}>
                {line}
              </span>
            ))
          : meta && <span className={classes.meta}>{meta}</span>}
      </span>
      {asideColumn && <span className={classes.aside}>{aside}</span>}
      {button && <span className={classes.chevron} aria-hidden />}
    </>
  );
  if (props.link) return <>{props.link(classes.root, content)}</>;
  if (button) {
    return (
      <button
        type="button"
        className={classes.root}
        aria-expanded={props.open}
        aria-controls={props.controls}
        onClick={props.onToggle}
      >
        {content}
      </button>
    );
  }
  return <div className={classes.root}>{content}</div>;
}

/** Props for {@link RowDrawer}. */
type RowDrawerProps = {
  /** The id the row's `aria-controls` points at. */
  id: string;
  /** The line at the start, such as `12 items · 54 min`. */
  summary: ReactNode;
  /** The link to the row's page, built from the slot class. */
  link: (className: string) => ReactNode;
  /** The accessible name of the scrolling list, such as `Tracks, scrollable`. */
  listLabel: string;
  /** The items, as {@link DrawerItem} rows. */
  children: ReactNode;
};

/**
 * The drawer under an open expandable row: a header with the summary and the link, then the item list, which scrolls
 * and takes focus so the keyboard can scroll it. Slot recipe `rowDrawer`.
 *
 * @param props - the id, the summary, the link, the list's name and the items.
 * @returns the drawer.
 */
export function RowDrawer({ id, summary, link, listLabel, children }: RowDrawerProps) {
  const classes = rowDrawer();

  return (
    <div id={id} className={classes.root}>
      <div className={classes.head}>
        <span>{summary}</span>
        {link(classes.link)}
      </div>
      <ol className={classes.list} tabIndex={0} aria-label={listLabel}>
        {children}
      </ol>
    </div>
  );
}

/** Props for {@link DrawerItem}. */
type DrawerItemProps = {
  /** The item number. */
  number: ReactNode;
  /** The title. */
  title: ReactNode;
  /** The formatted length. */
  time: ReactNode;
};

/**
 * One item in a {@link RowDrawer}: the number, the title (accent on hover) and the length.
 *
 * @param props - the number, the title and the length.
 * @returns the row.
 */
export function DrawerItem({ number, title, time }: DrawerItemProps) {
  const classes = rowDrawer();

  return (
    <li className={classes.row}>
      <span className={classes.number}>{number}</span>
      <span className={classes.title} data-part="title">
        {title}
      </span>
      <span className={classes.time}>{time}</span>
    </li>
  );
}

/** Props for {@link RowPanel}. */
type RowPanelProps = {
  /** The id the row's `aria-controls` points at. */
  id: string;
  /** Lines the panel up under the number of a `numbered` row instead of under a plate's title. */
  numbered?: boolean;
  /** What opens under the row. */
  children: ReactNode;
};

/**
 * The panel under an open expandable row for content that is not a list of items: the hover ground, a rule above, and
 * the content lined up under the title. Slot recipe `rowDrawer`.
 *
 * @param props - the id, whether the row is numbered, and the content.
 * @returns the panel.
 */
export function RowPanel({ id, numbered = false, children }: RowPanelProps) {
  const classes = rowDrawer({ indent: numbered ? 'number' : 'plate' });

  return (
    <div id={id} className={classes.root}>
      <div className={classes.head}>{children}</div>
    </div>
  );
}
