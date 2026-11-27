import {
  breadcrumbs,
  link,
  player,
  siteFooter,
  siteMasthead,
  siteNav,
  typeahead,
} from '../../styled-system/recipes';

/**
 * Slot recipes that feature components need the class names of. Each is wrapped in a function that calls the recipe
 * where Panda can see it, so its CSS is extracted for the app; a bare alias of the recipe function is not detected.
 */

/** Class for an inline link, accent colored. Recipe `link`. */
export const linkClass = () => link();

/** Class for an inline link in the color of the text around it, for a link on a toned block. Recipe `link`. */
export const inheritLinkClass = () => link({ tone: 'inherit' });

/** Class for a muted inline link. Recipe `link`. */
export const mutedLinkClass = () => link({ tone: 'muted' });

/** Slot classes for the breadcrumb trail. Slot recipe `breadcrumbs`. */
export const breadcrumbSlots = () => breadcrumbs();

/** Slot classes for the player bar. Slot recipe `player`. */
export const playerSlots = () => player();

/** Slot classes for the site footer. Slot recipe `siteFooter`. */
export const footerSlots = () => siteFooter();

/** Slot classes for the site header. Slot recipe `siteNav`; `signedIn` is on when the institution block shows; `floating` takes it out of the page flow and `away` hides it. */
export const navSlots = (
  { signedIn, floating, away, headroom }: { signedIn: boolean; floating?: boolean; away?: boolean; headroom?: boolean } = {
    signedIn: false,
  }
) => siteNav({ signedIn, floating, away, headroom });

/** Slot classes for the label type-ahead. Slot recipe `typeahead`. */
export const typeaheadSlots = () => typeahead();

/** Slot classes for the masthead over the home page's first screen. Slot recipe `siteMasthead`. */
export const mastheadSlots = () => siteMasthead();
