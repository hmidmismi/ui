import type { ComponentProps } from 'react';
import { styled } from '../../styled-system/jsx';

/**
 * @deprecated A span that takes style props: styling at the call site, which the guide does not allow. Use a primitive
 * with a variant. Only the loader still uses it.
 */
export type SpanProps = ComponentProps<typeof Span>;
export const Span = styled('span');
