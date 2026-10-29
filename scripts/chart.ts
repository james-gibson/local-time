#!/usr/bin/env tsx
/**
 * Render the stories chart — the library's default view (james-gibson/local-time#228).
 *
 *   npm run chart                 the corpus, drawn for this year
 *   npm run chart:authority       the xkcd #1491 fixture, drawn for 2015 (the source's own now)
 *   npx tsx scripts/chart.ts --now 2030 --authority --out /tmp/x
 *
 * Writes into `docs/chart/`:
 *   chart.json          the spec — the single input all three renderers consume
 *   timeline.svg        inert, theme-aware (CSS variables + prefers-color-scheme)
 *   timeline.png        light, 2×, hashed — the copy that survives chat and npm
 *   timeline-dark.png   the same, dark
 *   timeline.html       interactive: pan, zoom, keyboard, URL and #universe-id links
 *   timeline.js         the interaction above, no framework, no CDN
 *
 * Nothing here reads the clock unless told to: `--now` is written into the spec, so a
 * rebuild over unchanged data and an unchanged origin is byte-identical.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

import { allUniverses } from '../src/config/universes/index.js';
import {
  buildStoriesChart,
  entriesFromAuthority,
  entriesFromRegistry,
  XKCD_1491_MAP_ORIGIN,
  type AuthorityTable,
  type StoriesChartSpec,
} from '../src/query/stories-chart.js';
import { renderStoriesConsole, renderStoriesSvg } from '../src/query/stories-chart-svg.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const argv = process.argv.slice(2);
const has = (flag: string): boolean => argv.includes(flag);
const valueOf = (flag: string): string | undefined => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
};

const authority = has('--authority');
const consoleOnly = has('--console');
const outDir = path.resolve(valueOf('--out') ?? path.join(root, 'docs/chart'));

const currentYear = (): number => {
  const now = new Date();
  return now.getUTCFullYear() + (now.getUTCMonth() + now.getUTCDate() / 31) / 12;
};

const viewerNow = Number(valueOf('--now') ?? (authority ? XKCD_1491_MAP_ORIGIN : currentYear()));
if (!Number.isFinite(viewerNow)) {
  console.error(`--now must be a year, got ${valueOf('--now')}`);
  process.exit(2);
}

let spec: StoriesChartSpec;

if (authority) {
  const table = JSON.parse(
    fs.readFileSync(path.join(root, 'src/config/universes/reference/xkcd-1491-table.json'), 'utf8'),
  ) as AuthorityTable;
  spec = buildStoriesChart({
    entries: entriesFromAuthority(table),
    viewerNow,
    mapOrigin: XKCD_1491_MAP_ORIGIN,
  });
} else {
  spec = buildStoriesChart({
    entries: entriesFromRegistry(allUniverses),
    viewerNow,
    // The library's corpus is not the comic: clamping keeps 512 documentary universes
    // legible next to the four that are a billion years out.
    clampY: true,
  });
}

if (consoleOnly) {
  console.log(renderStoriesConsole(spec));
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });
const specPath = path.join(outDir, 'chart.json');
fs.writeFileSync(specPath, `${JSON.stringify(spec, null, 2)}\n`);

const svg = renderStoriesSvg(spec, { theme: 'auto', labels: 'declutter', interactive: false });
fs.writeFileSync(path.join(outDir, 'timeline.svg'), svg);

const interactiveSvg = renderStoriesSvg(spec, { theme: 'auto', labels: 'declutter', interactive: true });
fs.writeFileSync(
  path.join(outDir, 'timeline.html'),
  `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Stories of the past and future — local-time</title>
<style>
  :root { color-scheme: light dark; }
  html, body { margin: 0; background: #ffffff; color: #14181d; font-family: ui-sans-serif, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  html[data-theme="dark"], html[data-theme="dark"] body { background: #0d1117; color: #e6edf3; }
  header { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding: 14px 18px; border-bottom: 1px solid var(--rule, #c9d1d9); font-size: 13px; }
  header nav { display: flex; gap: 6px; flex-wrap: wrap; }
  button { font: inherit; padding: 4px 10px; border-radius: 6px; border: 1px solid #c9d1d9; background: transparent; color: inherit; cursor: pointer; }
  button[aria-pressed="true"] { border-color: #1f6feb; color: #1f6feb; }
  svg.stories-chart { display: block; width: 100%; height: auto; }
  .hint { color: #5b6773; }
  html[data-theme="dark"] .hint, html[data-theme="dark"] header { border-color: #30363d; }
  @media (prefers-color-scheme: dark) { html:not([data-theme="light"]) { background: #0d1117; color: #e6edf3; } }
</style>
</head>
<body>
<header>
  <strong>Stories of the past and future</strong>
  <nav aria-label="axis presets">
    <button data-preset="canonical" aria-pressed="true">canonical</button>
    <button data-preset="century" aria-pressed="false">century</button>
    <button data-preset="decades" aria-pressed="false">decades</button>
    <button data-preset="everything" aria-pressed="false">everything</button>
  </nav>
  <label>reading from <input id="origin" type="number" step="1" value="${Math.round(viewerNow)}" aria-label="the year you are reading from"></label>
  <button id="theme" aria-pressed="false">dark</button>
  <span class="hint">drag to pan · wheel to zoom · tab moves between entries · +/− zoom · Home resets</span>
</header>
<main>
${interactiveSvg}
</main>
<script id="chart-spec" type="application/json">${JSON.stringify(spec).replace(/</g, '\\u003c')}</script>
<script src="timeline.js"></script>
</body>
</html>
`,
);

const js = fs.readFileSync(path.join(root, 'scripts/chart-view.js'), 'utf8');
fs.writeFileSync(path.join(outDir, 'timeline.js'), js);

// --- PNG: the same SVG, a forced palette, no media queries -------------------
// A PNG cannot answer a media query, so the raster path renders twice with literal
// colours. `resvg-js` is the native encoder: the wasm build has no font database and
// silently drops every label, which produced a chart of dots. The trade is that the
// byte-identical assertion below is per-font-set; the SVG and JSON are exact anywhere.
for (const theme of ['light', 'dark'] as const) {
  const themed = renderStoriesSvg(spec, { theme, labels: 'declutter' });
  const png = new Resvg(themed, {
    fitTo: { mode: 'width', value: 2000 },
    font: { loadSystemFonts: true, defaultFontFamily: 'Helvetica' },
  })
    .render()
    .asPng();
  fs.writeFileSync(path.join(outDir, theme === 'light' ? 'timeline.png' : 'timeline-dark.png'), png);
}

console.log(
  `chart: ${spec.entries.length} entries, drawn for ${Math.round(spec.viewerNow)} → ${path.relative(root, outDir)}`,
);
