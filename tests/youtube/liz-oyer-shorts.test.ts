import { Universe, UniverseType } from '../../src/core/types';
import { CommonUniverseIds } from '../../src/core/common-universe-ids';
import { isSeriesUniverseId, isValidUniverseId } from '../../src/core/universe-ids';
import { allUniverses } from '../../src/config/universes';
import { ConfigLoader } from '../../src/config/config-loader';
import { UniverseRegistry } from '../../src/config/universe-registry';
import {
  LIZ_OYER_LUCAS_RUNTIME_SECONDS,
  LIZ_OYER_LUCAS_UNIVERSE_ID,
  LIZ_OYER_WATERGATE_RUNTIME_SECONDS,
  LIZ_OYER_WATERGATE_UNIVERSE_ID,
  lizOyerLucasUniverse,
  lizOyerShortsUniverses,
  lizOyerWatergateUniverse,
} from '../../src/config/universes/youtube/liz-oyer-shorts';
import { WATERGATE_SCANDAL_UNIVERSE_ID, watergateScandalUniverse } from '../../src/config/universes/historical/watergate-scandal';
import { LUCAS_INDICTMENT_UNIVERSE_ID, lucasIndictmentUniverse } from '../../src/config/universes/historical/lucas-indictment';
import { DOJ_WATERGATE_REVIEW_UNIVERSE_ID, dojWatergateReviewUniverse } from '../../src/config/universes/historical/doj-watergate-review';

/**
 * james-gibson/local-time#208 — two Lawyer Oyer shorts and the events they comment on.
 *
 * The ticket proposed a `media:` namespace and `media/youtube/` + `history/2026/` paths, none
 * of which exist. What it got right: the shorts are works, the events are real, and the pair
 * has to be modelled with the commentary as interpretation rather than as a finding. These
 * tests pin the five universes, the edges between them, and the one shape the ticket asked
 * for that no other test can see — the `nixon_was_framed` recreation layer.
 */

const universes = [
  lizOyerLucasUniverse,
  lizOyerWatergateUniverse,
  lucasIndictmentUniverse,
  watergateScandalUniverse,
  dojWatergateReviewUniverse,
] as unknown as Universe[];

const idOf = (u: Universe): string => String(u.universeId);
const registered = new Set((allUniverses as unknown as Universe[]).map(idOf));

const keyframes = (u: Universe): any[] => ((u.temporalStructure as any)?.keyframes ?? []) as any[];
const segments = (u: Universe): any[] => ((u.temporalStructure as any)?.segments ?? []) as any[];
const refs = (u: Universe): Array<{ type: string; targetUniverseId: string }> =>
  (((u as any).connections?.references ?? []) as Array<{ type: string; targetUniverseId: string }>);
const parents = (u: Universe): string[] =>
  (((u as any).connections?.natural?.parentUniverses ?? []) as string[]);

describe('the Liz Oyer shorts (#208)', () => {
  test('both ids are series ids, not the draft\'s media namespace', () => {
    // `media:` is not in UNIVERSE_ID_PATTERNS; an id in it would validate only through the
    // year-terminated catch-all, which is the #57 trap.
    for (const id of [LIZ_OYER_LUCAS_UNIVERSE_ID, LIZ_OYER_WATERGATE_UNIVERSE_ID]) {
      expect(id.startsWith('series:')).toBe(true);
      expect(isSeriesUniverseId(id)).toBe(true);
      expect(isValidUniverseId(id)).toBe(true);
    }
  });

  test('all five universes are in allUniverses and survive a registry lookup', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    for (const u of universes) {
      expect(registered.has(idOf(u))).toBe(true);
      registry.registerUniverse(idOf(u), u);
      expect(registry.getUniverse(idOf(u))).toBeDefined();
    }
  });

  test('the shorts are works: interpretation at zero fictionalisation', () => {
    for (const u of [lizOyerLucasUniverse, lizOyerWatergateUniverse] as unknown as Universe[]) {
      expect(u.type).toBe(UniverseType.SERIES);
      expect(u.realityRelation.type).toBe('interpretation');
      expect(u.realityRelation.fictionalizationDegree).toBe(0);
    }
  });

  test('the two events are documentary', () => {
    for (const u of [lucasIndictmentUniverse, watergateScandalUniverse, dojWatergateReviewUniverse]) {
      expect(u.type).toBe(UniverseType.HISTORICAL_EVENT);
      expect(u.realityRelation.type).toBe('documentary');
    }
  });

  test('the runtime is the metadata value, not the transcript end', () => {
    // The ticket listed 2:48 and 2:24 (the last spoken cues) and asked for the metadata value
    // before merge: 172 s and 146 s.
    expect(LIZ_OYER_LUCAS_RUNTIME_SECONDS).toBe(172);
    expect(LIZ_OYER_WATERGATE_RUNTIME_SECONDS).toBe(146);
    for (const [u, runtime] of [
      [lizOyerLucasUniverse, 172],
      [lizOyerWatergateUniverse, 146],
    ] as Array<[any, number]>) {
      const epoch: any = Object.values(u.layers[0].epochs)[0];
      expect((u.metadata as any).durationSeconds).toBe(runtime);
      expect(Number((BigInt(epoch.endTime) - BigInt(epoch.startTime)) / 1_000_000_000n)).toBe(runtime);
    }
  });

  test('segments are gapless and keyframes sit inside them', () => {
    for (const u of universes) {
      const segs = segments(u);
      expect(segs.length).toBeGreaterThan(0);
      for (let i = 1; i < segs.length; i += 1) {
        expect(segs[i].start).toBe(segs[i - 1].end);
      }
      const first = segs[0].start;
      const last = segs[segs.length - 1].end;
      for (const kf of keyframes(u)) {
        expect(kf.timestamp).toBeGreaterThanOrEqual(first);
        expect(kf.timestamp).toBeLessThanOrEqual(last);
      }
    }
  });

  test('every keyframe inside the runtime epoch is a real offset', () => {
    for (const u of [lizOyerLucasUniverse, lizOyerWatergateUniverse] as unknown as Universe[]) {
      const epoch: any = Object.values((u as any).layers[0].epochs)[0];
      for (const kf of keyframes(u)) {
        expect(kf.timestamp).toBeGreaterThanOrEqual(epoch.startTime);
        expect(kf.timestamp).toBeLessThanOrEqual(epoch.endTime);
      }
    }
  });

  test('every anchor and reference resolves', () => {
    const dangling: string[] = [];
    for (const u of universes) {
      for (const anchor of (u.realityRelation.realityAnchors ?? []) as any[]) {
        if (!registered.has(anchor.realEventId)) dangling.push(`${idOf(u)} anchor -> ${anchor.realEventId}`);
      }
      for (const ref of refs(u)) {
        if (!registered.has(ref.targetUniverseId)) dangling.push(`${idOf(u)} ref -> ${ref.targetUniverseId}`);
      }
    }
    expect(dangling).toEqual([]);
  });

  test('each short documents the event it comments on', () => {
    expect(
      (lizOyerLucasUniverse.realityRelation.realityAnchors ?? []).map((a: any) => a.realEventId),
    ).toContain(LUCAS_INDICTMENT_UNIVERSE_ID);
    expect(
      (lizOyerWatergateUniverse.realityRelation.realityAnchors ?? []).map((a: any) => a.realEventId),
    ).toContain(DOJ_WATERGATE_REVIEW_UNIVERSE_ID);
    // And the review is read against the scandal it revisits.
    expect(refs(dojWatergateReviewUniverse).map((r) => r.targetUniverseId)).toContain(
      WATERGATE_SCANDAL_UNIVERSE_ID,
    );
  });

  test('the "Nixon was framed" claim is a recreation layer, not a second Watergate', () => {
    const layer: any = (lizOyerWatergateUniverse as any).layers.find(
      (candidate: any) => candidate.layerId === 'nixon_was_framed',
    );
    expect(layer).toBeDefined();
    expect(layer.type).toBe('recreation');
    expect(layer.reality_correspondence.to).toBe(WATERGATE_SCANDAL_UNIVERSE_ID);
    expect(layer.reality_correspondence.accuracy).toBeLessThan(0.3);
    expect(layer.reality_correspondence.deviations.length).toBeGreaterThanOrEqual(2);
  });

  test('contested claims are keyframed below certainty 1', () => {
    const byId = (u: Universe, id: string) => keyframes(u).find((kf) => kf.id === id);
    // The timing claim in S1 and the OPR-inaction claim in S2 are the pair's contested ones.
    expect(byId(lizOyerLucasUniverse, 'election_timing').certainty).toBeLessThan(1);
    expect(byId(lizOyerWatergateUniverse, 'director_fired').certainty).toBeLessThan(1);
    // The single track caps the transcript, not the offsets.
    expect((lizOyerLucasUniverse.metadata as any).verification.confidence).toBe(0.8);
    expect((lizOyerWatergateUniverse.metadata as any).verification.confidence).toBe(0.8);
  });

  test('both shorts are contained, not parented twice', () => {
    for (const u of [lizOyerLucasUniverse, lizOyerWatergateUniverse] as unknown as Universe[]) {
      expect(parents(u).length).toBeGreaterThan(0);
      expect(parents(u)).toContain(CommonUniverseIds.US_HISTORY);
    }
  });

  test('the barrel exports exactly the two shorts', () => {
    expect(lizOyerShortsUniverses as unknown as Universe[]).toHaveLength(2);
  });
});
