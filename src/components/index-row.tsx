import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { indexRow } from '../../styled-system/recipes';

export type IndexRowProps = {
  /** The element or component to render, such as a router link. Defaults to `a`. */
  as?: ElementType;
  numeral?: ReactNode;
  label: ReactNode;
  kanji?: ReactNode;
  aside?: ReactNode;
  size?: 'md' | 'lg';
  active?: boolean;
} & Omit<ComponentPropsWithoutRef<'a'>, 'children'>;

/** One big ruled row of an index list. */
export function IndexRow({
  as: Tag = 'a',
  numeral,
  label,
  kanji,
  aside,
  size,
  active,
  ...rest
}: IndexRowProps) {
  const styles = indexRow({ size, active });
  return (
    <Tag className={styles.root} {...rest}>
      <span className={styles.numeral}>{numeral}</span>
      <span className={styles.label}>
        {label}
        {kanji ? <span className={styles.kanji}>{kanji}</span> : null}
      </span>
      <span className={styles.aside}>{aside}</span>
    </Tag>
  );
}
