import type { Face, FaceMetrics, Role, Theme } from './types';

/** The CSS variable names a theme sets. Components never read these directly; tokens and the type system do. */
export const themeVars = {
  ink: '--ui-ink',
  paper: '--ui-paper',
  line: '--ui-line',
  accent: '--ui-accent',
  accentSoft: '--ui-accent-soft',
  danger: '--ui-danger',
  dangerSoft: '--ui-danger-soft',
  display: '--ui-font-display',
  body: '--ui-font-body',
  mono: '--ui-font-mono',
} as const;

/** The per-role numbers the type system reads to size and trim text (all unitless). */
export type FaceVar = 'adj' | 'cap' | 'base' | 'normal';

/**
 * The CSS variable holding one of a role's type numbers.
 *
 * - `adj`: how much larger the face is set so its x-height equals the body face's.
 * - `cap`: the space above the capitals inside the content area, in em: (ascent - capHeight + lineGap / 2) / unitsPerEm.
 * - `base`: the space below the baseline, in em: (|descent| + lineGap / 2) / unitsPerEm.
 * - `normal`: the face's natural line height, in em: (ascent + lineGap + |descent|) / unitsPerEm.
 *
 * @param role - the role.
 * @param key - which number.
 * @returns the variable name.
 */
export const faceVar = (role: Role, key: FaceVar) => `--ui-${role}-${key}`;

/**
 * A CSS font stack for a face: the app's variable if it set one, then the family name, then the generic. The family and
 * generic sit inside the `var()` as its fallback, so the stack stays valid when the app never defines the variable (a
 * bare `var(--x), "Family"` would be invalid and the text would fall back to the browser default).
 *
 * @param face - the face.
 * @returns the `font-family` value.
 */
export function fontStack(face: Pick<Face, 'family' | 'generic' | 'cssVar'>) {
  const stack = `"${face.family}", ${face.generic}`;
  return face.cssVar ? `var(${face.cssVar}, ${stack})` : stack;
}

/**
 * How much larger a face is set so its lowercase x-height equals the reference face's at the same step.
 *
 * @param reference - the metrics of the reference (body) face.
 * @param metrics - the metrics of the face being matched.
 * @returns the multiplier, 1 for the reference face.
 */
export function xHeightAdjust(reference: FaceMetrics, metrics: FaceMetrics) {
  return reference.xHeight / reference.unitsPerEm / (metrics.xHeight / metrics.unitsPerEm);
}

const round = (value: number) => String(Math.round(value * 100000) / 100000);

/**
 * The type numbers of a face, as the variables the type system reads.
 *
 * @param role - the role.
 * @param metrics - the face's metrics.
 * @param reference - the body face's metrics.
 * @returns the variables.
 */
function faceVariables(role: Role, metrics: FaceMetrics, reference: FaceMetrics) {
  const upm = metrics.unitsPerEm;
  const descent = Math.abs(metrics.descent);
  return {
    [faceVar(role, 'adj')]: round(xHeightAdjust(reference, metrics)),
    [faceVar(role, 'cap')]: round((metrics.ascent - metrics.capHeight + metrics.lineGap / 2) / upm),
    [faceVar(role, 'base')]: round((descent + metrics.lineGap / 2) / upm),
    [faceVar(role, 'normal')]: round((metrics.ascent + metrics.lineGap + descent) / upm),
  };
}

/**
 * A theme as a map of CSS variable to value.
 *
 * @param theme - the theme.
 * @returns the variables.
 */
export function themeVariables(theme: Theme): Record<string, string> {
  const { palette, faces } = theme;
  const reference = faces.body.metrics;
  return {
    [themeVars.ink]: palette.ink,
    [themeVars.paper]: palette.paper,
    [themeVars.line]: palette.line,
    [themeVars.accent]: palette.accent,
    [themeVars.accentSoft]: palette.accentSoft,
    [themeVars.danger]: palette.danger,
    [themeVars.dangerSoft]: palette.dangerSoft,
    [themeVars.display]: fontStack(faces.display),
    [themeVars.body]: fontStack(faces.body),
    [themeVars.mono]: fontStack(faces.mono),
    ...faceVariables('display', faces.display.metrics, reference),
    ...faceVariables('body', faces.body.metrics, reference),
    ...faceVariables('mono', faces.mono.metrics, reference),
  };
}

/**
 * A theme as CSS text. Emit it from a build script into a `theme.css`, optionally scoped to a selector so one part of
 * a site can use another theme.
 *
 * @param theme - the theme.
 * @param selector - where the variables apply. Defaults to `:root`.
 * @returns the CSS.
 */
export function toCss(theme: Theme, selector = ':root') {
  const lines = Object.entries(themeVariables(theme)).map(([name, value]) => `  ${name}: ${value};`);
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}
