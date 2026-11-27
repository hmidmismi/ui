import type { ReactNode } from 'react';
import { visuallyHidden } from '../../styled-system/patterns';

/** Props for {@link VisuallyHidden}. */
type VisuallyHiddenProps = {
  /** The element. Defaults to `span`. */
  as?: 'span' | 'h1' | 'h2' | 'p';
  /** The text, read by assistive technology only. */
  children: ReactNode;
};

/**
 * Text that is not shown but is read by screen readers, such as a page's main heading when the design shows its own
 * display text instead. Pattern `visuallyHidden`.
 *
 * @param props - the element and the text.
 * @returns the hidden text.
 */
export function VisuallyHidden({ as: Tag = 'span', children }: VisuallyHiddenProps) {
  return <Tag className={visuallyHidden()}>{children}</Tag>;
}
