// packages/ui/src/components/fields/EditableSelect.tsx
'use client';
import { createListCollection } from '@ark-ui/react/select';
import { visuallyHidden } from '../../styled-system/patterns';
import * as Select from './select';
import { useUiText } from './ui-text';

export function EditableSelect<T extends string>({
  label,
  hideLabel,
  size,
  value,
  options,
  onChange,
  onClear,
  disabled,
}: {
  label?: string;
  /** Keeps the label for screen readers and leaves it off the page, for a select that sits in a bar of controls. */
  hideLabel?: boolean;
  /** The control's height; `sm` fits inside a header bar. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  value: T | '';
  options: { id: T; name: string }[];
  onChange: (value: T | undefined) => void;
  onClear?: () => void;
  disabled?: boolean;
}) {
  const t = useUiText();
  const sorted = [...options].sort((a, b) => a.name.localeCompare(b.name));
  const collection = createListCollection({
    items: sorted,
    itemToValue: (item) => item.id,
    itemToString: (item) => item.name,
  });

  return (
    <Select.Root
      collection={collection}
      value={value ? [value] : []}
      disabled={disabled}
      size={size}
      onValueChange={(details) => onChange(details.value[0] as T | undefined)}
    >
      {label && <Select.Label className={hideLabel ? visuallyHidden() : undefined}>{label}</Select.Label>}
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={t.nonePlaceholder} />
          <Select.Indicator />
        </Select.Trigger>
        {!disabled && onClear && value && (
          <Select.ClearTrigger onClick={onClear}>×</Select.ClearTrigger>
        )}
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Select.List>
            {sorted.map((opt) => (
              <Select.Item key={opt.id} item={opt}>
                <Select.ItemText>{opt.name}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
      </Select.Positioner>
      <Select.HiddenSelect />
    </Select.Root>
  );
}
