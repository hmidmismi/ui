import type { RecipeConfig, SlotRecipeConfig } from '@pandacss/dev';

/**
 * The opt-in parts of the system. The core (text, layout, surfaces, cards, rows, buttons, fields, chrome) is always
 * there; a module adds the recipes of one kind of component, so a project that never uses it gets none of its CSS. Each
 * module is also a subpath of the package (`@hmidmismi/ui/forms`) that exports its components.
 */
export const MODULES = {
  /** Selects, comboboxes and typeaheads. */
  forms: { recipes: [], slotRecipes: ['combobox', 'select', 'typeahead'], needs: [] },
  /** The signed-in editing bar, field status, sign-in form and the editable fields. */
  admin: {
    recipes: ['adminBar', 'fieldStatus', 'signInForm', 'pageBar'],
    slotRecipes: ['viewSwitch'],
    needs: ['forms'],
  },
  /** A music catalog: the player, a record's header, browsing by letter and range, and the playable table row. */
  catalog: {
    recipes: ['playableRow'],
    slotRecipes: ['player', 'recordHeader', 'rangeColumns', 'rangeNav', 'rangeSections', 'letterBar'],
    needs: ['forms'],
  },
} as const satisfies Record<string, { recipes: readonly string[]; slotRecipes: readonly string[]; needs: readonly string[] }>;

/** The name of a module. */
export type ModuleName = keyof typeof MODULES;

/** Every module. A project that does not choose gets all of them. */
export const ALL_MODULES = Object.keys(MODULES) as ModuleName[];

/** The modules asked for and the ones they need, each once. */
export function withNeeds(wanted: readonly ModuleName[]) {
  const all = new Set<ModuleName>();
  const add = (name: ModuleName) => {
    if (all.has(name)) return;
    all.add(name);
    for (const need of MODULES[name].needs) add(need);
  };
  wanted.forEach(add);
  return all;
}

/**
 * Takes out the recipes of the modules a project did not ask for.
 *
 * @param built - the recipes and slot recipes of the whole system.
 * @param wanted - the modules to keep; the ones they need are kept too.
 * @returns the recipes and slot recipes without the others.
 */
export function onlyModules<R extends Record<string, RecipeConfig>, S extends Record<string, SlotRecipeConfig>>(
  built: { recipes: R; slotRecipes: S },
  wanted: readonly ModuleName[]
) {
  const keep = withNeeds(wanted);
  const dropped = (kind: 'recipes' | 'slotRecipes') =>
    new Set(ALL_MODULES.filter((name) => !keep.has(name)).flatMap((name) => MODULES[name][kind]));
  const without = <T extends Record<string, unknown>>(from: T, names: Set<string>) =>
    Object.fromEntries(Object.entries(from).filter(([name]) => !names.has(name))) as T;
  return {
    recipes: without(built.recipes, dropped('recipes')),
    slotRecipes: without(built.slotRecipes, dropped('slotRecipes')),
  };
}
