#!/usr/bin/env node
/**
 * Generate the xkcd #1491 rendering-authority universe from its checked-in table.
 *
 * `src/config/universes/reference/xkcd-1491-table.json` is the reviewable artefact:
 * the chart's own data points, sourced from the listing xkcd links to, with the
 * factual columns only. This script projects it into a `Universe` the registry can
 * load, so the fixture and the corpus share one vocabulary (epochs, keyframes,
 * segments) instead of inventing a second one for charts.
 *
 * Deterministic by construction: same JSON in, same module out, no clock, no
 * environment, keys emitted in a fixed order. A test asserts the round trip.
 *
 * Usage: node scripts/import-xkcd-1491.mjs [--check]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const SOURCE = path.join(root, 'src/config/universes/reference/xkcd-1491-table.json');
const TARGET = path.join(root, 'src/config/universes/reference/xkcd_1491_authority.ts');
const UNIVERSE_ID = 'system:chart:xkcd_1491_authority:v1';
const MAP_ORIGIN = '2015-02-25';

/** Decimal years → nanoseconds since the Unix epoch.
 *
 * Date cannot carry the ±1e9-year entries: its range is ±273,000 years, and
 * `Date.UTC(1, 0, 1)` silently means 1901 for years 0–99. So the instant is
 * computed arithmetically rather than through the library's `dateToNanoseconds`.
 * One Julian year is exact enough for a chart whose smallest unit is a year. */
const ns = (year) => BigInt(Math.round((year - 1970) * 365.2425 * 86400 * 1e9));

const PRECISION = {
  day: 'TimePrecision.DAY',
  year: 'TimePrecision.YEAR',
  century: 'TimePrecision.YEAR',
  approximate: 'TimePrecision.YEAR',
};

const snake = (id) => id.replace(/-/g, '_');
const settingOf = (e) => ({
  min: e.publication.year + Math.min(e.offset.min, e.offset.max),
  max: (e.publication.yearEnd ?? e.publication.year) + Math.max(e.offset.min, e.offset.max),
});

const doc = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
const entries = doc.entries;

const epochs = [];
const keyframes = [];
const segments = [];

for (const e of entries) {
  const p = e.publication;
  const s = settingOf(e);
  const precision = PRECISION[p.precision] ?? 'TimePrecision.YEAR';
  epochs.push(
    `        'publication:${e.id}': {`,
    `          epochId: 'publication:${e.id}',`,
    `          startTime: ns(${p.year}),`,
    `          precision: ${precision},`,
    `          description: ${JSON.stringify(`${e.label} — published ${p.year < 0 ? `${-p.year} BCE` : p.year}`)},`,
    `        },`,
    `        'setting:${e.id}': {`,
    `          epochId: 'setting:${e.id}',`,
    `          startTime: ns(${s.min}),`,
    `          endTime: ns(${s.max}),`,
    `          precision: ${precision},`,
    `          description: ${JSON.stringify(`${e.label} — set ${e.offset.asPrinted}`)},`,
    `        },`,
  );

  keyframes.push(
    `      {`,
    `        id: '${e.id}--publication',`,
    `        timestamp: ns(${p.year}),`,
    `        significance: 0.6,`,
    `        tags: ['publication', 'xkcd-1491'],`,
    `        description: ${JSON.stringify(`${e.label} — ${e.description}, published ${p.year < 0 ? `${-p.year} BCE` : p.year}`)},`,
    `        type: KeyframeType.PUBLICATION,`,
    `        precision: ${precision},`,
    `        certainty: ${p.precision === 'year' || p.precision === 'day' ? 1 : 0.8},`,
    `      },`,
    `      {`,
    `        id: '${e.id}--setting',`,
    `        timestamp: ns(${Math.round((s.min + s.max) / 2)}),`,
    `        significance: 0.5,`,
    `        tags: ['setting', 'xkcd-1491'],`,
    `        description: ${JSON.stringify(`${e.label} — set ${e.offset.asPrinted}`)},`,
    `        type: KeyframeType.MILESTONE,`,
    `        precision: ${precision},`,
    `        certainty: ${e.certainty},`,
    `        dateRange: { earliest: ns(${s.min}), latest: ns(${s.max}) },`,
    `      },`,
  );

  segments.push(
    `      {`,
    `        id: '${e.id}',`,
    `        start: ns(${s.min}),`,
    `        end: ns(${s.max}),`,
    `        type: 'phase',`,
    `        description: ${JSON.stringify(`${e.label} — ${e.section === 'past' ? 'set before publication' : 'set after publication'} (${e.offset.asPrinted})`)},`,
    `      },`,
  );
}

const disputes = entries.filter((e) => e.dispute);
const module = `// GENERATED FILE — do not edit. Source: src/config/universes/reference/xkcd-1491-table.json
// Regenerate: node scripts/import-xkcd-1491.mjs
//
// The xkcd #1491 rendering authority (james-gibson/local-time#229).
//
// This universe records **what the chart claims**, not what is true: entry
// positions, offsets, and the chart's own hedges. It is the fixed corpus the
// stories chart is verified against, because the library's own registry holds
// different works with different events and comparing the two proves nothing.
//
// The truth lives beside it in \`${'system:chart:xkcd_1491_corrections:v1'}\`
// (#230), which points here and is never pointed at. Keep that direction: a
// fixture that depends on its erratum is not reproducible from one file.
import { Universe, UniverseType, TimePrecision, KeyframeType } from '../../../core/types';

/** Decimal years → nanoseconds since the Unix epoch.
 *
 * Date cannot carry the ±1e9-year entries (its range is ±273,000 years, and
 * \`Date.UTC(1, 0, 1)\` means 1901 for years 0–99), so instants are computed
 * arithmetically. A Julian year is exact enough for a chart measured in years.
 */
const ns = (year: number): bigint => BigInt(Math.round((year - 1970) * 365.2425 * 86400 * 1e9));

export const xkcd1491AuthorityUniverse: Universe = {
  universeId: '${UNIVERSE_ID}',
  type: UniverseType.ABSTRACT_CONCEPT,
  identifiers: {
    primary: '${UNIVERSE_ID}',
    aliases: ['xkcd-1491', 'stories-of-the-past-and-future', 'chart-authority'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0,
    realityAnchors: [
      {
        realEventId: 'xkcd:1491',
        relationshipType: 'documents',
        confidence: 1,
        evidence: [
          'https://xkcd.com/1491 — the comic, whose alt text links to its data listing',
          'the listing at explainxkcd.com/wiki/index.php/1491, retrieved 2026-10-28',
        ],
      },
    ],
  },
  attribution: {
    public_domain: false,
    sources: [
      'xkcd #1491, "Stories of the Past and Future" (Randall Munroe, 2015-02-25, CC BY-NC 2.5)',
      'explainxkcd listing for 1491 — factual columns only; notes here are ours',
    ],
    citations_required: true,
  },
  metadata: {
    canonicalName: 'Stories of the Past and Future — the rendering authority',
    creators: ['Randall Munroe'],
    released: new Date('2015-02-25T00:00:00Z'),
    cultural_significance: 0.8,
  },
  epochs: {
    map_origin: {
      epochId: 'map_origin',
      startTime: ns(2015.15),
      precision: TimePrecision.DAY,
      description:
        'the instant the chart was drawn: its cone apex, its "this chart" entry, and the date every verdict in it was computed from. A dated fact about the source, never a rendering default',
    },
  },
  layers: [
    {
      layerId: 'entries',
      type: 'primary',
      epochs: {
${epochs.join('\n')}
      },
    },
  ],
  temporalStructure: {
    segments: [
${segments.join('\n')}
    ],
    keyframes: [
${keyframes.join('\n')}
    ],
    windows: { strategy: 'time_based', avgWindowSize: ns(1) },
  },
};

/**
 * The entries the chart hedges, printed as it printed them. Disputed values are
 * *not* corrected here — this list names the entries whose \`certainty\` is below
 * 1 so a reader can find them without re-deriving the rule from the JSON.
 */
export const XKCD_1491_DISPUTED_ENTRIES: readonly string[] = [
${disputes.map((e) => `  '${e.id}',`).join('\n')}
];
`;

if (process.argv.includes('--check')) {
  const current = fs.existsSync(TARGET) ? fs.readFileSync(TARGET, 'utf8') : '';
  if (current !== module) {
    console.error('xkcd_1491_authority.ts is stale — run: node scripts/import-xkcd-1491.mjs');
    process.exit(1);
  }
  console.log('authority module is up to date');
} else {
  fs.writeFileSync(TARGET, module);
  console.log(`wrote ${path.relative(root, TARGET)} — ${entries.length} entries, ${disputes.length} disputed`);
}
