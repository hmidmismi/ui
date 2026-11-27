import { describe, expect, it } from 'vitest';
import { design } from '../src/design';
import { ALL_MODULES, createRecipes, MODULES } from '../src/preset';
import { createTypeSystem } from '../src/preset/type-scale';
import { neutral } from '../src/theme';

const type = createTypeSystem(design, neutral.faces);
const names = (modules?: Parameters<typeof createRecipes>[2]) => {
  const built = createRecipes(type, undefined, modules);
  return new Set([...Object.keys(built.recipes), ...Object.keys(built.slotRecipes)]);
};
const of = (module: keyof typeof MODULES) => [...MODULES[module].recipes, ...MODULES[module].slotRecipes];

describe('modules', () => {
  it('every name a module lists is a recipe of the system', () => {
    const all = names();
    for (const module of ALL_MODULES) for (const name of of(module)) expect(all, `${module}: ${name}`).toContain(name);
  });

  it('includes every module when none is chosen', () => {
    const all = names();
    for (const module of ALL_MODULES) for (const name of of(module)) expect(all).toContain(name);
  });

  it('leaves out every module but keeps the core when none is asked for', () => {
    const core = names([]);
    for (const module of ALL_MODULES) for (const name of of(module)) expect(core).not.toContain(name);
    for (const name of ['text', 'row', 'card', 'surface', 'button', 'siteNav']) expect(core).toContain(name);
  });

  it('brings the modules a module needs, and no others', () => {
    const catalog = names(['catalog']);
    for (const name of [...of('catalog'), ...of('forms')]) expect(catalog).toContain(name);
    for (const name of of('admin')) expect(catalog).not.toContain(name);
  });
});

describe('preset marker', () => {
  it('writes the modules a build includes to --ui-modules', async () => {
    const { createPreset } = await import('../src/preset');
    const root = (modules?: Parameters<typeof createPreset>[2]) =>
      (createPreset(design, neutral, modules).globalCss as { extend: Record<string, Record<string, string>> }).extend[':root']?.['--ui-modules'];
    expect(root({ modules: ['catalog'] })).toBe('catalog forms');
    expect(root({ modules: [] })).toBe('');
    expect(root()?.split(' ').sort()).toEqual([...ALL_MODULES].sort());
  });
});
