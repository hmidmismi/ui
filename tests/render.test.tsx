import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Button,
  Hero,
  Inset,
  ItemList,
  Label,
  Layout,
  Measure,
  Section,
  SectionGroup,
  SkipLink,
  SplitGrid,
  Stack,
  StatusBadge,
  Pair,
  Row,
  Text,
  Card,
  UiTextProvider,
  CloseButton,
  Title,
  Wrap,
} from '../src/components';

/** Server-renders an element to HTML. */
const html = (element: React.ReactElement) => renderToStaticMarkup(element);

describe('components render with the classes of their recipes', () => {
  it('a button takes its variant and size', () => {
    const out = html(
      <Button variant="outline" size="sm">
        Save
      </Button>
    );
    expect(out).toContain('button');
    expect(out).toContain('button--variant_outline');
    expect(out).toContain('button--size_sm');
  });

  it('a title is the tag of its level, styled for that level', () => {
    for (const level of ['h1', 'h2', 'h3', 'h4'] as const) {
      const out = html(<Title level={level}>Heading</Title>);
      expect(out).toContain(`<${level}`);
      expect(out).toContain(`title--level_${level}`);
    }
  });

  it('a title can render another tag than its level', () => {
    expect(
      html(
        <Title level="h1" as="p">
          x
        </Title>
      )
    ).toMatch(/^<p /);
  });

  it('layout primitives carry their gap and padding variants', () => {
    expect(
      html(
        <Stack gap="4" padBlock="8" padInline="4">
          x
        </Stack>
      )
    ).toMatch(/layout-stack--gap_4.*layout-stack--padBlock_8.*layout-stack--padInline_4/s);
    expect(
      html(
        <Wrap gap="2" align="center">
          x
        </Wrap>
      )
    ).toContain('layout-wrap--gap_2');
    expect(html(<ItemList inline>x</ItemList>)).toContain('item-list--inline_true');
    expect(html(<Measure>x</Measure>)).toContain('measure');
    expect(html(<Inset>x</Inset>)).toContain('inset');
    expect(html(<Layout kind="overview">x</Layout>)).toContain('layout--kind_overview');
    expect(html(<SplitGrid gap="lg">x</SplitGrid>)).toContain('split-grid--gap_lg');
    expect(html(<Stack as="header" align="center" ruled after="6">x</Stack>)).toContain('layout-stack--align_center');
    expect(html(<Stack ruled>x</Stack>)).toContain('layout-stack--ruled_true');
    expect(html(<Wrap justify="between" align="end" after="6">x</Wrap>)).toContain('layout-wrap--justify_between');
  });

  it('text takes its look from variants, not from a role name', () => {
    const out = html(
      <Text size="lg" face="display" tone="accent" weight="medium">
        x
      </Text>
    );
    expect(out).toContain('text--scale_display-lg');
    expect(out).toContain('text--tone_accent');
    expect(out).toContain('text--weight_medium');
    expect(html(<Text variant="caption">x</Text>)).toContain('text--tone_muted');
    expect(html(<Text as="span" size="sm" figures>1</Text>)).toContain('text--scale_body-sm-inline');
    expect(html(<Label tone="accent">x</Label>)).toContain('label--tone_accent');
  });

  it('a section names itself and carries its tone', () => {
    const out = html(
      <Section id="credits" label="Credits" tone="sand">
        x
      </Section>
    );
    expect(out).toContain('id="credits"');
    expect(out).toContain('Credits');
    expect(out).toContain('section');
    expect(
      html(
        <SectionGroup id="g" label="Group">
          x
        </SectionGroup>
      )
    ).toContain('Group');
  });

  it('a card can be a link',()=>{
    expect(html(<Card hue="2" interactive link={(className, content) => <a className={className} href="/x">{content}</a>}>Name</Card>)).toContain('<a class="hue');
  });

  it('a card takes its hue, tint, layout and control state from props', () => {
    const control = html(
      <Card as="button" layout="corners" hue="3" tint="soft" interactive end="12" onClick={() => {}}>
        Label
      </Card>
    );
    expect(control).toContain('hue--hue_3');
    expect(control).toContain('card__root--layout_corners');
    expect(control).toContain('card__root--tint_soft');
    expect(control).toContain('card__root--interactive_true');
    expect(control).toContain('type="button"');
    expect(control).toContain('card__end');
    const plate = html(<Card layout="plate" hue="5" end="12">NW</Card>);
    expect(plate).toContain('hue--hue_5');
    expect(plate).toContain('card__root--layout_plate');
    expect(html(<Card>x</Card>)).toContain('card__root--layout_stack');
  });

  it('a list of pairs keeps each label and value', () => {
    const out = html(
      <ItemList as="dl" layout="pairs" ruled>
        <Pair label="Label">NWCRI</Pair>
      </ItemList>
    );
    expect(out).toContain('Label');
    expect(out).toContain('NWCRI');
    expect(out).toContain('item-list--layout_pairs');
    expect(out).toContain('item-list--ruled_true');
    expect(html(<ItemList layout="flow" size="lg"><li>x</li></ItemList>)).toContain('item-list--layout_flow');
  });

  it('a row is a link, a button or neither, and keeps its parts', () => {
    const link = html(
      <Row layout="dated" lead="Oct" title="Show" meta="Hall" aside="Here" link={(className, content) => <a className={className} href="/x">{content}</a>} />
    );
    expect(link).toContain('<a class="row__root');
    expect(link).toContain('row__root--layout_dated');
    expect(link).toContain('row__root--interactive_true');
    expect(link).toContain('Show');
    expect(link).toContain('Here');
    const button = html(<Row layout="plated" title="Tracks" open controls="drawer-1" onToggle={() => {}} />);
    expect(button).toContain('aria-expanded="true"');
    expect(button).toContain('aria-controls="drawer-1"');
    expect(html(<Row title="Plain" />)).toContain('<div class="row__root');
  });

  it('a hero renders the four text slots and its link', () => {
    const out = html(
      <Hero
        orientation="landscape"
        kicker="Editorial"
        headline="Remembering"
        summary="A guide."
        link={(className) => (
          <a className={className} href="/x">
            Read
          </a>
        )}
      />
    );
    for (const text of ['Editorial', 'Remembering', 'A guide.', 'Read'])
      expect(out).toContain(text);
    expect(out).toContain('hero__root--orientation_landscape');
  });

  it('a status badge and a skip link', () => {
    expect(html(<StatusBadge state="ok">All systems operational</StatusBadge>)).toContain(
      'status-badge--state_ok'
    );
    const skip = html(<SkipLink target="main">Skip to content</SkipLink>);
    expect(skip).toContain('href="#main"');
  });

  it('shows the default wording, and a project can change any entry', () => {
    expect(html(<CloseButton />)).toContain('aria-label="Close"');
    const changed = html(
      <UiTextProvider text={{ close: 'Fermer' }}>
        <CloseButton />
      </UiTextProvider>
    );
    expect(changed).toContain('aria-label="Fermer"');
  });
});
