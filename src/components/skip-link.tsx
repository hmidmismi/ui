import type { ReactNode } from 'react';
import { skipLink } from '../../styled-system/recipes';

/**
 * The link at the top of a page that jumps keyboard users past the header to the main content. It is hidden until it
 * receives focus. Recipe `skipLink`.
 *
 * @param props - the id of the element to jump to and the text.
 * @returns the link.
 */
export function SkipLink({ target, children }: { target: string; children: ReactNode }) {
  return (
    <a href={`#${target}`} className={skipLink()}>
      {children}
    </a>
  );
}
