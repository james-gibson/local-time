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

function normalise(mdPath, content) {
  const { frontmatter: fm, body } = splitFrontmatter(content);

  // The zero-reference block holds the temporal structure.
  const zr = fm['zero-reference'] || {};

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
      zeroPoint: zr['zero-point'] ?? fm['zero-point'] ?? null,
      epochId: zr['epoch-id'] ?? null,
      addresses: zr.addresses ?? [],
      keyframes: zr.keyframes ?? [],
      segments: zr.segments ?? [],
      windows: zr.windows ?? { strategy: 'phase_based' },
      layers: zr.layers ?? [],
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
