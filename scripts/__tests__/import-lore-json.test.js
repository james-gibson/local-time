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
