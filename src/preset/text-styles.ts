import { defineTextStyles } from '@pandacss/dev';
import { scaleTextStyles } from './type-scale';

export const textStyles = defineTextStyles({
  ...scaleTextStyles,
  label: { value: { fontSize: 'sm', lineHeight: 'sm', fontWeight: 'medium' } },
});
