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
