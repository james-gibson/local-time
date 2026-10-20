import type {
  AnchorContext,
  TemporalAnchor,
  TemporalEpoch,
  TemporalKeyframe,
  TemporalLayer,
  Universe,
} from './types';
import { TimePrecision } from './types';

/**
 * A work's three temporal domains (james-gibson/local-time#150).
 *
 * `explorations/example.ts.md:426-530` describes a creative work as a temporal authority with
 * three coordinate systems:
 *
 * - `runtime` — linear playback time, zero at the first frame. Every work has one.
 * - `narrative` — the story's *real-calendar* time, which may be non-linear or a span rather
 *   than a point. A work set in an invented world has none: Azeroth and the Forgotten Realms
 *   have no 1910, and saying so by omission is the honest shape.
 * - `production` — real-world creation time, which is always a calendar span.
 *
 * Only `runtime` had a producer before this module: `UniverseBuilder.withRuntime()` has always
 * emitted it, and the other two had no way in. They are layers here because layers are how the
 * corpus models axes; `layerId` is the domain, so "which axes does this work have?" is a
 * question with an answer that does not depend on epoch key spelling.
 */
export type TemporalDomain = 'runtime' | 'narrative' | 'production';

export const TEMPORAL_DOMAINS: readonly TemporalDomain[] = ['runtime', 'narrative', 'production'];

/** A domain, resolved to the epoch that carries its span. */
export interface DomainSpan {
  domain: TemporalDomain;
  epochId: string;
  startTime: bigint;
  endTime: bigint;
  precision: TimePrecision;
  description?: string;
}

/** Layer types per domain: playback and story are the work's own axes; production is about it. */
const DOMAIN_LAYER_TYPES: Record<TemporalDomain, TemporalLayer['type']> = {
  runtime: 'primary',
  narrative: 'primary',
  production: 'meta',
};

const domainLayer = (universe: Universe, domain: TemporalDomain): TemporalLayer | undefined =>
  (universe.layers ?? []).find((layer) => layer.layerId === domain);

const epochOf = (layer: TemporalLayer, domain: TemporalDomain): TemporalEpoch | undefined =>
  layer.epochs[domain] ?? Object.values(layer.epochs)[0];

/** Epochs carry `startTime`/`endTime`; a few older ones use the `start`/`end` aliases. */
const spanOf = (epoch: TemporalEpoch): { start: bigint; end: bigint } | undefined => {
  const start = epoch.startTime ?? epoch.start;
  const end = epoch.endTime ?? epoch.end;
  return start === undefined || end === undefined ? undefined : { start, end };
};

/**
 * The epoch backing `domain`, or `undefined` when the work does not have that axis.
 *
 * Resolved by **layer id**, not by epoch key: `withRuntime()` has always written the runtime
 * local epoch of layering under the layer `runtime`. Epoch keys vary (`main` from the builder,
 * `film` on the Mary Poppins literal), so they are a poor identity.
 */
export function domainSpan(universe: Universe, domain: TemporalDomain): DomainSpan | undefined {
  const layer = domainLayer(universe, domain);
  if (!layer) return undefined;
  const epoch = epochOf(layer, domain);
  const span = epoch ? spanOf(epoch) : undefined;
  if (!epoch || !span) return undefined;

  return {
    domain,
    epochId: epoch.epochId ?? domain,
    startTime: span.start,
    endTime: span.end,
    precision: epoch.precision,
    description: epoch.description,
  };
}

/** Every domain the work actually carries, in `TEMPORAL_DOMAINS` order. */
export function domainSpans(universe: Universe): DomainSpan[] {
  return TEMPORAL_DOMAINS.flatMap((domain) => {
    const span = domainSpan(universe, domain);
    return span ? [span] : [];
  });
}

/**
 * Where `instant` sits in the work's runtime, as a fraction in `[0, 1]` — the coordinate the
 * design's "scenes at the 87% mark of their runtime" query is expressed in
 * (`example.ts.md:730-738`). `undefined` when the work has no non-zero runtime.
 */
export function runtimeFraction(universe: Universe, instant: bigint): number | undefined {
  const span = domainSpan(universe, 'runtime');
  if (!span || span.endTime <= span.startTime) return undefined;
  return Number(instant - span.startTime) / Number(span.endTime - span.startTime);
}

/** The runtime position of a fraction, clamped to the work's span. */
export function runtimeAtFraction(universe: Universe, fraction: number): bigint | undefined {
  const span = domainSpan(universe, 'runtime');
  if (!span) return undefined;
  const clamped = Math.min(1, Math.max(0, fraction));
  return span.startTime + BigInt(Math.round(Number(span.endTime - span.startTime) * clamped));
}

/**
 * Runtime moments within `tolerance` of `fraction` — "find scenes at the 87% mark". The
 * tolerance is a fraction of the runtime, not a duration, so the query is per-work.
 */
export function momentsAtRuntimeFraction(
  universe: Universe,
  fraction: number,
  tolerance = 0.01,
): TemporalKeyframe[] {
  return (universe.temporalStructure?.keyframes ?? []).filter((keyframe) => {
    const at = runtimeFraction(universe, keyframe.timestamp);
    return at !== undefined && Math.abs(at - fraction) <= tolerance;
  });
}

/**
 * Domains whose span overlaps `[startTime, endTime)`. `runtime` is excluded deliberately: its
 * zero is the first frame, so it looks like 1970 in nanosecond form and would match every
 * modern window. A calendar query must not read playback time as a date.
 */
export function domainsOverlapping(
  universe: Universe,
  startTime: bigint,
  endTime: bigint,
): DomainSpan[] {
  return domainSpans(universe).filter(
    (span) => span.domain !== 'runtime' && span.startTime < endTime && span.endTime > startTime,
  );
}

/** One calendar span on a universe — a domain, or any other dated layer it carries. */
export interface CalendarSpan {
  layerId: string;
  epochId: string;
  startTime: bigint;
  endTime: bigint;
  precision: TimePrecision;
  description?: string;
}

/**
 * Every calendar span a universe carries, from every layer except `runtime`.
 *
 * `domainSpans()` answers "which of the three axes does this work have?"; this answers "when
 * does this universe happen?". A historical event, a biography and a work's narrative domain
 * are all calendar spans, so a window query over the corpus uses this one.
 */
export function calendarSpans(universe: Universe): CalendarSpan[] {
  const spans: CalendarSpan[] = [];
  for (const layer of universe.layers ?? []) {
    if (layer.layerId === 'runtime') continue;
    for (const [key, epoch] of Object.entries(layer.epochs)) {
      const span = spanOf(epoch);
      if (!span) continue;
      spans.push({
        layerId: layer.layerId,
        epochId: epoch.epochId ?? key,
        startTime: span.start,
        endTime: span.end,
        precision: epoch.precision,
        description: epoch.description,
      });
    }
  }
  return spans;
}

/**
 * Universes with a *calendar* span overlapping the window — "find all 1916 references across
 * every universe", answered at the corpus level. Playback time never counts as a date.
 */
export function universesInCalendarWindow(
  universes: readonly Universe[],
  startTime: bigint,
  endTime: bigint,
): Universe[] {
  return universes.filter((universe) =>
    calendarSpans(universe).some(
      (span) => span.startTime < endTime && span.endTime > startTime,
    ),
  );
}

/** Nanoseconds since the Unix epoch, the corpus's timestamp unit. */
export const calendarInstant = (date: string | Date): bigint =>
  BigInt(new Date(date).getTime()) * 1_000_000n;

/**
 * Address a point *into* a domain, as `multi.md` describes: `domainId` is
 * `<universeId>:<domain>`.
 *
 * Throws — rather than emitting a dangling address — when the work does not carry that domain.
 * A work set in an invented world has no narrative calendar time, so it cannot be the target
 * of a narrative anchor; that is a property of the work, not something to paper over.
 */
export function domainAnchor(
  universe: Universe,
  domain: TemporalDomain,
  eventId: string,
  context: AnchorContext = {},
): TemporalAnchor {
  const span = domainSpan(universe, domain);
  if (!span) {
    throw new Error(
      `${universe.universeId} has no '${domain}' domain; it cannot be anchored there. ` +
        `Domains present: ${domainSpans(universe).map((s) => s.domain).join(', ') || 'none'}.`,
    );
  }
  return {
    domainId: `${universe.universeId}:${domain}`,
    eventId,
    context,
  };
}

/** The universe id and domain an anchor addresses, if it is shaped `<universeId>:<domain>`. */
export function parseDomainAnchor(
  anchor: TemporalAnchor,
): { universeId: string; domain: TemporalDomain } | undefined {
  const separator = anchor.domainId.lastIndexOf(':');
  if (separator <= 0) return undefined;
  const domain = anchor.domainId.slice(separator + 1) as TemporalDomain;
  if (!TEMPORAL_DOMAINS.includes(domain)) return undefined;
  return { universeId: anchor.domainId.slice(0, separator), domain };
}

/**
 * A layer for a calendar domain — used by literal universes and by the builder, so both emit
 * the same shape. `start`/`end` are ISO dates or `Date`s; the span is `[start, end)`.
 */
export function temporalDomainLayer(
  domain: Exclude<TemporalDomain, 'runtime'>,
  start: string | Date,
  end: string | Date,
  precision: TimePrecision,
  description: string,
): TemporalLayer {
  return {
    layerId: domain,
    type: DOMAIN_LAYER_TYPES[domain],
    epochs: {
      [domain]: {
        epochId: domain,
        startTime: calendarInstant(start),
        endTime: calendarInstant(end),
        precision,
        description,
      },
    },
  };
}
