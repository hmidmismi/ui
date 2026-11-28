// packages/ui/tests/visual/guides.mjs
// The script inside each page the report shows: it draws the baseline lines (one per baseline)
// and the twelve columns of the page's column grid over the page, and follows the window as it is resized. The parent
// report turns each on and off with a message.
export function guides(baseline, describeStep) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:absolute;left:0;top:0;width:100%;pointer-events:none;z-index:99999';
  document.body.style.position = 'relative';
  document.body.append(overlay);
  const state = { lines: true, columns: true };
  const draw = () => {
    const root = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    const grid = (baseline * root) / 16;
    const height = document.documentElement.scrollHeight;
    const first = document.querySelector('.column-grid');
    // The static page has no React running, so the style book's readouts are filled in here with the same function.
    for (const step of document.querySelectorAll('[data-step]')) {
      const sample = step.querySelector('[data-sample]')?.firstElementChild;
      const readout = step.querySelector('[data-readout]');
      if (sample && readout) readout.textContent = describeStep(sample, grid);
    }
    const parts = [];
    if (state.columns && first) {
      const box = first.getBoundingClientRect();
      const gap = Number.parseFloat(getComputedStyle(first).columnGap) || 0;
      const column = (box.width - gap * 11) / 12;
      for (let i = 0; i < 12; i++)
        parts.push(`<div style="position:absolute;top:0;height:${height}px;left:${box.left + i * (column + gap)}px;width:${column}px;background:rgba(0,120,255,.12)"></div>`);
    }
    // One line per baseline, drawn in the pixel above each multiple, which is where a glyph's baseline rests.
    if (state.lines)
      parts.push(
        `<div style="position:absolute;inset:0;height:${height}px;background-image:repeating-linear-gradient(to bottom,transparent 0,transparent ${grid - 1}px,rgba(255,0,80,.55) ${grid - 1}px,rgba(255,0,80,.55) ${grid}px)"></div>`
      );
    overlay.style.height = `${height}px`;
    overlay.innerHTML = parts.join('');
  };
  addEventListener('message', (event) => {
    Object.assign(state, event.data);
    draw();
  });
  addEventListener('resize', draw);
  addEventListener('load', draw);
  draw();
}
