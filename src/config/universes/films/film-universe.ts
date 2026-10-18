import { CommonUniverseIds } from '../../../core/common-universe-ids';
import {
  Attribution,
  RealityAnchor,
  RealityRelation,
  Universe,
} from '../../../core/types';
import {
  GENERIC_FILM_STUDIO_TOKEN,
  UniverseId,
  createFilmUniverseId,
} from '../../../core/universe-ids';
import { UniverseBuilder } from '../../../core/universe-builder';
import { distributedByRef, resolveFilmStudio } from '../studios';

/**
 * A film universe, assembled from a spec — the shim for hand-authoring one.
 *
 * ## Why this exists
 *
 * The film universes were hand-authored literals (james-gibson/local-time#115, #116), and
 * james-gibson/local-time#103 says why: the builder could not emit the containment or
 * reference shape, and it dropped the fields segments need. #115/#116 worked around that with
 * a 200-line literal cast `as unknown as Universe` — which also meant **nothing validated it**
 * (a literal skips `build()`), and the cast hid three out-of-union values elsewhere in the
 * corpus (#143).
 *
 * The literal was never the right shape for a film. A film is *data* — a runtime, a set of cut
 * points, a set of moments, a distributor, a set of sources. What was code was only the
 * scaffolding around it. This factory is that scaffolding, once.
 *
 * ## What is derived rather than written
 *
 * Everything that must agree with something else is computed, so it cannot disagree:
 *
 * - the id and the film's token come from one `spec.studio`, which is also resolved to the
 *   `film_studio:` container it is a member of, and named in the `DISTRIBUTED_BY` reference;
 * - the **act segments are gapless by construction** — the spec names cut points, the factory
 *   pairs each with the next, so `end === next.start` cannot drift by a day (which is what the
 *   ticketed spans did, every time);
 * - the runtime epoch's end is `spec.runtimeMinutes`, so it cannot disagree with the last act;
 * - `metadata.released` is the date, not the id's year.
 *
 * ## What still must be authored
 *
 * The prose, and the judgement in it: the cultural-significance number and its justification,
 * the act descriptions, the moment significances. Those are the work; everything mechanical
 * around them is not.
 *
 * ## Usage
 *
 * ```ts
 * export const warcraftFilmUniverse = createFilmUniverse({ ... });
 * ```
 *
 * Then register it exactly like any other film — `export *` from the barrel **and** the
 * `filmUniverses` spread (see `./index.ts`).
 */

/** A runtime position in nanoseconds: minutes (and optional seconds) from the first frame. */
const runtime = (minutes: number, seconds = 0): bigint =>
  (BigInt(minutes) * 60n + BigInt(seconds)) * 1_000_000_000n;

/**
 * One act. `endsAt*` is a **cut point** — where this act stops — not a duration, and not a
 * calendar date. The factory pairs it with the next act's start, so acts
 * partition the runtime with no gaps (a film is watched from zero).
 */
export interface FilmAct {
  id: string;
  endsAtMinute: number;
  endsAtSecond?: number;
  /** The prose for the segment. Kept since #100 — the builder used to drop it. */
  description: string;
}

/** A runtime keyframe: a significant moment, as a position in the film. */
export interface FilmMoment {
  id: string;
  minute: number;
  second?: number;
  significance: number;
  tags: string[];
  description: string;
}

export interface FilmSpec {
  /** The distributor's registered studio token (not the generic `film` token). */
  studio: string;
  /** The title fragment of the id — pinned explicitly when the title carries punctuation. */
  slug: string;
  year: number;
  title: string;
  aliases?: string[];
  /** Theatrical runtime in minutes. The runtime epoch and the last act both derive from it. */
  runtimeMinutes: number;
  realityRelation: {
    type: RealityRelation['type'];
    fictionalizationDegree: number;
    /** Only anchored to universes that exist — a dangling anchor is not a connection. */
    anchors?: RealityAnchor[];
  };
  copyright: {
    holders: string[];
    year: number;
    status: 'active' | 'expired' | 'public_domain' | 'invalid';
  };
  creators?: Attribution['creators'] & { based_on?: string[] };
  /** At least three, per the guide's attribution rule. */
  sources: string[];
  usageRestrictions?: string[];
  /** The real-world release date — `metadata.released`, not the id's year. */
  released: Date | string;
  culturalSignificance: number;
  /** Why that number. Name the evidence, not the adjective. */
  culturalNote: string;
  description: string;
  tags: string[];
  /** In order, by cut point. Must be increasing and end before the runtime. */
  acts: FilmAct[];
  moments: FilmMoment[];
  /** Extra containers beyond `HOLLYWOOD_SYSTEM` and the film's own studio. */
  containers?: UniverseId[];
  /** Average window size in minutes; defaults to runtime / 12. */
  averageWindowMinutes?: number;
}

/**
 * Assemble a film universe.
 *
 * Throws — loudly, and before anything is registered — on the three spec errors that would
 * otherwise become silent data defects: an unregistered studio token, acts that are out of
 * order or run past the runtime, and a runtime with no acts at all.
 */
export function createFilmUniverse(spec: FilmSpec): Universe {
  const studio = resolveFilmStudio(spec.studio);
  if (!studio) {
    throw new Error(
      `'${spec.studio}' is not a registered film studio. Add it to FILM_STUDIO_SPECS in ` +
        'src/config/universes/studios/studios.ts, or name the generic token deliberately ' +
        `('${GENERIC_FILM_STUDIO_TOKEN}').`,
    );
  }

  if (spec.acts.length === 0) {
    throw new Error(`${spec.studio}:${spec.slug}:${spec.year} has no acts; a film has a timeline.`);
  }

  const runtimeEnd = runtime(spec.runtimeMinutes);
  const label = `${spec.studio}:${spec.slug}:${spec.year}`;
  spec.acts.forEach((act, index) => {
    const cut = runtime(act.endsAtMinute, act.endsAtSecond ?? 0);
    const isLast = index === spec.acts.length - 1;
    const previous =
      index === 0
        ? 0n
        : runtime(spec.acts[index - 1].endsAtMinute, spec.acts[index - 1].endsAtSecond ?? 0);
    const at = `${act.endsAtMinute}m${act.endsAtSecond ?? 0}s`;

    if (isLast) {
      // The last act ends where the film does. Stated, not ignored, so a typo is an error
      // rather than a silently-truncated timeline.
      if (cut !== runtimeEnd) {
        throw new Error(
          `${label} act '${act.id}' is the last act and must end at the ${spec.runtimeMinutes}m ` +
            `runtime, but cuts at ${at}.`,
        );
      }
      return;
    }
    if (cut <= previous) {
      throw new Error(
        `${label} act '${act.id}' cuts at ${at}, which is not after the previous act's cut.`,
      );
    }
    if (cut >= runtimeEnd) {
      throw new Error(
        `${label} act '${act.id}' cuts at ${at}, at or after the ${spec.runtimeMinutes}m ` +
          'runtime; only the last act ends there.',
      );
    }
  });

  const builder = new UniverseBuilder()
    .film(spec.studio, spec.slug, spec.year)
    // Pin the id through the validating factory: `.film()` already routes through it, and
    // pinning makes the id explicit at the call site (a punctuated title never round-trips
    // through the slug fragment — see the local-time-ids skill).
    .withId(createFilmUniverseId(spec.studio, spec.slug, spec.year))
    .withRuntime(spec.runtimeMinutes)
    .withWindowing(
      'scene_based',
      runtime(spec.averageWindowMinutes ?? Math.max(1, Math.round(spec.runtimeMinutes / 12))),
    )
    .withRealityRelation(
      spec.realityRelation.type,
      spec.realityRelation.fictionalizationDegree,
      spec.realityRelation.anchors ?? [],
    )
    .withCopyright(spec.copyright.holders, spec.copyright.year, spec.copyright.status)
    // After `withCopyright`, which replaces `attribution`; these merge into it.
    .withSources(spec.sources)
    .withReleased(spec.released)
    // The human title, not the slug-derived one — `extractMetadata` would turn
    // `Dungeons & Dragons: Honor Among Thieves` into `Dungeons And Dragons Honor Among Thieves`.
    .withCanonicalName(spec.title)
    .withDescription(spec.description)
    .withTags(spec.tags)
    .withCulturalSignificance(spec.culturalSignificance, spec.culturalNote);

  if (spec.aliases) builder.withAliases(spec.aliases);
  if (spec.creators) builder.withCreators(spec.creators);
  if (spec.usageRestrictions) builder.withUsageRestrictions(spec.usageRestrictions);

  // Containment, derived from the one token: the film is a member of Hollywood and of its own
  // studio's container — never hand-listed, so the three can never disagree.
  builder.addParent(CommonUniverseIds.HOLLYWOOD_SYSTEM);
  builder.addParent(studio.universeId);
  for (const container of spec.containers ?? []) builder.addParent(container);

  // The distributor is a fact *as of this film's release*: the studio's later renames,
  // acquisitions and closures are keyframes in the studio's universe, never edits here (#44).
  builder.addReference(
    distributedByRef(spec.studio, `Distributed theatrically by ${studio.displayName}.`),
  );

  // Acts, paired so the partition is gapless by construction.
  let cursor = runtime(0);
  spec.acts.forEach((act, index) => {
    const isLast = index === spec.acts.length - 1;
    const end = isLast ? runtimeEnd : runtime(act.endsAtMinute, act.endsAtSecond ?? 0);
    builder.addSegment(act.id, cursor, end, 'act', act.description, 'active');
    cursor = end;
  });

  for (const moment of spec.moments) {
    builder.addRuntimeKeyframe(
      moment.minute,
      moment.second ?? 0,
      moment.id,
      moment.significance,
      moment.tags,
      moment.description,
    );
  }

  return builder.build();
}
