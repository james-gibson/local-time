/**
 * import-lore-json.js — unresolved segment bounds must fail the run.
 *
 * Regression guard for james-gibson/local-time#35. Before this, an epoch-relative
 * segment bound with no matching keyframe (e.g. `film-release:T+30:00:00`) silently
 * collapsed onto the document's first/last keyframe; the importer merely warned. It
 * now refuses to emit the module and exits non-zero, because computing `T±` offsets
 * from the zero point is unsound (the addresses are ordinal labels, not a clock).
 *
 * Run: node --test scripts/__tests__/
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '..', 'import-lore-json.js');

/** Build a throwaway lore dir: `<name>.md` beside `<name>.json` (collectLoreJson needs both). */
function withLoreDir(name, json) {
  const loreDir = mkdtempSync(join(tmpdir(), 'lore-in-'));
  const outDir = mkdtempSync(join(tmpdir(), 'lore-out-'));
  mkdirSync(loreDir, { recursive: true });
  writeFileSync(join(loreDir, `${name}.md`), `# ${name}\n`);
  writeFileSync(join(loreDir, `${name}.json`), JSON.stringify(json, null, 2));
  return { loreDir, outDir };
}

function baseDoc(segmentEnd) {
  return {
    universeId: 'test:film:2000',
    'local-time-sync': true,
    title: 'Test Film',
    type: 'film',
    realityGradient: 1,
    zeroReference: {
      zeroPoint: '2000-01-01T00:00:00Z',
      zeroStatus: 'established',
      keyframes: [
        { id: 'release', address: 'test:T+00:00:00', timestamp: '2000-01-01T00:00:00Z' },
      ],
      segments: [{ id: 'run', start: 'test:T+00:00:00', end: segmentEnd, type: 'phase' }],
      windows: { strategy: 'phase_based' },
    },
  };
}

function run(json) {
  const { loreDir, outDir } = withLoreDir('test-film', json);
  const res = spawnSync(process.execPath, [SCRIPT, loreDir, outDir], { encoding: 'utf-8' });
  return { res, outDir };
}

test('a bound matching a declared keyframe resolves and emits the module', () => {
  const { res, outDir } = run(baseDoc('test:T+00:00:00'));
  assert.equal(res.status, 0, res.stderr);
  assert.ok(readdirSync(outDir).includes('test_film_2000.ts'));
});

test('a bound given as an absolute ISO timestamp resolves', () => {
  const { res, outDir } = run(baseDoc('2000-02-01T00:00:00Z'));
  assert.equal(res.status, 0, res.stderr);
  const code = readFileSync(join(outDir, 'test_film_2000.ts'), 'utf-8');
  assert.match(code, /BigInt\(Date\.UTC\(2000, 1, 1/);
});

test('an unresolved epoch-relative bound fails loudly and writes nothing', () => {
  const { res, outDir } = run(baseDoc('test:T+30:00:00'));
  assert.equal(res.status, 1);
  assert.match(res.stderr, /unresolved segment bound/);
  assert.match(res.stderr, /segment "run" \(end\)/);
  assert.match(res.stderr, /test:T\+30:00:00/);
  assert.match(res.stderr, /local-time#35/);
  assert.deepEqual(readdirSync(outDir), []);
});

test('the barrel exposes importedUniverses so the registry can load the tree', () => {
  // james-gibson/local-time#98: the registry imports the barrel's `importedUniverses`
  // at runtime. Without that array the generated universes can never be registered.
  const { res, outDir } = run(baseDoc('test:T+00:00:00'));
  assert.equal(res.status, 0, res.stderr);
  const barrel = readFileSync(join(outDir, 'index.ts'), 'utf-8');
  assert.match(barrel, /export const importedUniverses: Universe\[\]/);
  assert.match(barrel, /testFilm2000Universe/);
});

test('the barrel is written even when no document is enrolled', () => {
  // A stable barrel keeps the registry's runtime import deterministic (#98).
  const { res, outDir } = run({ universeId: 'test:film:2000', title: 'skip', type: 'film' });
  assert.equal(res.status, 0, res.stderr);
  const barrel = readFileSync(join(outDir, 'index.ts'), 'utf-8');
  assert.match(barrel, /export const importedUniverses: Universe\[\] = \[/);
});

test('keyframes are emitted in offset order, not declaration order (#35)', () => {
  // Declared deliberately out of order: the emitted keyframes must be ordered by
  // their offset from the zero (here the anchored `42i.re`), so a hand-edited or
  // stale JSON cannot leak a non-chronological timeline into the module. Ids are
  // prefixed so they cannot collide with the segment/epoch ids in the source.
  const doc = {
    universeId: 'test:ordered:2000',
    'local-time-sync': true,
    title: 'Ordered',
    type: 'film',
    realityGradient: 1,
    zeroReference: {
      zeroPoint: '2000-01-01T00:00:00Z',
      zeroStatus: 'established',
      keyframes: [
        { id: 'kf_later', address: 'test:T+02:00:00', timestamp: '2000-03-01T00:00:00Z', '42i': { re: 5_184_000_000, im: 0, tension: 0 } },
        { id: 'kf_earlier', address: 'test:T+01:00:00', timestamp: '2000-02-01T00:00:00Z', '42i': { re: 2_678_400_000, im: 0, tension: 0 } },
        { id: 'kf_zero', address: 'test:T+00:00:00', timestamp: '2000-01-01T00:00:00Z', '42i': { re: 0, im: 0, tension: 0 } },
      ],
      segments: [{ id: 'run', start: 'test:T+00:00:00', end: 'test:T+02:00:00', type: 'phase' }],
      windows: { strategy: 'phase_based' },
    },
  };
  const { res, outDir } = run(doc);
  assert.equal(res.status, 0, res.stderr);
  const code = readFileSync(join(outDir, 'test_ordered_2000.ts'), 'utf-8');
  const positions = ['kf_zero', 'kf_earlier', 'kf_later'].map((id) => code.indexOf(`id: '${id}'`));
  assert.ok(positions.every((i) => i >= 0), 'every keyframe must be emitted');
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b), `out of order: ${positions}`);
});

/**
 * The KB's declared connection edges reaching the module.
 *
 * Two fields were carried into the JSON by build-lore-json.js and then never read
 * here, so both were dropped in silence: `parent-universes` (local-time#133) and
 * `cross-references` (local-time#136). `cross-references` is declared *required*
 * for every lore doc, and `lab.md` declares three sibling links that have never
 * existed in the model.
 *
 * Two shapes, and the rule between them (also stated in the KB's contract):
 *   - a *frame* is declared on the keyframe (`target-universe-id`) and names an
 *     occurrence in another universe — deferred resolution, so it is valid before
 *     the target records it;
 *   - a *reference* is declared at the top level (`cross-references`) and names the
 *     framing relationship between the two universes.
 */
test('parent-universes and cross-references are emitted as connection edges (#133, #136)', () => {
  const doc = {
    ...baseDoc('test:T+00:00:00'),
    parentUniverses: ['SOFTWARE_ENGINEERING', 'PERSONAL_PROJECTS'],
    crossReferences: ['history:costco:1983'],
  };
  const { res, outDir } = run(doc);
  assert.equal(res.status, 0, res.stderr);
  const code = readFileSync(join(outDir, 'test_film_2000.ts'), 'utf-8');

  assert.match(code, /connections: \{/);
  // Emitted verbatim: the symbolic name is resolved downstream by
  // CommonUniverseIds.resolveDeclaredName, so the module stays faithful to the KB.
  assert.match(code, /parentUniverses: \['SOFTWARE_ENGINEERING', 'PERSONAL_PROJECTS'\]/);
  assert.match(code, /references: \[/);
  // A bare id asserts the edge and nothing more.
  assert.match(code, /type: 'THEMATICALLY_LINKED'/);
  assert.match(code, /targetUniverseId: 'history:costco:1983'/);
});

test('a rich cross-reference carries its type, confidence and description (#136)', () => {
  const doc = {
    ...baseDoc('test:T+00:00:00'),
    crossReferences: [
      {
        'universe-id': 'technology:isotope:2026',
        type: 'DEPENDS_ON',
        confidence: 0.9,
        description: 'isotope is the shared rung every link registers against',
      },
    ],
  };
  const { res, outDir } = run(doc);
  assert.equal(res.status, 0, res.stderr);
  const code = readFileSync(join(outDir, 'test_film_2000.ts'), 'utf-8');

  assert.match(code, /type: 'DEPENDS_ON'/);
  assert.match(code, /targetUniverseId: 'technology:isotope:2026'/);
  assert.match(code, /confidence: 0\.9/);
  assert.match(code, /description: 'isotope is the shared rung every link registers against'/);
});

test('a frame link is emitted on the keyframe, carrying its target (#136)', () => {
  const doc = baseDoc('test:T+00:00:00');
  doc.zeroReference.keyframes = [
    {
      id: 'release',
      address: 'test:T+00:00:00',
      timestamp: '2000-01-01T00:00:00Z',
      'target-universe-id': 'technology:smoke_alarm:2026',
      'target-keyframe-type': 'release',
      'target-keyframe-id': 'v0.11.0',
    },
  ];
  const { res, outDir } = run(doc);
  assert.equal(res.status, 0, res.stderr);
  const code = readFileSync(join(outDir, 'test_film_2000.ts'), 'utf-8');

  assert.match(code, /targetUniverseId: 'technology:smoke_alarm:2026'/);
  assert.match(code, /targetKeyframeType: 'release'/);
  assert.match(code, /targetKeyframeId: 'v0\.11\.0'/);
});

test('a cross-reference naming an occurrence is reported, not flattened (#136)', () => {
  // `epoch-id`/`address` point at a *frame*, so they belong on the keyframe. Emitting
  // the entry as a plain reference would keep the edge and lose the one thing it says,
  // so it is called out — the same "never defaulted in silence" rule as windows.strategy.
  const doc = {
    ...baseDoc('test:T+00:00:00'),
    crossReferences: [
      {
        'universe-id': 'technology:tuner:2026',
        'epoch-id': 'tuner-origin',
        address: 'tuner-origin:T+00:00:00',
        type: 'DEPENDS_ON',
      },
    ],
  };
  const { res, outDir } = run(doc);
  assert.equal(res.status, 0, res.stderr);
  assert.match(res.stderr, /carries epoch-id\/address/);

  const code = readFileSync(join(outDir, 'test_film_2000.ts'), 'utf-8');
  assert.match(code, /targetUniverseId: 'technology:tuner:2026'/);
  assert.doesNotMatch(code, /tuner-origin/, 'the occurrence must not leak as a flattened edge');
});

test('a document with no declared connections emits no connections block', () => {
  // The block is additive: 23 compendia predate it, and a bare universe must not
  // grow an empty `connections: {}` that asserts nothing.
  const { res, outDir } = run(baseDoc('test:T+00:00:00'));
  assert.equal(res.status, 0, res.stderr);
  const code = readFileSync(join(outDir, 'test_film_2000.ts'), 'utf-8');
  assert.doesNotMatch(code, /connections:/);
});
