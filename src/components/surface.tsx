import type { ReactNode } from 'react';
import { surface } from '../../styled-system/recipes';

export type SurfaceProps = { tone?: 'paper' | 'ink'; fill?: boolean; children?: ReactNode };

/** A full-width ground. `ink` is the dark canvas: it carries the `dark` class so every color inside flips. */
export function Surface({ tone = 'paper', fill, children }: SurfaceProps) {
  const className = `${tone === 'ink' ? 'dark ' : ''}${surface({ fill })}`;
  return <div className={className}>{children}</div>;
}
