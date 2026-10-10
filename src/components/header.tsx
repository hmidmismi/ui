import type { ReactNode } from 'react';
import { header } from '../../styled-system/recipes';
import type { LinkTag, NavItem } from './nav';

export type HeaderProps = {
  brand: ReactNode;
  brandHref?: string;
  items: NavItem[];
  /** Language select and theme toggle, rendered flush right on every page. */
  headerUtility?: ReactNode;
  /** Render links with a router link. Defaults to `a`. */
  as?: LinkTag;
  /** Label for the menu button, translated by the app. */
  menuLabel?: string;
  /** Id of the `Menu` the button controls. */
  menuId: string;
  menuOpen: boolean;
  onMenuToggle: () => void;
  /** Switch to the burger layout. Apps pass a media-query result, or leave it to CSS with `compact`. */
  compact?: boolean;
};

/** Brand, primary nav and header utility nav. On small screens the nav gives way to a button that opens the `Menu`. */
export function Header({
  brand,
  brandHref = '/',
  items,
  headerUtility,
  as: Tag = 'a',
  menuLabel = 'Menu',
  menuId,
  menuOpen,
  onMenuToggle,
  compact = false,
}: HeaderProps) {
  const h = header({ compact, open: menuOpen });
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
        <div className={h.utility}>
          {headerUtility}
          <button
            type="button"
            className={h.burger}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuLabel}
            onClick={onMenuToggle}
          >
            <span className={h.bar} />
            <span className={h.bar} />
            <span className={h.bar} />
          </button>
        </div>
      </div>
    </header>
  );
}
