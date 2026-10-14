/**
 * build-lore-json.js — the derived nominal offset and the keyframe order.
 *
 * Companion to the #35 guard: a `T±` label is an **order**, not a clock, so a
 * keyframe with no timestamp is placed by its label (`nominalMs`), and one with a
 * timestamp by the clock. Every unit the KB uses must parse, or the offset
 * silently becomes zero and the order is wrong.
 *
 * Run: node --test scripts/__tests__/
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '..', 'build-lore-json.js');
const DAY_MS = 86_400_000;

/** Build one throwaway lore doc and return the JSON it produced. */
function build(md) {
  const root = mkdtempSync(join(tmpdir(), 'lore-build-'));
  mkdirSync(join(root, 'lore'), { recursive: true });
  writeFileSync(join(root, 'lore', 'doc.md'), md);
  const res = spawnSync(process.execPath, [SCRIPT, root], { encoding: 'utf-8' });
  return {
    res,
    json: () => JSON.parse(readFileSync(join(root, 'lore', 'doc.json'), 'utf-8')),
  };
}

const MD = `---
title: Sorted Test
universe-id: test:sorted:2000
type: film
local-time-sync: true
zero-reference:
  epoch-id: t
  zero-time: 2000-01-01T00:00:00Z
  zero-status: established
  precision: day
  keyframes:
    - id: kf_later
      address: t:T+02:00:00
      timestamp: 2000-03-01T00:00:00Z
    - id: kf_label_only
      address: t:T+45 days
    - id: kf_earlier
      address: t:T+01:00:00
      timestamp: 2000-02-01T00:00:00Z
    - id: kf_weeks
      address: t:T+81 weeks
---
Body.
`;

test('keyframes are ordered by the clock, with label-only keyframes placed by their label (#35)', () => {
  const { res, json } = build(MD);
  assert.equal(res.status, 0, res.stderr);
  // Real elapsed: earlier 31d, later 60d. Nominal: label-only 45d, weeks 567d.
  assert.deepEqual(json().zeroReference.keyframes.map((k) => k.id), [
    'kf_earlier',
    'kf_label_only',
    'kf_later',
    'kf_weeks',
  ]);
});

test('every unit the KB uses parses into a nominal offset', () => {
  const { res, json } = build(MD);
  assert.equal(res.status, 0, res.stderr);
  const byId = new Map(json().zeroReference.keyframes.map((k) => [k.id, k]));
  assert.equal(byId.get('kf_label_only').nominalMs, 45 * DAY_MS);
  // `weeks` is the unit the old parser dropped, silently zeroing the offset.
  assert.equal(byId.get('kf_weeks').nominalMs, 81 * 7 * DAY_MS);
  // A timestamped keyframe still carries its label's nominal, for comparison.
  assert.equal(byId.get('kf_earlier').nominalMs, 60 * 60 * 1000);
});
