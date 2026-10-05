'use client';
import { filterGroup } from '../../styled-system/recipes';
import * as ToggleGroup from './toggle-group';

export type FilterGroupItem = { id: string; name: string };

export type FilterGroupProps = {
  label: string;
  items: FilterGroupItem[];
  active: ReadonlySet<string>;
  validIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
};

export function FilterGroup({ label, items, active, validIds, onToggle }: FilterGroupProps) {
  const styles = filterGroup();

  return (
    <div className={styles.root}>
      <span className={styles.label}>{label}</span>
      <ToggleGroup.Root
        multiple
        value={[...active]}
        onValueChange={({ value }) => {
          const prev = [...active];
          const added = value.find((v) => !prev.includes(v));
          const removed = prev.find((v) => !value.includes(v));
          if (added) onToggle(added);
          if (removed) onToggle(removed);
        }}
      >
        {items.map((item) => (
          <ToggleGroup.Item
            key={item.id}
            value={item.id}
            disabled={!(active.has(item.id) || validIds.has(item.id))}
          >
            {item.name}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
