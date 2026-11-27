import type { ReactNode, Ref } from 'react';
import { cover, layers, pinned } from '../../styled-system/recipes';
import { declared } from './variants';

/** Props for {@link Cover}. */
type CoverProps = {
  /** The element. Defaults to `div`. */
  as?: 'div' | 'section' | 'header';
  /** The picture, video or canvas behind the content. It fills the block. */
  media: ReactNode;
  /** A minimum height: a third of the screen, or all of it. */
  min?: 'third' | 'screen';
  /** Centers the content in the block. */
  place?: 'center';
  /** Darkens the top of the media, so light text over it stays readable. */
  scrim?: 'top';
  /** A named wash from the theme behind the media. */
  tone?: string;
  /** The accessible name, for a section. */
  label?: string;
  /** What sits over the media. */
  children?: ReactNode;
};

/**
 * A block with its media behind its content. Slot recipe `cover`.
 *
 * @param props - the element, the media, the minimum height, placement, scrim and content.
 * @returns the block.
 */
export function Cover({ as: Tag = 'div', media, min, place, scrim, tone, label, children }: CoverProps) {
  const classes = cover({ min, place, scrim, tone: tone ? declared(tone) : undefined });
  return (
    <Tag className={classes.root} aria-label={label}>
      <div className={classes.media}>{media}</div>
      <div className={classes.content}>{children}</div>
    </Tag>
  );
}

/** Props for {@link Pinned}. */
type PinnedProps = {
  /** How many screens of scroll the stage stays pinned for. */
  length: number;
  /** Pulls the track up over the end of the page above, so the stage rises over it. */
  rise?: boolean;
  /** The stage as it is after it has played: a third of a screen, not pinned. */
  short?: boolean;
  /** The accessible name. */
  label: string;
  /** The track, so scroll progress can be read from it. */
  ref?: Ref<HTMLElement>;
  /** What fills the stage. */
  children: ReactNode;
};

/**
 * A pinned stage: while the page scrolls through the track, the stage stays in the screen. Slot recipe `pinned`.
 *
 * @param props - the length, whether it rises or is short, its name, the ref and the stage content.
 * @returns the track with its stage.
 */
export function Pinned({ length, rise = false, short = false, label, ref, children }: PinnedProps) {
  const classes = pinned({ rise, short });
  return (
    <section ref={ref} className={classes.root} aria-label={label} style={{ ['--len' as string]: length }}>
      <div className={classes.stage}>{children}</div>
    </section>
  );
}

/**
 * Children laid over one another in the same place, so one can fade over another. Recipe `layers`.
 *
 * @param props - the placement, the blend and the layers.
 * @returns the stack of layers.
 */
export function Layers({ place, blend, children }: { place?: 'center'; blend?: 'difference'; children: ReactNode }) {
  return <div className={layers({ place, blend })}>{children}</div>;
}
