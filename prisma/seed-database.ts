/**
 * The database seed, expressed as a function over a `PrismaClient` rather than as a
 * script with a `main()` at the bottom.
 *
 * Why the split (james-gibson/local-time#58): `prisma/seed.ts` was only ever runnable
 * by hand against a database that was expected to exist already, and it was wrong the
 * first time it ran — every JSON column is `String` in the schema, but the seed handed
 * Prisma objects, so `identifiers` failed validation on the very first universe. Nothing
 * caught that because no test ever imported it. Keeping the logic here, side-effect
 * free, is what lets `tests/prisma/seed.test.ts` run the whole seed against a throwaway
 * SQLite file on every `npm test`.
 *
 * `prisma/seed.ts` is now a thin CLI wrapper around this module.
 */
import type { PrismaClient } from '@prisma/client';
import { allNetworks, allUniverses } from '../src/config/universes/index.js';
import {
  TimePrecision,
  type TemporalEpoch,
  type TemporalSegment,
  type Universe,
  type UniverseNetwork,
  type ZeroReferenceEpoch,
} from '../src/core/types.js';

/**
 * The schema models every JSON-ish field as `String` (SQLite has no JSON type and
 * Prisma's `Json` scalar is not supported on SQLite). The conversion therefore has to
 * live at this boundary rather than being left to Prisma's input validation, which
 * rejects an object where a `String` is declared.
 *
 * `JSON.stringify` throws on `bigint` (`TemporalKeyframe.dateRange` carries two of
 * them), so bigints are written as decimal strings. That matches how every timestamp
 * column in this schema already stores its value, and it is lossless — but it does mean
 * a JSON column is not itself enough to tell `1700000000000000000` from the string
 * `'1700000000000000000'`. #58's follow-up on ADR 0001 is where that gets a real answer.
 */
const bigintToDecimal = (_key: string, value: unknown): unknown =>
  typeof value === 'bigint' ? value.toString() : value;

const toJson = (value: unknown): string => JSON.stringify(value, bigintToDecimal);

/** Same as {@link toJson}, but keeps nullable columns null instead of writing `"null"`. */
const toOptionalJson = (value: unknown): string | null =>
  value === undefined || value === null ? null : toJson(value);

/** `TemporalLayer.epochs` is a union: plain epochs and zero-reference epochs. */
type EpochLike = TemporalEpoch & Partial<ZeroReferenceEpoch>;

/**
 * A segment as it is *actually* authored. `TemporalSegment` declares `id` / `start` /
 * `end`, but container universes (`system:secure_ledger:*`, `technology:*`,
 * `history:*`) are written with the builder's container form instead, which says
 * `segmentId` / `startTime` / `endTime` and no `type` at all. Nothing validates either
 * shape — `src/config/universes/index.ts` narrows every entry with `as unknown as
 * Universe` — so the seed has to accept both rather than trust the interface.
 * See james-gibson/local-time#58: this is the drift a database boundary is supposed to
 * surface.
 */
type SegmentLike = TemporalSegment & {
  segmentId?: string;
  startTime?: bigint;
  endTime?: bigint;
};

/**
 * A `TimePrecision` is a span **in nanoseconds** (`DAY = 86_400_000_000_000`,
 * `MILLION_YEARS ≈ 3.15e22`), so the enum's numeric value fits neither a 32-bit
 * `INTEGER` nor SQLite's signed 64-bit at the top end. Every other enum column in this
 * schema is already stored as its name (`'primary'`, `'active'`, …), so precision is
 * stored the same way: `'DAY'`, `'YEAR'`, …
 *
 * The input is `unknown` rather than `TimePrecision` on purpose. `TemporalEpoch.precision`
 * is declared as the numeric enum, but the static data authors it **both** ways: most
 * epochs carry `TimePrecision.DAY`, and some zero-reference epochs carry the string
 * `'MINUTE'`. Nothing validates the literal — `as unknown as Universe` erases the
 * distinction — so the conversion accepts either and returns the name. This is the same
 * class of drift as the two segment shapes below.
 *
 * An epoch with *no* precision is not a value to store. The column is NOT NULL since
 * #193: the 26 epochs that omitted it were given the resolution they actually have, and
 * this throws instead of writing the string `"undefined"` if one reappears.
 */
const precisionName = (precision: unknown): string => {
  if (typeof precision === 'string' && precision.length > 0) return precision;
  if (typeof precision === 'number') {
    const name = TimePrecision[precision];
    if (name !== undefined) return name;
  }
  throw new Error(
    'Epoch declares no TimePrecision; temporal_epochs.precision is NOT NULL (#193)',
  );
};

export interface SeedSummary {
  universes: number;
  layers: number;
  epochs: number;
  windows: number;
  segments: number;
  keyframes: number;
  networks: number;
  memberships: number;
  /** Network members whose universe is not registered, so no row was written. */
  unresolvedMemberships: number;
  /** Segments with no usable id/start/end in either authored shape, so no row was written. */
  unmodelledSegments: number;
}

/**
 * Delete every row in dependency order. Child tables first, because the relations are
 * `onDelete: Cascade` and a parent-first delete is only harmless while SQLite foreign
 * keys are off — which is the interesting way to get duplicate rows on a re-seed.
 */
async function clearDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.queryIndex.deleteMany();
  await prisma.universeSearchView.deleteMany();
  await prisma.referenceChainConnection.deleteMany();
  await prisma.referenceChain.deleteMany();
  await prisma.temporalReference.deleteMany();
  await prisma.universeNetworkMembership.deleteMany();
  await prisma.universeNetwork.deleteMany();
  await prisma.temporalKeyframe.deleteMany();
  await prisma.temporalSegment.deleteMany();
  await prisma.temporalStructure.deleteMany();
  await prisma.temporalWindow.deleteMany();
  await prisma.temporalEpoch.deleteMany();
  await prisma.temporalLayer.deleteMany();
  await prisma.universe.deleteMany();
}

/**
 * The searchable projection of one universe, as `universe_search_view` expects it.
 *
 * Two things here are deliberate rather than incidental:
 *
 * - `creators` is read from `attribution.creators`, which became person-keyed in #148.
 *   The old code read `attribution.creators.director`, which threw at runtime
 *   (`undefined.join`) and was found by grep, not by a gate. The seed test pins this.
 * - `earliestTime` / `latestTime` are compared as `bigint`. Comparing their decimal
 *   strings, as the first version did, sorts `'999'` after `'1000'` and every negative
 *   timestamp before every positive one.
 */
function searchViewFor(universe: Universe) {
  const searchText = [
    universe.metadata?.canonicalName,
    universe.identifiers?.aliases?.join(' '),
    universe.metadata?.creators?.join(' '),
    universe.attribution?.creators?.map((creator) => creator.name).join(' '),
  ]
    .filter(Boolean)
    .join(' ');

  const keyframes = universe.temporalStructure?.keyframes ?? [];
  const tags = keyframes.flatMap((keyframe) => keyframe.tags ?? []).join(', ');

  const idYear = String(universe.universeId).match(/:(\d{4})(?:$|:)/);
  const createdYear = idYear
    ? Number.parseInt(idYear[1], 10)
    : (universe.attribution?.copyright?.year ?? yearOf(universe.metadata?.released));

  let earliest: bigint | undefined;
  let latest: bigint | undefined;

  for (const layer of universe.layers ?? []) {
    for (const epoch of Object.values<EpochLike>(layer.epochs ?? {})) {
      const start = epoch.startTime ?? epoch.start;
      const end = epoch.endTime ?? epoch.end;

      if (typeof start === 'bigint' && (earliest === undefined || start < earliest)) {
        earliest = start;
      }
      if (typeof end === 'bigint' && (latest === undefined || end > latest)) {
        latest = end;
      }
    }
  }

  return {
    canonicalName: universe.metadata?.canonicalName ?? 'Unknown',
    type: universe.type,
    culturalSignificance: universe.metadata?.cultural_significance ?? null,
    realityType: universe.realityRelation.type,
    fictionalizationDegree: universe.realityRelation.fictionalizationDegree,
    hasPublicDomain: universe.attribution?.public_domain ?? false,
    createdYear: createdYear ?? null,
    searchText,
    tags,
    earliestTime: earliest?.toString() ?? null,
    latestTime: latest?.toString() ?? null,
  };
}

/** `UniverseMetadata.released` is typed as a `Date` but is authored as an ISO string. */
function yearOf(released: unknown): number | null {
  if (released instanceof Date && !Number.isNaN(released.getTime())) {
    return released.getFullYear();
  }
  if (typeof released === 'string') {
    const match = released.match(/^(-?\d{1,4})-/);
    if (match) return Number.parseInt(match[1], 10);
  }
  return null;
}

/**
 * Seed the whole static universe set into an empty (or previously seeded) database.
 *
 * Returns the row counts it wrote so a caller can assert against them without
 * re-querying, and so a human running `npm run db:seed` sees what happened.
 */
export async function seedDatabase(prisma: PrismaClient): Promise<SeedSummary> {
  const summary: SeedSummary = {
    universes: 0,
    layers: 0,
    epochs: 0,
    windows: 0,
    segments: 0,
    keyframes: 0,
    networks: 0,
    memberships: 0,
    unresolvedMemberships: 0,
    unmodelledSegments: 0,
  };

  await clearDatabase(prisma);

  for (const universe of allUniverses) {
    await seedUniverse(prisma, universe, summary);
  }

  for (const network of allNetworks) {
    await seedNetwork(prisma, network, summary);
  }

  return summary;
}

async function seedUniverse(
  prisma: PrismaClient,
  universe: Universe,
  summary: SeedSummary,
): Promise<void> {
  const universeId = String(universe.universeId);

  await prisma.universe.create({
    data: {
      id: universeId,
      type: universe.type,
      canonicalName: universe.metadata?.canonicalName ?? null,
      culturalSignificance: universe.metadata?.cultural_significance ?? null,
      identifiers: toOptionalJson(universe.identifiers),
      realityRelation: toJson(universe.realityRelation),
      attribution: toJson(universe.attribution ?? {}),
      metadata: toOptionalJson(universe.metadata),
    },
  });
  summary.universes += 1;

  for (const layer of universe.layers ?? []) {
    const createdLayer = await prisma.temporalLayer.create({
      data: {
        layerId: layer.layerId,
        type: layer.type,
        universeId,
        contains: toOptionalJson(layer.contains),
        realityCorrespondence: toOptionalJson(layer.reality_correspondence),
        // `TemporalLayer.subuniverses` was retired in favour of first-class containment
        // (`Universe.connections.natural.parentUniverses`, #74) and was never populated,
        // so nothing is written. The column stays in the schema for now.
      },
    });
    summary.layers += 1;

    for (const [epochKey, epoch] of Object.entries<EpochLike>(layer.epochs ?? {})) {
      await prisma.temporalEpoch.create({
        data: {
          epochId: epoch.epochId ?? epochKey,
          startTime: (epoch.startTime ?? epoch.start)?.toString() ?? null,
          endTime: (epoch.endTime ?? epoch.end)?.toString() ?? null,
          precision: precisionName(epoch.precision),
          description: epoch.description ?? null,
          layerId: createdLayer.id,
          zeroPoint: epoch.zeroPoint?.toString() ?? null,
          zeroEvent: epoch.zeroEvent ?? null,
          beforePrefix: epoch.beforePrefix ?? null,
          afterPrefix: epoch.afterPrefix ?? null,
          relativeFormat: epoch.relativeFormat ?? null,
        },
      });
      summary.epochs += 1;
    }
  }

  for (const window of universe.temporalWindows ?? []) {
    await prisma.temporalWindow.create({
      data: {
        windowId: window.windowId,
        startTime: window.startTime.toString(),
        endTime: window.endTime.toString(),
        precision: precisionName(window.precision),
        type: window.type ?? null,
        universeId,
        aliases: toJson(window.aliases),
        metadata: toOptionalJson(window.metadata),
      },
    });
    summary.windows += 1;
  }

  if (universe.temporalStructure) {
    const structure = await prisma.temporalStructure.create({
      data: {
        universeId,
        windows: toJson(universe.temporalStructure.windows),
      },
    });

    for (const segment of universe.temporalStructure.segments ?? []) {
      const authored = segment as SegmentLike;
      const segmentId = authored.id ?? authored.segmentId;
      const start = authored.start ?? authored.startTime;
      const end = authored.end ?? authored.endTime;

      if (segmentId === undefined || start === undefined || end === undefined) {
        summary.unmodelledSegments += 1;
        continue;
      }

      await prisma.temporalSegment.create({
        data: {
          segmentId,
          start: start.toString(),
          end: end.toString(),
          type: authored.type ?? null,
          status: authored.status ?? null,
          jurisdiction: authored.jurisdiction ?? null,
          structureId: structure.id,
        },
      });
      summary.segments += 1;
    }

    for (const keyframe of universe.temporalStructure.keyframes ?? []) {
      await prisma.temporalKeyframe.create({
        data: {
          keyframeId: keyframe.id,
          timestamp: keyframe.timestamp.toString(),
          significance: keyframe.significance,
          certainty: keyframe.certainty ?? null,
          structureId: structure.id,
          tags: toJson(keyframe.tags ?? []),
          dateRange: toOptionalJson(keyframe.dateRange),
        },
      });
      summary.keyframes += 1;
    }
  }

  await prisma.universeSearchView.create({ data: { universeId, ...searchViewFor(universe) } });
}

async function seedNetwork(
  prisma: PrismaClient,
  network: UniverseNetwork,
  summary: SeedSummary,
): Promise<void> {
  const createdNetwork = await prisma.universeNetwork.create({
    data: {
      networkId: network.networkId,
      sharedEpochs: toOptionalJson(network.sharedEpochs),
      eras: toJson(network.eras ?? []),
    },
  });
  summary.networks += 1;

  // `UniverseNetwork.universes` is a `Set`. An array is accepted too, because a
  // hand-authored network literal carries one and the Set is only what the builder and
  // the registry produce.
  const members: readonly unknown[] = Array.isArray(network.universes)
    ? network.universes
    : Array.from(network.universes ?? []);

  for (const member of members) {
    const universeId = String(member);
    const exists = await prisma.universe.findUnique({ where: { id: universeId } });
    if (!exists) {
      summary.unresolvedMemberships += 1;
      continue;
    }
    await prisma.universeNetworkMembership.create({
      data: { universeId, networkId: createdNetwork.id },
    });
    summary.memberships += 1;
  }
}
