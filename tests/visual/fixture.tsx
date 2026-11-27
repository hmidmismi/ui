import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SiteMasthead } from '../../src/components/chrome';
import { PageColumn } from '../../src/components/page';
import { StyleBook } from '../../src/style-book/style-book';

const link = (className: string, content: ReactNode) => (
  <a className={className} href="#">
    {content}
  </a>
);

const TABS = ['About YVML', 'Workshops', 'Residencies', 'People', 'Events', 'Support Us'].map((label) => ({
  key: label,
  label,
  link,
}));

/**
 * The page the visual tests draw: a masthead over a block of media, the way the home page opens, then the style book.
 * It is server-rendered, so only what React draws without effects appears (the style book's live readout is empty).
 */
export const fixture = renderToStaticMarkup(
  <>
    <div data-fixture="masthead" style={{ position: 'relative', height: '17.5rem', background: '#2b4a63' }}>
      <SiteMasthead
        id="masthead"
        start={
          <>
            <span>70°F Mostly cloudy</span>
            <a href="#">Shop</a>
          </>
        }
        end={
          <>
            <button type="button" style={{ width: 84 }}>EN</button>
            <button type="button" style={{ width: 44 }}>Night</button>
          </>
        }
        wordmark={{ text: 'Yucca Valley Material Lab', short: 'YVML', link }}
        tabs={TABS}
        menu={{ label: 'Menu', panel: <a href="#">Panel</a> }}
      />
    </div>
    <main data-fixture="book">
      <PageColumn>
        <StyleBook />
      </PageColumn>
    </main>
  </>
);
