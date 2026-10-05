import type { ComponentProps } from 'react';
import { styled } from '../../styled-system/jsx';
import { layoutStack, layoutWrap } from '../../styled-system/recipes';

export const Stack = styled('div', layoutStack);
export type StackProps = ComponentProps<typeof Stack>;

export const Wrap = styled('div', layoutWrap);
export type WrapProps = ComponentProps<typeof Wrap>;
