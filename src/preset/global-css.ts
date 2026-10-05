/**
 * Base styles for every app: global color variables, the canvas background and body text role, the focus ring, an
 * optional baseline-grid overlay, and print and reduced-motion rules. Add the `dark` class to `<html>` for dark mode.
 * Element looks such as headings live in recipes, not here.
 *
 * Set `data-baseline-grid` on `<html>` to overlay the 5px baseline (a faint line every 5px, a stronger one every 10px)
 * and check that blocks sit on the rhythm.
 */
export const globalCss = {
  extend: {
    '*': {
      '--global-color-border': 'colors.border',
      '--global-color-placeholder': 'colors.fg.subtle',
      '--global-color-selection': 'colors.colorPalette.subtle.bg',
      '--global-color-focus-ring': 'colors.colorPalette.solid.bg',
    },
    html: {
      colorPalette: 'gray',
      colorScheme: 'light',
      fontFamily: 'body',
      fontSize: '100%',
      scrollBehavior: 'smooth',
      textSizeAdjust: '100%',
    },
    'html.dark': {
      colorScheme: 'dark',
    },
    body: {
      background: 'canvas',
      color: 'fg.default',
      fontFamily: 'body',
      fontSize: 'md',
      lineHeight: 'md',
      textRendering: 'optimizeLegibility',
    },
    ':focus-visible': {
      outline: '2px solid',
      outlineColor: 'accent.9',
      outlineOffset: '2px',
    },
    'html[data-baseline-grid]::after': {
      content: '""',
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '9999',
      backgroundImage:
        'repeating-linear-gradient(to bottom, color-mix(in srgb, red 38%, transparent) 0 1px, transparent 1px 10px), repeating-linear-gradient(to bottom, color-mix(in srgb, red 14%, transparent) 0 1px, transparent 1px 5px)',
    },
    '@media print': {
      '[data-no-print]': { display: 'none !important' },
      body: { background: 'white', color: 'black' },
      a: { color: 'inherit', textDecoration: 'underline' },
    },
    '@media (prefers-reduced-motion: reduce)': {
      html: { scrollBehavior: 'auto' },
      '*, *::before, *::after': {
        animationDuration: '0.01ms !important',
        animationIterationCount: '1 !important',
        transitionDuration: '0.01ms !important',
      },
    },
  },
};
