import type { ElementType } from 'react';

/** One destination in the header, menu and footer. */
export type NavItem = { label: string; href: string; current?: boolean };

export type LinkTag = ElementType;
