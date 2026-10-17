import type {
  ControlSize,
  ControlStyle,
  Design,
  HeadingLevel,
  HeadingStyle,
  RoleName,
  RoleStyle,
} from './types';

/** The text roles of the default design: plain sizes and weights, no capitals. */
export const defaultRoles = {
  eyebrow: { step: 'xs', weight: 'medium', tracking: 'caps', uppercase: true, color: 'accent' },
  personName: { step: 'sm', weight: 'semibold' },
  term: { step: 'sm', weight: 'semibold', color: 'fg.muted' },
  entry: { face: 'display', step: 'lg' },
  prose: { step: 'md' },
  value: { step: 'md' },
  caption: { step: 'sm', color: 'fg.muted' },
  count: {
    step: 'sm',
    color: 'fg.muted',
    extra: { fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' },
  },
  tagline: { face: 'display', step: '2xl', weight: 'medium' },
  fieldLabel: {
    step: 'xs',
    weight: 'medium',
    tracking: 'caps',
    uppercase: true,
    color: 'fg.muted',
  },
  notice: { step: 'lg', color: 'fg.muted' },
} as const satisfies Record<RoleName, RoleStyle>;

/** The control sizes of the default design, in baselines: one baseline taller at each step. */
export const defaultControls = {
  '2xs': { height: 5, padX: 2, icon: 3 },
  xs: { height: 6, padX: 2, icon: 3 },
  sm: { height: 7, padX: 3, icon: 3 },
  md: { height: 8, padX: 3, icon: 4 },
  lg: { height: 9, padX: 4, icon: 4 },
  xl: { height: 10, padX: 4, icon: 5 },
  '2xl': { height: 12, padX: 6, icon: 6 },
} as const satisfies Record<ControlSize, ControlStyle>;

/** The headings of the default design: six levels, each a step smaller, in medium weight. */
export const defaultHeadings = {
  h1: { step: '5xl', weight: 'medium' },
  h2: { step: '4xl', weight: 'medium' },
  h3: { step: '3xl', weight: 'medium' },
  h4: { step: '2xl', weight: 'medium' },
  h5: { step: 'xl', weight: 'medium' },
  h6: { step: 'lg', weight: 'medium' },
} as const satisfies Record<HeadingLevel, HeadingStyle>;

/** The default design: a 5px baseline, a 10px spacing unit and a minor-third type scale from a 16px body. */
export const design = {
  grid: { baseline: 5, unit: 10, root: 16 },
  type: { base: 16, ratio: 1.2, leading: { body: 1.5, falloff: 0.05, floor: 1.3 } },
  motion: {
    durations: {
      fastest: '50ms',
      faster: '100ms',
      fast: '150ms',
      normal: '200ms',
      slow: '250ms',
      slower: '300ms',
      slowest: '400ms',
    },
  },
} as const satisfies Design;
