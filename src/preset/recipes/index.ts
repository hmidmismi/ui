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
import { filterGroup } from './filter-group';
import { footer } from './footer';
import { group } from './group';
import { header } from './header';
import { icon } from './icon';
import { indexRow } from './index-row';
import { input } from './input';
import { layoutStack, layoutWrap } from './layout';
import { link } from './link';
import { list } from './list';
import { menu } from './menu';
import { placeholder } from './placeholder';
import { popover } from './popover';
import { radioGroup } from './radio-group';
import { createRoles } from './roles';
import { select } from './select';
import { spinner } from './spinner';
import { split } from './split';
import { surface } from './surface';
import { tabs } from './tabs';
import { toggleGroup } from './toggle-group';
import { tooltip } from './tooltip';

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
      absoluteCenter,
      badge,
      button,
      group,
      icon,
      input,
      label,
      layoutStack,
      layoutWrap,
      link,
      numeral,
      placeholder: placeholder(t),
      spinner,
      surface,
      text,
      title,
    },
    slotRecipes: {
      accordion,
      checkbox,
      crumbs: crumbs(t),
      dialog,
      field,
      filterGroup: filterGroup(t),
      indexRow: indexRow(t),
      list,
      popover,
      radioGroup,
      select,
      footer: footer(t),
      header: header(t),
      menu: menu(t),
      announcement: announcement(t),
      split,
      tabs,
      toggleGroup,
      tooltip,
    },
  };
}
