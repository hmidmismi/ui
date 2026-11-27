import type { ReactNode } from 'react';
import { sidebar } from '../../styled-system/recipes';
import { useUiText } from './ui-text';

/** Props for {@link Sidebar}. */
type SidebarProps = {
  /** The name of the section, for the disclosure. */
  currentTitle: string;
  /** The sidebar groups, from {@link SidebarGroup}; it renders twice, so it must be cheap and stateless. */
  side: ReactNode;
  /** The sidebar's accessible name; `In this section` from the wording map when absent. */
  navLabel?: string;
  /** The words before the current title in the disclosure; `In this section:` from the wording map when absent. */
  navLead?: string;
  /** The content. */
  children: ReactNode;
};

/**
 * A sticky sidebar of links beside the content from 960px, and an "In this section" disclosure above the content below
 * that. Slot recipe `sidebar`.
 *
 * @param props - the current page's title, the sidebar groups and the content.
 * @returns the layout.
 */
export function Sidebar({ currentTitle, side, navLabel, navLead, children }: SidebarProps) {
  const t = useUiText();
  const classes = sidebar();

  return (
    <div className={classes.root}>
      <aside className={classes.side} aria-label={navLabel ?? t.sectionNav}>
        {side}
      </aside>
      <details className={classes.disclosure}>
        <summary className={classes.summary}>
          {navLead ?? t.sectionNavLead} <span className={classes.current}>{currentTitle}</span>
        </summary>
        <nav className={classes.nav} aria-label={navLabel ?? t.sectionNav}>
          {side}
        </nav>
      </details>
      {children}
    </div>
  );
}

/** One group of the sidebar: a label over its links, built by the caller. */
export function SidebarGroup({ title, children }: { title: string; children: ReactNode }) {
  const classes = sidebar();

  return (
    <div className={classes.sideGroup}>
      <h2 className={classes.sideLabel}>{title}</h2>
      {children}
    </div>
  );
}

/** The class for a link in the sidebar. */
export function sidebarLinkClass() {
  return sidebar().sideLink;
}
