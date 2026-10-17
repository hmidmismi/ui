import { defineRecipe } from '@pandacss/dev';
import { column } from '../fragments';
import { hoverAccentSurface } from '../interaction';

/** An image in one of the named shapes. */
export const picture = defineRecipe({
  className: 'picture',
  staticCss: ['*'],
  base: { background: 'gray.3' },
  variants: {
    shape: {
      cover: { width: 'full', maxWidth: 'cover', aspectRatio: '1', objectFit: 'cover' },
      thumb: { width: 'full', aspectRatio: '1', objectFit: 'cover', borderRadius: 'l1' },
      portrait: {
        flex: '0 0 auto',
        width: { base: 'avatar.sm', md: 'avatar.md' },
        height: { base: 'avatar.sm', md: 'avatar.md' },
        objectFit: 'cover',
        borderRadius: 'full',
      },
      portraitLg: {
        width: 'avatar.lg',
        height: 'avatar.lg',
        objectFit: 'cover',
        borderRadius: 'full',
        boxShadow: 'lg',
      },
      photo: { width: 'full', aspectRatio: '3 / 2', objectFit: 'cover' },
      map: { width: 'full', aspectRatio: '3 / 1', objectFit: 'cover', borderRadius: 'l2' },
      score: {
        width: 'full',
        borderRadius: 'l2',
        borderWidth: 'hairline',
        borderColor: 'border',
        background: 'white',
      },
    },
  },
});

/** A picture with a caption. */
export const figure = defineRecipe({
  className: 'figure',
  base: { ...column, gap: '2' },
});

/** A 16:9 frame that fills with an `iframe` or a play `button`. */
export const videoFrame = defineRecipe({
  className: 'video-frame',
  base: {
    position: 'relative',
    width: 'full',
    aspectRatio: '16 / 9',
    borderRadius: 'l2',
    overflow: 'hidden',
    background: 'gray.3',
    '& iframe, & button': { position: 'absolute', inset: '0', width: 'full', height: 'full' },
    '& button': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      background: 'transparent',
      color: 'accent',
      ...hoverAccentSurface,
    },
  },
});
