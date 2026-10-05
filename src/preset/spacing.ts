import { defineTokens } from '@pandacss/dev';
import { baselines } from './scale';

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

/** The scale as tokens, shared by `spacing` and `sizes`. */
export const scaleValues = Object.fromEntries(
  STEPS.map((count) => [String(count), { value: count === 0 ? '0px' : baselines(count) }])
);

export const spacing = defineTokens.spacing(scaleValues);
