import { describe, expect, it } from 'vitest';
import { baselineOffset, createRules, lineMargins, lineShift, snapDistance, trim } from './index';

const vars = { asc: '--a', desc: '--d', capHeight: '--c' };

describe('lines', () => {
  it('computes the baseline the way a browser places it', () => {
    expect(baselineOffset('20px', vars)).toBe(
      'round(down, calc((20px + round(nearest, calc(var(--a) * 1em), 1px) - round(nearest, calc(var(--d) * 1em), 1px)) / 2), 1px)'
    );
  });

  it('moves a line with opposite margins so the box keeps its size', () => {
    const style = lineShift('20px', vars, '5px') as Record<string, Record<string, string>>;
    const shift = snapDistance('20px', vars, '5px');
    expect(style['&::before']?.marginBottom).toBe(shift);
    expect(style['&::after']?.marginTop).toBe(`calc(-1 * ${shift})`);
    expect(lineMargins('20px', vars, '5px')).toEqual({
      marginBlockStart: shift,
      marginBlockEnd: `calc(-1 * ${shift})`,
    });
  });

  it('trims to the capitals, and rounds up to a row when it snaps', () => {
    const plain = JSON.stringify(trim('20px', vars, '5px', false));
    const snapped = JSON.stringify(trim('20px', vars, '5px', true));
    expect(plain).not.toContain('round(up');
    expect(snapped).toContain('round(up, calc(var(--c) * 1em), 5px)');
  });

  it('draws rules as shadows that take no height', () => {
    const rules = createRules({ hairline: '1px', border: '#ccc', edge: '4px' });
    expect(rules.ruleAbove).toEqual({ boxShadow: 'inset 0 1px 0 0 #ccc' });
    expect(rules.ruleBoth.boxShadow).toContain('inset 0 calc(-1 * 1px) 0 0 #ccc');
    expect(JSON.stringify(rules.toneRing(40, 'top'))).toContain('inset 0 4px 0 0 var(--tone)');
    const styles = [
      rules.ruleAbove,
      rules.ruleBelow,
      rules.ruleBoth,
      rules.ringed,
      rules.toneRing(40),
      rules.ruleBelowOf('red'),
    ];
    for (const value of styles)
      expect(JSON.stringify(value)).not.toMatch(/border(Width|Block|Top|Bottom)/);
  });
});
