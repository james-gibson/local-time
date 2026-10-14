#!/usr/bin/env node
/**
 * atlas-sync.mjs — refresh the Synapse "chunk atlas" in Qdrant.
 *
 * The atlas is a small, curated set of high-value Synapse chunks (path + symbol →
 * chunk_id) for a repository. Chunk ids are content-addressed, so they rot whenever a
 * file changes and re-indexes. This re-resolves every symbol through the running Synapse
 * MCP server and batch-upserts the result to Qdrant under a stable, deterministic id, so
 * running it repeatedly is an idempotent update rather than a stream of duplicates.
 *
 * Why here: the lore/local-time sync already owns "make the derived data current"
 * (KB markdown → JSON → TS → Qdrant). The atlas is the same kind of derived data, and it
 * is the thing a future agent reaches for first, so it should be refreshed on the same run.
 *
 * Usage:
 *   node scripts/atlas-sync.mjs [--atlas scripts/synapse-atlas.json] [--dry-run] [--skip-qdrant]
 *
 * Env:
 *   SYNAPSE_URL             default from ~/.config/opencode/opencode.json (mcp.servers.synapse.url)
 *   QDRANT_URL              default from ~/.config/opencode/opencode.json (mcp.servers.qdrant.environment)
 *   QDRANT_API_KEY          "
 *   QDRANT_VECTOR_NAME      default fast-all-minilm-l6-v2   (named inference vector)
 *   QDRANT_INFERENCE_MODEL  default sentence-transformers/all-MiniLM-L6-v2
 *
 * Exit: 0 = every symbol resolved; 1 = at least one unresolved (so a pipeline notices).
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const atlasPath = resolve(opt('--atlas', resolve(HERE, 'synapse-atlas.json')));
const dryRun = flag('--dry-run');
const skipQdrant = flag('--skip-qdrant');

// ---- credentials -----------------------------------------------------------
const openCodeConfig = () => {
  try {
    return JSON.parse(readFileSync(`${homedir()}/.config/opencode/opencode.json`, 'utf8'));
  } catch {
    return { mcp: { servers: {} } };
  }
};
const cfg = openCodeConfig();
const servers = cfg?.mcp?.servers ?? {};
const SYNAPSE_URL = process.env.SYNAPSE_URL ?? servers.synapse?.url ?? 'http://127.0.0.1:8585/mcp';
const QDRANT_URL = process.env.QDRANT_URL ?? servers.qdrant?.environment?.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY ?? servers.qdrant?.environment?.QDRANT_API_KEY;
const VECTOR_NAME = process.env.QDRANT_VECTOR_NAME ?? 'fast-all-minilm-l6-v2';
const INFERENCE_MODEL = process.env.QDRANT_INFERENCE_MODEL ?? 'sentence-transformers/all-MiniLM-L6-v2';

// ---- Synapse MCP over HTTP -------------------------------------------------
let mcpId = 0;
async function mcpCall(name, callArgs) {
  const res = await fetch(SYNAPSE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++mcpId, method: 'tools/call', params: { name, arguments: callArgs } }),
  });
  const text = await res.text();
  // The server may answer as SSE (`data: {...}`) or as a bare JSON body.
  const line = text.split('\n').filter((l) => l.startsWith('data:')).pop();
  const payload = JSON.parse(line ? line.slice(5).trim() : text);
  const content = payload?.result?.content?.[0]?.text;
  if (content === undefined) throw new Error(`MCP ${name}: ${text.slice(0, 200)}`);
  return JSON.parse(content);
}

/** Resolve one atlas entry to a live chunk id. Symbol first; regex as the documented fallback. */
async function resolveChunk(repo_id, { path, symbol }) {
  const search = (action, query) =>
    mcpCall('synapse_search_codebase', { action, repo_id, query, path, compress_payload: false, max_tokens: 3000 });

  let hit = (await search('symbol', symbol))?.results?.[0];
  let via = 'symbol';
  if (!hit) {
    // A chunked class is indexed as `<Name>__partN`, so the bare symbol misses it.
    hit = (await search('regex', symbol.replace(/__part\d+$/, '')))?.results?.[0];
    via = 'regex';
  }
  if (!hit) return { resolved: false };
  return { resolved: true, chunk_id: hit.chunk_id, symbol: hit.symbol, file_path: hit.file_path, via };
}

// ---- Qdrant ----------------------------------------------------------------
const qHeaders = () => ({ 'api-key': QDRANT_API_KEY, 'Content-Type': 'application/json' });
async function qdrant(method, path, body) {
  const res = await fetch(`${QDRANT_URL}${path}`, {
    method,
    headers: qHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

const NS = Buffer.from('6ba7b8109dad11d180b400c04fd430c8', 'hex');
const uuid5 = (name) => {
  const h = createHash('sha1').update(Buffer.concat([NS, Buffer.from(name)])).digest().subarray(0, 16);
  const b = Buffer.from(h); b[6] = (b[6] & 0x0f) | 0x50; b[8] = (b[8] & 0x3f) | 0x80;
  const x = b.toString('hex');
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
};

// ---- run -------------------------------------------------------------------
const atlas = JSON.parse(readFileSync(atlasPath, 'utf8'));
const entries = atlas.groups.flatMap((g) => g.chunks.map((c) => ({ ...c, group: g.name })));

const resolved = [];
for (const e of entries) {
  const r = await resolveChunk(atlas.repo_id, e);
  resolved.push({ ...e, ...r });
  const mark = r.resolved ? `✓ ${r.chunk_id.slice(0, 12)}… (${r.via})` : '✗ UNRESOLVED';
  console.log(`${mark}  ${e.path} :: ${e.symbol}`);
}

const unresolved = resolved.filter((r) => !r.resolved && !r.optional);
const optionalUnresolved = resolved.filter((r) => !r.resolved && r.optional);
const missing = new Set(resolved.filter((r) => r.resolved).map((r) => r.path));
console.log(`\nresolved ${resolved.length - unresolved.length - optionalUnresolved.length}/${resolved.length} across ${missing.size} files; ${unresolved.length} unresolved, ${optionalUnresolved.length} optional-absent`);

if (dryRun) {
  console.log('\n--dry-run: nothing written.');
  process.exit(unresolved.length ? 1 : 0);
}

// Compose the document: the durable half is `path :: symbol`; the chunk id is the cache.
const document = [
  `High-value Synapse chunks for ${atlas.repo_id} (regenerated ${new Date().toISOString().slice(0, 10)} by scripts/atlas-sync.mjs).`,
  '',
  'Chunk ids are content-addressed and go stale when a file changes and re-indexes. Each line keeps the symbol + path, so a dead id is re-resolvable: symbol/regex search → chunk_id → synapse_inspect_files read_chunk (raw_source).',
  '',
  ...atlas.groups.flatMap((g) => [
    g.name,
    ...resolved
      .filter((r) => r.group === g.name)
      .map((r) => `- ${r.path} :: ${r.symbol}${r.note ? ` (${r.note})` : ''} — ${r.resolved ? r.chunk_id : r.optional ? 'absent on this branch (optional)' : 'UNRESOLVED'}`),
    '',
  ]),
].join('\n').trimEnd();

if (skipQdrant) {
  console.log('\n--skip-qdrant: resolved only, nothing written.');
  process.exit(unresolved.length ? 1 : 0);
}

if (!QDRANT_URL || !QDRANT_API_KEY) {
  console.error('! no Qdrant credentials (checked env and ~/.config/opencode/opencode.json)');
  process.exit(78);
}

for (const [field_name, field_schema] of [
  ['metadata.repo', 'keyword'],
  ['metadata.kind', 'keyword'],
  ['metadata.topics', 'keyword'],
  ['metadata.issues', 'integer'],
]) {
  await qdrant('PUT', `/collections/${atlas.collection}/index`, { field_name, field_schema });
}

const point = {
  id: uuid5(`${atlas.repo_id}:atlas:${atlas.slug}`),
  vector: { [VECTOR_NAME]: { text: document, model: INFERENCE_MODEL } },
  payload: {
    document,
    metadata: {
      repo: atlas.repo_id,
      kind: 'chunk-atlas',
      slug: atlas.slug,
      date: new Date().toISOString().slice(0, 10),
      topics: atlas.topics ?? [],
      issues: atlas.issues ?? [],
      unresolved: unresolved.map((u) => `${u.path}::${u.symbol}`),
      optional_absent: optionalUnresolved.map((u) => `${u.path}::${u.symbol}`),
    },
  },
};

const up = await qdrant('PUT', `/collections/${atlas.collection}/points?wait=true`, { points: [point] });
console.log(`\nupserted ${point.id} to ${atlas.collection}: ${JSON.stringify(up.status ?? up)}`);
console.log(`  unresolved: ${unresolved.length}`);

process.exit(unresolved.length ? 1 : 0);
