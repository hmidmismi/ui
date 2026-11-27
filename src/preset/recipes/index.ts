import type { TypeSystem } from '../type-scale';
import { absoluteCenter } from './absolute-center';
import { accordion } from './accordion';
import { adminBar, fieldStatus, pageBar, signInForm, viewSwitch } from './admin';
import { alert } from './alert';
import { badge } from './badge';
import { codeBlock, disclosure, quote, timeline } from './blocks';
import { browseNav, letterBar, rangeColumns, rangeNav, rangeSections } from './browse';
import { button } from './button';
import { card } from './card';
import { cover, layers, pinned } from './cover';
import { siteMasthead } from './masthead';
import { checkbox } from './checkbox';
import { breadcrumbs, jumpNav, siteFooter, siteNav } from './chrome';
import { combobox } from './combobox';
import { dialog } from './dialog';
import { field } from './field';
import { fieldRow } from './field-row';
import { fieldset } from './fieldset';
import { group } from './group';
import { hero } from './hero';
import { icon } from './icon';
import { input } from './input';
import {
  columnCell,
  columnGrid,
  fullRow,
  inset,
  itemList,
  layout,
  layoutStack,
  layoutWrap,
  measure,
  mediaRow,
  ruled,
  splitGrid,
} from './layout';
import { link } from './link';
import { listFilter, rowDrawer } from './lists';
import { row } from './row';
import { embedFrame, figure, picture, videoFrame } from './media';
import { sidebar } from './sidebar';
import { pageColumn, skipLink } from './pages';
import { pagination } from './pagination';
import { player } from './player';
import { popover } from './popover';
import { radioGroup } from './radio-group';
import { createRoles } from './roles';
import { chip, filterRow, searchField, typeahead } from './search';
import { section, sectionGroup } from './section';
import { surface } from './surface';
import { select } from './select';
import { spinner } from './spinner';
import { statusBadge } from './status';
import { styleguide } from './styleguide';
import { table } from './table';
import { playableRow, scrollX, tableCell } from './table-parts';
import { tabs } from './tabs';
import { recordHeader } from './record';
import { ALL_MODULES, type ModuleName, onlyModules } from './modules';
import { hue, scrollList } from './tile';
import { toast } from './toast';
import { toggleGroup } from './toggle-group';
import { tooltip } from './tooltip';

/**
 * Every recipe, built for a type system. The recipes that set text take the type system; the rest are static.
 *
 * @param t - the type system of a design.
 * @returns the recipes and slot recipes.
 */
/** The names a project gave its colors: the label hues (`categorical`) and the section tones (`wash`). */
export type ColorNames = { hues: readonly string[]; tones: readonly string[] };

function buildRecipes(t: TypeSystem, names: ColorNames) {
  const { label, numeral, text, title } = createRoles(t);
  return {
    recipes: {
      scrollX,
      tableCell: tableCell(t),
      playableRow,
      itemList: itemList(t),
      layoutStack,
      columnGrid,
      columnCell,
      layoutWrap,
      measure,
      ruled,
      mediaRow,
      inset,
      layout,
      fullRow,
      splitGrid,
          listFilter: listFilter(t),
      quote,
      codeBlock: codeBlock(t),
      timeline: timeline(t),
      disclosure: disclosure(t),
      figure,
      sectionGroup,
      hue: hue(names.hues),
      surface: surface(names.tones),
      layers,
      scrollList,
      chip: chip(t),
      pageColumn,
      skipLink: skipLink(t),
      pageBar,
      adminBar,
      fieldStatus,
      signInForm,
      statusBadge: statusBadge(t),
      absoluteCenter,
      badge: badge(t),
      button: button(t),
      fieldRow,
      group,
      icon,
      input,
      label,
      link: link(t),
      numeral,
      spinner,
      text,
      title,
    },
    slotRecipes: {
      embedFrame,
      picture,
      videoFrame,
      combobox,
      styleguide: styleguide(t),
      recordHeader: recordHeader(t),
      row: row(t),
      rowDrawer,
      section: section(t, names.tones),
      card: card(t),
      siteMasthead: siteMasthead(t),
      cover: cover(names.tones),
      pinned,
          sidebar: sidebar(t),
      jumpNav: jumpNav(t),
      breadcrumbs: breadcrumbs(t),
      siteNav: siteNav(t),
      siteFooter: siteFooter(t),
      alert,
      player: player(t),
      searchField: searchField(t),
      filterRow: filterRow(t),
      typeahead: typeahead(t),
      hero: hero(t),
      viewSwitch,
      browseNav: browseNav(t),
      rangeColumns: rangeColumns(t),
      rangeNav: rangeNav(t),
      rangeSections: rangeSections(t),
      letterBar: letterBar(t),
      accordion,
      checkbox,
      dialog,
      field,
      fieldset,
      popover,
      radioGroup,
      select,
      pagination,
      table: table(t),
      tabs,
      toast,
      toggleGroup,
      tooltip,
    },
  };
}

/**
 * Every recipe the project asked for: the core and the modules it lists (see `MODULES`), built for a type system.
 *
 * @param t - the type system of a design.
 * @param names - the project's hue and tone names.
 * @param modules - the opt-in modules to include. All of them when left out.
 * @returns the recipes and slot recipes.
 */
export function createRecipes(
  t: TypeSystem,
  names: ColorNames = { hues: [], tones: [] },
  modules: readonly ModuleName[] = ALL_MODULES
) {
  return onlyModules(buildRecipes(t, names), modules);
}

export { ALL_MODULES, MODULES, type ModuleName } from './modules';
