import type { ReactNode } from 'react';
import { pageColumn } from '../../styled-system/recipes';

/** Props for {@link PageColumn}. */
type PageColumnProps = {
  /** `article` for an entity page, `div` otherwise. */
  as?: 'article' | 'div';
  /** Removes the top padding, for a page whose first block sets its own, such as the home masthead. */
  flushTop?: boolean;
  /** The page blocks. */
  children: ReactNode;
};

/**
 * The page: full width with one gutter at each side. There is no gap between its blocks; each block spaces itself with
 * its own padding. Recipe `pageColumn`.
 *
 * @param props - the element and the blocks.
 * @returns the page column.
 */
export function PageColumn({ as: Tag = 'div', flushTop = false, children }: PageColumnProps) {
  return <Tag className={pageColumn({ flushTop })}>{children}</Tag>;
}
