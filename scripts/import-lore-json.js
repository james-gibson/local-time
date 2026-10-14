#!/usr/bin/env node
/**
 * import-lore-json.js — Convert KB lore JSON (from build-lore-json.js) into
 * local-time TypeScript `Universe` modules.
 *
 * Usage: node scripts/import-lore-json.js <look-dir> <output-dir>
 *   Reads:  <look-dir>/*.json
 *   Writes: <output-dir>/<universe_id>.ts   (one module per universe)
 *           <output-dir>/index.ts           (barrel export)
 *
 * The generated modules target the REAL local-time type system
 * (src/core/types.ts): a plain `Universe` object literal, timestamps as
 * `BigInt(Date.UTC(...)) * 1000000n` nanoseconds, and the shared
 * `realityRelation` / `attribution` / `layers` / `temporalStructure` shape.
 *
 * They are emitted with `as unknown as Universe` so richer KB-only fields
 * (e.g. keyframe descriptions) survive without fighting excess-property checks.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename, relative } from 'node:path';

// --- config maps -----------------------------------------------------------

const TYPE_MAP = {
  'historical-event': 'HISTORICAL_EVENT',
  'legal-timeline': 'LEGAL_TIMELINE',
  biography: 'BIOGRAPHY',
  mission: 'MISSION',
  film: 'FILM',
  book: 'BOOK',
  simulation: 'SIMULATION',
  technology: 'TECHNOLOGY',
  institution: 'INSTITUTIONAL_PERIOD',
  'institutional-period': 'INSTITUTIONAL_PERIOD',
};

const WINDOW_STRATEGIES = new Set(['scene_based', 'time_based', 'phase_based', 'countdown_based']);

/**
 * KB window strategies that have a defensible equivalent in the TypeScript model.
 *
 * A point in time is a *degenerate phase*: smeared it is a stretch, zoomed in it has width.
 * `phase_based` is therefore the honest representation of `point_in_time`, not a downgrade
 * (james-gibson/local-time#79). Naming it here makes that a mapping rather than a typo the
 * default silently absorbed — anything in neither set now warns.
 */
const WINDOW_STRATEGY_ALIASES = { point_in_time: 'phase_based' };
const SEGMENT_TYPES = new Set([
  'sequence', 'act', 'scene', 'phase', 'countdown', 'mission_phase',
  'life_period', 'education', 'career', 'public_service', 'legal_period',
  'legislation_active', 'court_jurisdiction',
]);
const TIME_PRECISIONS = new Set([
  'MILLION_YEARS', 'CENTURY', 'DECADE', 'YEAR', 'MONTH', 'DAY',
  'HOUR', 'MINUTE', 'SECOND', 'MILLISECOND', 'NANOSECOND',
]);

/** Map a KB precision (any case) to a `TimePrecision.<X>` expression. */
function precisionEnum(p) {
  const key = String(p ?? 'SECOND').toUpperCase().replace(/[\s-]+/g, '_');
  return `TimePrecision.${TIME_PRECISIONS.has(key) ? key : 'SECOND'}`;
}

// --- helpers ---------------------------------------------------------------

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;

/** ISO date/datetime -> nanosecond bigint expression (UTC). */
function ns(iso) {
  const m = String(iso).match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/
  );
  if (!m) return null;
  const [, y, mo, d, h = '0', mi = '0', s = '0'] = m;
  return `BigInt(Date.UTC(${+y}, ${+mo - 1}, ${+d}, ${+h}, ${+mi}, ${+s})) * 1000000n`;
}

function toIdentifier(universeId) {
  const camel = String(universeId)
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/_([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())
    .replace(/^([0-9])/, '_$1');
  return `${camel}Universe`;
}

/**
 * Resolve the `realityRelation.type` string for an imported universe.
 *
 * A document may declare an explicit relation type (carried as
 * `realityRelationType` in the KB JSON, sourced from the `reality-relation`
 * frontmatter key). That wins, because the scalar gradient alone cannot
 * represent interpretation/metafiction/recreation/etc. Otherwise the degree is
 * banded onto the four coarse members as a fallback.
 *
 * Accepts either argument order for convenience:
 *   realityRelationType(declaredType, degree)  or  realityRelationType(degree, declaredType)
 * and the legacy single-arg `realityRelationType(degree)`.
 */
function realityRelationType(a, b) {
  let declared = undefined;
  let degree = undefined;
  const isNum = (v) =>
    v !== null && v !== undefined && String(v).trim() !== '' && Number.isFinite(Number(v));
  if (b === undefined) {
    if (isNum(a)) {
      degree = a;
    } else {
      declared = a;
    }
  } else if (isNum(a) && !isNum(b)) {
    degree = a;
    declared = b;
  } else if (!isNum(a) && isNum(b)) {
    declared = a;
    degree = b;
  } else {
    // Ambiguous: prefer a string-ish first arg as declared when present.
    declared = a;
    degree = b;
  }
  if (declared !== null && declared !== undefined && String(declared).trim() !== '') {
    return String(declared).trim();
  }
  if (degree === null || degree === undefined) return 'documentary';
  const g = Number(degree);
  if (g <= 0.2) return 'documentary';
  if (g <= 0.5) return 'historical_fiction';
  if (g <= 0.75) return 'inspired_by';
  return 'pure_fiction';
}

// --- generators ------------------------------------------------------------

function emitKeyframes(keyframes) {
  const out = [];
  for (const kf of keyframes) {
    // A presumed keyframe may carry a date-range instead of a point timestamp.
    const dr = kf['date-range'];
    const ts = ns(kf.timestamp) ?? (dr && ns(dr.earliest)) ?? null;
    if (!ts) continue;
    out.push('      {');
    out.push(`        id: ${q(kf.id ?? 'keyframe')},`);
    out.push(`        timestamp: ${ts},`);
    out.push(`        significance: ${num(kf.significance, 0.5)},`);
    if (Array.isArray(kf.tags) && kf.tags.length) {
      out.push(`        tags: [${kf.tags.map(q).join(', ')}],`);
    } else {
      out.push('        tags: [],');
    }
    out.push(`        certainty: ${num(kf.certainty, 1)},`);
    if (dr && ns(dr.earliest) && ns(dr.latest)) {
      out.push(`        dateRange: { earliest: ${ns(dr.earliest)}, latest: ${ns(dr.latest)} },`);
    }
    // Presumption + tension are additive KB extensions carried through the
    // `as unknown as Universe` cast (types.ts has no field for them yet).
    if (kf.presumed) out.push('        presumed: true,');
    if (kf['false-start']) out.push('        falseStart: true,');
    if (kf.provenance) out.push(`        provenance: ${q(kf.provenance)},`);
    if (kf['42i'] && Number.isFinite(Number(kf['42i'].tension))) {
      out.push(`        tension: ${num(kf['42i'].tension, 0)},`);
    }
    if (kf.description) out.push(`        description: ${q(kf.description)},`);
    out.push('      },');
  }
  return out;
}

function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function emitSegments(segments, keyframes) {
  // Resolve a segment endpoint: a keyframe address/id, or a raw ISO timestamp
  // (lore docs may give absolute bounds rather than epoch-relative addresses).
  const byAddress = new Map();
  for (const kf of keyframes) {
    const ts = ns(kf.timestamp);
    if (!ts) continue;
    if (kf.address) byAddress.set(String(kf.address), ts);
    if (kf.id) byAddress.set(String(kf.id), ts);
  }
  const resolveRef = (ref) => (ref && (byAddress.get(String(ref)) || ns(ref))) || null;

  // Computing `T±` offsets from the document's `zeroReference.zeroPoint` is NOT
  // an option. The KB's addresses are ordinal labels, not a uniform clock:
  // `founding:T+09:00:00` is ~3 years in one document and 9 nominal hours in
  // another, so any arithmetic on them produces nonsense (zero-reference skill,
  // Rule 2 "addresses are strings, not math"). The sanctioned answer is to
  // *declare* a keyframe at each epoch-relative bound (zero-reference skill →
  // "Presumed keyframes").
  //
  // An unresolved bound is therefore a hard error rather than a silent collapse
  // onto the first/last keyframe. Collect every offender so they can be fixed in
  // one pass (james-gibson/local-time#35).
  const unresolved = [];
  const resolveBound = (ref, segId, which) => {
    const resolved = resolveRef(ref);
    if (resolved) return resolved;
    unresolved.push({ segId, which, ref: ref ?? null });
    return null;
  };

  const out = [];
  for (const seg of segments) {
    const segId = seg.id ?? 'segment';
    const start = resolveBound(seg.start, segId, 'start');
    const end = resolveBound(seg.end, segId, 'end');
    // Skip a segment with an unresolved bound: emitting the first/last keyframe
    // in its place is exactly the corruption this guards against.
    if (!start || !end) continue;
    const type = SEGMENT_TYPES.has(seg.type) ? seg.type : 'phase';
    out.push('      {');
    out.push(`        id: ${q(segId)},`);
    out.push(`        start: ${start},`);
    out.push(`        end: ${end},`);
    out.push(`        type: ${q(type)},`);
    if (seg.status) out.push(`        status: ${q(seg.status)},`);
    if (seg.jurisdiction) out.push(`        jurisdiction: ${q(seg.jurisdiction)},`);
    if (seg.description) out.push(`        description: ${q(seg.description)},`);
    out.push('      },');
  }
  return { lines: out, unresolved };
}

function emitRealityAnchors(anchors) {
  const out = [];
  for (const a of anchors) {
    out.push('      {');
    out.push(`        realEventId: ${q(a['real-event-id'] ?? a.realEventId ?? '')},`);
    out.push(`        relationshipType: ${q(a.relationship ?? a.relationshipType ?? 'documents')},`);
    out.push(`        confidence: ${num(a.confidence, 1)},`);
    if (Array.isArray(a.evidence) && a.evidence.length) {
      out.push(`        evidence: [${a.evidence.map(q).join(', ')}],`);
    }
    out.push('      },');
  }
  return out;
}

function emitUniverse(json) {
  const id = json.universeId || basename(json.sourcePath || 'universe', '.md');
  const degree = json.realityGradient ?? 0;
  const declaredType = json.realityRelationType ?? json.realityRelation?.type ?? null;
  const anchors = json.realityAnchors ?? [];
  const zr = json.zeroReference ?? {};  const keyframes = zr.keyframes ?? [];
  const segments = zr.segments ?? [];
  const aliases = json.aliases ?? [];

  const layerEpochs = [];
  for (const seg of segments) {
    if (!seg.id) continue;
    layerEpochs.push(`      ${q(seg.id)}: {
        epochId: ${q(seg.id)},
        precision: TimePrecision.DAY,
        description: ${q(seg.description ?? seg.id)},
      },`);
  }
  if (layerEpochs.length === 0) layerEpochs.push('      main: { epochId: \'main\', precision: TimePrecision.DAY },');

  // The epoch's zero-point, when established or presumed. An `unestablished`
  // zero is deliberately omitted: null is explicit (skill §1a) and we do not
  // fabricate a zeroth where none is recorded.
  const zeroEpochLines = [];
  const zns = zr.zeroPoint ? ns(zr.zeroPoint) : null;
  if (zns && zr.zeroStatus !== 'unestablished') {
    zeroEpochLines.push('      zero_reference: {');
    zeroEpochLines.push("        epochId: 'zero_reference',");
    zeroEpochLines.push(`        startTime: ${zns},`);
    zeroEpochLines.push(`        precision: ${precisionEnum(zr.precision)},`);
    zeroEpochLines.push(`        zeroPoint: ${zns},`);
    zeroEpochLines.push(`        zeroEvent: ${q(zr.zeroEvent ?? json.title ?? 'zero-point')},`);
    zeroEpochLines.push(`        beforePrefix: ${q(zr.beforePrefix ?? 'T-')},`);
    zeroEpochLines.push(`        afterPrefix: ${q(zr.afterPrefix ?? 'T+')},`);
    zeroEpochLines.push(`        relativeFormat: ${q(zr.relativeFormat ?? 'HMS')},`);
    zeroEpochLines.push(`        zeroStatus: ${q(zr.zeroStatus ?? 'presumed')},`);
    if (Array.isArray(zr.falseStarts) && zr.falseStarts.length) {
      zeroEpochLines.push('        falseStarts: [');
      for (const fs of zr.falseStarts) {
        const at = (fs && ns(fs.at)) || '0n';
        zeroEpochLines.push(
          `          { at: ${at}, address: ${q(fs?.address ?? '')}, outcome: ${q(fs?.outcome ?? 'aborted')}${fs?.note ? `, note: ${q(fs.note)}` : ''} },`
        );
      }
      zeroEpochLines.push('        ],');
    }
    zeroEpochLines.push('      },');
  }

  // `point_in_time` is an alias, not a loss (see WINDOW_STRATEGY_ALIASES). Anything in
  // neither set is a real unknown and is called out instead of being defaulted in silence.
  const rawStrategy = zr.windows?.strategy;
  let windowStrategy =
    WINDOW_STRATEGY_ALIASES[rawStrategy] ??
    (WINDOW_STRATEGIES.has(rawStrategy) ? rawStrategy : null);
  if (rawStrategy != null && windowStrategy === null) {
    console.warn(
      `! windows.strategy "${rawStrategy}" is not a known strategy; defaulting to phase_based`,
    );
  }
  windowStrategy = windowStrategy ?? 'phase_based';

  const realityType = realityRelationType(declaredType, degree);
  const { lines: segmentLines, unresolved: unresolvedSegments } = emitSegments(segments, keyframes);

  const lines = [];
  lines.push('/**');
  lines.push(` * ${json.title ?? id} — auto-generated by import-lore-json.js. DO NOT EDIT.`);
  if (json.localTimeImport) lines.push(` * Source import: ${json.localTimeImport}`);
  if (json.sourceUrl) lines.push(` * Source: ${json.sourceUrl}`);
  lines.push(' */');
  lines.push("import { Universe, UniverseType, TimePrecision } from '../../../core/types';");
  lines.push('');
  lines.push(`export const ${toIdentifier(id)}: Universe = {`);
  lines.push(`  universeId: ${q(id)},`);
  lines.push(`  type: UniverseType.${TYPE_MAP[json.type] ?? 'HISTORICAL_EVENT'},`);
  lines.push('  identifiers: {');
  lines.push(`    primary: ${q(json.identifiers?.primary ?? id)},`);
  if (aliases.length) lines.push(`    aliases: [${aliases.map(q).join(', ')}],`);
  lines.push('  },');
  lines.push('  realityRelation: {');
  lines.push(`    type: ${q(realityType)},`);
  lines.push(`    fictionalizationDegree: ${num(degree, 0)},`);
  lines.push('    realityAnchors: [');
  lines.push(...emitRealityAnchors(anchors));
  lines.push('    ],');
  lines.push('  },');
  lines.push('  attribution: {');
  if (json.attribution?.['public-domain'] !== undefined) {
    lines.push(`    public_domain: ${Boolean(json.attribution['public-domain'])},`);
  }
  if (json.attribution?.sources?.length) {
    lines.push(`    sources: [${json.attribution.sources.map(q).join(', ')}],`);
  }
  lines.push(`    citations_required: ${Boolean(json.attribution?.['citations-required'] ?? false)},`);
  lines.push('  },');
  lines.push('  epochs: {},');
  lines.push('  layers: [');
  lines.push('    {');
  lines.push('      layerId: \'primary\',');
  lines.push('      type: \'primary\',');
  lines.push('      epochs: {');
  lines.push(...zeroEpochLines, ...layerEpochs);
  lines.push('      },');
  lines.push('    },');
  lines.push('  ],');
  lines.push('  temporalStructure: {');
  lines.push('    segments: [');
  lines.push(...segmentLines);
  lines.push('    ],');
  lines.push('    keyframes: [');
  lines.push(...emitKeyframes(keyframes));
  lines.push('    ],');
  lines.push(`    windows: { strategy: ${q(windowStrategy)} },`);
  lines.push('  },');
  lines.push('  metadata: {');
  lines.push(`    canonicalName: ${q(json.title ?? id)},`);
  if (json.description) lines.push(`    description: ${q(json.description)},`);
  if (json.culturalSignificance !== null && json.culturalSignificance !== undefined) {
    lines.push(`    cultural_significance: ${num(json.culturalSignificance, 0)},`);
  }
  if (zr.zeroStatus) lines.push(`    zeroStatus: ${q(zr.zeroStatus)},`);
  if (zr.condition?.dilatation !== null && zr.condition?.dilatation !== undefined) {
    lines.push(`    timelineDilatation: ${num(zr.condition.dilatation, 0)},`);
  }
  const released =
    zr.zeroPoint ??
    (String(id).match(/(\d{4})/)?.[1] ? `${String(id).match(/(\d{4})/)[1]}-01-01` : '1970-01-01');
  lines.push(`    released: new Date(${q(released)}),`);
  lines.push('  },');
  lines.push('} as unknown as Universe;');
  lines.push('');
  return { code: lines.join('\n'), unresolved: unresolvedSegments };
}

// --- driver ----------------------------------------------------------------

const jsonDir = process.argv[2] || './lore';
const outputDir = process.argv[3] || './src/config/universes/imported';

if (!existsSync(jsonDir)) {
  console.error(`Input directory not found: ${jsonDir}`);
  process.exit(1);
}

/** Recursively collect lore JSON paths — always written beside a .md, so a
 *  standalone .json (a real config like opencode.json) is not a lore document. */
function collectLoreJson(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectLoreJson(full, out);
    else if (entry.name.endsWith('.json') && existsSync(full.replace(/\.json$/, '.md'))) out.push(full);
  }
  return out.sort();
}

mkdirSync(outputDir, { recursive: true });

const jsonPaths = collectLoreJson(jsonDir);
console.log(`Importing ${jsonPaths.length} lore document(s) from ${jsonDir} -> ${outputDir}`);

const exports = [];
const notEnrolled = [];

// Rendered modules are held back until every document has been checked: one
// unresolved segment bound fails the whole run instead of emitting a tree where
// some segments silently collapsed onto their first/last keyframe.
const rendered = [];
const problems = [];

for (const jsonPath of jsonPaths) {
  const json = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  // Enrolment is the contract, and the JSON carries it so this check needs no
  // second read of the markdown. A JSON without the flag is stale or hand-made:
  // skip it rather than quietly inventing a universe.
  if (json['local-time-sync'] !== true) {
    notEnrolled.push(relative(jsonDir, jsonPath));
    continue;
  }
  if (!json.universeId) {
    notEnrolled.push(`${relative(jsonDir, jsonPath)} (enrolled, no universe-id)`);
    continue;
  }
  const rel = relative(jsonDir, jsonPath);
  const { code, unresolved } = emitUniverse(json);
  const moduleName = String(json.universeId).replace(/[^a-zA-Z0-9]+/g, '_');
  if (unresolved.length) {
    for (const u of unresolved) {
      problems.push({ doc: rel, universeId: json.universeId, ...u });
    }
    continue;
  }
  rendered.push({
    rel,
    moduleName,
    id: toIdentifier(json.universeId),
    tsPath: join(outputDir, `${moduleName}.ts`),
    code,
  });
}

if (problems.length) {
  const docs = new Set(problems.map((p) => p.doc));
  console.error(
    `\n${problems.length} unresolved segment bound(s) across ${docs.size} document(s):\n`,
  );
  for (const p of problems) {
    console.error(
      `  ✗ ${p.doc} (${p.universeId}) — segment "${p.segId}" (${p.which}): ` +
        `${p.ref ? q(p.ref) : '(missing)'} matches no declared keyframe address/id ` +
        `and is not an absolute ISO timestamp`,
    );
  }
  console.error(
    '\nEvery bound must resolve to a declared keyframe (declare one with that `address`) or to\n' +
      'an absolute ISO timestamp. Do NOT compute `T±` offsets from the zero point: the addresses\n' +
      'are ordinal labels, not a clock (zero-reference skill → "Presumed keyframes").\n' +
      'Refusing to emit segments that would silently collapse (james-gibson/local-time#35).',
  );
  process.exit(1);
}

for (const r of rendered) {
  writeFileSync(r.tsPath, r.code);
  exports.push({ moduleName: r.moduleName, id: r.id });
  console.log(`  ${r.rel} -> ${basename(r.tsPath)}`);
}

if (notEnrolled.length) {
  console.log(`Not enrolled (${notEnrolled.length}): ${notEnrolled.join(', ')}`);
}

if (exports.length) {
  const barrel = exports
    .map((e) => `export { ${e.id} } from './${e.moduleName}';`)
    .join('\n');
  writeFileSync(join(outputDir, 'index.ts'), barrel + '\n');
  console.log(`  index.ts -> ${exports.length} export(s)`);
}

console.log('Done.');
