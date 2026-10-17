import { defineRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';

/** A flat field standing in for a video or photo until media is attached. */
export const placeholder = ({ labelCaps }: TypeSystem) =>
  defineRecipe({
    className: 'placeholder',
    base: {
      alignItems: 'center',
      bg: 'gray.12',
      color: 'gray.1',
      display: 'flex',
      justifyContent: 'center',
      width: 'full',
      ...labelCaps,
    },
    defaultVariants: { ratio: 'video' },
    variants: {
      ratio: {
        video: { aspectRatio: '16 / 9' },
        photo: { aspectRatio: '4 / 3' },
      },
    },
  });
