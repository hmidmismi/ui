import type { ModuleName } from '../preset/recipes/modules';

declare const process: { env: { NODE_ENV?: string } };

const reported = new Set<string>();

/**
 * Says, once and in development only, when a component of an opt-in module is used in a project whose preset left that
 * module out: the component would render with no CSS. The preset writes the modules it included to `--ui-modules` on
 * `:root`; with no such variable (older CSS, or no stylesheet yet) nothing is reported. It does nothing on the server.
 *
 * @param name - the module the calling component belongs to.
 */
export function requireModule(name: ModuleName): void {
  if (typeof document === 'undefined' || process.env.NODE_ENV === 'production' || reported.has(name)) return;
  const included = getComputedStyle(document.documentElement).getPropertyValue('--ui-modules').trim();
  if (!included || included.split(/\s+/).includes(name)) return;
  reported.add(name);
  console.error(
    `@hmidmismi/ui: a component of the "${name}" module is used, but createPreset's \`modules\` does not include "${name}", so it has no CSS. Add it: createPreset(design, theme, { modules: [..., '${name}'] }).`
  );
}
