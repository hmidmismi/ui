import { useEffect, useRef, useState } from 'react';
import { css } from '../../styled-system/css';
import { Cell, Grid } from '../components/layout';
import { PageColumn } from '../components/page';

const HEIGHT = '--grid-overlay-height';
// The columns are a developer's tool, not part of the theme: a fixed translucent color that shows on light and dark pages.
const COLUMN = 'rgba(0, 120, 255, 0.12)';

const root = css({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  // Set to the page's height by the component once it is shown; declared here so the variable always has a value.
  [HEIGHT]: '0px',
  height: `var(${HEIGHT})`,
  pointerEvents: 'none',
  zIndex: 9998,
});
// The page's own column grid, drawn with the same components, so the columns are exactly where content is placed. Below
// `md` the page has no columns.
const columns = css({ position: 'absolute', inset: '0', display: { base: 'none', md: 'block' } });
const column = css({ height: `var(${HEIGHT})`, background: COLUMN });

/** Whether the event came from a field the reader is typing in. */
const typing = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null;
  return !!target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
};

/**
 * Shows the grid over the whole page, to check that everything lines up: the baseline lines (the preset's own
 * `data-baseline-grid` on the page, one line per `spacing.1`) and the twelve columns (drawn here with the page's own
 * column grid). It is hidden until `g` is pressed (outside a field) or the address has `?grid`. Mount it once, in the
 * page frame, for development and preview only. It reads the page's own spacing token and column grid, so it shows
 * whichever grid mode and root size the page is drawn in.
 *
 * @returns the overlay.
 */
export function GridOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setShown(new URLSearchParams(window.location.search).has('grid'));
    const toggle = (event: KeyboardEvent) => {
      if (event.key === 'g' && !event.metaKey && !event.ctrlKey && !event.altKey && !typing(event)) setShown((on) => !on);
    };
    window.addEventListener('keydown', toggle);
    return () => window.removeEventListener('keydown', toggle);
  }, []);

  // The baseline lines are the preset's own, switched on with an attribute on the page.
  useEffect(() => {
    document.documentElement.toggleAttribute('data-baseline-grid', shown);
    return () => document.documentElement.removeAttribute('data-baseline-grid');
  }, [shown]);

  // The columns are as tall as the page, so they scroll with it.
  useEffect(() => {
    if (!shown) return;
    const element = ref.current;
    const size = () => element?.style.setProperty(HEIGHT, `${document.documentElement.scrollHeight}px`);
    size();
    const observer = new ResizeObserver(size);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <div ref={ref} className={root} hidden={!shown} aria-hidden>
      <div className={columns}>
        <PageColumn>
          <Grid>
            {Array.from({ length: 12 }, (_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: twelve fixed columns
              <Cell key={index} span="1">
                <div className={column} />
              </Cell>
            ))}
          </Grid>
        </PageColumn>
      </div>
    </div>
  );
}
