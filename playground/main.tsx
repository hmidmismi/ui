import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../styled-system/styles.css';
import { Badge, Button, Input, Label, Stack, Text, Title } from '../src';
import { baikikai } from '../src/brand';
import fraunces from '@capsizecss/metrics/fraunces';
import karla from '@capsizecss/metrics/karla';
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

const themes: Record<string, Theme> = { neutral, baikikai, warm };
const STEPS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'] as const;
const SPACING = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24] as const;

function Swatches({ palette }: { palette: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 5 }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          title={`${palette}.${i + 1}`}
          style={{ height: 50, background: `var(--colors-${palette}-${i + 1})`, border: '1px solid var(--colors-gray-7)' }}
        />
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '30px 0', borderTop: '1px solid var(--colors-gray-7)' }}>
      <Stack gap="lg">
        <Label>{title}</Label>
        {children}
      </Stack>
    </section>
  );
}

function App() {
  const query = new URLSearchParams(window.location.search);
  const [dark, setDark] = useState(query.has('dark'));
  const [grid, setGrid] = useState(query.has('grid'));
  const [themeName, setThemeName] = useState(query.get('theme') ?? 'neutral');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  useEffect(() => {
    if (grid) document.documentElement.setAttribute('data-baseline-grid', '');
    else document.documentElement.removeAttribute('data-baseline-grid');
  }, [grid]);
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
      <Stack gap="lg">
        <Title level={1}>UI Playground</Title>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="outline" onClick={() => setDark(!dark)}>
            {dark ? 'Light mode' : 'Dark mode'}
          </Button>
          <Button variant="outline" onClick={() => setGrid(!grid)}>
            {grid ? 'Hide baseline grid' : 'Show baseline grid'}
          </Button>
          {Object.keys(themes).map((name) => (
            <Button key={name} variant={name === themeName ? 'solid' : 'outline'} onClick={() => setThemeName(name)}>
              Theme: {name}
            </Button>
          ))}
        </div>
      </Stack>

      <Section title="Type scale">
        {STEPS.map((step) => (
          <div key={step} style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
            <Label>{step}</Label>
            <span style={{ fontFamily: 'var(--fonts-display)', fontSize: `var(--font-sizes-${step})`, lineHeight: `var(--line-heights-${step})` }}>
              Aikido is a martial way
            </span>
          </div>
        ))}
        <Title level={2}>Title level 2</Title>
        <Text>Body text sits on the 5px baseline, with the space above the capitals and below the baseline trimmed.</Text>
        <Text variant="small">Small text.</Text>
        <Text variant="caption">Caption text.</Text>
      </Section>

      <Section title="Spacing">
        {SPACING.map((n) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Label>{n}</Label>
            <div style={{ height: 10, width: `var(--spacing-${n})`, background: 'var(--colors-accent-9)' }} />
          </div>
        ))}
      </Section>

      <Section title="Color scales">
        {['gray', 'accent', 'red'].map((p) => (
          <Stack key={p} gap="sm">
            <Text variant="small">{p}</Text>
            <Swatches palette={p} />
          </Stack>
        ))}
      </Section>

      <Section title="Components">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="solid">Solid</Button>
          <Button variant="surface">Surface</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="solid" disabled>
            Disabled
          </Button>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Badge variant="solid">Solid</Badge>
          <Badge variant="subtle">Subtle</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <Input placeholder="Input" />
      </Section>
    </main>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
