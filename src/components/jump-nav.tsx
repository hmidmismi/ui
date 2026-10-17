import { useRef } from 'react';
import { jumpNav } from '../../styled-system/recipes';
import { useActiveSection } from '../hooks/use-active-section';
import { useMeasuredHeight } from '../hooks/use-measured-height';
import type { JumpLink } from './jump-links';

export type { JumpLink };

/**
 * A sticky bar of pills that jump to the page's sections. It sticks under the header, stays on one row and scrolls
 * sideways when the pills overflow, and inverts the pill of the section the reader is in. Its height is published as
 * `--jh` so section anchors clear it. Slot recipe `jumpNav`.
 *
 * @param props - the links to show, in order.
 * @returns the navigation element.
 */
export function JumpNav({ links }: { links: JumpLink[] }) {
  const active = useActiveSection(links.map((link) => link.id));
  const classes = jumpNav();
  const root = useRef<HTMLElement>(null);
  useMeasuredHeight(root, '--jh');

  return (
    <nav ref={root} className={classes.root} aria-label="On this page" data-no-print>
      {links.map((link) => (
        <a
          key={link.id}
          className={classes.link}
          href={`#${link.id}`}
          aria-current={active === link.id ? 'true' : undefined}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
