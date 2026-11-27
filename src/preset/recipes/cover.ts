import { defineRecipe, defineSlotRecipe } from '@pandacss/dev';
import { siteInset } from '../fragments';

/**
 * A block with a picture, video or canvas behind its content. `media` fills the block and the `content` sits over it.
 * `min` gives the block a minimum height (a third of the screen, or all of it), `place` centers the content in it, and
 * `scrim` darkens the top of the media so light text over it stays readable, and `tone` fills it with a named wash.
 */
export const cover = (tones: readonly string[]) =>
  defineSlotRecipe({
  className: 'cover',
  staticCss: ['*'],
  slots: ['root', 'media', 'content'],
  base: {
    root: { position: 'relative', isolation: 'isolate', overflow: 'hidden', display: 'grid', width: 'full' },
    media: {
      position: 'absolute',
      inset: '0',
      zIndex: 'hide',
      '& > *': { display: 'block', width: 'full', height: 'full', objectFit: 'cover' },
    },
    content: { position: 'relative', display: 'grid', ...siteInset },
  },
  variants: {
    min: {
      third: { root: { minHeight: '33.333dvh' } },
      screen: { root: { minHeight: '100dvh' } },
    },
    place: { center: { content: { alignContent: 'center', justifyItems: 'center', textAlign: 'center' } } },
    tone: Object.fromEntries(
      tones.map((tone) => [tone, { root: { background: `wash.${tone}.bg`, color: `wash.${tone}.fg` } }])
    ),
    scrim: {
      top: {
        media: {
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '0',
            background: 'linear-gradient(to bottom, token(colors.black.a7), transparent 45%)',
          },
        },
      },
    },
  },
  });

/**
 * A scroll track with a stage that stays pinned in the screen while the page scrolls through it: the track is `length`
 * screens taller than the stage. `rise` pulls the track up over the end of the page above it, for a stage that slides up
 * over it; `short` is the stage after it has played, a third of a screen with no pinning.
 */
export const pinned = defineSlotRecipe({
  className: 'pinned',
  staticCss: ['*'],
  slots: ['root', 'stage'],
  base: {
    root: { position: 'relative', height: 'calc((var(--len) + 1) * 100dvh)' },
    stage: { position: 'sticky', insetBlockStart: '0', height: '100dvh', overflow: 'hidden' },
  },
  variants: {
    rise: { true: { root: { zIndex: 'docked', marginBlockStart: '-100dvh', pointerEvents: 'none' }, stage: { pointerEvents: 'auto' } } },
    short: { true: { root: { height: '33.333dvh', marginBlockStart: '0' }, stage: { position: 'relative', height: 'full' } } },
  },
});

/** Children laid over one another in the same place, each filling it, centered with `place`. */
export const layers = defineRecipe({
  className: 'layers',
  staticCss: ['*'],
  base: { display: 'grid', '& > *': { gridArea: '1 / 1' } },
  variants: {
    place: { center: { placeItems: 'center', textAlign: 'center' } },
    // Each layer blends with what is behind it, so light text stays readable over a picture. A layer that fades must be the blended element itself.
    blend: { difference: { '& > *': { mixBlendMode: 'difference', color: 'white' } } },
  },
});
