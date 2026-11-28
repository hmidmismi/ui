/**
 * What a piece of text is drawn at: its size and line height in px, the leading, and how many baselines the line is. It is
 * one self-contained function, with no imports, so the visual tests can also put it into a page that React does not run in.
 *
 * @param element - a rendered element of text.
 * @param baseline - the baseline in px, or 0 when it is not known.
 * @returns for example `16px on 25px · 1.56 · 5 baselines`.
 */
export function describeStep(element: Element, baseline: number): string {
  const style = getComputedStyle(element);
  const size = Number.parseFloat(style.fontSize);
  const line = Number.parseFloat(style.lineHeight);
  const tenth = (value: number) => Math.round(value * 10) / 10;
  const lines = baseline > 0 ? ` · ${tenth(line / baseline)} baselines` : '';
  return `${tenth(size)}px on ${tenth(line)}px · ${Math.round((line / size) * 100) / 100}${lines}`;
}
