import {
  ChartEntry,
  ChartClass,
  StoriesChartSpec,
  project,
  classify,
} from './stories-chart';

/**
 * The three renderers, one spec.
 *
 * - `renderStoriesSvg` — inert SVG; theme resolves from CSS custom properties, so the
 *   docs site's `data-theme` toggle beats the OS and nothing flashes.
 * - `renderStoriesPng` (scripts/chart.ts) — the same SVG, rasterised with a forced
 *   palette, because a PNG cannot answer a media query.
 * - `renderStoriesConsole` — the text view, for terminals and for reading a diff.
 *
 * No renderer reads the registry. A row in one and not the others is a bug here.
 */

export type Theme = 'light' | 'dark' | 'auto';

export interface Palette {
  bg: string;
  ink: string;
  muted: string;
  rule: string;
  obsolete: string;
  periodPiece: string;
  hatch: string;
  possible: string;
  past: string;
  origin: string;
  accent: string;
}

export const PALETTES: Record<'light' | 'dark', Palette> = {
  light: {
    bg: '#ffffff',
    ink: '#14181d',
    muted: '#5b6773',
    rule: '#c9d1d9',
    obsolete: '#f2e6e6',
    periodPiece: '#f4f1e6',
    hatch: '#b9a9a9',
    possible: '#2f6f4f',
    past: '#8a5a2b',
    origin: '#14181d',
    accent: '#1f6feb',
  },
  dark: {
    bg: '#0d1117',
    ink: '#e6edf3',
    muted: '#9aa7b4',
    rule: '#30363d',
    obsolete: '#2a1d1d',
    periodPiece: '#2a271b',
    hatch: '#6b5a5a',
    possible: '#57b98a',
    past: '#d19a5b',
    origin: '#e6edf3',
    accent: '#6ea8ff',
  },
};

const W = 1400;
const H = 900;
const M = { top: 96, right: 64, bottom: 84, left: 112 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const yearLabel = (y: number): string => (y < 0 ? `${Math.round(-y)} BCE` : `${Math.round(y)}`);

const magnitudeLabel = (years: number): string => {
  const a = Math.abs(years);
  if (a >= 1e9) return `${(a / 1e9).toFixed(a % 1e9 === 0 ? 0 : 1)} Gyr`;
  if (a >= 1e6) return `${(a / 1e6).toFixed(a % 1e6 === 0 ? 0 : 1)} Myr`;
  if (a >= 1e3) return `${(a / 1e3).toFixed(a % 1e3 === 0 ? 0 : 1)} kyr`;
  return `${Math.round(a)}y`;
};

const CLASS_LABEL: Record<ChartClass, string> = {
  still_possible: 'still possible',
  obsolete: 'obsolete — its future has arrived',
  period_piece: 'former period piece — published closer to its setting than to you',
  recognizable: 'set in the past, and recognisably so',
};

export interface SvgOptions {
  theme?: Theme;
  /** `declutter` is the PNG's rule: a subset of labels, deterministic. */
  labels?: 'all' | 'declutter';
  /** Stamp the view in the corner: the origin, and `custom` when the scales were dialled. */
  stamp?: string;
  /** Interactive SVG: ids and titles for the JS to hook, plus hash targets. */
  interactive?: boolean;
}

export function classOf(entry: ChartEntry, spec: StoriesChartSpec): ChartClass {
  return classify(entry, spec.viewerNow);
}

export function renderStoriesSvg(spec: StoriesChartSpec, options: SvgOptions = {}): string {
  const theme = options.theme ?? 'auto';
  const labels = options.labels ?? 'all';
  const p = theme === 'auto' ? PALETTES.light : PALETTES[theme];
  const VAR_KEY: Record<string, keyof Palette> = {
    bg: 'bg', ink: 'ink', muted: 'muted', rule: 'rule', obsolete: 'obsolete',
    period: 'periodPiece', hatch: 'hatch', possible: 'possible', past: 'past', accent: 'accent',
  };
  /** `var(--x)` in the interactive artefact (so the site's toggle wins); a literal
   * colour in the raster one, because a PNG cannot answer a media query and resvg
   * does not resolve custom properties. */
  const V = (name: string): string => (theme === 'auto' ? `var(--${name})` : p[VAR_KEY[name]]);

  const cssVars =
    theme === 'auto'
      ? `--bg:${PALETTES.light.bg};--ink:${PALETTES.light.ink};--muted:${PALETTES.light.muted};--rule:${PALETTES.light.rule};--obsolete:${PALETTES.light.obsolete};--period:${PALETTES.light.periodPiece};--hatch:${PALETTES.light.hatch};--possible:${PALETTES.light.possible};--past:${PALETTES.light.past};--accent:${PALETTES.light.accent};`
      : '';

  const x = (year: number): number => M.left + project(year, spec.scales.x) * PW;
  const y = (offset: number): number => M.top + (1 - project(offset, spec.scales.y)) * PH;

  const zeroY = y(0);
  const apexX = x(spec.viewerNow);

  // ---- ticks ---------------------------------------------------------------
  const xTicks = (() => {
    const wanted = [-2000, 0, 500, 1000, 1500, 1800, 1900, 1950, 2000, 2026].filter(
      (t) => t >= spec.scales.x.domain.min && t <= spec.scales.x.domain.max,
    );
    const kept: number[] = [];
    for (const t of wanted) {
      const px = x(t);
      if (kept.every((k) => Math.abs(x(k) - px) >= 52)) kept.push(t);
    }
    return kept;
  })();
  const yTicks = (() => {
    const cap = Math.max(Math.abs(spec.scales.y.domain.min), Math.abs(spec.scales.y.domain.max));
    const wanted = [0, 1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9].flatMap((v) => (v === 0 ? [0] : [v, -v]));
    const kept: number[] = [];
    for (const v of wanted.filter((v) => Math.abs(v) <= cap * 1.0001)) {
      if (kept.every((k) => Math.abs(y(k) - y(v)) >= 22)) kept.push(v);
    }
    return kept;
  })();

  const gridX = xTicks
    .map(
      (t) =>
        `<line class="grid" x1="${x(t).toFixed(1)}" y1="${M.top}" x2="${x(t).toFixed(1)}" y2="${M.top + PH}"/>` +
        `<text class="tick" x="${x(t).toFixed(1)}" y="${M.top + PH + 22}" text-anchor="middle">${yearLabel(t)}</text>`,
    )
    .join('\n  ');

  const gridY = yTicks
    .map(
      (v) =>
        `<line class="grid" x1="${M.left}" y1="${y(v).toFixed(1)}" x2="${M.left + PW}" y2="${y(v).toFixed(1)}"/>` +
        `<text class="tick" x="${M.left - 12}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${v === 0 ? '0' : magnitudeLabel(v)}</text>`,
    )
    .join('\n  ');

  // ---- the cone ------------------------------------------------------------
  // Both boundaries satisfy |offset| = apex − publication. The shaded wedge is the
  // region where the reader has already overtaken the work's own claim.
  const wedgePoints: string[] = [];
  const minX = spec.scales.x.domain.min;
  const steps = 48;
  for (let i = 0; i <= steps; i += 1) {
    const year = minX + ((spec.viewerNow - minX) * i) / steps;
    wedgePoints.push(`${x(year).toFixed(1)},${y(spec.viewerNow - year).toFixed(1)}`);
  }
  wedgePoints.push(`${apexX.toFixed(1)},${zeroY.toFixed(1)}`);
  for (let i = steps; i >= 0; i -= 1) {
    const year = minX + ((spec.viewerNow - minX) * i) / steps;
    wedgePoints.push(`${x(year).toFixed(1)},${y(-(spec.viewerNow - year)).toFixed(1)}`);
  }

  const coneBoundary = (sign: 1 | -1): string => {
    const pts: string[] = [];
    for (let i = 0; i <= steps; i += 1) {
      const year = minX + ((spec.viewerNow - minX) * i) / steps;
      pts.push(`${x(year).toFixed(1)},${y(sign * (spec.viewerNow - year)).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  // ---- entries -------------------------------------------------------------
  const placed: Array<{ x0: number; x1: number; y: number }> = [];
  const collides = (x0: number, x1: number, y: number): boolean =>
    placed.some((q) => y > q.y - 11 && y < q.y + 11 && x1 > q.x0 && x0 < q.x1);
  const widthOf = (label: string): number => Math.min(240, label.length * 6.1 + 8);

  const entries = spec.entries.map((entry) => {
    const cls = classOf(entry, spec);
    const px = x(entry.publicationYear);
    const yTop = y(entry.offset.max);
    const yBottom = y(entry.offset.min);
    const ranged = Math.abs(yTop - yBottom) > 1.5;
    const shift = cls === 'obsolete' || cls === 'period_piece' ? 0.55 : 1;
    const title = `${entry.label} — ${yearLabel(entry.publicationYear)}, set ${entry.offset.asPrinted ?? (entry.offset.min < 0 ? `${magnitudeLabel(entry.offset.min)} in the past` : 'at publication')}; ${CLASS_LABEL[cls]}`;
    const desc = entry.notes ?? entry.dispute ?? '';

    const priority =
      entry.certainty < 0.8 || entry.offset.open || Math.abs(entry.offset.min) >= 1e6 || entry.dispute;

    const marker = ranged
      ? `<line class="marker" x1="${px.toFixed(1)}" y1="${yTop.toFixed(1)}" x2="${px.toFixed(1)}" y2="${yBottom.toFixed(1)}"/>` +
        (entry.offset.open
          ? `<path class="open" d="M ${px.toFixed(1)} ${(entry.offset.min < 0 ? yBottom : yTop).toFixed(1)} l -4 -7 l 8 0 z"/>`
          : '')
      : `<circle class="marker" cx="${px.toFixed(1)}" cy="${yTop.toFixed(1)}" r="${3 + entry.certainty}"/>`;

    let label = '';
    const baseY = ranged ? Math.min(yTop, yBottom) - 6 : yTop - 7;
    const w = widthOf(entry.label);
    const right = px > M.left + PW - w - 12;
    const candidates = [
      { x0: right ? px - 7 - w : px + 7, x1: right ? px - 7 : px + 7 + w, y: baseY },
      { x0: right ? px - 7 - w : px + 7, x1: right ? px - 7 : px + 7 + w, y: baseY - 12 },
      { x0: right ? px - 7 - w : px + 7, x1: right ? px - 7 : px + 7 + w, y: baseY + 12 },
    ];
    if (labels === 'all' || priority || placed.length < 44) {
      const spot = candidates.find((c) => !collides(c.x0, c.x1, c.y));
      if (spot) {
        placed.push(spot);
        const anchor = right ? 'end' : 'start';
        const lx = right ? px - 7 : px + 7;
        label = `<text class="label ${cls}" x="${lx.toFixed(1)}" y="${spot.y.toFixed(1)}" text-anchor="${anchor}" style="opacity:${shift}">${esc(entry.label)}</text>`;
      }
    }

    return {
      cls,
      priority: priority ? 1 : 0,
      svg:
        `<g class="entry ${entry.side} ${cls}" data-year="${entry.publicationYear}" data-min="${entry.offset.min}" data-max="${entry.offset.max}"${options.interactive ? ` id="u-${esc(entry.id)}" tabindex="0"` : ''}>` +
        `<title>${esc(title)}</title>` +
        (desc ? `<desc>${esc(desc)}</desc>` : '') +
        marker +
        label +
        `</g>`,
    };
  });

  const countByClass = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.cls] = (acc[e.cls] ?? 0) + 1;
    return acc;
  }, {});

  const stamp =
    options.stamp ??
    `drawn for ${yearLabel(spec.viewerNow)}${spec.mapOrigin !== undefined ? ` · source drawn ${yearLabel(spec.mapOrigin)}` : ''}`;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"
     aria-labelledby="chart-title chart-desc" class="stories-chart"${theme === 'auto' ? '' : ` data-palette="${theme}"`}>
  <title id="chart-title">Stories of the past and future — the local-time corpus</title>
  <desc id="chart-desc">Each entry is a work plotted at its publication date and how far its setting sits from that date: ${entries.length} entries, ${countByClass.obsolete ?? 0} obsolete, ${countByClass.still_possible ?? 0} still possible, ${countByClass.period_piece ?? 0} former period pieces, ${countByClass.recognizable ?? 0} recognisable past settings. Chart form after xkcd #1491.</desc>
  <style>
    .stories-chart { ${cssVars} background: ${p.bg}; font-family: ui-sans-serif, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .stories-chart { --bg:${p.bg}; --ink:${p.ink}; --muted:${p.muted}; --rule:${p.rule}; --obsolete:${p.obsolete}; --period:${p.periodPiece}; --hatch:${p.hatch}; --possible:${p.possible}; --past:${p.past}; --accent:${p.accent}; }
    @media (prefers-color-scheme: dark) {
      .stories-chart { --bg:${PALETTES.dark.bg}; --ink:${PALETTES.dark.ink}; --muted:${PALETTES.dark.muted}; --rule:${PALETTES.dark.rule}; --obsolete:${PALETTES.dark.obsolete}; --period:${PALETTES.dark.periodPiece}; --hatch:${PALETTES.dark.hatch}; --possible:${PALETTES.dark.possible}; --past:${PALETTES.dark.past}; --accent:${PALETTES.dark.accent}; }
    }
    :root[data-theme="dark"] .stories-chart { --bg:${PALETTES.dark.bg}; --ink:${PALETTES.dark.ink}; --muted:${PALETTES.dark.muted}; --rule:${PALETTES.dark.rule}; --obsolete:${PALETTES.dark.obsolete}; --period:${PALETTES.dark.periodPiece}; --hatch:${PALETTES.dark.hatch}; --possible:${PALETTES.dark.possible}; --past:${PALETTES.dark.past}; --accent:${PALETTES.dark.accent}; }
    :root[data-theme="light"] .stories-chart { --bg:${PALETTES.light.bg}; --ink:${PALETTES.light.ink}; --muted:${PALETTES.light.muted}; --rule:${PALETTES.light.rule}; --obsolete:${PALETTES.light.obsolete}; --period:${PALETTES.light.periodPiece}; --hatch:${PALETTES.light.hatch}; --possible:${PALETTES.light.possible}; --past:${PALETTES.light.past}; --accent:${PALETTES.light.accent}; }
    .stories-chart text { fill: ${V('ink')}; }
    .stories-chart .tick { fill: ${V('muted')}; font-size: 12px; }
    .stories-chart .axis-title { fill: ${V('muted')}; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; }
    .stories-chart .grid { stroke: ${V('rule')}; stroke-width: 0.6; opacity: 0.7; }
    .stories-chart .zero { stroke: ${V('ink')}; stroke-width: 1; opacity: 0.55; }
    .stories-chart .cone-fill { fill: ${V('period')}; }
    .stories-chart .cone-obsolete { fill: ${V('obsolete')}; }
    .stories-chart .cone-edge { fill: none; stroke: ${V('muted')}; stroke-width: 1; stroke-dasharray: 5 4; opacity: 0.9; }
    .stories-chart .label { font-size: 11px; }
    .stories-chart .label.still_possible, .stories-chart .label.recognizable { fill: ${V('ink')}; }
    .stories-chart .label.obsolete, .stories-chart .label.period_piece { fill: ${V('muted')}; }
    .stories-chart .marker { stroke: none; }
    .stories-chart .entry.future .marker { fill: ${V('possible')}; }
    .stories-chart .entry.past .marker { fill: ${V('past')}; }
    .stories-chart .open { fill: ${V('muted')}; }
    .stories-chart .entry.interactive:focus { outline: none; }
    .stories-chart .entry.interactive:focus .marker, .stories-chart .entry.interactive:hover .marker { stroke: ${V('accent')}; stroke-width: 3; }
    .stories-chart .note { fill: ${V('muted')}; font-size: 11px; }
    .stories-chart .attribution { fill: ${V('muted')}; font-size: 10.5px; }
    .stories-chart .targeted .marker { stroke: ${V('accent')}; stroke-width: 3; }
    .stories-chart .apex { stroke: ${V('accent')}; stroke-width: 1.2; stroke-dasharray: 3 3; opacity: 0.9; }
  </style>
  <defs>
    <clipPath id="plot-clip"><rect x="${M.left}" y="${M.top}" width="${PW}" height="${PH}"/></clipPath>
    <pattern id="hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="7" stroke="${V('hatch')}" stroke-width="1" opacity="0.22"/>
    </pattern>
  </defs>
  <rect x="0" y="0" width="${W}" height="${H}" fill="${V('bg')}"/>
  <g role="group" aria-label="axes">
  ${gridX}
  ${gridY}
  </g>
  <g role="group" aria-label="the cone: settings the reader's present has overtaken" clip-path="url(#plot-clip)">
    <polygon class="cone-fill" points="${wedgePoints.join(' ')}" fill="url(#hatch)"/>
    <polyline class="cone-edge" points="${coneBoundary(1)}"/>
    <polyline class="cone-edge" points="${coneBoundary(-1)}"/>
    <text class="note" x="${(apexX > M.left + PW - 150 ? apexX - 10 : apexX + 10).toFixed(1)}" y="${(M.top + 18).toFixed(1)}" text-anchor="${apexX > M.left + PW - 150 ? 'end' : 'start'}">stories set in ${yearLabel(spec.viewerNow)}</text>
    <text class="note" x="${(apexX - 12).toFixed(1)}" y="${(zeroY - 8).toFixed(1)}" text-anchor="end">and older than this, the future is already past</text>
  </g>
  <line class="zero" x1="${M.left}" y1="${zeroY.toFixed(1)}" x2="${M.left + PW}" y2="${zeroY.toFixed(1)}"/>
  <g role="group" aria-label="entries">
  ${entries.map((e) => e.svg).join('\n  ')}
  </g>
  <g role="group" aria-label="labels">
    <text class="axis-title" x="${M.left}" y="${M.top - 20}">years the setting sits from publication</text>
    <text class="axis-title" x="${M.left + PW}" y="${M.top + PH + 58}" text-anchor="end">date of publication</text>
    <text class="note" id="chart-counts" x="${M.left}" y="34">${entries.length} entries · ${countByClass.obsolete ?? 0} obsolete · ${countByClass.still_possible ?? 0} still possible · ${countByClass.period_piece ?? 0} former period pieces · ${countByClass.recognizable ?? 0} recognisable</text>
    <text class="note" id="chart-stamp" x="${M.left + PW}" y="34" text-anchor="end">${esc(stamp)}</text>
  </g>
  <g role="group" aria-label="attribution">
    <text class="attribution" x="${M.left}" y="${H - 22}">${esc(spec.attribution.split('\n')[0])}</text>
    <text class="attribution" x="${M.left}" y="${H - 8}">${esc(spec.attribution.split('\n')[1])}</text>
  </g>
</svg>
`;
  return body;
}

const BAR = '▁▂▃▄▅▆▇█';

/** The console view: the same spec, grouped by the reader's verdict, so a diff reads. */
export function renderStoriesConsole(spec: StoriesChartSpec): string {
  const groups = new Map<ChartClass, ChartEntry[]>();
  for (const entry of spec.entries) {
    const cls = classify(entry, spec.viewerNow);
    groups.set(cls, [...(groups.get(cls) ?? []), entry]);
  }
  const order: ChartClass[] = ['obsolete', 'still_possible', 'period_piece', 'recognizable'];
  const lines = [
    `stories of the past and future — ${spec.entries.length} entries, drawn for ${yearLabel(spec.viewerNow)}`,
    `cone: |offset| = apex − publication`,
    '',
  ];
  for (const cls of order) {
    const list = groups.get(cls) ?? [];
    if (!list.length) continue;
    lines.push(`${cls} (${list.length})`);
    for (const entry of list) {
      const span = magnitudeLabel(Math.max(Math.abs(entry.offset.min), Math.abs(entry.offset.max)));
      const barLength = Math.max(1, Math.min(24, Math.round(Math.log10(1 + Math.abs(entry.offset.max)) * 4)));
      lines.push(
        `  ${yearLabel(entry.publicationYear).padStart(9)}  ${BAR[Math.min(7, barLength % 8)].repeat(barLength)} ${entry.label}  (${entry.side} ${span})`,
      );
    }
    lines.push('');
  }
  lines.push(spec.attribution);
  return lines.join('\n');
}
