'use client';

import type { ComponentProps } from 'react';
import { createStyleContext } from '../../styled-system/jsx';
import { split } from '../../styled-system/recipes';

const { withProvider, withContext } = createStyleContext(split);

export type SplitRootProps = ComponentProps<typeof Root>;
export const Root = withProvider('div', 'root');
export const Main = withContext('div', 'main');
export const Side = withContext('div', 'side');
