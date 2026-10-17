import { useEffect, useState } from 'react';

/** Extra space below the sticky header and jump bar before a section counts as reached, in px (Rev 19 §5.5). */
const REACH = 24;

/**
 * Tracks which of the given sections the reader is in, for a jump bar. The current section is the last one whose top is
 * at or above the header height plus the jump bar height plus 24px; the first one when none is, and the last one at the
 * bottom of the page. The heights come from `--bh` and `--jh`, which the header and the jump bar publish.
 *
 * @param ids - the section element ids, in page order.
 * @returns the active section id.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const key = ids.join('|');

  useEffect(() => {
    const sections = key.split('|');
    let frame = 0;
    const measure = () => {
      frame = 0;
      const styles = getComputedStyle(document.documentElement);
      const line =
        (Number.parseFloat(styles.getPropertyValue('--bh')) || 0) +
        (Number.parseFloat(styles.getPropertyValue('--jh')) || 0) +
        REACH;
      let current = sections[0] ?? null;
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) current = id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActive(atBottom ? (sections[sections.length - 1] ?? current) : current);
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}
