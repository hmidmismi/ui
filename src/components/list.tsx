'use client';

import type { ComponentProps } from 'react';
import { createStyleContext } from '../../styled-system/jsx';
import { list } from '../../styled-system/recipes';

const { withProvider, withContext } = createStyleContext(list);

export type ListProps = ComponentProps<typeof List>;
export const List = withProvider('ul', 'root');
export const ListItem = withContext('li', 'item');
