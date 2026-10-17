import { describe, expect, it } from 'vitest';
import { design as base } from '../design';
import { neutral, type Theme, type ThemeScales } from '../theme';
import { createPreset } from './index';

/** A design that overrides the given inputs. */
const preset = (design: Record<string, unknown> = {}, theme: Theme = neutral) =>
  createPreset({ ...base, ...design } as typeof base, theme);

const tokens = (p: ReturnType<typeof createPreset>) =>
  (p.theme?.tokens ?? {}) as Record<string, Record<string, any>>;

describe('design inputs that name tokens', () => {
  it("take a design's own named sizes, radii and tracking", () => {
    const t = tokens(
      preset({ sizes: { site: '70rem' }, radii: { md: '6px' }, letterSpacings: { caps: '0.2em' } })
    );
    expect(t.sizes?.site.value).toBe('70rem');
    expect(t.radii?.md.value).toBe('6px');
    expect(t.letterSpacings?.caps.value).toBe('0.2em');
  });

  it('keep the defaults for what the design leaves out', () => {
    const t = tokens(preset({ sizes: { site: '70rem' } }));
    expect(t.sizes?.prose.value).toBe('65ch');
    expect(t.radii?.sm.value).toBe('2px');
  });

  it('refuse a name the system does not declare, and say which names exist', () => {
    expect(() => preset({ sizes: { nonsense: '1rem' } })).toThrow(/no name "nonsense".*site/);
    expect(() => preset({ radii: { huge: '1rem' } })).toThrow(/Design\.radii/);
    expect(() => preset({ letterSpacings: { loud: '1em' } })).toThrow(/Design\.letterSpacings/);
  });

  it("set breakpoints from the design over Panda's own", () => {
    const p = preset({ breakpoints: { md: '60rem' } });
    const breakpoints = (p.theme?.extend as { breakpoints: Record<string, string> }).breakpoints;
    expect(breakpoints.md).toBe('60rem');
    expect(breakpoints.sm).toBe('40rem');
  });

  it('make a shadow with one value a token and one with two a per-mode token', () => {
    const p = preset({
      shadows: { xs: '0 1px 2px red', sm: { light: '0 1px 2px blue', dark: '0 1px 2px green' } },
    });
    const extend = p.theme?.extend as { tokens: { shadows: Record<string, any> } };
    expect(extend.tokens.shadows.xs.value).toBe('0 1px 2px red');
    const semantic = p.theme?.semanticTokens as { shadows: Record<string, any> };
    expect(semantic.shadows.sm.value).toEqual({
      _light: '0 1px 2px blue',
      _dark: '0 1px 2px green',
    });
  });
});

describe('headings and text roles read the design', () => {
  it('set a heading level from the design', () => {
    const p = preset({
      type: { ...base.type, headings: { h1: { step: '2xl', uppercase: true, tracking: 'title' } } },
    });
    const title = (p.theme?.extend as { recipes: Record<string, any> }).recipes.title;
    const h1 = title.variants.level.h1;
    expect(h1.textTransform).toBe('uppercase');
    expect(h1.letterSpacing).toBe('title');
    expect(Object.keys(title.variants.level)).toEqual(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
  });

  it('set a role from the design', () => {
    const p = preset({
      type: { ...base.type, roles: { eyebrow: { step: 'sm', uppercase: true, color: 'accent' } } },
    });
    const eyebrow = (p.theme?.extend as { recipes: Record<string, any> }).recipes.eyebrow;
    expect(eyebrow.base.color).toBe('accent');
    expect(eyebrow.base.textTransform).toBe('uppercase');
  });
});

/** Twelve distinct steps, in the shape a scale takes. */
const steps = (prefix: string) =>
  Array.from({ length: 12 }, (_, index) => `#${prefix}${index}`.padEnd(7, '0'));
const scale = (prefix: string) => ({ light: steps(prefix), dark: steps(`${prefix}d`) });
const wash = {
  bg: { light: '#fff', dark: '#000' },
  fg: { light: '#000', dark: '#fff' },
  label: { light: '#777', dark: '#888' },
};

const scales: ThemeScales = {
  neutral: scale('a'),
  accent: scale('b'),
  danger: scale('c'),
  success: scale('d'),
  warning: scale('e'),
  info: scale('f'),
  secondary: { light: '#111', dark: '#eee' },
  categorical: Array.from({ length: 8 }, (_, index) => ({
    light: `#00000${index}`,
    dark: `#ffffff${index}`,
  })),
  wash: { sand: wash, green: wash, blue: wash, salmon: wash },
};

describe('a theme declared as plain scales', () => {
  const colors = (theme: Parameters<typeof preset>[1]) =>
    (preset({}, theme).theme?.semanticTokens as { colors: Record<string, any> }).colors;
  const theme = { name: 'plain', faces: neutral.faces, scales };

  it('builds every role the components read from the scales', () => {
    const c = colors(theme);
    expect(c.gray['12'].value).toEqual({
      base: scales.neutral.light[11],
      _dark: scales.neutral.dark[11],
    });
    expect(c.accent['9'].value.base).toBe(scales.accent.light[8]);
    expect(c.accent.DEFAULT.value.base).toBe('{colors.accent.9}');
    expect(c.red['9'].value.base).toBe(scales.danger.light[8]);
    expect(c.secondary.value).toEqual({ base: '#111', _dark: '#eee' });
    expect(Object.keys(c.categorical)).toHaveLength(8);
    expect(Object.keys(c.wash)).toEqual(['sand', 'green', 'blue', 'salmon']);
  });

  it('gives each scale the component variants recipes read through colorPalette', () => {
    const c = colors(theme);
    for (const name of ['gray', 'accent', 'red', 'success', 'warning', 'info']) {
      expect(Object.keys(c[name]), name).toEqual(
        expect.arrayContaining(['solid', 'subtle', 'surface', 'outline', 'plain'])
      );
    }
  });

  it('mixes the alpha steps from step 12 when a scale gives none', () => {
    const c = colors(theme);
    expect(c.accent.a9.value.base).toContain('color-mix');
  });

  it('refuses a scale that does not have twelve steps', () => {
    const broken = {
      ...theme,
      scales: { ...scales, accent: { light: ['#000'], dark: steps('b') } },
    };
    expect(() => preset({}, broken)).toThrow(/12/);
  });
});
