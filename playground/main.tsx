import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../styled-system/styles.css';
import fraunces from '@capsizecss/metrics/fraunces';
import karla from '@capsizecss/metrics/karla';
import { Button, Section as RuledSection, StyleBook, Stack, Text, Title } from '../src';
import { neutral, type Theme, toCss } from '../src/theme';

/** A second theme, to show that a theme is only variables: nothing is rebuilt when it is applied. */
const warm: Theme = {
  name: 'warm',
  palette: {
    ink: '#1B1B2F',
    paper: '#F4EBDD',
    line: '#D2C4AE',
    accent: '#B8452E',
    accentSoft: '#F2A65A',
    danger: '#A3262A',
    dangerSoft: '#E8A0A2',
  },
  faces: {
    display: { family: 'Fraunces', generic: 'serif', metrics: fraunces },
    body: { family: 'Karla', generic: 'sans-serif', metrics: karla },
    mono: neutral.faces.mono,
  },
};

const themes: Record<string, Theme> = { neutral, warm };

function Swatches({ palette }: { palette: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 5 }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          title={`${palette}.${i + 1}`}
          style={{
            height: 50,
            background: `var(--colors-${palette}-${i + 1})`,
            border: '1px solid var(--colors-gray-7)',
          }}
        />
      ))}
    </div>
  );
}

/** A part of the page: the library's ruled section, so the playground's own rhythm comes from the library. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <RuledSection id={title.toLowerCase().replace(/\W+/g, '-')} label={title}>
      <Stack gap="8">{children}</Stack>
    </RuledSection>
  );
}

function App() {
  const query = new URLSearchParams(window.location.search);
  const [dark, setDark] = useState(query.has('dark'));
  const [grid, setGrid] = useState(query.has('grid'));
  const [spacing, setSpacing] = useState(query.has('spacing'));
  const [themeName, setThemeName] = useState(query.get('theme') ?? 'neutral');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  useEffect(() => {
    if (grid) document.documentElement.setAttribute('data-baseline-grid', '');
    else document.documentElement.removeAttribute('data-baseline-grid');
  }, [grid]);
  useEffect(() => {
    if (spacing) document.documentElement.setAttribute('data-spacing-grid', '');
    else document.documentElement.removeAttribute('data-spacing-grid');
  }, [spacing]);
  useEffect(() => {
    let tag = document.getElementById('theme-override') as HTMLStyleElement | null;
    if (!tag) {
      tag = document.createElement('style');
      tag.id = 'theme-override';
      document.head.appendChild(tag);
    }
    tag.textContent = toCss(themes[themeName] ?? neutral);
  }, [themeName]);

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', padding: '30px 20px 100px' }}>
      <Stack gap="8">
        <Title level="h1">UI Playground</Title>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="outline" onClick={() => setDark(!dark)}>
            {dark ? 'Light mode' : 'Dark mode'}
          </Button>
          <Button variant="outline" onClick={() => setGrid(!grid)}>
            {grid ? 'Hide baseline grid' : 'Show baseline grid'}
          </Button>
          <Button variant="outline" onClick={() => setSpacing(!spacing)}>
            {spacing ? 'Hide spacing grid' : 'Show spacing grid'}
          </Button>
          {Object.keys(themes).map((name) => (
            <Button
              key={name}
              variant={name === themeName ? 'solid' : 'outline'}
              onClick={() => setThemeName(name)}
            >
              Theme: {name}
            </Button>
          ))}
        </div>
      </Stack>

      <StyleBook />

      <Section title="Color scales">
        {['gray', 'accent', 'red'].map((p) => (
          <Stack key={p} gap="2">
            <Text variant="small">{p}</Text>
            <Swatches palette={p} />
          </Stack>
        ))}
      </Section>

    </main>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
