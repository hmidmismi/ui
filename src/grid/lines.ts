/**
 * Lines of text on a baseline grid, in plain CSS.
 *
 * A browser draws the first baseline of a line at a fixed distance below the top of its line box, and that distance
 * depends on the font. These functions compute it in CSS from the font's own metrics, then move the line so the baseline
 * falls on a grid line while the box keeps its size. They return CSS values and style objects; nothing here knows about
 * a framework, a design or a token system.
 *
 * Every length is a CSS expression, so `line` can be `1.5625rem` or `var(--line)` and `baseline` can be `5px` or
 * `token(spacing.1)`.
 */

/** A style object: CSS properties and nested selectors, for any CSS-in-JS tool. */
export type Style = Record<string, unknown>;

/** The names of the CSS variables that hold a face's metrics, each as a number of em. */
export type FaceVars = {
  /** The ascent: the distance from the baseline to the top of the line the font wants. */
  asc: string;
  /** The descent: the same below the baseline, as a positive number. */
  desc: string;
  /** The height of the capitals. Only the trim reads it. */
  capHeight: string;
  /**
   * The name of a CSS variable that holds the baseline offset measured in the running browser for this face and size
   * (see `calibrate.ts`). When it is set it replaces the calculation, so a browser that places baselines differently from
   * the calculation is still exact. Left out, the calculation is used.
   */
  measured?: string;
};

/**
 * The distance from the top of a line box to the first baseline, as a CSS expression.
 *
 * Browsers round the font's ascent and descent to whole pixels and put the baseline half of the leftover line height below
 * the top of the line, rounded down. The same arithmetic here gives the same number.
 *
 * @param line - the line height.
 * @param vars - the face's metric variables.
 * @returns a CSS length.
 */
export function baselineOffset(line: string, vars: FaceVars): string {
  const em = (name: string) => `calc(var(${name}) * 1em)`;
  const ascent = `round(nearest, ${em(vars.asc)}, 1px)`;
  const descent = `round(nearest, ${em(vars.desc)}, 1px)`;
  const calculated = `round(down, calc((${line} + ${ascent} - ${descent}) / 2), 1px)`;
  return vars.measured ? `var(${vars.measured}, ${calculated})` : calculated;
}

/**
 * How far the first baseline must move to reach the nearest grid line, as a CSS expression (negative moves it up).
 *
 * @param line - the line height.
 * @param vars - the face's metric variables.
 * @param baseline - one grid row.
 * @returns a CSS length.
 */
export function snapDistance(line: string, vars: FaceVars, baseline: string): string {
  const offset = baselineOffset(line, vars);
  return `calc(round(nearest, ${offset}, ${baseline}) - ${offset})`;
}

/**
 * Puts the first baseline of a block of text on a grid line without changing its height or its box: the line is moved by
 * a margin on `::before` and the opposite margin on `::after`. For a block whose text is its own, not a flex or grid
 * container (whose pseudo-elements would become items). The block must start on a grid line.
 *
 * @param line - the line height, a whole number of rows.
 * @param vars - the face's metric variables.
 * @param baseline - one grid row.
 * @returns the style.
 */
export function lineShift(line: string, vars: FaceVars, baseline: string): Style {
  const shift = snapDistance(line, vars, baseline);
  return {
    '&::before': { content: '""', display: 'table', marginBottom: shift },
    '&::after': { content: '""', display: 'table', marginTop: `calc(-1 * ${shift})` },
  };
}

/**
 * The same shift as margins on the element itself, for an item of a flex or grid container (whose margins never collapse)
 * and for text that clips with an ellipsis, which pseudo-elements would break. It moves the item's box too, so not for
 * text inside a box with its own background or border.
 *
 * @param line - the line height, a whole number of rows.
 * @param vars - the face's metric variables.
 * @param baseline - one grid row.
 * @returns the style.
 */
export function lineMargins(line: string, vars: FaceVars, baseline: string): Style {
  const shift = snapDistance(line, vars, baseline);
  return { marginBlockStart: shift, marginBlockEnd: `calc(-1 * ${shift})` };
}

/**
 * Trims a block to the space between the top of its capitals and its baseline, so padding is measured from the letters.
 * With `snap` the block is rounded up to whole rows, with the space added above the capitals, so the baseline sits on a
 * grid line and the next block starts on one. For a block box only.
 *
 * @param line - the line height, a whole number of rows.
 * @param vars - the face's metric variables.
 * @param baseline - one grid row.
 * @param snap - whether to round the trimmed height up to whole rows.
 * @returns the style.
 */
export function trim(line: string, vars: FaceVars, baseline: string, snap: boolean): Style {
  const offset = baselineOffset(line, vars);
  const capHeight = `calc(var(${vars.capHeight}) * 1em)`;
  const height = snap ? `round(up, ${capHeight}, ${baseline})` : capHeight;
  return {
    '&::before': { content: '""', display: 'table', marginBottom: `calc(${height} - ${offset})` },
    '&::after': { content: '""', display: 'table', marginTop: `calc(${offset} - ${line})` },
  };
}

/**
 * The same shift by moving the element with `position: relative`, for a block that can use neither pseudo-elements (a
 * disclosure summary, whose marker the browsers lay out differently) nor margins (that could collapse). Its box keeps its place
 * in the layout, so only for text with no background or border of its own.
 *
 * @param line - the line height.
 * @param vars - the face's metric variables.
 * @param baseline - one grid row.
 * @returns the style.
 */
export function lineRelative(line: string, vars: FaceVars, baseline: string): Style {
  return { position: 'relative', insetBlockStart: snapDistance(line, vars, baseline) };
}

/** The fixed height of a box that centers one line of text, and the edges inside it that take space. */
export type CenteredBox = {
  /** The height of the box, border box included. */
  height: string;
  /** A border or padding at the top that the text is centered below. Defaults to none. */
  top?: string;
  /** The same at the bottom. */
  bottom?: string;
  /**
   * The box also holds an icon or other items that the browser keeps centered. The text then moves with them, by unequal
   * padding that shifts the whole centered content, instead of being placed from the top.
   */
  items?: boolean;
};

/**
 * Puts the first baseline of one line of text on the grid line nearest to where centering it in a fixed-height box would
 * put it. The text is placed by padding from the top of the box, not by the browser's centering, which browsers round in
 * different ways, so the result is exact everywhere and the box keeps its size. For text-only controls, tabs and badges; text
 * beside an icon needs its own slot and `lineMargins`.
 *
 * @param line - the line height.
 * @param vars - the face's metric variables.
 * @param baseline - one grid row.
 * @param box - the box's height and the edges inside it.
 * @returns the style.
 */
export function centeredLine(
  line: string,
  vars: FaceVars,
  baseline: string,
  box: CenteredBox
): Style {
  const top = box.top ?? '0px';
  const bottom = box.bottom ?? '0px';
  const offset = baselineOffset(line, vars);
  const centered = `calc(${top} + (${box.height} - ${top} - ${bottom} - ${line}) / 2 + ${offset})`;
  if (box.items) {
    const shift = `calc(round(nearest, ${centered}, ${baseline}) - ${centered})`;
    return {
      paddingBlockStart: `max(0px, calc(2 * ${shift}))`,
      paddingBlockEnd: `max(0px, calc(-2 * ${shift}))`,
    };
  }
  return {
    alignItems: 'flex-start',
    paddingBlockStart: `max(0px, calc(round(nearest, ${centered}, ${baseline}) - ${top} - ${offset}))`,
    paddingBlockEnd: '0px',
  };
}

/**
 * Puts the first baseline of text on a grid line in a box whose height comes from its own padding (an auto-height box with
 * `padding-block`), by moving the same amount of padding from below to above or the reverse. The box keeps its height. The
 * padding must be at least half a row on both sides.
 *
 * @param line - the line height.
 * @param vars - the face's metric variables.
 * @param baseline - one grid row.
 * @param padding - the padding above and below the text as set, and a border above it that takes space.
 * @returns the style.
 */
export function paddedLine(
  line: string,
  vars: FaceVars,
  baseline: string,
  padding: { block: string; border?: string }
): Style {
  const natural = `calc(${padding.border ?? '0px'} + ${padding.block} + ${baselineOffset(line, vars)})`;
  const shift = `calc(round(nearest, ${natural}, ${baseline}) - ${natural})`;
  return {
    paddingBlockStart: `calc(${padding.block} + ${shift})`,
    paddingBlockEnd: `calc(${padding.block} - ${shift})`,
  };
}
