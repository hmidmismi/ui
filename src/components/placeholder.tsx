import type { ReactNode } from 'react';
import { placeholder } from '../../styled-system/recipes';

export type PlaceholderProps = { ratio?: 'video' | 'photo'; children?: ReactNode };

/** A flat field for a video or photo that is not attached yet. */
export function Placeholder({ ratio, children }: PlaceholderProps) {
  return <div className={placeholder({ ratio })}>{children}</div>;
}
