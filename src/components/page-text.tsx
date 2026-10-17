import type { ReactNode } from 'react';
import { hue, pageLayout, pageText } from '../../styled-system/recipes';
import type { Hue } from './tile';

/**
 * The article of a page of text: at most 72 characters wide, holding a title and the body. Slot recipe `pageText`.
 *
 * @param props - the blocks.
 * @returns the article.
 */
export function PageArticle({ children }: { children: ReactNode }) {
  return <article className={pageText().root}>{children}</article>;
}

/** The page title, the serif `h1`. */
export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className={pageText().title}>{children}</h1>;
}

/** The large paragraph under the title. */
export function PageLede({ children }: { children: ReactNode }) {
  return <p className={pageText().lede}>{children}</p>;
}

/** A section head. */
export function PageH2({ children }: { children: ReactNode }) {
  return <h2 className={pageText().h2}>{children}</h2>;
}

/** A minor head, set as a small uppercase label. */
export function PageH3({ children }: { children: ReactNode }) {
  return <h3 className={pageText().h3}>{children}</h3>;
}

/** A paragraph of body text. */
export function PageP({ children }: { children: ReactNode }) {
  return <p className={pageText().p}>{children}</p>;
}

/** Props for {@link PageList}. */
type PageListProps = {
  /** Numbers the items. */
  ordered?: boolean;
  /** Sets the list in two columns without markers. */
  columns?: boolean;
  /** Sets the items in the display face with a rule under each, in two columns. */
  board?: boolean;
  /** The items, as `li` elements. */
  children: ReactNode;
};

/**
 * A bulleted or numbered list, or a two-column list of names.
 *
 * @param props - the kind of list and its items.
 * @returns the list.
 */
export function PageList({
  ordered = false,
  columns = false,
  board = false,
  children,
}: PageListProps) {
  const className = pageText({ columns: columns || board, board }).list;

  return ordered ? (
    <ol className={className}>{children}</ol>
  ) : (
    <ul className={className}>{children}</ul>
  );
}

/** A definition list: the term at the start, its detail beside it. */
export function PageKv({ children }: { children: ReactNode }) {
  return <dl className={pageText().kv}>{children}</dl>;
}

/** One term and detail of a {@link PageKv}. */
export function PageKvRow({ term, children }: { term: ReactNode; children: ReactNode }) {
  const classes = pageText();

  return (
    <>
      <dt className={classes.term}>{term}</dt>
      <dd className={classes.detail}>{children}</dd>
    </>
  );
}

/** A data table; give it {@link PageTh} cells in the head and {@link PageTd} cells in the rows. */
export function PageTable({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <table className={pageText().table}>
      <thead>
        <tr>{head}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

/** A column head; `num` right-aligns it. */
export function PageTh({ num = false, children }: { num?: boolean; children: ReactNode }) {
  return (
    <th className={pageText().th} data-num={num ? '' : undefined} scope="col">
      {children}
    </th>
  );
}

/** A cell; `num` right-aligns it with tabular figures. */
export function PageTd({ num = false, children }: { num?: boolean; children: ReactNode }) {
  return (
    <td className={pageText().td} data-num={num ? '' : undefined}>
      {children}
    </td>
  );
}

/** A block of preformatted text. */
export function PageCode({ children }: { children: string }) {
  return <pre className={pageText().code}>{children}</pre>;
}

/** The grid of record label tiles. */
export function PageTileGrid({ children }: { children: ReactNode }) {
  return <ul className={pageText().tileGrid}>{children}</ul>;
}

/** Props for {@link PageTile}. */
type PageTileProps = {
  /** The label's hue. */
  hue: Hue;
  /** The label's name. */
  name: ReactNode;
  /** The label's release count, formatted. */
  count: ReactNode;
  /** Builds the tile's link from the slot class and its content. */
  link: (className: string, content: ReactNode) => ReactNode;
};

/**
 * One label tile: the name at the start and the release count at the end, in the label's color.
 *
 * @param props - the hue, name, count and link builder.
 * @returns the list item.
 */
export function PageTile({ hue: color, name, count, link }: PageTileProps) {
  const classes = pageText();

  return (
    <li className={hue({ hue: color })}>
      {link(
        classes.tile,
        <>
          <span className={classes.tileName}>{name}</span>
          <span className={classes.tileCount}>{count}</span>
        </>
      )}
    </li>
  );
}

/** Props for {@link PageLayout}. */
type PageLayoutProps = {
  /** The name of the section, for the disclosure. */
  currentTitle: string;
  /** The sidebar groups, from {@link PageSideGroup}; it renders twice, so it must be cheap and stateless. */
  side: ReactNode;
  /** The article. */
  children: ReactNode;
};

/**
 * The page layout: a sticky sidebar of the section's pages beside the article from 960px, and a "In this section"
 * disclosure above the article below that. Slot recipe `pageLayout`.
 *
 * @param props - the current page's title, the sidebar groups and the article.
 * @returns the layout.
 */
export function PageLayout({ currentTitle, side, children }: PageLayoutProps) {
  const classes = pageLayout();

  return (
    <div className={classes.root}>
      <aside className={classes.side} aria-label="In this section">
        {side}
      </aside>
      <details className={classes.disclosure}>
        <summary className={classes.summary}>
          In this section: <span className={classes.current}>{currentTitle}</span>
        </summary>
        <nav className={classes.nav} aria-label="In this section">
          {side}
        </nav>
      </details>
      {children}
    </div>
  );
}

/** One group of the sidebar: a label over its links, built by the caller. */
export function PageSideGroup({ title, children }: { title: string; children: ReactNode }) {
  const classes = pageLayout();

  return (
    <div className={classes.sideGroup}>
      <h2 className={classes.sideLabel}>{title}</h2>
      {children}
    </div>
  );
}

/** The class for a link in the sidebar. */
export function pageSideLinkClass() {
  return pageLayout().sideLink;
}
