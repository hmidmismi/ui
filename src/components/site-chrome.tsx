'use client';

import { type ElementType, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { siteFooter, siteHeader, siteSheet, siteStrip } from '../../styled-system/recipes';

/** One destination in the header, sheet and footer. */
export type NavItem = { label: string; href: string; current?: boolean };

type LinkTag = ElementType;

/** Kana numerals that lead the items of the mobile sheet, in order. */
export const KANA_NUMERALS = ['い', 'ろ', 'は', 'に', 'ほ', 'へ', 'と'] as const;

export type SiteStripProps = { children: ReactNode };

/** The strip above the header. Put the statement and its link inside. */
export function SiteStrip({ children }: SiteStripProps) {
  const s = siteStrip();
  return (
    <div className={s.root} role="note">
      <p className={s.text}>{children}</p>
    </div>
  );
}

/** Styled link for use inside `SiteStrip` text. */
export function SiteStripLink({ as: Tag = 'a', ...props }: { as?: LinkTag; href: string; children: ReactNode }) {
  return <Tag className={siteStrip().link} {...props} />;
}

export type SiteHeaderProps = {
  brand: ReactNode;
  brandHref?: string;
  items: NavItem[];
  /** Language select and theme toggle, rendered flush right on every page. */
  tools?: ReactNode;
  /** Content of the footer line of the sheet (Instagram, Contact). */
  sheetFoot?: ReactNode;
  /** Render links with a router link. Defaults to `a`. */
  as?: LinkTag;
  /** Label for the menu button, translated by the app. */
  menuLabel?: string;
  /** Switch to the sheet layout. Apps pass a media-query result, or leave it to CSS with `compact`. */
  compact?: boolean;
};

/**
 * Header and mobile sheet together, since they share open state. The sheet locks page scroll while open, closes on
 * Escape, returns focus to the button and restores it when closed.
 */
export function SiteHeader({
  brand,
  brandHref = '/',
  items,
  tools,
  sheetFoot,
  as: Tag = 'a',
  menuLabel = 'Menu',
  compact = false,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const h = siteHeader({ compact, open });
  const sheet = siteSheet();

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className={h.root}>
      <div className={h.inner}>
        <Tag href={brandHref} className={h.brand}>
          {brand}
        </Tag>
        <nav className={h.nav} aria-label="Primary">
          {items.map((item) => (
            <Tag
              key={item.href}
              href={item.href}
              className={h.navLink}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.label}
            </Tag>
          ))}
        </nav>
        <div className={h.tools}>
          {tools}
          <button
            ref={button}
            type="button"
            className={h.burger}
            aria-expanded={open}
            aria-controls={id}
            aria-label={menuLabel}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={h.bar} />
            <span className={h.bar} />
            <span className={h.bar} />
          </button>
        </div>
      </div>
      <div id={id} className={sheet.root} data-open={open ? '' : undefined} aria-hidden={!open}>
        <ul className={sheet.list}>
          {items.map((item, index) => (
            <li key={item.href} className={sheet.item}>
              <span className={sheet.numeral} aria-hidden="true">
                {KANA_NUMERALS[index]}
              </span>
              <Tag href={item.href} className={sheet.label} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                {item.label}
              </Tag>
            </li>
          ))}
        </ul>
        {sheetFoot ? <div className={sheet.foot}>{sheetFoot}</div> : null}
      </div>
    </header>
  );
}

export type SiteFooterProps = {
  links: NavItem[];
  /** Left of the bottom line, e.g. `© 2026 Brooklyn Aikikai`. */
  copyright: ReactNode;
  /** Right of the bottom line, e.g. the 501(c)(3) statement. */
  legal: ReactNode;
  as?: LinkTag;
};

/** Footer links, with the copyright on the left and the legal line on the right. */
export function SiteFooter({ links, copyright, legal, as: Tag = 'a' }: SiteFooterProps) {
  const f = siteFooter();
  return (
    <footer className={f.root}>
      <div className={f.inner}>
        <nav className={f.links} aria-label="Footer">
          {links.map((link) => (
            <Tag key={link.href} href={link.href} className={f.link}>
              {link.label}
            </Tag>
          ))}
        </nav>
        <div className={f.meta}>
          <span>{copyright}</span>
          <span className={f.legal}>{legal}</span>
        </div>
      </div>
    </footer>
  );
}
