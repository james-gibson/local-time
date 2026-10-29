import fs from 'node:fs';
import path from 'node:path';

import { xkcd1491AuthorityUniverse, XKCD_1491_DISPUTED_ENTRIES } from '../../config/universes/reference/xkcd_1491_authority';
import { xkcd1491CorrectionsUniverse } from '../../config/universes/reference/xkcd_1491_corrections';
import {
  buildStoriesChart,
  classify,
  decodeView,
  encodeView,
  entriesFromAuthority,
  entriesFromRegistry,
  project,
  unproject,
  type AuthorityTable,
  type ChartEntry,
  type ChartView,
} from '../stories-chart';
import { renderStoriesConsole, renderStoriesSvg } from '../stories-chart-svg';

const tablePath = path.join(__dirname, '../../config/universes/reference/xkcd-1491-table.json');
const table = JSON.parse(fs.readFileSync(tablePath, 'utf8')) as AuthorityTable;

const entry = (over: Partial<ChartEntry>): ChartEntry => ({
  id: 'x',
  label: 'x',
  side: 'past',
  publicationYear: 1985,
  offset: { min: -30, max: -30 },
  certainty: 1,
  fictionalizationDegree: 1,
  source: 'authority',
  ...over,
});

const authoritySpec = () =>
  buildStoriesChart({
    entries: entriesFromAuthority(table),
    viewerNow: 2015.15,
    mapOrigin: 2015.15,
  });

describe('projection', () => {
  const piecewise = {
    mode: 'piecewise' as const,
    domain: { min: -3000, max: 2030 },
    breaks: [
      { value: -3000, position: 0 },
      { value: 1000, position: 0.2 },
      { value: 1900, position: 0.6 },
      { value: 2030, position: 1 },
    ],
  };

  it('is monotone on the adaptive axis', () => {
    const xs = [-3000, -2000, 0, 1000, 1500, 1900, 2000, 2030].map((y) => project(y, piecewise));
    for (let i = 1; i < xs.length; i += 1) expect(xs[i]).toBeGreaterThan(xs[i - 1]);
  });

  it('round-trips through unproject within a year', () => {
    for (const y of [-2100, -700, 1, 1002, 1939, 2015]) {
      expect(unproject(project(y, piecewise), piecewise)).toBeCloseTo(y, -1);
    }
  });

  it('keeps zero at the middle of a signed log axis', () => {
    const log = { mode: 'log' as const, domain: { min: -1e9, max: 1e9 } };
    expect(project(0, log)).toBeCloseTo(0.5, 6);
    expect(project(1e9, log)).toBeCloseTo(1, 6);
    expect(project(-1e9, log)).toBeCloseTo(0, 6);
  });
});

describe('classify — the verdict belongs to the reader, not the work', () => {
  it('calls 1984 obsolete once its date has passed, and still possible before', () => {
    const orwell = entry({ id: 'nineteen-eighty-four', publicationYear: 1949, offset: { min: 35, max: 35 }, side: 'future' });
    expect(classify(orwell, 1980)).toBe('still_possible');
    expect(classify(orwell, 2015)).toBe('obsolete');
  });

  it('calls Gilgamesh a former period piece and refuses to move its coordinates', () => {
    const gilgamesh = entry({ publicationYear: -2100, offset: { min: -500, max: -500 } });
    expect(classify(gilgamesh, 2015)).toBe('period_piece');
    expect(classify(gilgamesh, -1800)).toBe('recognizable');
    expect(gilgamesh.publicationYear).toBe(-2100);
  });
});

describe('the authority table (#229)', () => {
  it('holds the chart\'s 104 entries and its extremes', () => {
    const spec = authoritySpec();
    expect(spec.entries).toHaveLength(104);
    const years = spec.entries.map((e) => e.publicationYear);
    expect(Math.min(...years)).toBe(-2100);
    expect(Math.max(...years)).toBe(2015);
    const biggest = Math.max(...spec.entries.map((e) => Math.max(Math.abs(e.offset.min), Math.abs(e.offset.max))));
    expect(biggest).toBe(1e9);
  });

  it('keeps the chart\'s claims, not the truth', () => {
    const spec = authoritySpec();
    const disputed = spec.entries.filter((e) => e.dispute);
    expect(disputed).toHaveLength(8);
    // The chart's ~535-year placement of Lest Darkness Fall is not silently fixed here.
    const lest = spec.entries.find((e) => e.id === 'lest-darkness-fall');
    expect(lest?.dispute).toMatch(/1404|535/);
    expect(lest?.certainty).toBeLessThan(1);
  });

  it('keeps the printed spellings and the open-ended settings', () => {
    const spec = authoritySpec();
    const rip = spec.entries.find((e) => e.id === 'rip-van-winkel');
    expect(rip?.label).toBe('Rip Van Winkel');
    const moby = spec.entries.find((e) => e.id === 'moby-dick');
    expect(moby?.offset.open).toBe(true);
  });

  it('carries the attribution required by the licence', () => {
    expect(authoritySpec().attribution).toContain('xkcd.com/1491');
    expect(authoritySpec().attribution).toContain('CC BY-NC 2.5');
  });
});

describe('the fixture pair (#229 / #230)', () => {
  const keyframeIds = new Set(
    (xkcd1491AuthorityUniverse.temporalStructure?.keyframes ?? []).map((k) => k.id),
  );

  it('the authority opens no edge to its corrections', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '../../config/universes/reference/xkcd_1491_authority.ts'),
      'utf8',
    );
    expect(source).toContain('GENERATED FILE');
    // The prose above the object names the sibling on purpose; the *data* must not.
    expect(source).not.toMatch(/import .*corrections/);
    expect(source).not.toContain('targetUniverseId');
    expect(source).not.toContain('targetKeyframeId');
    for (const keyframe of xkcd1491AuthorityUniverse.temporalStructure?.keyframes ?? []) {
      expect(keyframe.targetUniverseId).toBeUndefined();
    }
  });

  it('every correction targets a keyframe that exists', () => {
    const corrections = xkcd1491CorrectionsUniverse.temporalStructure?.keyframes ?? [];
    expect(corrections.length).toBeGreaterThanOrEqual(8);
    for (const c of corrections) {
      expect(String(c.targetUniverseId)).toBe('system:chart:xkcd_1491_authority:v1');
      expect(c.targetKeyframeId).toBeDefined();
      expect(keyframeIds.has(c.targetKeyframeId as string)).toBe(true);
    }
  });

  it('has at least one deliberately unresolved correction', () => {
    const corrections = xkcd1491CorrectionsUniverse.temporalStructure?.keyframes ?? [];
    expect(corrections.some((c) => c.tags.includes('unresolved'))).toBe(true);
  });

  it('registers the disputed ids the generator found', () => {
    expect(XKCD_1491_DISPUTED_ENTRIES).toContain('lest-darkness-fall');
    // Eight rows, six works: the three Star Wars entries are disputed for one reason.
    expect(XKCD_1491_DISPUTED_ENTRIES).toHaveLength(8);
    expect(new Set(XKCD_1491_DISPUTED_ENTRIES).size).toBe(8);
  });
});

describe('registry corpus', () => {
  it('skips the fixtures themselves: a fixture cannot draw itself as a row', () => {
    const entries = entriesFromRegistry([xkcd1491AuthorityUniverse, xkcd1491CorrectionsUniverse]);
    expect(entries).toHaveLength(0);
  });
});

describe('views', () => {
  it('round-trips every dial through the URL', () => {
    const view: ChartView = { xMin: -3000, xMax: 2030, yMin: -1e9, yMax: 1e9, xMode: 'piecewise', yMode: 'log', now: 2026.8, custom: true };
    expect(decodeView(encodeView(view))).toEqual(view);
  });

  it('refuses a view with no reader origin', () => {
    expect(() => decodeView('x=-10..10')).toThrow(/origin/);
  });
});

describe('rendering', () => {
  const spec = authoritySpec();

  it('renders every entry, with text rather than paths', () => {
    const svg = renderStoriesSvg(spec, { theme: 'auto' });
    expect((svg.match(/class="entry /g) ?? []).length).toBe(spec.entries.length);
    expect(svg).toContain('<title>');
    expect(svg).toContain('<desc>');
    expect(svg).not.toContain('<image');
  });

  it('requests no external asset', () => {
    const svg = renderStoriesSvg(spec, { theme: 'auto' });
    expect(svg).not.toMatch(/<script[^>]+src=/);
    expect(svg).not.toContain('@import');
    expect(svg).not.toMatch(/url\(http/);
  });

  it('resolves theme variables for the interactive artefact and literals for the raster one', () => {
    expect(renderStoriesSvg(spec, { theme: 'auto' })).toContain('var(--ink)');
    const raster = renderStoriesSvg(spec, { theme: 'dark' });
    expect(raster).not.toContain('var(--ink)');
    expect(raster).toContain('#e6edf3');
  });

  it('stamps the origin it was drawn for', () => {
    const svg = renderStoriesSvg(spec, { theme: 'auto' });
    expect(svg).toContain('drawn for 2015');
    expect(svg).toContain('source drawn 2015');
  });

  it('console view lists every entry under exactly one class', () => {
    const text = renderStoriesConsole(spec);
    const sum = (text.match(/\((?!104)\d+\)/g) ?? []).reduce((acc, s) => acc + Number(s.replace(/[()]/g, '')), 0);
    expect(sum).toBe(104);
    expect(text).toContain('obsolete');
  });
});
