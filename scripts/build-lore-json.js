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
import { join, basename, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';

/** Resolve the directory that actually contains the markdown lore docs. */
function resolveLoreDir(input) {
  const abs = resolve(input);
  const entries = readdirSync(abs);
  if (entries.some((e) => e.endsWith('.md'))) return abs; // dir is itself `lore`
  const nested = join(abs, 'lore');
  if (exists(nested) && statSync(nested).isDirectory()) return nested;
  return abs;
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
function deriveZero(zr, fm, keyframes) {
  const anchor = isObject(fm['zero-point']) ? fm['zero-point'] : {};
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

function normalise(mdPath, content) {
  const { frontmatter: fm, body } = splitFrontmatter(content);

  // The zero-reference block holds the temporal structure.
  const zr = fm['zero-reference'] || {};
  const keyframes = zr.keyframes ?? [];
  const zero = deriveZero(zr, fm, keyframes);
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

const files = readdirSync(loreDir).filter((f) => f.endsWith('.md') && !f.startsWith('.'));
console.log(`Building JSON from ${files.length} lore docs in ${loreDir}`);

for (const file of files) {
  const mdPath = join(loreDir, file);
  const content = readFileSync(mdPath, 'utf-8');
  const json = normalise(mdPath, content);
  const jsonPath = mdPath.replace(/\.md$/, '.json');
  writeFileSync(jsonPath, JSON.stringify(json, null, 2) + '\n');
  console.log(`  ${file} -> ${basename(jsonPath)}  (${json.universeId ?? 'no universe-id'})`);
}

console.log('Done.');
