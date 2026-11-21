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
  return withLoreDirMany({ [name]: json });
}

/** Same, for a run that has to see several documents at once (james-gibson/local-time#243). */
function withLoreDirMany(docs) {
  const loreDir = mkdtempSync(join(tmpdir(), 'lore-in-'));
  const outDir = mkdtempSync(join(tmpdir(), 'lore-out-'));
  mkdirSync(loreDir, { recursive: true });
  for (const [name, json] of Object.entries(docs)) {
    writeDoc(loreDir, name, json);
  }
  return { loreDir, outDir };
}

/** Rewrite one document's JSON in place — the second run of a carry-over test. */
function writeDoc(loreDir, name, json) {
  writeFileSync(join(loreDir, `${name}.md`), `# ${name}\n`);
  writeFileSync(join(loreDir, `${name}.json`), JSON.stringify(json, null, 2));
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

test('an unresolved epoch-relative bound fails loudly and emits no module for that doc', () => {
  const { res, outDir } = run(baseDoc('test:T+30:00:00'));
  assert.equal(res.status, 1);
  assert.match(res.stderr, /unresolved segment bound/);
  assert.match(res.stderr, /segment "run" \(end\)/);
  assert.match(res.stderr, /test:T\+30:00:00/);
  // Both the refused-emission rule and the per-document one are named.
  assert.match(res.stderr, /local-time#35/);
  assert.match(res.stderr, /local-time#243/);
  // The barrel is still written so the registry has a module to load (#98), and the
  // document itself contributes nothing to it.
  assert.deepEqual(readdirSync(outDir), ['index.ts']);
  assert.match(readFileSync(join(outDir, 'index.ts'), 'utf-8'), /importedUniverses: Universe\[\] = \[\n\];/);
});

/**
 * james-gibson/local-time#243 — the refusal was per-run, not per-document.
 *
 * Four unrelated broken compendia in the vault stopped a new universe from being
 * imported at all: step 1 wrote the JSON, step 2 refused, and the only workaround was
 * running this script by hand against a directory holding one document.
 */
test('one broken document does not cost the documents that resolve (#243)', () => {
  const { loreDir, outDir } = withLoreDirMany({
    'good-film': baseDoc('test:T+00:00:00'),
    'broken-film': {
      ...baseDoc('test:T+30:00:00'),
      universeId: 'test:broken:2000',
      title: 'Broken Film',
    },
  });

  const res = spawnSync(process.execPath, [SCRIPT, loreDir, outDir], { encoding: 'utf-8' });

  // Still a failed run: the caller must not read the tree as complete.
  assert.equal(res.status, 1);

  // ... but the document that resolves is emitted, and the barrel carries it.
  const files = readdirSync(outDir);
  assert.ok(files.includes('test_film_2000.ts'), `missing emitted module: ${files}`);
  assert.ok(!files.includes('test_broken_2000.ts'), 'the broken document must emit nothing');

  const barrel = readFileSync(join(outDir, 'index.ts'), 'utf-8');
  assert.match(barrel, /importedUniverses: Universe\[\] = \[\n  testFilm2000Universe,\n\];/);

  // The error names the broken document, and only the broken document.
  assert.match(res.stderr, /broken-film\.json/);
  assert.doesNotMatch(res.stderr, /good-film\.json/);
});

test('a skipped document keeps its last good module registered (#243)', () => {
  // First run: both documents resolve, so both are built.
  const { loreDir, outDir } = withLoreDirMany({
    'good-film': baseDoc('test:T+00:00:00'),
    'later-broken': {
      ...baseDoc('test:T+00:00:00'),
      universeId: 'test:later:2000',
      title: 'Later Broken',
    },
  });

  const first = spawnSync(process.execPath, [SCRIPT, loreDir, outDir], { encoding: 'utf-8' });
  assert.equal(first.status, 0, first.stderr);
  const modulePath = join(outDir, 'test_later_2000.ts');
  const before = readFileSync(modulePath, 'utf-8');

  // Second run: the same document now has a bound that cannot resolve.
  writeDoc(loreDir, 'later-broken', {
    ...baseDoc('test:T+30:00:00'),
    universeId: 'test:later:2000',
    title: 'Later Broken',
  });
  const second = spawnSync(process.execPath, [SCRIPT, loreDir, outDir], { encoding: 'utf-8' });

  assert.equal(second.status, 1);
  // The module on disk is untouched — dropping it from the barrel would unregister a
  // universe that still works and leave `generated-registration` an orphan to fail on.
  assert.equal(readFileSync(modulePath, 'utf-8'), before);
  assert.match(
    readFileSync(join(outDir, 'index.ts'), 'utf-8'),
    /importedUniverses: Universe\[\] = \[\n  testFilm2000Universe,\n  testLater2000Universe,\n\];/,
  );
  // And it is reported as carried, not as rebuilt.
  assert.match(second.stdout, /later-broken\.json -> test_later_2000\.ts \(carried over unchanged\)/);
});

test('a skipped document with no earlier module says its universe left the barrel (#243)', () => {
  const { loreDir, outDir } = withLoreDirMany({
    'never-built': {
      ...baseDoc('test:T+30:00:00'),
      universeId: 'test:never:2000',
      title: 'Never Built',
    },
  });

  const res = spawnSync(process.execPath, [SCRIPT, loreDir, outDir], { encoding: 'utf-8' });
  assert.equal(res.status, 1);
  assert.match(res.stdout, /no module to carry over; testNever2000Universe stays out of the barrel/);
  assert.doesNotMatch(readFileSync(join(outDir, 'index.ts'), 'utf-8'), /testNever2000Universe,/);
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

// --- body prose is carried through (james-gibson/local-time#96) ---------------
//
// The YAML guides the builder, and the builder must carry a clean example a
// developer can follow to rebuild the YAML. The markdown body is that example.

/** Pull the emitted "Source narrative" block back out of a generated module. */
function emittedNarrative(code) {
  const start = code.indexOf('--- Source narrative (from lore)');
  if (start === -1) return null;
  const after = code.slice(start).split('\n');
  const out = [];
  for (const line of after.slice(2)) {
    // every body line is ` * <text>`; the closing ` */` ends the block
    if (line === ' */' || !line.startsWith(' *')) break;
    // undo the `*\/` neutralisation so the result round-trips to the JSON body
    out.push(line === ' *' ? '' : line.slice(3).replace(/\*\\\//g, '*/'));
  }
  return out.join('\n');
}

test('the generated module carries the lore body as a readable example', () => {
  const body = '# Test Film\n\n## Overview\n\nA short paragraph.\n\n- one\n- two';
  const { res, outDir } = run({ ...baseDoc('test:T+00:00:00'), body });
  assert.equal(res.status, 0, res.stderr);
  const code = readFileSync(join(outDir, 'test_film_2000.ts'), 'utf-8');
  assert.match(code, /--- Source narrative \(from lore\)/);
  // It survives verbatim (modulo the JSDoc ` * ` gutter).
  assert.equal(emittedNarrative(code), body);
});

test('the emitted example cannot silently drift from the JSON body', () => {
  const body = 'Line A\n\nLine B';
  const { res, outDir } = run({ ...baseDoc('test:T+00:00:00'), body });
  assert.equal(res.status, 0, res.stderr);
  const code = readFileSync(join(outDir, 'test_film_2000.ts'), 'utf-8');
  assert.equal(emittedNarrative(code), body);
  // And a change to the authority must show up in the builder.
  assert.notEqual(emittedNarrative(code), `${body} (stale)`);
});

test('a body containing a comment terminator does not break the generated module', () => {
  const body = 'before */ after';
  const { res, outDir } = run({ ...baseDoc('test:T+00:00:00'), body });
  assert.equal(res.status, 0, res.stderr);
  const code = readFileSync(join(outDir, 'test_film_2000.ts'), 'utf-8');
  // The header block comment still closes exactly once before the export...
  const header = code.slice(0, code.indexOf('export const'));
  assert.equal((header.match(/\*\//g) || []).length, 1);
  // ...and the body's literal terminator is neutralised to `*\/` in the source,
  // while round-tripping back to `*/` when read out.
  assert.match(header, /before \*\\\/ after/);
  assert.equal(emittedNarrative(code), body);
  assert.match(code, /export const /);
});
