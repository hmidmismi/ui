export const conditions = {
  extend: {
    light: ':root &, .light &',
    dark: '&.dark, .dark &',
    invalid: '&:is(:user-invalid, [data-invalid], [aria-invalid=true])',
    hover: { '@media (hover: hover)': { '&:not(:disabled):hover': '@slot' as const } },
    active: '&:not(:disabled):active',
    checked:
      '&:is(:checked, [data-checked], [data-state=checked], [aria-checked=true], [data-state=indeterminate])',
    on: '&:is([data-state=on])',
    pinned: '&:is([data-pinned])',
    // The masthead's own width, in `rem` of the page's root size: from here the utility links sit at the start, then the full name.
    mastLg: '@container (min-width: 56rem)',
    mastXl: '@container (min-width: 80rem)',
  },
};
