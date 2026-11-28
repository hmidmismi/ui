import { type ReactNode, useEffect, useRef, useState } from 'react';
import { css } from '../../styled-system/css';
import { Badge } from '../components/badge';
import { Button } from '../components/button';
import { Input } from '../components/input';
import { Picture } from '../components/media';
import { Cell, Grid, ItemList, Stack, Wrap } from '../components/layout';
import { Row } from '../components/lists';
import { Section } from '../components/section';
import { Label, Text, type TextSize, Title } from '../components/typography';
import { describeStep } from './readout';

/** The type steps, smallest to largest. */
const STEPS: TextSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'];

/** The spacing tokens shown, each with a bar one token wide. A bar is written out so Panda sees its token. */
const SPACING: [string, string][] = [
  ['1', css({ width: '1' })],
  ['2', css({ width: '2' })],
  ['3', css({ width: '3' })],
  ['4', css({ width: '4' })],
  ['5', css({ width: '5' })],
  ['6', css({ width: '6' })],
  ['8', css({ width: '8' })],
  ['10', css({ width: '10' })],
  ['12', css({ width: '12' })],
  ['16', css({ width: '16' })],
  ['20', css({ width: '20' })],
  ['24', css({ width: '24' })],
];

const bar = css({ height: '2', background: 'accent' });
const probe = css({ height: '1', width: '0', visibility: 'hidden' });
/** A blank one-pixel image: the picture shows its recipe's gray ground, sized to the grid like any picture. */
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const placeholder = <Picture shape="thumb" src={BLANK} alt="" width={1} height={1} />;
const swatch = css({ height: '8', borderWidth: 'hairline', borderStyle: 'solid', borderColor: 'border' });

/** Rounds to one decimal, for a readout. */
const tenth = (value: number) => Math.round(value * 10) / 10;

/**
 * What the page is drawing at now: the viewport width, the root font size and the baseline (one spacing step) in px. They
 * move as the window is resized in the fluid grid modes, and stay put in the fixed one.
 */
function useMetrics() {
  const probeRef = useRef<HTMLSpanElement>(null);
  const [metrics, setMetrics] = useState({ viewport: 0, root: 0, baseline: 0 });
  useEffect(() => {
    const read = () =>
      setMetrics({
        viewport: window.innerWidth,
        root: tenth(Number.parseFloat(getComputedStyle(document.documentElement).fontSize)),
        baseline: tenth(probeRef.current?.getBoundingClientRect().height ?? 0),
      });
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);
  return { metrics, probeRef };
}

/** One sample of type with a caption: what it is, then what it is drawn at, read live from the page. */
function Step({ label, baseline, children }: { label: string; baseline: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState('');
  useEffect(() => {
    const read = () => {
      const element = ref.current?.firstElementChild;
      if (element) setDrawn(describeStep(element, baseline));
    };
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, [baseline]);
  return (
    <Stack gap="1" data-step>
      <Text variant="caption">
        {label} · <span data-readout>{drawn}</span>
      </Text>
      <div ref={ref} data-sample>
        {children}
      </div>
    </Stack>
  );
}

const SAMPLE = 'The quick brown fox jumps over the lazy dog';
const PARAGRAPH =
  'Typography is the craft of arranging type to make written language legible, readable and appealing when displayed. The arrangement involves the typeface, size, line length and spacing.';

// The style book is a developer's page, not product wording: its sample text is written here, not in the text map.

/**
 * A style book: the type scale, the spacing steps, the twelve columns, rows and the common controls, all drawn with the
 * design system's own components, so it shows the site's own theme and grid mode. It reads the page's live root size and
 * baseline, so resizing the window shows how the grid scales. Mount it on a route of the app.
 *
 * @returns the style book.
 */
export function StyleBook() {
  const { metrics, probeRef } = useMetrics();
  return (
    <Stack gap="8">
      <Section id="grid" label="Grid">
        <span ref={probeRef} className={probe} aria-hidden />
        <Wrap gap="8">
          <Text>Viewport {metrics.viewport}px</Text>
          <Text>Root {metrics.root}px</Text>
          <Text>Baseline {metrics.baseline}px</Text>
        </Wrap>
      </Section>

      <Section id="type-scale" label="Type scale">
        <Stack gap="6">
          {STEPS.map((step) => (
            <Step key={step} label={step} baseline={metrics.baseline}>
              <Text face="display" size={step}>
                {SAMPLE}
              </Text>
            </Step>
          ))}
          {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((level) => (
            <Step key={level} label={level} baseline={metrics.baseline}>
              <Title level={level}>The quick brown fox</Title>
            </Step>
          ))}
        </Stack>
      </Section>

      <Section id="columns" label="Columns">
        <Stack gap="6">
          <Text variant="caption">Three columns of the same size share their lines.</Text>
          <Grid>
            {[0, 1, 2].map((n) => (
              <Cell key={n} span="4">
                <Text>{PARAGRAPH}</Text>
              </Cell>
            ))}
          </Grid>
          <Text variant="caption">Twelve columns, then six, four and three.</Text>
          {(['12', '6', '4', '3'] as const).map((span) => (
            <Grid key={span}>
              {Array.from({ length: 12 / Number(span) }, (_, n) => (
                <Cell key={n} span={span}>
                  <div className={swatch} />
                </Cell>
              ))}
            </Grid>
          ))}
        </Stack>
      </Section>

      <Section id="spacing" label="Spacing">
        <Stack gap="2">
          {SPACING.map(([name, width]) => (
            <Wrap key={name} gap="4" align="center">
              <Label>{name}</Label>
              <div className={`${bar} ${width}`} />
            </Wrap>
          ))}
        </Stack>
      </Section>

      <Section id="rows" label="Rows">
        <ItemList gap="0" closed>
          <li>
            <Row title="A plain row" meta="A meta line under the title" aside="Aside" />
          </li>
          <li>
            <Row
              layout="dated"
              lead="Mar 5"
              title="A dated row"
              meta={['First line', 'Second line · $495']}
              aside="Open"
            />
          </li>
          <li>
            <Row layout="plain" title="A row with several lines" meta={['First line', 'Second line', 'Third line · detail']} />
          </li>
        </ItemList>
        <Grid>
          <Cell span="6">
            <ItemList gap="0" closed>
              <li>
                <Row
                  layout="stacked"
                  lead={placeholder}
                  title="A stacked row with a longer title that wraps"
                  meta={['First line', 'Second line', 'Third line · detail']}
                  link={(className, content) => (
                    <a className={className} href="#">
                      {content}
                    </a>
                  )}
                />
              </li>
            </ItemList>
          </Cell>
          <Cell span="6">
            <ItemList gap="0" closed>
              {['A card row', 'A card row with a longer title that wraps onto a second line'].map((title) => (
                <li key={title}>
                  <Row
                    layout="card"
                    lead={placeholder}
                    title={title}
                    meta={['First line', 'Second line', 'Third line · detail']}
                    link={(className, content) => (
                      <a className={className} href="#">
                        {content}
                      </a>
                    )}
                  />
                </li>
              ))}
            </ItemList>
          </Cell>
        </Grid>
      </Section>

      <Section id="controls" label="Controls">
        <Stack gap="4">
          <Wrap gap="3">
            <Button variant="solid">Solid</Button>
            <Button variant="surface">Surface</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="solid" disabled>
              Disabled
            </Button>
          </Wrap>
          <Wrap gap="3">
            <Badge variant="solid">Solid</Badge>
            <Badge variant="subtle">Subtle</Badge>
            <Badge variant="outline">Outline</Badge>
          </Wrap>
          <Input placeholder="Input" aria-label="Input" />
        </Stack>
      </Section>
    </Stack>
  );
}
