import type { ReactNode } from 'react';
import { linkNav } from '../../styled-system/recipes';

/**
 * A row of links that choose one of a group, such as a letter, a decade or a section; the current one is marked. Recipe
 * `linkNav`.
 *
 * @param props - the navigation's accessible name and the links, whose class names come from {@link linkNavClass}.
 * @returns the navigation.
 */
export function LinkNav({ label, children }: { label: string; children: ReactNode }) {
  return (
    <nav aria-label={label} className={linkNav().root}>
      {children}
    </nav>
  );
}

/**
 * The class name for a link inside a {@link LinkNav}.
 *
 * @param current - whether the link is for the one being shown.
 * @returns the class name.
 */
export function linkNavClass(current: boolean) {
  return linkNav({ current }).link;
}
