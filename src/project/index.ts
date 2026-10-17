import type { Config } from '@pandacss/dev';
import type { Design } from '../design';
import { createPreset } from '../preset';
import { fontFaces } from '../theme/fontFaces';
import type { ColorScale, Face, Role, Theme, ThemeScales } from '../theme';

/** One app of a project: what makes it different from the others (its accent). */
export type AppConfig = { accent: ColorScale };

/**
 * Everything a project declares, as plain data: the design (grid, type scale, headings, roles, controls, sizes, radii,
 * shadows, tracking, breakpoints, motion), the font faces, the colors shared by its apps, and each app's accent.
 */
export type ProjectConfig = {
  design: Design;
  faces: Record<Role, Face>;
  /** The colors every app shares. The accent is each app's own. */
  colors: Omit<ThemeScales, 'accent'>;
  apps: Record<string, AppConfig>;
};

/**
 * Checks and returns a project's configuration. It does nothing else; it is there so the file that declares a project
 * gets its types.
 *
 * @param project - the declaration.
 * @returns the same declaration.
 */
export const defineProject = <const T extends ProjectConfig>(project: T): T => project;

/**
 * The theme of one app of a project.
 *
 * @param project - the project.
 * @param app - the app's name, a key of `project.apps`.
 * @returns the theme: the project's faces and colors with the app's accent.
 * @throws when the project has no such app.
 */
export function themeFor(project: ProjectConfig, app: string): Theme {
  const config = project.apps[app];
  if (!config) {
    throw new Error(`The project has no app "${app}". Its apps are: ${Object.keys(project.apps).join(', ')}.`);
  }
  return { name: app, faces: project.faces, scales: { ...project.colors, accent: config.accent } };
}

/** Panda's own presets, which the system builds on. */
const PANDA = ['@pandacss/preset-base', '@pandacss/preset-panda'];

/**
 * The Panda config of an app. The app generates only the CSS for its own source files (`panda cssgen --minimal`); the
 * reset, tokens, fonts and component styles come from the project's stylesheet, so `preflight` is off.
 *
 * @param project - the project.
 * @param app - the app's name.
 * @returns the config, for `defineConfig`.
 */
export function appPandaConfig(project: ProjectConfig, app: string) {
  return {
    preflight: false,
    jsxFramework: 'react',
    presets: [...PANDA, createPreset(project.design, themeFor(project, app))],
    include: ['./src/**/*.{ts,tsx}'],
    exclude: [],
    outdir: 'styled-system',
  } satisfies Config;
}

/** Options for the project's stylesheet. */
export type StylesheetOptions = {
  /** The source files to scan for component styles, relative to the package that builds the stylesheet. */
  include: string[];
  /** The folder of the font files, relative to the package that builds the stylesheet. Defaults to `fonts`. */
  fontDir?: string;
};

/**
 * The Panda config that builds the stylesheet every app of a project imports: the reset, the tokens, the font faces
 * and the styles of every component. It is built with one app's theme; the other apps set their own accent in their
 * own `tokens.css`.
 *
 * @param project - the project.
 * @param app - the app whose theme the stylesheet carries.
 * @param options - the files to scan and where the fonts are.
 * @returns the config, for `defineConfig`.
 */
export function stylesheetPandaConfig(project: ProjectConfig, app: string, options: StylesheetOptions) {
  const theme = themeFor(project, app);
  const fontDir = options.fontDir ?? 'fonts';
  return {
    preflight: true,
    jsxFramework: 'react',
    presets: [...PANDA, createPreset(project.design, theme)],
    include: options.include,
    exclude: [],
    // The URL is relative to the stylesheet, which is generated into `styled-system/` next to the font folder.
    globalFontface: fontFaces(theme, (file: string) => `../${fontDir}/${file}`),
    outdir: 'styled-system',
  } satisfies Config;
}
