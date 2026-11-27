import type { ReactNode } from 'react';
import { statusBadge } from '../../styled-system/recipes';
import type { VariantOf } from './variants';

/** Props for {@link StatusBadge}. */
type StatusBadgeProps = {
  /** `ok` is green, `bad` is red. */
  state: VariantOf<typeof statusBadge, 'state'>;
  /** The text. */
  children: ReactNode;
};

/**
 * A one-line status strip, green when ok and red when not. Recipe `statusBadge`.
 *
 * @param props - the state and the text.
 * @returns the strip.
 */
export function StatusBadge({ state, children }: StatusBadgeProps) {
  return <div className={statusBadge({ state })}>{children}</div>;
}
