#!/usr/bin/env node
/**
 * build-lore-json.js — Convert KB lore docs (markdown + YAML frontmatter) to JSON
 * for MDX consumption AND for import into local-time TypeScript universes.
 *
 * Usage: node scripts/build-lore-json.js [content-root-or-lore-dir]
 *   Reads:  <dir>/lore/*.md   (or <dir>/*.md when the dir is itself `lore`)
 *   Writes: <dir>/lore/*.json (next to each markdown source)
 *
 * The output JSON is a normalised, lossless view of the zero-reference
 * frontmatter contract (see the `zero-reference` skill) plus the document body.
 *
 * It also carries two *derived* additions (recomputable, never authoritative):
 *   - the epoch zero-point + `zeroStatus`, synthesised from a declared
 *     zero-time or a `zero-point`-tagged keyframe (`null` = unestablished);
 *   - the 42i lift — each keyframe's complex coordinate (real elapsed time,
 *     imaginary label-drift) plus its tension, so timelines of different
 *     precision regimes can be compared.
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, basename, resolve, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';

/** Resolve the directory that actually contains the markdown lore docs. */
function resolveLoreDir(input) {
  const abs = resolve(input);
  // Prefer the project layout: content lives under <root>/lore. The project root
  // itself can hold top-level markdown (OUTSTANDING.md, CONVENTIONS.md), so a
  // plain "any .md here?" test resolves the root instead of its `lore/` dir and
  // the compendia never regenerate.
  const nested = join(abs, 'lore');
  if (exists(nested) && statSync(nested).isDirectory()) return nested;
  if (readdirSync(abs).some((e) => e.endsWith('.md'))) return abs; // dir is itself `lore`
  return abs;
}

/** Recursively collect .md paths (skipping dot-dirs like .ok/). */
function collectMarkdown(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectMarkdown(full, out);
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function exists(p) {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

function splitFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };
  let frontmatter = {};
  try {
    frontmatter = parseYaml(match[1]) || {};
  } catch (err) {
    console.error(`  ! YAML parse error: ${err.message}`);
  }
  return { frontmatter, body: match[2] ?? '' };
}

// --- zero-point derivation & the 42i lift ----------------------------------
//
// Addresses are NOMINAL strings — skill Rule 2: "addresses are strings, not
// math". To compare timelines from different precision regimes (a NASA
// countdown, where `T+05:30` really is 5.5 minutes, vs. a corporate history,
// where `T+09:00:00` really is twelve years) we lift every keyframe into a
// complex plane:
//
//   real axis  (re) = anchored elapsed time (timestamp - zeroPoint)
//   imag axis  (im) = drift between the printed label and reality (nominal - re)
//
// A literal timeline (labels map 1:1 onto time) sits on the real axis, im ≈ 0.
// A purely nominal one rotates into the imaginary plane as |im| → |re|. The
// per-keyframe `tension` (0..1) and the epoch `dilatation` (real-ms per
// nominal-"hour") are what let us compare "apples to volkswagons" without
// pretending the units agree.

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Parse an ISO 8601 date/datetime to epoch milliseconds, or null. */
function isoToMs(iso) {
  const m = String(iso ?? '').match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/
  );
  if (!m) return null;
  const [, y, mo, d, h = '0', mi = '0', s = '0'] = m;
  return Date.UTC(+y, +mo - 1, +d, +h, +mi, +s);
}

/**
 * Parse the nominal offset out of an epoch-relative address.
 *
 * Mirrors `Temporal42i.parseNominalOffset` so the derived view agrees with the
 * library instead of inventing its own dialect — a divergence here silently
 * zeroes the very offsets the lift exists to compare:
 *   - `…:T+HH:MM:SS` (and an optional `.mmm`) — a precise label.
 *   - `…:T+<n>day(s)ish` / `…:T+<n>d` — a fuzzy label; the trailing `ish` marks
 *     the offset as approximate.
 * Returns `null` when the address carries no parseable offset — never a guessed
 * zero, so callers can tell "no offset" from "offset of zero".
 */
function parseNominalOffset(address) {
  const a = String(address ?? '');
  const hms = a.match(/([+-])(\d{2,}):(\d{2}):(\d{2})(?:\.(\d{3}))?\s*$/);
  if (hms) {
    const sign = hms[1] === '-' ? -1 : 1;
    const ms = (+hms[2] * 3600 + +hms[3] * 60 + +hms[4]) * 1000 + +(hms[5] ?? 0);
    return { ms: sign * ms, approximate: false };
  }
  const days = a.match(/([+-])(\d+(?:\.\d+)?)\s*(?:d|day|days)(ish)?\s*$/i);
  if (days) {
    const sign = days[1] === '-' ? -1 : 1;
    return {
      ms: sign * Math.round(Number(days[2]) * 86_400_000),
      approximate: Boolean(days[3]),
    };
  }
  return null;
}

/** Nominal offset of an epoch-relative address in milliseconds, or null. */
function nominalMs(address) {
  return parseNominalOffset(address)?.ms ?? null;
}

/**
 * Derive the epoch's zero-point and its *status*.
 *
 *   established   — zero-time declared with a source
 *   presumed      — zero inferred from a keyframe (usable, but flagged)
 *   unestablished — no zeroth at all
 *
 * `null` is a statement, not a gap: in 42i space the origin is a real position,
 * and an event may genuinely have no established zeroth. We therefore never
 * silently fabricate one — an undeclared, underivable zero stays `null` with
 * status `unestablished`.
 */
function deriveZero(zr, fm, keyframes, zeroIndex) {
  const anchor = isObject(fm['zero-point']) ? fm['zero-point'] : {};
  const ownId = fm['universe-id'] ?? null;
  const refId = zr['universe-id'] ?? null;

  // A `zero-reference` naming ANOTHER universe inherits that universe's zeroth:
  // the amendments do not ratify an origin of their own, they extend the
  // Constitution's. Resolved from the pass-1 index; the inherited status is the
  // target's, because it *is* the same zeroth.
  if (refId && refId !== ownId && zeroIndex?.has(refId)) {
    const target = zeroIndex.get(refId);
    return {
      zeroPoint: target.zeroPoint,
      zeroStatus: target.zeroStatus,
      zeroSource: `reference:${refId}`,
      precision: zr.precision ?? target.precision,
      zeroEvent: zr['zero-event'] ?? target.zeroEvent,
      beforePrefix: zr['before-prefix'] ?? anchor['before-prefix'] ?? target.beforePrefix,
      afterPrefix: zr['after-prefix'] ?? anchor['after-prefix'] ?? target.afterPrefix,
      relativeFormat: zr['relative-format'] ?? anchor['relative-format'] ?? target.relativeFormat,
      falseStarts: zr['false-starts'] ?? [],
    };
  }

  const inlineTime = zr['zero-time'] ?? anchor['zero-time'] ?? fm['zero-time'] ?? null;
  const tagged = keyframes.find((k) => (k.tags ?? []).includes('zero-point'));
  const atZero = keyframes.find((k) => nominalMs(k.address) === 0);

  let zeroPoint = inlineTime;
  let source = inlineTime ? 'declared' : null;
  if (!zeroPoint && tagged?.timestamp) {
    zeroPoint = tagged.timestamp;
    source = 'keyframe:zero-point';
  }
  if (!zeroPoint && atZero?.timestamp) {
    zeroPoint = atZero.timestamp;
    source = 'keyframe:T+00:00:00';
  }

  const declared = zr['zero-status'] ?? anchor['zero-status'] ?? null;
  const zeroStatus =
    declared ?? (source === 'declared' ? 'established' : zeroPoint ? 'presumed' : 'unestablished');

  return {
    zeroPoint,
    zeroStatus,
    zeroSource: source,
    precision: zr.precision ?? anchor.precision ?? null,
    zeroEvent: zr['zero-event'] ?? anchor['zero-event'] ?? tagged?.description ?? null,
    beforePrefix: zr['before-prefix'] ?? anchor['before-prefix'] ?? 'T-',
    afterPrefix: zr['after-prefix'] ?? anchor['after-prefix'] ?? 'T+',
    relativeFormat: zr['relative-format'] ?? anchor['relative-format'] ?? 'HMS',
    falseStarts: zr['false-starts'] ?? anchor['false-starts'] ?? [],
  };
}

const round = (n, p) => Math.round(n * 10 ** p) / 10 ** p;

/** Lift keyframes into the 42i complex plane and score their tension. */
function liftTo42i(keyframes, zeroPointIso) {
  const z0 = isoToMs(zeroPointIso);
  if (z0 === null) return { lift: null, condition: null };

  let nomMin = Infinity;
  let nomMax = -Infinity;
  let reMin = Infinity;
  let reMax = -Infinity;
  const lift = new Map();

  for (const kf of keyframes) {
    const real = isoToMs(kf.timestamp);
    const nom = nominalMs(kf.address);
    if (real === null || nom === null) continue;
    const re = real - z0;   // real axis: anchored elapsed time
    const im = nom - re;    // imaginary axis: label drift from reality
    const tension = Math.abs(im) / Math.max(Math.abs(re), Math.abs(im), 1);
    lift.set(kf, { re, im, tension: round(tension, 4) });
    nomMin = Math.min(nomMin, nom);
    nomMax = Math.max(nomMax, nom);
    reMin = Math.min(reMin, re);
    reMax = Math.max(reMax, re);
  }

  const nominalSpan = nomMax - nomMin;
  const realSpan = reMax - reMin;
  return {
    lift,
    condition: {
      nominalSpanMs: Number.isFinite(nominalSpan) ? nominalSpan : null,
      realSpanMs: Number.isFinite(realSpan) ? realSpan : null,
      // real milliseconds per nominal "hour" — ≈1 for a literal timeline.
      dilatation: Number.isFinite(nominalSpan) && nominalSpan > 0
        ? round(realSpan / nominalSpan, 3)
        : null,
    },
  };
}

function normalise(mdPath, content, zeroIndex) {
  const { frontmatter: fm, body } = splitFrontmatter(content);

  // The zero-reference block holds the temporal structure.
  const zr = fm['zero-reference'] || {};
  const keyframes = zr.keyframes ?? [];
  const zero = deriveZero(zr, fm, keyframes, zeroIndex);
  const { lift, condition } = liftTo42i(keyframes, zero.zeroPoint);

  // Attach the 42i coordinate to each keyframe (a derived view, never authority).
  const keyframesOut = keyframes.map((kf) => {
    const l = lift?.get(kf);
    return l ? { ...kf, '42i': l } : kf;
  });

  return {
    // --- provenance ---
    sourcePath: mdPath,
    sourceUrl: fm['source-url'] ?? null,
    importedFrom: fm['imported-from'] ?? null,
    localTimeId: fm['local-time-id'] ?? null,
    localTimeImport: fm['local-time-import'] ?? null,

    // --- identity ---
    universeId: fm['universe-id'] ?? null,
    // Carried through so the importer can refuse a stale or un-enrolled JSON
    // without re-reading the markdown. `null` means the flag was absent.
    'local-time-sync': fm['local-time-sync'] ?? null,
    // Explicit permission to publish this universe as public documentation.
    // Deliberately separate from the KB's root-derived `visibility`: a doc can
    // live in a private root and still be publishable, but only on purpose.
    publish: fm.publish ?? null,
    type: fm.type ?? null,
    title: fm.title ?? null,
    description: fm.description ?? null,
    realityGradient: fm['reality-gradient'] ?? null,
    identifiers: fm.identifiers ?? null,
    parentUniverses: fm['parent-universes'] ?? [],
    aliases: fm.identifiers?.aliases ?? [],

    // --- attribution / reality ---
    attribution: fm.attribution ?? null,
    realityAnchors: fm['reality-anchors'] ?? [],
    crossReferences: fm['cross-references'] ?? [],
    culturalSignificance: fm['cultural-significance'] ?? null,

    // --- extension relationship to local-time ---
    extends: fm.extends ?? null,

    // --- temporal structure ---
    zeroReference: {
      zeroPoint: zero.zeroPoint,
      zeroStatus: zero.zeroStatus,
      zeroSource: zero.zeroSource,
      precision: zero.precision,
      zeroEvent: zero.zeroEvent,
      beforePrefix: zero.beforePrefix,
      afterPrefix: zero.afterPrefix,
      relativeFormat: zero.relativeFormat,
      falseStarts: zero.falseStarts,
      epochId: zr['epoch-id'] ?? null,
      addresses: zr.addresses ?? [],
      keyframes: keyframesOut,
      segments: zr.segments ?? [],
      windows: zr.windows ?? { strategy: 'phase_based' },
      layers: zr.layers ?? [],
      // 42i epoch condition: how literal the timeline's labels are.
      condition,
    },

    // --- narrative body ---
    body: body.trim(),
  };
}

const contentArg = process.argv[2] || '.';
const loreDir = resolveLoreDir(contentArg);

const mdPaths = collectMarkdown(loreDir);
console.log(`Building JSON from ${mdPaths.length} lore docs in ${loreDir}`);

/** Frontmatter key that enrols a doc in this sync. */
const ENROL_KEY = 'local-time-sync';

const isEnrolled = (fm) => {
  const v = fm[ENROL_KEY];
  return v === true || v === 'true' || v === 'yes';
};

// Pass 1 — index every enrolled doc's own zeroth, so a doc that *references*
// another universe's zeroth can resolve it instead of restating it.
const contents = new Map();
const frontmatters = new Map();
const zeroIndex = new Map();
for (const mdPath of mdPaths) {
  const content = readFileSync(mdPath, 'utf-8');
  contents.set(mdPath, content);
  const { frontmatter: fm } = splitFrontmatter(content);
  frontmatters.set(mdPath, fm);
  if (!isEnrolled(fm)) continue;
  const id = fm['universe-id'];
  const zr = fm['zero-reference'] || {};
  // A doc that borrows another universe's zeroth contributes none of its own.
  if (!id || (zr['universe-id'] && zr['universe-id'] !== id)) continue;
  const zero = deriveZero(zr, fm, zr.keyframes ?? []);
  if (zero.zeroPoint) zeroIndex.set(id, zero);
}

// Pass 2 — emit, but only for enrolled docs.
//
// Without an enrolment key the walk writes a JSON beside *every* markdown in the
// tree, so meta docs (CONVENTIONS.md, OUTSTANDING.md) acquire JSON exports they
// have no use for. `local-time-sync: true` in a doc's frontmatter opts it in;
// everything else is left alone. See CONVENTIONS.md.
const enrolled = [], skipped = [];
for (const mdPath of mdPaths) {
  if (!isEnrolled(frontmatters.get(mdPath))) {
    skipped.push(relative(loreDir, mdPath));
    continue;
  }
  enrolled.push(mdPath);
  const json = normalise(mdPath, contents.get(mdPath), zeroIndex);
  const jsonPath = mdPath.replace(/\.md$/, '.json');
  writeFileSync(jsonPath, JSON.stringify(json, null, 2) + '\n');
  console.log(`  ${relative(loreDir, mdPath)} -> ${basename(jsonPath)}  (${json.universeId ?? 'no universe-id'})`);
}

console.log(`Emitted ${enrolled.length}, skipped ${skipped.length} not enrolled`);
if (skipped.length) console.log(`  ${skipped.join(', ')}`);

console.log('Done.');
