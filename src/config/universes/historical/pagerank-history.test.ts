import { Universe, UniverseType } from '../../../core/types';
import { isValidUniverseId } from '../../../core/universe-ids';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { RealityGradientAnalyzer } from '../../../utils/reality-gradient';
import { allUniverses } from '../index';
import {
  PAGERANK_CONTAINER_ID,
  pagerankEraUniverses,
  pagerankHistoryContainerUniverse,
  pagerankHistoryUniverse,
  pagerankHistoryUniverses,
} from './pagerank-history';

/**
 * History of PageRank — james-gibson/local-time#93, decomposed under #103.
 *
 * The universe is no longer a 352-line literal: it is a container plus five era
 * members, all built through `UniverseBuilder`. The guards here are the ones the
 * decomposition makes possible and the ones it could break:
 *
 * - registration and a real lookup for every id (#27, #67);
 * - one membership per era, with the container's ancestors inherited (#74);
 * - the container's partition and each era's epoch/segment agree, because both
 *   come from one era table;
 * - every authored keyframe lands in exactly one era, inside that era's bounds;
 * - the container owns no keyframes (a moment belongs to one era, #76);
 * - the anchor resolves to a registered universe (the #129 lesson);
 * - every epoch carries an explicit `epochId` (#19);
 * - the whole namespace projects as documentary rather than fiction.
 */

const emptyLoader = { loadConfigurations: async () => [] } as unknown as ConfigLoader;

const idOf = (universe: Universe): string => String(universe.universeId);

const container = pagerankHistoryContainerUniverse;
const containerId = PAGERANK_CONTAINER_ID;
const eraIds = pagerankEraUniverses.map(idOf);

const epochsOf = (universe: Universe) =>
  (universe.layers ?? []).flatMap((layer) =>
    Object.entries(layer.epochs ?? {}).map(([key, epoch]) => ({
      label: `${layer.layerId}.${key}`,
      epochId: (epoch as { epochId?: string }).epochId,
      start: (epoch as { startTime?: bigint }).startTime,
      end: (epoch as { endTime?: bigint }).endTime,
    })),
  );

const segmentsOf = (universe: Universe) =>
  (universe.temporalStructure?.segments ?? []).map((segment) => ({
    id: segment.id,
    start: segment.start,
    end: segment.end,
    type: segment.type,
  }));

const keyframesOf = (universe: Universe) =>
  (universe.temporalStructure?.keyframes ?? []).map((keyframe) => ({
    id: keyframe.id,
    timestamp: keyframe.timestamp,
  }));

const ns = (iso: string): bigint => BigInt(new Date(iso).getTime()) * 1_000_000n;
const PRESENT = ns('2026-10-17T00:00:00Z');

/** The eleven moments the hand-authored literal carried, by id. */
const EXPECTED_KEYFRAMES = [
  'backrub_begins',
  'provisional_patent_filed',
  'patent_application_filed',
  'pagerank_paper_published',
  'anatomy_paper_published',
  'google_founded',
  'patent_granted',
  'topic_sensitive_pagerank',
  'nofollow_introduced',
  'toolbar_pagerank_retired',
  'patent_expired',
].sort();

describe('the PageRank container (#103)', () => {
  test('keeps the id the literal owned, and the primary identifier agrees with it', () => {
    expect(containerId).toBe('history:pagerank:1996');
    expect(container.universeId).toBe(containerId);
    expect(pagerankHistoryUniverse).toBe(container);
    expect(isValidUniverseId(containerId)).toBe(true);
    expect(container.type).toBe(UniverseType.HISTORICAL_EVENT);
    // A `identifiers.primary` that disagrees with `universeId` is a defect (#102 BUG-4).
    expect(container.identifiers.primary).toBe(containerId);
  });

  test('is registered once, and survives a real registry lookup', async () => {
    expect(allUniverses.filter((u) => idOf(u as Universe) === containerId)).toHaveLength(1);

    const registry = new UniverseRegistry(emptyLoader);
    await registry.initialize();

    expect(registry.getUniverse(containerId)).toBeDefined();
    // The container is reachable by its alias too, which is what a KB reference
    // or a query typed as "PageRank history" resolves through.
    expect(registry.getUniverse('PageRank history')?.universeId).toBe(containerId);
  });

  test('is contained by software engineering and world history', () => {
    const parents = (container.connections?.natural?.parentUniverses ?? []) as string[];
    expect(parents).toContain(CommonUniverseIds.SOFTWARE_ENGINEERING);
    expect(parents).toContain(CommonUniverseIds.WORLD_HISTORY);
    for (const parent of parents) expect(isValidUniverseId(parent)).toBe(true);
  });

  test('holds the five-phase partition, gapless, from 1996 to the present', () => {
    const segments = segmentsOf(container);

    expect(segments.map((segment) => segment.id)).toEqual([
      'inception',
      'publication',
      'commercialization',
      'patent_era',
      'post_patent',
    ]);
    expect(segments[0].start).toBe(ns('1996-01-01T00:00:00Z'));
    expect(segments[segments.length - 1].end).toBe(PRESENT);
    for (let i = 1; i < segments.length; i += 1) {
      expect(segments[i].start).toBe(segments[i - 1].end);
    }
  });

  test('owns no keyframes: a moment belongs to exactly one era (#76)', () => {
    expect(keyframesOf(container)).toEqual([]);
  });

  test('keeps the paper authors as a creator credit', () => {
    expect(container.metadata?.creators).toEqual([
      'Lawrence Page',
      'Sergey Brin',
      'Rajeev Motwani',
      'Terry Winograd',
    ]);
  });

  test('carries one explicit epoch for the whole run (#19)', () => {
    const epochs = epochsOf(container);
    expect(epochs).toHaveLength(1);
    expect(epochs[0].epochId).toBe('pagerank:1996:2026');
    expect(epochs[0].start).toBe(ns('1996-01-01T00:00:00Z'));
    expect(epochs[0].end).toBe(PRESENT);
  });
});

describe('the five era members (#103)', () => {
  test('the namespace is the container plus five eras, all with valid ids', () => {
    expect(pagerankHistoryUniverses).toHaveLength(6);
    expect(eraIds).toEqual([
      'history:pagerank:inception:1996',
      'history:pagerank:publication:1998',
      'history:pagerank:commercialization:1998',
      'history:pagerank:patent_era:2001',
      'history:pagerank:post_patent:2019',
    ]);
    for (const id of [containerId, ...eraIds]) expect(isValidUniverseId(id)).toBe(true);
  });

  test('every era is a member of the container, and inherits its ancestors', async () => {
    const registry = new UniverseRegistry(emptyLoader);
    await registry.initialize();

    for (const id of eraIds) {
      expect(registry.getMemberships(id).map(String)).toContain(containerId);
      expect(registry.contains(containerId, id)).toBe(true);
      // One membership, two inherited ancestors: the point of the container.
      expect(registry.contains(CommonUniverseIds.SOFTWARE_ENGINEERING, id)).toBe(true);
      expect(registry.contains(CommonUniverseIds.WORLD_HISTORY, id)).toBe(true);
    }
    expect(registry.getChildren(containerId).map(String).sort()).toEqual([...eraIds].sort());
  });

  test('every era is registered exactly once and retrievable', async () => {
    const registry = new UniverseRegistry(emptyLoader);
    await registry.initialize();

    for (const universe of pagerankEraUniverses) {
      const id = idOf(universe);
      expect(allUniverses.filter((u) => idOf(u as Universe) === id)).toHaveLength(1);
      expect(registry.getUniverse(id)).toBeDefined();
    }
  });

  test('each era declares exactly one membership — the container', () => {
    for (const universe of pagerankEraUniverses) {
      const parents = (universe.connections?.natural?.parentUniverses ?? []) as string[];
      expect(parents).toEqual([containerId]);
    }
  });

  test("each era's epoch and segment are the container's row for that era", () => {
    const containerSegments = segmentsOf(container);

    pagerankEraUniverses.forEach((universe, index) => {
      const epochs = epochsOf(universe);
      const segments = segmentsOf(universe);
      const expected = containerSegments[index];

      expect(epochs).toHaveLength(1);
      expect(epochs[0].epochId).toBeTruthy();
      expect(epochs[0].start).toBe(expected.start);
      expect(epochs[0].end).toBe(expected.end);

      expect(segments).toHaveLength(1);
      expect(segments[0].start).toBe(expected.start);
      expect(segments[0].end).toBe(expected.end);
      expect(segments[0].type).toBe(expected.type);
    });
  });

  test('the eras are contiguous and cover the container span exactly once', () => {
    const segments = segmentsOf(container);
    for (let i = 1; i < segments.length; i += 1) {
      expect(segments[i].start).toBe(segments[i - 1].end);
    }
  });

  test('the patent era is a legal_period, the rest are phases', () => {
    const byId = new Map(pagerankEraUniverses.map((universe) => [idOf(universe), universe]));
    expect(segmentsOf(byId.get('history:pagerank:patent_era:2001')!)[0].type).toBe('legal_period');
    expect(segmentsOf(byId.get('history:pagerank:inception:1996')!)[0].type).toBe('phase');
  });
});

describe('keyframes are authored once and land in exactly one era', () => {
  const allEraKeyframes = pagerankEraUniverses.flatMap((universe) =>
    keyframesOf(universe).map((keyframe) => ({ ...keyframe, universeId: idOf(universe) })),
  );

  test('all eleven moments survived the decomposition, none duplicated', () => {
    const ids = allEraKeyframes.map((keyframe) => keyframe.id).sort();
    expect(ids).toEqual(EXPECTED_KEYFRAMES);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every keyframe falls inside its own era, and nowhere else', () => {
    for (const universe of pagerankEraUniverses) {
      const [epoch] = epochsOf(universe);
      for (const keyframe of keyframesOf(universe)) {
        expect(keyframe.timestamp >= epoch.start!).toBe(true);
        expect(keyframe.timestamp < epoch.end!).toBe(true);
      }
    }
  });

  test('the expiry opens the post-patent era (the one-day fix)', () => {
    // The literal had `patent_expired` on 2019-06-04 inside an epoch that started
    // 2019-06-05. The boundary is now the expiry itself.
    const postPatent = pagerankEraUniverses.find(
      (universe) => idOf(universe) === 'history:pagerank:post_patent:2019',
    )!;
    const [epoch] = epochsOf(postPatent);

    expect(epoch.start).toBe(ns('2019-06-04T00:00:00Z'));
    expect(keyframesOf(postPatent).map((keyframe) => keyframe.id)).toEqual(['patent_expired']);
  });

  test('the publication era holds the paper that the era is named for', () => {
    const publication = pagerankEraUniverses.find(
      (universe) => idOf(universe) === 'history:pagerank:publication:1998',
    )!;

    expect(keyframesOf(publication).map((keyframe) => keyframe.id)).toEqual([
      'pagerank_paper_published',
      'anatomy_paper_published',
    ]);
  });
});

describe('anchors and projection', () => {
  const registeredIds = new Set(allUniverses.map((universe) => idOf(universe as Universe)));

  test('the container anchors only a universe that is registered', () => {
    const anchorIds = container.realityRelation.realityAnchors.map((anchor) => anchor.realEventId);

    expect(anchorIds).toEqual(['technology:world_wide_web:1989']);
    for (const id of anchorIds) expect(registeredIds.has(id)).toBe(true);
  });

  test('the eras add no anchors of their own — the anchor is shared context', () => {
    for (const universe of pagerankEraUniverses) {
      expect(universe.realityRelation.realityAnchors).toEqual([]);
    }
  });

  test('the container and every era project as documentary, not fiction', () => {
    for (const universe of pagerankHistoryUniverses) {
      expect(universe.realityRelation.type).toBe('documentary');
      expect(universe.realityRelation.fictionalizationDegree).toBe(0.0);
      expect(RealityGradientAnalyzer.analyzeUniverse(universe).level).toBeLessThanOrEqual(0.1);
    }
  });

  test('every id in the namespace is unique across allUniverses', () => {
    const ids = allUniverses.map((universe) => idOf(universe as Universe));
    expect(ids.length).toBe(new Set(ids).size);
  });
});
