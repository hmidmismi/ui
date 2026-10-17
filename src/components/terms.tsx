import type { ReactNode } from 'react';
import { columnList, termList, termRow } from '../../styled-system/recipes';
import { Term } from './text';

/**
 * A two-column list of labels and values, one row per term: the release metadata. The columns collapse to one on
 * narrow screens. Recipe `termList`.
 *
 * @param props - the `TermRow` children.
 * @returns the list.
 */
export function TermList({ children }: { children: ReactNode }) {
  return <dl className={termList()}>{children}</dl>;
}

/** Props for {@link TermRow} and {@link ColumnRow}. */
type TermRowProps = {
  /** The label. */
  term: string;
  /** The value. */
  children: ReactNode;
};

/**
 * One label and value inside a {@link TermList}. Recipe `termRow`.
 *
 * @param props - the label and the value.
 * @returns the row.
 */
export function TermRow({ term, children }: TermRowProps) {
  return (
    <div className={termRow()}>
      <Term as="dt">{term}</Term>
      <dd>{children}</dd>
    </div>
  );
}

/** Props for {@link ColumnList}. */
type ColumnListProps = {
  /** `wide` flows the rows into as many 22rem columns as fit; `single` keeps one column. */
  width?: 'wide' | 'single';
  /** The `ColumnRow` children. */
  children: ReactNode;
};

/**
 * A list of terms that flows into columns, so long lists such as a large ensemble stay compact. Recipe `columnList`.
 *
 * @param props - the column width and the rows.
 * @returns the list.
 */
export function ColumnList({ width = 'wide', children }: ColumnListProps) {
  return <dl className={columnList({ width })}>{children}</dl>;
}

/**
 * One term and its value inside a {@link ColumnList}. It does not split across columns.
 *
 * @param props - the label and the value.
 * @returns the row.
 */
export function ColumnRow({ term, children }: TermRowProps) {
  return (
    <div>
      <Term as="dt">{term}</Term>
      <dd>{children}</dd>
    </div>
  );
}
