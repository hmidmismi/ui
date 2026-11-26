import { Building2, Moon, Sun } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useHeaderReveal } from '../hooks/use-header-reveal';
import { useMeasuredHeight } from '../hooks/use-measured-height';
import { useScrollEdges } from '../hooks/use-scroll-edges';
import { IconButton } from './icon-button';
import { breadcrumbSlots, footerSlots, mastheadSlots, navSlots } from './slots';
import { useUiText } from './ui-text';

/**
 * Renders a link with the class a component gives it. The app passes its router's link, so the package needs no router:
 * `(className, content) => <Link to="/about" className={className}>{content}</Link>`.
 */
export type LinkRender = (className: string, content: ReactNode) => ReactNode;

/** One link of a navigation: what identifies it, what it says, how it links and an optional badge after the label. */
export type NavLink = {
  key: string;
  label: ReactNode;
  link: LinkRender;
  /** Shown after the label, such as a count. */
  badge?: ReactNode;
};

/** The localStorage key that remembers the visitor's chosen theme. */
export const THEME_KEY = 'theme';

/**
 * Inline script that runs in `<head>` before first paint. It adds the `dark` class to `<html>` when the visitor chose
 * dark mode, or has no saved choice and their system prefers dark, so the page never flashes the wrong theme.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

/** How long the theme change fades, in milliseconds: the `normal` duration token plus a margin. */
const SWITCH_MS = 260;

/**
 * The button that switches between light and dark theme. The icon shows the mode the button switches to: the sun in
 * dark mode, the moon in light mode. The choice is saved in localStorage and applied by adding or removing the `dark`
 * class on `<html>`; {@link THEME_INIT_SCRIPT} in the head applies it before first paint. Slot recipe `siteNav`.
 *
 * @param props - `inUtility` renders the button as the design system's icon button, for the header's utility row; without it the button is the bar's own control.
 * @returns the theme button.
 */
export function ThemeToggle({ inUtility = false }: { inUtility?: boolean }) {
  const t = useUiText();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    const root = document.documentElement;
    root.setAttribute('data-theme-switching', '');
    window.setTimeout(() => root.removeAttribute('data-theme-switching'), SWITCH_MS);
    root.classList.toggle('dark', next);
    try {
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch {
      /* storage unavailable: the choice lasts for this page view only */
    }
    setDark(next);
  };

  const icon = dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />;
  const label = dark ? t.switchToLight : t.switchToDark;

  // In the utility row the toggle is the design system's own icon button; in the bar it keeps the bar's bordered control.
  if (inUtility) {
    return (
      <IconButton variant="plain" size="xs" onClick={toggle} aria-pressed={dark} aria-label={label}>
        {icon}
      </IconButton>
    );
  }
  return (
    <button type="button" className={navSlots().themeButton} onClick={toggle} aria-pressed={dark} aria-label={label}>
      {icon}
    </button>
  );
}

/**
 * The height of the utility row, the first row of the header grid, in px.
 *
 * @param element - the header.
 * @returns the row height.
 */
const utilityHeight = (element: HTMLElement) =>
  Number.parseFloat(getComputedStyle(element).gridTemplateRows) || 0;

/**
 * How much of the sticky header slides away with the utility row: the row's height less the hairline that stays visible
 * as the bar's top border.
 *
 * @param element - the header.
 * @returns the hidden height in px.
 */
const scrolledAway = (element: HTMLElement) => utilityHeight(element) - 1;

/** The signed-in block of the header: who is signed in, and where the block links. */
export type SiteHeaderAccount = {
  name: string;
  link: LinkRender;
  /** What the block says above the name. Defaults to `Signed in`. */
  status?: string;
};

/** Props for {@link SiteHeader}. */
type SiteHeaderProps = {
  /** The row above the bar: anything the app puts there, such as a status or controls. The row is empty without it. */
  utility?: ReactNode;
  /** The wordmark's text and how it links home. */
  wordmark: { text: ReactNode; link: LinkRender };
  /** The primary tabs. */
  tabs: NavLink[];
  /** The signed-in block, or nothing when there is none to show. */
  account?: SiteHeaderAccount | null;
  /** Controls at the end of the bar, such as {@link ThemeToggle}. */
  actions?: ReactNode;
};

/**
 * The site header, one grid: the utility row, the wordmark, the primary tabs (each may carry a badge), the signed-in
 * block and the controls. Each is a single element that the recipe places by grid area: the signed-in block sits in the
 * bar from 640px and at the start of the utility row below, and the tabs drop to their own row on phones. The whole
 * header is sticky and hides its utility row as it scrolls, so the bar stays; its bar height is published as `--bh` for
 * the sticky bars under it. Slot recipe `siteNav`.
 *
 * @param props - the utility row, wordmark, tabs, account and controls.
 * @returns the header.
 */
export function SiteHeader({ utility, wordmark, tabs, account, actions }: SiteHeaderProps) {
  const t = useUiText();
  const classes = navSlots({ signedIn: Boolean(account) });
  const root = useRef<HTMLElement>(null);
  useMeasuredHeight(root, '--bh', scrolledAway);
  useHeaderReveal(root, utilityHeight);
  const tabRow = useRef<HTMLElement>(null);
  useScrollEdges(tabRow);

  return (
    <header ref={root} className={classes.root} data-no-print>
      {utility && <div className={classes.utility}>{utility}</div>}
      {wordmark.link(classes.wordmark, wordmark.text)}
      <nav ref={tabRow} aria-label={t.browseNav} className={classes.tabs}>
        {tabs.map((item) => (
          <ChromeLink key={item.key} render={item.link} className={classes.tab}>
            {item.label}
            {item.badge}
          </ChromeLink>
        ))}
      </nav>
      {account &&
        account.link(
          classes.institution,
          <>
            <Building2 className={classes.institutionIcon} aria-hidden />
            <span>
              <span className={classes.signedIn}>{account.status ?? 'Signed in'}</span>
              <span className={classes.name} title={account.name}>
                {account.name}
              </span>
            </span>
          </>
        )}
      {actions}
    </header>
  );
}

/** A link rendered through the app's {@link LinkRender}, with children as its content. */
function ChromeLink({
  render,
  className,
  children,
}: {
  render: LinkRender;
  className: string;
  children: ReactNode;
}) {
  return <>{render(className, children)}</>;
}

/** Props for {@link SiteFooter}. */
type SiteFooterProps = {
  /** The links in the footer's nav; the nav is left out without any. */
  links?: NavLink[];
  /** The copyright line. */
  copyright?: ReactNode;
  /** A status link, shown with a green dot. */
  status?: { label: ReactNode; link: LinkRender };
  /** Lines at the end of the footer, such as legal details and credits. */
  notes?: ReactNode[];
};

/**
 * The site footer: the links over the copyright line at the start, and at the end the status link with its green dot and
 * the notes (below the links on phones). Every part is optional and a part with nothing to show is left out. Slot recipe
 * `siteFooter`.
 *
 * @param props - the links, copyright, status and notes.
 * @returns the footer.
 */
export function SiteFooter({ links = [], copyright, status, notes = [] }: SiteFooterProps) {
  const t = useUiText();
  const classes = footerSlots();

  return (
    <footer className={classes.root} data-no-print>
      <div className={classes.start}>
        {links.length > 0 && (
          <nav aria-label={t.footerNav} className={classes.links}>
            {links.map((item) => (
              <ChromeLink key={item.key} render={item.link} className={classes.link}>
                {item.label}
              </ChromeLink>
            ))}
          </nav>
        )}
        {copyright && <p className={classes.note}>{copyright}</p>}
      </div>
      {(status || notes.length > 0) && (
        <div className={classes.end}>
          {status?.link(
            classes.status,
            <>
              <span className={classes.dot} aria-hidden />
              <span className={classes.statusText}>{status.label}</span>
            </>
          )}
          {notes.map((note, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: the notes are a fixed list of lines that never reorder
            <p key={index} className={classes.note}>
              {note}
            </p>
          ))}
        </div>
      )}
    </footer>
  );
}


/** One step of a {@link BreadcrumbTrail}. */
export type BreadcrumbStep = {
  key: string;
  label: ReactNode;
  /** How the step links; a step without one is plain text. */
  link?: LinkRender;
  /** Marks the current page, the last step. */
  current?: boolean;
};

/** Props for {@link BreadcrumbTrail}. */
type BreadcrumbTrailProps = {
  /** How the first step, Home, links. */
  home: LinkRender;
  /** The steps after Home, ending with the current page. */
  steps: BreadcrumbStep[];
};

/**
 * A breadcrumb trail: a home link, then each step separated by a slash, with the current page last as plain text. It is a
 * `nav` landmark labelled `Breadcrumb` holding an ordered list, with `aria-current="page"` on the last item. Slot recipe
 * `breadcrumbs`.
 *
 * @param props - the home link and the steps.
 * @returns the breadcrumb navigation.
 */
export function BreadcrumbTrail({ home, steps }: BreadcrumbTrailProps) {
  const t = useUiText();
  const classes = breadcrumbSlots();
  const trail = useRef<HTMLElement>(null);
  useScrollEdges(trail);

  return (
    <nav ref={trail} aria-label={t.breadcrumbNav} className={classes.root} data-no-print>
      <ol className={classes.list}>
        <li className={classes.item}>{home(classes.link, t.home)}</li>
        {steps.map((step) => (
          <li key={step.key} className={classes.item}>
            {step.current ? (
              <span className={classes.current} aria-current="page">
                {step.label}
              </span>
            ) : step.link ? (
              step.link(classes.link, step.label)
            ) : (
              <span className={classes.plain}>{step.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Props for {@link SiteMasthead}. */
type SiteMastheadProps = {
  /** The links at the start of the utility row, from `md`. */
  start: ReactNode;
  /** The controls at the end of the utility row, from `md`. */
  end: ReactNode;
  /** The wordmark: the full name from `md`, the short one below, and how it links home. */
  wordmark: { text: ReactNode; short: ReactNode; link: LinkRender };
  /** The primary tabs, centered under the wordmark from `md`. */
  tabs: NavLink[];
  /** Below `md`: the menu button's text, what the menu panel holds, and the one control at the end of the bar. */
  menu: { label: string; panel: ReactNode; control: ReactNode };
};

/**
 * The masthead over the first screen of a page: light text over its media, the wordmark centered with the tabs under it,
 * and a utility row. Below `md` a menu button, the short wordmark and one control. Slot recipe `siteMasthead`.
 *
 * @param props - the utility row, wordmark, tabs and the phone menu.
 * @returns the masthead.
 */
export function SiteMasthead({ start, end, wordmark, tabs, menu }: SiteMastheadProps) {
  const t = useUiText();
  const classes = mastheadSlots();
  return (
    <header className={classes.root} data-no-print>
      <div className={classes.start}>{start}</div>
      <div className={classes.end}>{end}</div>
      <details className={classes.menu}>
        <summary className={classes.summary}>{menu.label}</summary>
        <div className={classes.panel}>{menu.panel}</div>
      </details>
      {wordmark.link(
        classes.wordmark,
        <>
          <span className={classes.full}>{wordmark.text}</span>
          <span className={classes.short} aria-hidden>
            {wordmark.short}
          </span>
        </>
      )}
      <nav aria-label={t.browseNav} className={classes.nav}>
        {tabs.map((item) => (
          <ChromeLink key={item.key} render={item.link} className={classes.tab}>
            {item.label}
          </ChromeLink>
        ))}
      </nav>
      <div className={classes.language}>{menu.control}</div>
    </header>
  );
}
