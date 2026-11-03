import { allUniverses } from '../index';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { UniverseType, KeyframeType } from '../../../core/types';
import { isSeriesUniverseId, isValidUniverseId } from '../../../core/universe-ids';
import {
  anchorWatchHegseth20261026Universe,
  anchorWatchPresumedAnchors,
  anchorWatchRealityAnchors,
  anchorWatchReferences,
  anchorWatchDiscussionPoints,
  anchorWatchSegments,
  anchorWatchKeyframes,
  ANCHOR_WATCH_EPISODE_ID,
  AIR_START_UTC_NS,
  RUNTIME_SECONDS,
} from './anchor-watch-2026-10-26';
import { ANCHOR_WATCH_SERIES_ID } from './anchor-watch';
import { IRAN_WAR_2026_ID } from '../global-politics/iran-war';
import { ISRAELI_ELECTION_2026_ID } from '../global-politics/israeli-election-2026';
import { RUSSIA_UKRAINE_WAR_2022_ID } from '../global-politics/russia-ukraine-war';
import { FORTRESS_PROGRAM_2026_ID } from '../us-politics/fortress';

/**
 * james-gibson/local-time#212 — the youtube/ namespace registration guard, plus the
 * Anchor Watch episode's structural invariants.
 *
 * Membership is not registration (#27, #67, #98): a universe in `allUniverses` can still
 * be skipped by `loadBuiltInUniverses` on a bad id. Each assertion here is a lookup, not
 * a read of the array.
 */

const NS = 1_000_000_000n;
const at = (mmss: string): bigint => {
  const [m, s] = mmss.split(':').map(Number);
  return AIR_START_UTC_NS + BigInt(m * 60 + s) * NS;
};

const episode = anchorWatchHegseth20261026Universe as unknown as {
  universeId: string;
  type: UniverseType;
  temporalStructure: {
    segments: Array<{ id: string; start: bigint; end: bigint; type: string }>;
    keyframes: Array<{ id: string; timestamp: bigint; type?: KeyframeType }>;
    windows: { strategy: string; avgWindowSize?: bigint };
  };
  layers: Array<{ epochs: Record<string, { epochId?: string }> }>;
  connections: { natural: { parentUniverses: string[] } };
  metadata: {
    threadSiblings?: string[];
    discussionPoints?: Array<{ claimKind?: string; verification?: { status?: string } }>;
  };
};

describe('the youtube/ namespace registers every universe', () => {
  let registry: UniverseRegistry;
  let registered: Set<string>;

  beforeAll(async () => {
    registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    registered = new Set(allUniverses.map((u) => String((u as { universeId: string }).universeId)));
  });

  test('the episode and its series are both in allUniverses and retrievable', () => {
    expect(registered.has(ANCHOR_WATCH_EPISODE_ID)).toBe(true);
    expect(registered.has(ANCHOR_WATCH_SERIES_ID)).toBe(true);

    expect(registry.getUniverse(ANCHOR_WATCH_EPISODE_ID)).toBeDefined();
    expect(registry.getUniverse(ANCHOR_WATCH_SERIES_ID)).toBeDefined();
  });

  test('the episode is a declared series id, not a catch-all accident', () => {
    expect(isSeriesUniverseId(ANCHOR_WATCH_EPISODE_ID)).toBe(true);
    expect(isValidUniverseId(ANCHOR_WATCH_EPISODE_ID)).toBe(true);
  });

  test('the episode is a member of its series (containment, not a second copy)', () => {
    expect(episode.type).toBe(UniverseType.SERIES);
    expect(episode.connections.natural.parentUniverses).toEqual([ANCHOR_WATCH_SERIES_ID]);
    expect(registry.getOwner(ANCHOR_WATCH_EPISODE_ID)?.universeId).toBe(ANCHOR_WATCH_EPISODE_ID);
    expect(registry.getParentChain(ANCHOR_WATCH_EPISODE_ID)).toContain(ANCHOR_WATCH_SERIES_ID);
  });
});

describe('the Anchor Watch episode structure', () => {
  test('12 segments tile 0:00–55:52 with no gap or overlap', () => {
    expect(anchorWatchSegments).toHaveLength(12);
    const segments = episode.temporalStructure.segments;

    expect(segments[0].start).toBe(at('0:00'));
    for (let i = 0; i < segments.length; i++) {
      expect(segments[i].type).toBe('sequence');
      if (i > 0) expect(segments[i].start).toBe(segments[i - 1].end);
    }
    expect(segments[segments.length - 1].end).toBe(AIR_START_UTC_NS + BigInt(RUNTIME_SECONDS) * NS);
  });

  test('the window strategy is time_based with a bigint avgWindowSize', () => {
    expect(episode.temporalStructure.windows.strategy).toBe('time_based');
    expect(typeof episode.temporalStructure.windows.avgWindowSize).toBe('bigint');
  });

  test('every epoch has an explicit epochId', () => {
    for (const layer of episode.layers) {
      for (const epoch of Object.values(layer.epochs)) {
        expect(epoch.epochId).toBeTruthy();
      }
    }
  });

  test('all 18 keyframes derive from the air instant and use KeyframeType members', () => {
    expect(anchorWatchKeyframes).toHaveLength(18);
    for (const keyframe of episode.temporalStructure.keyframes) {
      expect(keyframe.timestamp).toBeGreaterThanOrEqual(AIR_START_UTC_NS);
      expect(keyframe.timestamp).toBeLessThanOrEqual(AIR_START_UTC_NS + BigInt(RUNTIME_SECONDS) * NS);
      if (keyframe.type !== undefined) {
        expect(Object.values(KeyframeType)).toContain(keyframe.type);
      }
    }
  });
});

describe('the discussion-point ledger', () => {
  test('25 rows, each with a claim kind and a verification status', () => {
    expect(anchorWatchDiscussionPoints).toHaveLength(25);
    for (const point of anchorWatchDiscussionPoints) {
      expect(point.claimKind).toBeTruthy();
      expect(point.verification.status).toBeTruthy();
    }
  });

  test('predictions are excluded, never laundered into facts', () => {
    const predictions = anchorWatchDiscussionPoints.filter(
      (point) => point.claimKind === 'prediction',
    );
    expect(predictions).toHaveLength(2);
    for (const point of predictions) {
      expect(point.verification.status).toBe('excluded');
    }
  });
});

describe('Phase 2 event universes and resolved edges (#212, #431)', () => {
  let registry: UniverseRegistry;
  let registered: Set<string>;

  beforeAll(async () => {
    registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    registered = new Set(allUniverses.map((u) => String((u as { universeId: string }).universeId)));
  });

  test('all four Phase-2 universes are registered and retrievable', () => {
    const phase2Ids = [
      IRAN_WAR_2026_ID,
      ISRAELI_ELECTION_2026_ID,
      FORTRESS_PROGRAM_2026_ID,
      RUSSIA_UKRAINE_WAR_2022_ID,
    ];
    for (const id of phase2Ids) {
      expect(registered.has(id)).toBe(true);
      expect(registry.getUniverse(id)).toBeDefined();
    }
  });

  test('the episode converts its threadSiblings into resolved references and anchors, with FORTRESS as contradicts', () => {
    expect(episode.metadata.threadSiblings ?? []).toEqual([]);
    expect(anchorWatchPresumedAnchors).toEqual([]);

    expect(anchorWatchReferences.map((ref) => `${ref.type}:${ref.targetUniverseId}`)).toEqual([
      `DOCUMENTS:${IRAN_WAR_2026_ID}`,
      `DOCUMENTS:${ISRAELI_ELECTION_2026_ID}`,
      `CONTRADICTS:${FORTRESS_PROGRAM_2026_ID}`,
      `DOCUMENTS:${RUSSIA_UKRAINE_WAR_2022_ID}`,
    ]);

    for (const ref of anchorWatchReferences) {
      expect(registered.has(ref.targetUniverseId)).toBe(true);
    }

    const fortressAnchor = anchorWatchRealityAnchors.find(
      (anchor) => anchor.realEventId === FORTRESS_PROGRAM_2026_ID,
    );
    expect(fortressAnchor?.relationshipType).toBe('contradicts');
    for (const anchor of anchorWatchRealityAnchors) {
      expect(registered.has(anchor.realEventId)).toBe(true);
    }
  });

  test('no threadSiblings or presumed anchor id is left pointing at a registered universe', () => {
    for (const id of episode.metadata.threadSiblings ?? []) {
      expect(registered.has(id)).toBe(false);
    }
    for (const anchor of anchorWatchPresumedAnchors) {
      expect(registered.has(anchor.realEventId)).toBe(false);
    }
  });
});
