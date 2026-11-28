// packages/ui/tests/visual/report.mjs
// Turns the visual run's JSON result and the saved screenshots into one page and opens it: the outcome of each check, and the
// pictures. Run by `pnpm test:visual` after the tests.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const here = import.meta.dirname;
const result = JSON.parse(readFileSync(join(here, '../../.vitest/visual.json'), 'utf8'));
const tests = result.testResults.flatMap((file) => file.assertionResults);
const failed = tests.filter((t) => t.status === 'failed');
const esc = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rows = tests
  .map((t) => `<li class="${t.status}"><b>${t.status === 'passed' ? 'pass' : t.status}</b> ${esc(t.fullName)}${t.failureMessages?.length ? `<pre>${esc(t.failureMessages.join('\n').slice(0, 600))}</pre>` : ''}</li>`)
  .join('');
const viewer = `<section class="viewer"><div class="bar">
<span>Mode</span>${['free', 'scaled', 'baseline'].map((m) => `<button data-mode="${m}">${m}</button>`).join('')}
<span>Type ratio (scaled)</span>${[['1.125', 'major second'], ['1.2', 'minor third'], ['1.25', 'major third'], ['1.333', 'perfect fourth'], ['1.5', 'perfect fifth']].map(([r, n]) => `<button data-ratio="${r}" title="${n}">${r}</button>`).join('')}
<span>Width</span>${[390, 768, 1024, 1440].map((w) => `<button data-width="${w}">${w}</button>`).join('')}
<label><input type="checkbox" id="lines" checked> baseline lines (every 5px at a 16px root; free has no grid, so there they only show the drift)</label><label><input type="checkbox" id="columns" checked> 12 columns</label></div>
<div class="frame"><iframe id="page" title="The page in the chosen mode" src="pages/free.html"></iframe></div></section>
<script>
const frame = document.getElementById('page');
const state = { mode: 'free', ratio: '1.2', width: 1440 };
const send = () => frame.contentWindow.postMessage({ lines: lines.checked, columns: columns.checked }, '*');
const apply = () => {
  const file = state.mode === 'scaled' && state.ratio !== '1.2' ? 'scaled-' + state.ratio : state.mode;
  if (!frame.src.endsWith('pages/' + file + '.html')) frame.src = 'pages/' + file + '.html';
  frame.style.width = state.width + 'px';
  for (const b of document.querySelectorAll('[data-mode]')) b.classList.toggle('on', b.dataset.mode === state.mode);
  for (const b of document.querySelectorAll('[data-ratio]')) b.classList.toggle('on', b.dataset.ratio === state.ratio);
  for (const b of document.querySelectorAll('[data-width]')) b.classList.toggle('on', +b.dataset.width === state.width);
};
document.addEventListener('click', (e) => {
  if (e.target.dataset.mode) {
    state.mode = e.target.dataset.mode;
    state.ratio = '1.2';
  }
  if (e.target.dataset.ratio) {
    state.ratio = e.target.dataset.ratio;
    state.mode = 'scaled';
  }
  if (e.target.dataset.width) state.width = +e.target.dataset.width;
  apply();
});
lines.onchange = columns.onchange = send;
frame.onload = send;
apply();
</script>`;
const html = `<!doctype html><meta charset="utf-8"><title>Visual tests</title>
<style>body{font:14px system-ui;margin:0;background:#fff;color:#111}main{padding:1.5rem 2rem}h1{font-size:2rem;margin:0 0 1rem}h2{font-size:1.5rem}h1.ok{color:#066b4a}h1.bad{color:#b01e1e}ul{padding:0;list-style:none;columns:2}li{padding:.2rem 0;break-inside:avoid}.passed b{color:#066b4a}.failed b{color:#b01e1e}pre{background:#f4f4f4;padding:.5rem;overflow:auto}
.viewer{border-top:1px solid #ccc}.bar{position:sticky;top:0;z-index:2;display:flex;gap:.75rem;align-items:center;flex-wrap:wrap;padding:.75rem 2rem;background:#fff;border-bottom:1px solid #ccc}
button{font:inherit;padding:.3rem .8rem;border:1px solid #888;background:#fff;cursor:pointer}button.on{background:#111;color:#fff}
.frame{overflow:auto;background:#ddd;padding:1rem 2rem}iframe{display:block;height:calc(100vh - 7rem);border:0;background:#fff;max-width:none}</style>
<main><h1 class="${failed.length ? 'bad' : 'ok'}">${failed.length ? `${failed.length} failed` : 'All passed'}: ${tests.length - failed.length} of ${tests.length} checks</h1>
<details><summary>All checks</summary><ul>${rows}</ul></details></main>${viewer}`;
const out = join(here, 'report.html');
writeFileSync(out, html);
console.log(`${failed.length ? 'FAILED' : 'PASSED'}: ${tests.length - failed.length}/${tests.length} checks. Report: ${out}`);
if (process.platform === 'darwin') execFileSync('open', [out]);
process.exitCode = failed.length ? 1 : 0;
