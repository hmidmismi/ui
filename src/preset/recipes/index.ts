import { absoluteCenter } from './absolute-center';
import { accordion } from './accordion';
import type { TypeSystem } from '../type-scale';
import { announcement } from './announcement';
import { badge } from './badge';
import { button } from './button';
import { checkbox } from './checkbox';
import { crumbs } from './crumbs';
import { dialog } from './dialog';
import { field } from './field';
import { fieldRow } from './field-row';
import { fieldset } from './fieldset';
import { filterGroup } from './filter-group';
import { footer } from './footer';
import { group } from './group';
import { header } from './header';
import { icon } from './icon';
import { indexRow } from './index-row';
import { input } from './input';
import { link } from './link';
import { list } from './list';
import { menu } from './menu';
import { pagination } from './pagination';
import { placeholder } from './placeholder';
import { popover } from './popover';
import { radioGroup } from './radio-group';
import { createRoles } from './roles';
import { select } from './select';
import { spinner } from './spinner';
import { split } from './split';
import { surface } from './surface';
import { table } from './table';
import { tabs } from './tabs';
import { toast } from './toast';
import { toggleGroup } from './toggle-group';
import { tooltip } from './tooltip';


import { pageColumn, pageHeader, cardItem, centeredLines, skipLink } from './pages';
import { pageBar, adminBar, fieldStatus, signInForm, viewSwitch } from './admin';
import { statusBadge } from './status';
import { hero } from './hero';
import { browseNav, rangeColumns, letterBar, neighborNav, listHeader } from './browse';

import { eyebrow, personName, term, entry, prose, value, caption, count, tagline, fieldLabel, notice } from './page-roles';

import { chip, searchField, filterRow, typeahead } from './search';
import { jumpNav, breadcrumbs, siteNav, siteFooter } from './chrome';
import { player } from './player';

import { listFilter, countedList, expandableRow, rowDrawer, datedList } from './lists';
import { quote, codeBlock, timeline, disclosure } from './blocks';
import { picture, figure, videoFrame } from './media';
import { sectionGroup, section } from './section';
import { hue, scrollList, plate } from './tile';
import { featureCard, tile } from './cards';
import { pageText, pageLayout } from './page-text';

import { itemList, layoutStack, layoutWrap, measure, ruled, mediaRow, inset, layout, fullRow, termList, termRow, columnList, splitGrid, tileGrid } from './layout';

import { scrollX, tableCell, playableRow } from './table-parts';
import { combobox } from './combobox';
import { styleguide } from './styleguide';

/**
 * Every recipe, built for a type system. The recipes that set text take the type system; the rest are static.
 *
 * @param t - the type system of a design.
 * @returns the recipes and slot recipes.
 */
export function createRecipes(t: TypeSystem) {
  const { label, numeral, text, title } = createRoles(t);
  return {
    recipes: {
      scrollX,
      tableCell: tableCell(t),
      playableRow,
      itemList,
      layoutStack,
      layoutWrap,
      measure,
      ruled,
      mediaRow,
      inset,
      layout,
      fullRow,
      termList: termList(t),
      termRow,
      columnList: columnList(t),
      splitGrid,
      tileGrid,
      listFilter: listFilter(t),
      quote,
      codeBlock: codeBlock(t),
      timeline,
      disclosure: disclosure(t),
      picture,
      figure,
      videoFrame,
      sectionGroup,
      hue,
      scrollList,
      chip: chip(t),
      eyebrow: eyebrow(t),
      personName: personName(t),
      term: term(t),
      entry: entry(t),
      prose: prose(t),
      value: value(t),
      caption: caption(t),
      count: count(t),
      tagline: tagline(t),
      fieldLabel: fieldLabel(t),
      notice: notice(t),
      pageColumn,
      pageHeader,
      cardItem,
      centeredLines,
      skipLink,
      pageBar,
      adminBar,
      fieldStatus,
      signInForm,
      statusBadge,
      absoluteCenter,
      badge,
      button,
      fieldRow,
      group,
      icon,
      input,
      label,
      link,
      numeral,
      placeholder: placeholder(t),
      spinner,
      surface,
      text,
      title,
    },
    slotRecipes: {
      combobox,
      styleguide: styleguide(t),
      countedList: countedList(t),
      expandableRow: expandableRow(t),
      rowDrawer,
      datedList: datedList(t),
      section: section(t),
      plate: plate(t),
      featureCard: featureCard(t),
      tile: tile(t),
      pageText: pageText(t),
      pageLayout: pageLayout(t),
      jumpNav: jumpNav(t),
      breadcrumbs: breadcrumbs(t),
      siteNav: siteNav(t),
      siteFooter: siteFooter(t),
      player: player(t),
      searchField: searchField(t),
      filterRow: filterRow(t),
      typeahead: typeahead(t),
      hero: hero(t),
      viewSwitch,
      browseNav: browseNav(t),
      rangeColumns: rangeColumns(t),
      letterBar: letterBar(t),
      neighborNav,
      listHeader: listHeader(t),
      accordion,
      checkbox,
      crumbs: crumbs(t),
      dialog,
      field,
      fieldset,
      filterGroup: filterGroup(t),
      indexRow: indexRow(t),
      list,
      popover,
      radioGroup,
      select,
      footer: footer(t),
      header: header(t),
      menu: menu(t),
      pagination,
      announcement: announcement(t),
      split,
      table,
      tabs,
      toast,
      toggleGroup,
      tooltip,
    },
  };
}
