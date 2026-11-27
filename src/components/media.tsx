import type { ReactNode } from 'react';
import { embedFrame, figure, picture, videoFrame } from '../../styled-system/recipes';
import { Text } from './typography';

/** The picture shapes. */
export type PictureShape =
  | 'cover'
  | 'thumb'
  | 'portrait'
  | 'portraitLg'
  | 'photo'
  | 'map'
  | 'fill'
  | 'score';

/** Props for {@link Picture}. */
type PictureProps = {
  /** The shape and size. */
  shape: PictureShape;
  /** The image URL. */
  src: string;
  /** The alt text. */
  alt: string;
  /** The intrinsic width, to reserve space. */
  width: number;
  /** The intrinsic height, to reserve space. */
  height: number;
  /** Loads at high priority instead of lazily, for the image at the top of the page. */
  priority?: boolean;
};

/**
 * An image in one of the named shapes. It loads lazily unless it is marked as priority. Recipe `picture`.
 *
 * @param props - the shape, source, alt text, intrinsic size and priority.
 * @returns the image.
 */
export function Picture({ shape, src, alt, width, height, priority = false }: PictureProps) {
  const classes = picture({ shape });

  return (
    <span className={classes.frame}>
      <img
        className={classes.image}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? undefined : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />
    </span>
  );
}

/** Props for {@link Figure}. */
type FigureProps = {
  /** The caption under the picture. */
  caption: ReactNode;
  /** A credit line under the caption, such as a photographer and license. */
  credit?: ReactNode;
  /** The picture. */
  children: ReactNode;
};

/**
 * A picture with a caption and an optional credit line. Recipe `figure`.
 *
 * @param props - the caption, the credit and the picture.
 * @returns the figure.
 */
export function Figure({ caption, credit, children }: FigureProps) {
  return (
    <figure className={figure()}>
      {children}
      <figcaption>
        <Text variant="caption" as="span">{caption}</Text>
        {credit && <Text variant="caption" as="div">{credit}</Text>}
      </figcaption>
    </figure>
  );
}

/**
 * A 16:9 frame that fills with an `iframe` or a play `button`. Recipe `videoFrame`.
 *
 * @param props - the content.
 * @returns the frame.
 */
export function VideoFrame({ children }: { children: ReactNode }) {
  const classes = videoFrame();

  return (
    <div className={classes.frame}>
      <div className={classes.root}>{children}</div>
    </div>
  );
}

/** Props for {@link EmbedFrame}. */
type EmbedFrameProps = {
  /** The address of the form to show. */
  src: string;
  /** The accessible name of the frame. */
  title: string;
  /** The `sandbox` permissions the framed page needs. */
  sandbox?: string;
};

/**
 * A tall frame holding an embedded form from another site, such as a registration form. It loads lazily, takes the
 * frame's width, and scrolls inside when the form is longer. Recipe `embedFrame`.
 *
 * @param props - the address, the accessible name and the sandbox permissions.
 * @returns the frame.
 */
export function EmbedFrame({ src, title, sandbox }: EmbedFrameProps) {
  const classes = embedFrame();

  return (
    <div className={classes.frame}>
      <div className={classes.root}>
        <iframe src={src} title={title} sandbox={sandbox} loading="lazy" />
      </div>
    </div>
  );
}
