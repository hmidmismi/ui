import { useEffect } from 'react';
import { calibrateBaselines } from '../grid';

/**
 * Measures where this browser puts the first baseline of every face and size and hands the numbers to the CSS, so text
 * stays on the baseline grid in browsers that round font metrics differently from Chrome (see `grid/calibrate.ts`). Call it
 * once at the root of the app. It runs after the fonts load and again when they finish loading or the window is resized
 * (zoom changes how a browser rounds); nothing changes in a browser whose calculation is already right.
 */
export function useBaselineCalibration(): void {
  useEffect(() => {
    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => calibrateBaselines());
    };
    document.fonts.ready.then(run);
    document.fonts.addEventListener('loadingdone', run);
    window.addEventListener('resize', run);
    return () => {
      cancelAnimationFrame(frame);
      document.fonts.removeEventListener('loadingdone', run);
      window.removeEventListener('resize', run);
    };
  }, []);
}
