import type { ReactNode } from 'react';
import { footer } from '../../styled-system/recipes';
import type { LinkTag, NavItem } from './nav';

export type FooterProps = {
  footerUtility: NavItem[];
  /** Left of the bottom line, e.g. `© 2026 Brooklyn Aikikai`. */
  copyright: ReactNode;
  /** Right of the bottom line, e.g. the 501(c)(3) statement. */
  legal: ReactNode;
  as?: LinkTag;
};

/** Footer utility nav, with the copyright on the left and the legal line on the right. */
export function Footer({ footerUtility, copyright, legal, as: Tag = 'a' }: FooterProps) {
  const f = footer();
  return (
    <footer className={f.root}>
      <div className={f.inner}>
        <nav className={f.utility} aria-label="Footer">
          {footerUtility.map((link) => (
            <Tag key={link.href} href={link.href} className={f.utilityLink}>
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
