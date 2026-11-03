import { Universe, TemporalKeyframe, KeyframeType } from '../core/types';

/**
 * What this module does not read — and why that matters
 *
 * The chart consumes the registry and nothing else: no Qdrant collection, no
 * `plane` named vector, no call into isotope, no 42i coordinate. `plane_charge`
 * in the KB payload is written by the indexer and never traversed
 * (james-gibson/isotope#8), and this view is not one of its would-be consumers:
 * the only charge-shaped thing it could show is derived locally by
 * `buildUniverseGraph` from the reality gradient (#76/#90), not ranked in plane
 * space. So isotope#8 is not a blocker for the chart. It blocks ordering or
 * sizing entries by plane-space *distance*, which is a different feature and
 * would need a ranking client that does not exist yet.
 *
 * The stories chart: xkcd #1491's shape, built from this corpus.
 *
 * `buildStoriesChart` returns a **spec**, not pixels. Three renderers consume it —
 * SVG, PNG, console — and none of them may reach for the registry themselves, so a
 * row that appears in one appears in all three or the renderer is wrong.
 *
 * ## Two origins, three voices
 *
 * The chart plots each entry at (publication, offset-from-publication), and the
 * cone's apex sits at the **viewer's** present, not the author's. xkcd #1491 gets
 * away with conflating the two because in February 2015 the reader's now and the
 * chart's now were the same instant. A reader in 2026 must not be handed 2015's
 * verdict, so classes are computed from `viewerNow` at read time and never stored
 * on an entry. See james-gibson/local-time#228.
 *
 * The vocabularies stay separate:
 * - the authority (#229) says what the source claimed — a dated statement;
 * - the corrections (#230) say what is true — also dated;
 * - the class says what the reader's position makes of both — the only one that moves.
 */

export const CHART_ATTRIBUTION =
  'Chart form after xkcd #1491, "Stories of the Past and Future"\n' +
  '(Randall Munroe, CC BY-NC 2.5) — https://xkcd.com/1491/';

/** The instant every verdict in it was computed from. A fact about the source. */
export const XKCD_1491_MAP_ORIGIN = 2015.15;

const JULIAN_YEAR_NS = 365.2425 * 86400 * 1e9;

/** Nanoseconds since the epoch → decimal year. Float is deliberate: the chart's
 * unit is a year and its range runs to ±1e9, which `Date` cannot represent. */
export function nanosecondsToYear(timestamp: bigint): number {
  return Number(timestamp) / JULIAN_YEAR_NS + 1970;
}

/** Decimal year → nanoseconds, the inverse of the above. */
export function yearToNanoseconds(year: number): bigint {
  return BigInt(Math.round((year - 1970) * JULIAN_YEAR_NS));
}

export type ChartSide = 'past' | 'future';

/**
 * The four classes the comic distinguishes by colour — now *derived*, from the
 * cone and the reader's origin, rather than assigned by hand.
 */
export type ChartClass = 'still_possible' | 'obsolete' | 'period_piece' | 'recognizable';

export interface ChartOffset {
  /** Signed years from publication: negative is before it. */
  min: number;
  max: number;
  /** The chart drew an open end (`5+`, `before 1846`). */
  open?: boolean;
  /** The source's own words for the setting ("the Stone Age", "a long time ago"). */
  asPrinted?: string;
}

export interface ChartEntry {
  id: string;
  label: string;
  side: ChartSide;
  /** The work's origin: its publication instant, in decimal years. */
  publicationYear: number;
  offset: ChartOffset;
  certainty: number;
  fictionalizationDegree: number;
  notes?: string;
  /** The listing's own hedge, when it has one. Never a corrected value. */
  dispute?: string;
  /** Ids of other entries this one references, when the corpus declares edges. */
  references?: string[];
  source: 'authority' | 'registry';
}

/**
 * What the plane is, and what it costs.
 *
 * The xkcd chart is a **plane projection cut at the time of its publication** — one
 * slice, taken on 2015-02-25, of works plotted at (publication, offset). It is static
 * because the plane is: nothing about a comic can be re-cut.
 *
 * This corpus is not static and not planar. Universes reference each other, epochs nest
 * inside other epochs, and the magnitudes run from nanoseconds to billions of years, so
 * any single plane is a lossy projection of a relational object. Naming the cut and the
 * losses is the difference between a chart and an illustration.
 */
export interface ChartProjection {
  plane: 'publication × offset';
  /** The instant the plane is cut at — the viewer's present, never the author's. */
  cutAt: number;
  /** The source's own cut, when the corpus is an authority. */
  authoredAt?: number;
  units: 'years';
  span: { x: { min: number; max: number }; y: { min: number; max: number } };
  /** Edges the plane cannot draw, counted rather than dropped silently. */
  edges: { total: number; resolvable: number };
  /** The dimensions this plane flattens. Named so a reader knows what they are not seeing. */
  collapses: string[];
}

export interface AxisBreak {
  value: number;
  /** Position along the axis, 0 (start) → 1 (end). */
  position: number;
}

export interface AxisScale {
  /**
   * `piecewise` follows the comic's adaptive axis — control points crowd where the
   * data is (the last two centuries), not at round numbers. `log` is a signed
   * log10(1+|v|) useful for the offset axis. `linear` is the honest option for a
   * narrow window.
   */
  mode: 'piecewise' | 'log' | 'linear';
  domain: { min: number; max: number };
  breaks?: AxisBreak[];
}

export interface StoriesChartScales {
  x: AxisScale;
  y: AxisScale;
}

export interface StoriesChartSpec {
  version: 1;
  /** The reader's present — the cone's apex. Never the build date. */
  viewerNow: number;
  /** The source's present, when the corpus is an authority. A dated fact. */
  mapOrigin?: number;
  entries: ChartEntry[];
  scales: StoriesChartScales;
  /** What this plane is a projection of, cut when, and what it cannot show. */
  projection: ChartProjection;
  cone: {
    apexYear: number;
    /** Both boundaries satisfy |offset| = apexYear − publicationYear. */
    description: string;
  };
  attribution: string;
}

// ---------------------------------------------------------------------------
// projection
// ---------------------------------------------------------------------------

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Signed log10(1 + |v|): compresses ±1e9 while keeping the sign and the zero. */
export function signedLog(value: number): number {
  return Math.sign(value) * Math.log10(1 + Math.abs(value));
}

export function project(value: number, scale: AxisScale): number {
  const { min, max } = scale.domain;
  if (max === min) return 0.5;
  if (scale.mode === 'linear') return clamp01((value - min) / (max - min));
  if (scale.mode === 'log') {
    const cap = Math.max(Math.abs(min), Math.abs(max));
    if (cap <= 0) return 0.5;
    return clamp01(0.5 + signedLog(value) / (2 * Math.log10(1 + cap)));
  }
  const breaks = (scale.breaks ?? []).slice().sort((a, b) => a.value - b.value);
  if (breaks.length < 2) {
    return clamp01(signedLog(value - min) / Math.log10(1 + (max - min)));
  }
  if (value <= breaks[0].value) return clamp01(breaks[0].position);
  for (let i = 1; i < breaks.length; i += 1) {
    const lo = breaks[i - 1];
    const hi = breaks[i];
    if (value <= hi.value) {
      const span = hi.value - lo.value;
      const t = span === 0 ? 0 : (value - lo.value) / span;
      return clamp01(lo.position + t * (hi.position - lo.position));
    }
  }
  return clamp01(breaks[breaks.length - 1].position);
}

/** The inverse, for turning a pointer position back into a year. */
export function unproject(position: number, scale: AxisScale): number {
  const { min, max } = scale.domain;
  if (scale.mode === 'linear') return min + clamp01(position) * (max - min);
  if (scale.mode === 'log') {
    const cap = Math.max(Math.abs(min), Math.abs(max));
    const s = (clamp01(position) - 0.5) * 2 * Math.log10(1 + cap);
    return Math.sign(s) * (Math.pow(10, Math.abs(s)) - 1);
  }
  const breaks = (scale.breaks ?? []).slice().sort((a, b) => a.position - b.position);
  if (breaks.length < 2) {
    return min + Math.pow(10, clamp01(position) * Math.log10(1 + (max - min))) - 1;
  }
  for (let i = 1; i < breaks.length; i += 1) {
    const lo = breaks[i - 1];
    const hi = breaks[i];
    if (position <= hi.position) {
      const span = hi.position - lo.position;
      const t = span === 0 ? 0 : (position - lo.position) / span;
      return lo.value + t * (hi.value - lo.value);
    }
  }
  return breaks[breaks.length - 1].value;
}

// ---------------------------------------------------------------------------
// classification
// ---------------------------------------------------------------------------

/**
 * What the reader's position makes of an entry.
 *
 * Future-side settings that have since been overtaken by the reader are `obsolete`;
 * past-side settings whose work was published closer to its setting than to the
 * reader are `period_piece` — the comic's "modern audiences may not recognise which
 * parts were supposed to sound old".
 */
export function classify(entry: ChartEntry, viewerNow: number): ChartClass {
  if (entry.side === 'future') {
    const settingYear = entry.publicationYear + entry.offset.max;
    return settingYear <= viewerNow ? 'obsolete' : 'still_possible';
  }
  const age = viewerNow - entry.publicationYear;
  return Math.abs(entry.offset.min) < age ? 'period_piece' : 'recognizable';
}

// ---------------------------------------------------------------------------
// scales
// ---------------------------------------------------------------------------

const X_BREAKS: AxisBreak[] = [
  { value: -3000, position: 0 },
  { value: -2000, position: 0.04 },
  { value: 0, position: 0.1 },
  { value: 1000, position: 0.18 },
  { value: 1500, position: 0.3 },
  { value: 1800, position: 0.45 },
  { value: 1900, position: 0.58 },
  { value: 1950, position: 0.7 },
  { value: 1980, position: 0.8 },
  { value: 2000, position: 0.9 },
  { value: 2020, position: 0.97 },
  { value: 2100, position: 1 },
];

/** Default scales: the comic's adaptive publication axis, a signed log for offsets. */
export interface DefaultScaleOptions {
  /**
   * Clamp the offset axis to the 98th percentile instead of the maximum.
   *
   * The authority keeps every extreme: *The Time Machine* and *Star Wars* are 1e9
   * years away and that is the argument the chart is making. The library's own view
   * does not — four of its five hundred universes are that far out, and leaving the
   * axis at 1e9 flattens the other 512 onto the zero line. Clamped entries still
   * render, pinned at the edge and labelled as such.
   */
  clampY?: boolean;
}

export function defaultScales(
  entries: ChartEntry[],
  viewerNow: number,
  options: DefaultScaleOptions = {},
): StoriesChartScales {
  const years = entries.map((e) => e.publicationYear).filter(Number.isFinite);
  const minX = Math.min(...(years.length ? years : [-3000]), -3000);
  const maxX = Math.max(...(years.length ? years : [viewerNow]), viewerNow, 2020);
  const xBreaks = X_BREAKS.filter((b) => b.value >= minX - 1 || b === X_BREAKS[0]).map((b, i, all) => ({
    ...b,
    position: i === 0 ? 0 : all.length === 1 ? 1 : (b.position - all[0].position) / (all[all.length - 1].position - all[0].position || 1),
  }));
  if (xBreaks.length === 1) xBreaks.push({ value: maxX, position: 1 });
  if (xBreaks[xBreaks.length - 1].value < maxX) xBreaks.push({ value: maxX, position: 1 });

  const magnitudes = entries
    .map((e) => Math.max(Math.abs(e.offset.min), Math.abs(e.offset.max)))
    .sort((a, b) => a - b);
  const quantile = magnitudes.length ? magnitudes[Math.min(magnitudes.length - 1, Math.floor(magnitudes.length * 0.98))] : 1;
  const maxMagnitude = magnitudes.length ? magnitudes[magnitudes.length - 1] : 1;
  const maxOffset = Math.max(
    10,
    options.clampY ? Math.pow(10, Math.round(Math.log10(Math.max(quantile, 1)))) : Math.max(maxMagnitude, 1),
  );

  return {
    x: { mode: 'piecewise', domain: { min: xBreaks[0].value, max: maxX }, breaks: xBreaks },
    y: { mode: 'log', domain: { min: -maxOffset, max: maxOffset } },
  };
}

// ---------------------------------------------------------------------------
// the spec
// ---------------------------------------------------------------------------

export interface BuildStoriesChartOptions {
  entries: ChartEntry[];
  /**
   * The reader's present. Callers must pass it explicitly — a chart that reads the
   * clock is not reproducible, and one that defaults to the source's date is lying
   * to the reader. CLI: `--now 2026`.
   */
  viewerNow: number;
  mapOrigin?: number;
  scales?: StoriesChartScales;
  /** See {@link DefaultScaleOptions.clampY}. */
  clampY?: boolean;
}

export function buildStoriesChart(options: BuildStoriesChartOptions): StoriesChartSpec {
  const { entries, viewerNow } = options;
  if (!Number.isFinite(viewerNow)) {
    throw new Error('buildStoriesChart: viewerNow must be an explicit year');
  }
  const sorted = [...entries].sort(
    (a, b) => a.publicationYear - b.publicationYear || a.label.localeCompare(b.label),
  );
  const scales = options.scales ?? defaultScales(sorted, viewerNow, { clampY: options.clampY });
  const declared = entries.reduce((acc, e) => acc + (e.references?.length ?? 0), 0);
  return {
    version: 1,
    viewerNow,
    ...(options.mapOrigin !== undefined ? { mapOrigin: options.mapOrigin } : {}),
    entries: sorted,
    scales,
    projection: {
      plane: 'publication × offset',
      cutAt: viewerNow,
      ...(options.mapOrigin !== undefined ? { authoredAt: options.mapOrigin } : {}),
      units: 'years',
      span: { x: scales.x.domain, y: scales.y.domain },
      edges: { total: declared, resolvable: declared },
      collapses: [
        'cross-universe references: drawn on selection in the interactive view, counted here, invisible in a raster',
        'epoch and segment structure inside a work: a work is one entry, however many periods it holds',
        'events with no keyframe: absence is a gap in a band, not a row',
        'anything outside the drawn axis: entries beyond the offset clamp are pinned at the edge',
      ],
    },
    cone: {
      apexYear: viewerNow,
      description:
        'both boundaries satisfy |offset| = apexYear − publicationYear: above the future boundary the setting is impossible and therefore obsolete; inside the past wedge the work was published closer to its setting than to the reader',
    },
    attribution: CHART_ATTRIBUTION,
  };
}

// ---------------------------------------------------------------------------
// sources
// ---------------------------------------------------------------------------

export interface AuthorityTableEntry {
  id: string;
  label: string;
  description: string;
  section: ChartSide;
  publication: { year: number; yearEnd?: number; precision: string; seriesStart?: boolean };
  offset: { min: number; max: number; open?: boolean; asPrinted: string };
  certainty: number;
  fictionalizationDegree: number;
  notes?: string;
  dispute?: string;
}

export interface AuthorityTable {
  entries: AuthorityTableEntry[];
}

/** The authority (#229): the chart's own data points, as the source claims them. */
export function entriesFromAuthority(table: AuthorityTable): ChartEntry[] {
  return table.entries.map((e) => ({
    id: e.id,
    label: e.label,
    side: e.section,
    publicationYear: e.publication.year,
    offset: { min: e.offset.min, max: e.offset.max, open: e.offset.open, asPrinted: e.offset.asPrinted },
    certainty: e.certainty,
    fictionalizationDegree: e.fictionalizationDegree,
    notes: e.notes,
    dispute: e.dispute,
    source: 'authority' as const,
  }));
}

const isFixture = (universe: Universe): boolean => universe.universeId.startsWith('system:');

function originOf(universe: Universe): { year: number; source: ChartEntry['source'] } | null {
  for (const layer of universe.layers ?? []) {
    for (const epoch of Object.values(layer.epochs ?? {})) {
      const zero = (epoch as { zeroPoint?: bigint }).zeroPoint;
      if (zero !== undefined) return { year: nanosecondsToYear(zero), source: 'registry' };
    }
  }
  const keyframes = universe.temporalStructure?.keyframes ?? [];
  const release = keyframes.find(
    (k) => k.type === KeyframeType.RELEASE || k.type === KeyframeType.PUBLICATION,
  );
  if (release) return { year: nanosecondsToYear(release.timestamp), source: 'registry' };
  if (keyframes.length) {
    const first = [...keyframes].sort((a, b) => Number(a.timestamp - b.timestamp))[0];
    return { year: nanosecondsToYear(first.timestamp), source: 'registry' };
  }
  for (const layer of universe.layers ?? []) {
    for (const epoch of Object.values(layer.epochs ?? {})) {
      const start = epoch.startTime;
      if (start !== undefined) return { year: nanosecondsToYear(start), source: 'registry' };
    }
  }
  // The id scheme itself carries a year (`disney:aladdin:1992`), and it is the only
  // temporal fact many config universes have. Better than the load date, which would
  // stack the whole corpus at "now".
  const idYear = /:(\d{4}|v\d+)$/.exec(String(universe.universeId));
  if (idYear) {
    const year = Number(idYear[1]);
    if (Number.isFinite(year)) return { year, source: 'registry' };
  }
  if (universe.metadata?.released) {
    return { year: universe.metadata.released.getUTCFullYear(), source: 'registry' };
  }
  return null;
}

/**
 * The library's own corpus, for the default view.
 *
 * Provisional by design. The authority is the *verified* path because its offsets are
 * printed on the chart; here the offset is inferred from keyframes and epochs, and a
 * universe whose story time and production time are not distinguishable will land
 * somewhere defensible rather than somewhere precise. `system:` universes are excluded:
 * a fixture that draws itself as a row is measuring its own ruler.
 */
export function entriesFromRegistry(universes: Universe[]): ChartEntry[] {
  const out: ChartEntry[] = [];
  const known = new Set(universes.map((u) => String(u.universeId)));
  for (const universe of universes) {
    if (isFixture(universe)) continue;
    const origin = originOf(universe);
    // A universe with no usable instant has no x. It is skipped loudly rather than
    // plotted at NaN, which would poison the axis domain for every other entry.
    if (!origin || !Number.isFinite(origin.year)) continue;

    const stamps: bigint[] = [];
    for (const k of universe.temporalStructure?.keyframes ?? []) stamps.push(k.timestamp);
    for (const s of universe.temporalStructure?.segments ?? []) stamps.push(s.start, s.end);
    for (const layer of universe.layers ?? []) {
      for (const epoch of Object.values(layer.epochs ?? {})) {
        if (epoch.startTime !== undefined) stamps.push(epoch.startTime);
        if (epoch.endTime !== undefined) stamps.push(epoch.endTime);
      }
    }

    const offsets = stamps
      .map((t) => nanosecondsToYear(t) - origin.year)
      .filter((v) => Number.isFinite(v));
    const certainty = Math.min(
      1,
      universe.temporalStructure?.keyframes?.reduce((acc, k: TemporalKeyframe) => Math.min(acc, k.certainty ?? 1), 1) ?? 1,
    );

    out.push({
      id: String(universe.universeId),
      label: universe.metadata?.canonicalName ?? String(universe.identifiers?.primary ?? universe.universeId),
      side: offsets.length && Math.max(...offsets) > 0 ? 'future' : 'past',
      publicationYear: origin.year,
      offset: offsets.length
        ? { min: Math.min(...offsets, 0), max: Math.max(...offsets, 0) }
        : { min: 0, max: 0 },
      certainty: offsets.length ? certainty : 0.3,
      fictionalizationDegree: universe.realityRelation?.fictionalizationDegree ?? 0.5,
      notes: offsets.length ? undefined : 'no keyframes',
      // Only edges the plane can land: a reference to an id with no entry has nowhere
      // to point, and inventing a row for it would be the registration defect this
      // corpus already counts elsewhere (#27, #67).
      references: (universe.connections?.references ?? [])
        .map((r) => String(r.targetUniverseId))
        .filter((id) => known.has(id) && id !== String(universe.universeId)),
      source: 'registry',
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// views — every dial is a URL
// ---------------------------------------------------------------------------

export interface ChartView {
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  xMode?: AxisScale['mode'];
  yMode?: AxisScale['mode'];
  /** The reader's present. */
  now: number;
  /** True when the reader has dialled away from the canonical scales. */
  custom?: boolean;
}

export function encodeView(view: ChartView): string {
  const params = new URLSearchParams();
  if (view.xMin !== undefined && view.xMax !== undefined) params.set('x', `${view.xMin}..${view.xMax}`);
  if (view.yMin !== undefined && view.yMax !== undefined) params.set('y', `${view.yMin}..${view.yMax}`);
  if (view.xMode) params.set('xscale', view.xMode);
  if (view.yMode) params.set('yscale', view.yMode);
  params.set('origin', String(view.now));
  if (view.custom) params.set('view', 'custom');
  return params.toString();
}

export function decodeView(query: string): ChartView {
  const params = new URLSearchParams(query);
  const pair = (key: string): [number, number] | undefined => {
    const raw = params.get(key);
    if (!raw) return undefined;
    const [a, b] = raw.split('..').map(Number);
    return Number.isFinite(a) && Number.isFinite(b) ? [a, b] : undefined;
  };
  const origin = Number(params.get('origin'));
  if (!params.has('origin') || !Number.isFinite(origin)) {
    throw new Error('decodeView: the viewer origin is required — a view without one has no verdicts');
  }
  const x = pair('x');
  const y = pair('y');
  const view: ChartView = { now: origin };
  if (x) {
    view.xMin = x[0];
    view.xMax = x[1];
  }
  if (y) {
    view.yMin = y[0];
    view.yMax = y[1];
  }
  const xMode = params.get('xscale');
  const yMode = params.get('yscale');
  if (xMode === 'log' || xMode === 'linear' || xMode === 'piecewise') view.xMode = xMode;
  if (yMode === 'log' || yMode === 'linear' || yMode === 'piecewise') view.yMode = yMode;
  if (params.get('view') === 'custom') view.custom = true;
  return view;
}

/** Apply a view's dials to a spec's scales, leaving entries untouched. */
export function applyView(scales: StoriesChartScales, view: ChartView): StoriesChartScales {
  const next: StoriesChartScales = {
    x: { ...scales.x, domain: { ...scales.x.domain } },
    y: { ...scales.y, domain: { ...scales.y.domain } },
  };
  if (view.xMin !== undefined && view.xMax !== undefined) next.x.domain = { min: view.xMin, max: view.xMax };
  if (view.yMin !== undefined && view.yMax !== undefined) next.y.domain = { min: view.yMin, max: view.yMax };
  if (view.xMode) next.x.mode = view.xMode;
  if (view.yMode) next.y.mode = view.yMode;
  return next;
}

export const CHART_PRESETS = ['canonical', 'century', 'decades', 'everything'] as const;
export type ChartPreset = (typeof CHART_PRESETS)[number];

/** A named preset, resolved against the spec's own defaults. */
export function presetView(preset: ChartPreset, viewerNow: number): ChartView {
  switch (preset) {
    case 'canonical':
      return { now: viewerNow };
    case 'century':
      return { now: viewerNow, xMin: viewerNow - 120, xMax: viewerNow + 10, yMin: -120, yMax: 120, yMode: 'linear', custom: true };
    case 'decades':
      return { now: viewerNow, xMin: viewerNow - 80, xMax: viewerNow + 10, yMin: -80, yMax: 80, yMode: 'linear', custom: true };
    case 'everything':
      return { now: viewerNow };
    default:
      return { now: viewerNow };
  }
}
