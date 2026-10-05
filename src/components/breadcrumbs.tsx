import type { ElementType } from 'react';
import { crumbs } from '../../styled-system/recipes';

export type Crumb = { label: string; href?: string };

export type BreadcrumbsProps = {
  items: Crumb[];
  /** The component to render links with, such as a router link. Defaults to `a`. */
  as?: ElementType;
};

/** A breadcrumb trail. Items without an `href` are plain text; the last item is the current page. */
export function Breadcrumbs({ items, as: Tag = 'a' }: BreadcrumbsProps) {
  const styles = crumbs();
  return (
    <nav aria-label="Breadcrumb" className={styles.root}>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className={styles.item}>
            {index > 0 ? <span className={styles.separator}>/</span> : null}
            {item.href ? (
              <Tag href={item.href} className={styles.link}>
                {item.label}
              </Tag>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
