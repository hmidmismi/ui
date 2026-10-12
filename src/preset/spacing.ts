import { defineTokens } from '@pandacss/dev';
import { type Design, design } from '../design';
import { createScale } from './scale';

/**
 * The spacing scale. A token's name is its number of 5px baselines, so `spacing.4` is 20px. Even names are the 10px
 * scale (2, 4, 6, 8, 10, 12, ...); odd names (1, 3, 5, 7, 9) are the 5px utility steps. Every value is a whole number
 * of baselines, so spacing never breaks the vertical rhythm set by line heights in `type-scale.ts`.
 *
 * | token | px  | token | px  | token | px  |
 * | ----- | --- | ----- | --- | ----- | --- |
 * | 1     | 5   | 8     | 40  | 20    | 100 |
 * | 2     | 10  | 9     | 45  | 24    | 120 |
 * | 3     | 15  | 10    | 50  | 32    | 160 |
 * | 4     | 20  | 12    | 60  | 40    | 200 |
 * | 5     | 25  | 14    | 70  | 48    | 240 |
 * | 6     | 30  | 16    | 80  | 64    | 320 |
 * | 7     | 35  | 18    | 90  |       |     |
 */
const STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24, 32, 40, 48, 64] as const;

/**
 * The scale as token values for a design, shared by `spacing` and `sizes`.
 *
 * @param d - the design (only its grid is read).
 * @returns the values, keyed by baseline count.
 */
export function scaleValuesFor(d: Pick<Design, 'grid'>) {
  const { baselines } = createScale(d);
  return Object.fromEntries(
    STEPS.map((count) => [String(count), { value: count === 0 ? '0px' : baselines(count) }])
  );
}

/** The scale as tokens for the default design. */
export const scaleValues = scaleValuesFor(design);

/**
 * The spacing tokens for a design.
 *
 * @param d - the design.
 * @returns the tokens.
 */
export const spacingFor = (d: Pick<Design, 'grid'>) => defineTokens.spacing(scaleValuesFor(d));

export const spacing = spacingFor(design);
