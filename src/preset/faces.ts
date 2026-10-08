import archivo from '@capsizecss/metrics/archivo';
import fraunces from '@capsizecss/metrics/fraunces';
import ibmPlexMono from '@capsizecss/metrics/iBMPlexMono';
import karla from '@capsizecss/metrics/karla';
import shipporiMincho from '@capsizecss/metrics/shipporiMincho';
import zenKakuGothicNew from '@capsizecss/metrics/zenKakuGothicNew';

/** A face: its Google Fonts family name, the generic fallback and Capsize's vertical metrics for the file. */
export type FaceSpec = {
  family: string;
  generic: 'serif' | 'sans-serif' | 'monospace';
  metrics: typeof shipporiMincho;
};

/** The three roles a set fills. Components ask for a role, never for a family. */
export type FaceSet = { display: FaceSpec; body: FaceSpec; mono: FaceSpec };

const mono: FaceSpec = { family: 'IBM Plex Mono', generic: 'monospace', metrics: ibmPlexMono };

/**
 * The font sets. A set is one choice of display, body and mono face. Token names (`display`, `body`, `mono`) and CSS
 * variable names (`--font-display`, `--font-body`, `--font-mono`) are the same in every set, so swapping a set changes
 * no component, recipe or app markup: the app loads the set's files into those variables and Panda is generated with
 * the set's metrics.
 *
 * - `d` Shippori Mincho + Zen Kaku Gothic New. The default.
 * - `e` Archivo for both roles.
 * - `f` Fraunces + Karla.
 */
export const faceSets = {
  d: {
    display: { family: 'Shippori Mincho', generic: 'serif', metrics: shipporiMincho },
    body: { family: 'Zen Kaku Gothic New', generic: 'sans-serif', metrics: zenKakuGothicNew },
    mono,
  },
  e: {
    display: { family: 'Archivo', generic: 'sans-serif', metrics: archivo },
    body: { family: 'Archivo', generic: 'sans-serif', metrics: archivo },
    mono,
  },
  f: {
    display: { family: 'Fraunces', generic: 'serif', metrics: fraunces },
    body: { family: 'Karla', generic: 'sans-serif', metrics: karla },
    mono,
  },
} as const satisfies Record<string, FaceSet>;

/** A font set name: `d`, `e` or `f`. */
export type FaceSetName = keyof typeof faceSets;

export const DEFAULT_FACE_SET: FaceSetName = 'd';

/**
 * Resolves a set name, falling back to the default for anything unknown.
 *
 * @param name - a set name, case-insensitive.
 * @returns the set name.
 */
export function resolveFaceSet(name: string | undefined): FaceSetName {
  const key = (name ?? '').toLowerCase();
  return key in faceSets ? (key as FaceSetName) : DEFAULT_FACE_SET;
}

/** The active set. Chosen when Panda runs, by `BAIKIKAI_FACES=d|e|f`; `d` if unset. */
export const activeFaceSetName = resolveFaceSet(process.env.BAIKIKAI_FACES);
export const activeFaces: FaceSet = faceSets[activeFaceSetName];

/**
 * A CSS font stack for a face: the `next/font` variable, the family name, then the generic.
 *
 * @param role - the role, which names the CSS variable.
 * @param face - the face.
 * @returns the `font-family` value.
 */
export function fontStack(role: keyof FaceSet, face: FaceSpec) {
  return `var(--font-${role}), "${face.family}", ${face.generic}`;
}
