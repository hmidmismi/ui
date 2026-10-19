/// <reference lib="dom" />
/**
 * Measures where the running browser puts the first baseline of each face and size, and hands the numbers to the CSS.
 *
 * The CSS works the offset out from the font's metrics the way Chrome does. Other browsers round metrics differently (Firefox
 * is up to a pixel off), so each face and size gets a CSS variable that this fills in with the measured offset; the CSS uses
 * it when it is set. Run it in the browser after the fonts load. It changes nothing in a browser whose calculation is right.
 */

/** The faces a project sets text in. */
export const CALIBRATED_ROLES = ['display', 'body', 'mono'] as const;

/** The type steps, `xs` to `7xl`. */
export const CALIBRATED_STEPS = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
] as const;

/** The variable that holds the measured offset of long-form body text. */
export const LONGFORM_OFFSET_VAR = '--ui-baseline-body-longform';

/**
 * The name of the CSS variable that holds the measured baseline offset of a face at a step.
 *
 * @param role - the face.
 * @param step - the type step.
 * @returns the variable name.
 */
export const measuredOffsetVar = (role: string, step: string) => `--ui-baseline-${role}-${step}`;

/**
 * Measures every face and step and sets the variables on the root element.
 *
 * Each probe is a block with the same font, size and line height a text style of that face and step has, and a zero-size
 * inline-block on its baseline. The offset is the distance from the top of the block to the probe.
 *
 * @param root - the element to set the variables on. Defaults to the document element.
 * @returns the offsets that were measured, by variable name.
 */
export function calibrateBaselines(
  root: HTMLElement = document.documentElement
): Record<string, string> {
  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText =
    'position:absolute;visibility:hidden;pointer-events:none;top:0;left:0;width:1px;overflow:hidden';
  document.body.appendChild(host);
  const measured: Record<string, string> = {};
  for (const role of CALIBRATED_ROLES) {
    for (const step of CALIBRATED_STEPS) {
      const block = document.createElement('div');
      block.style.cssText = `font-family:var(--fonts-${role});font-size:calc(var(--font-sizes-${step}) * var(--ui-${role}-adj, 1));line-height:var(--line-heights-${step});white-space:nowrap`;
      const probe = document.createElement('span');
      probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      block.append(probe, 'Hxg');
      host.appendChild(block);
      const offset = probe.getBoundingClientRect().bottom - block.getBoundingClientRect().top;
      measured[measuredOffsetVar(role, step)] = `${Math.round(offset * 64) / 64}px`;
    }
  }
  // Long-form body text sets the `lg` size on a line of seven rows instead of the step's own line height.
  const longform = document.createElement('div');
  longform.style.cssText =
    'font-family:var(--fonts-body);font-size:calc(var(--font-sizes-lg) * var(--ui-body-adj, 1));line-height:var(--spacing-7);white-space:nowrap';
  const longformProbe = document.createElement('span');
  longformProbe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
  longform.append(longformProbe, 'Hxg');
  host.appendChild(longform);
  const longformOffset =
    longformProbe.getBoundingClientRect().bottom - longform.getBoundingClientRect().top;
  measured[LONGFORM_OFFSET_VAR] = `${Math.round(longformOffset * 64) / 64}px`;
  host.remove();
  for (const [name, value] of Object.entries(measured)) root.style.setProperty(name, value);
  return measured;
}
