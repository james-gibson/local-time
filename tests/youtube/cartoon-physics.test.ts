import { allUniverses } from '../../src/config/universes';
import { ConfigLoader } from '../../src/config/config-loader';
import { UniverseRegistry } from '../../src/config/universe-registry';
import { CommonUniverseIds } from '../../src/core/common-universe-ids';
import {
  createSeriesUniverseId,
  isSeriesUniverseId,
  isValidUniverseId,
} from '../../src/core/universe-ids';
import { KeyframeType, TimePrecision, Universe } from '../../src/core/types';
import {
  CARTOON_PHYSICS_PUBLISHED,
  CARTOON_PHYSICS_RUNTIME_SECONDS,
  CARTOON_PHYSICS_UNIVERSE_ID,
  cartoonPhysicsCaptionArtifacts,
  cartoonPhysicsChapters,
  cartoonPhysicsPresumedAnchors,
  cartoonPhysicsUniverse,
} from '../../src/config/universes/youtube';

/**
 * The content guard for the BigBlueBackpack cartoon-physics essay.
 *
 * Registration is proved repo-wide by `src/config/__tests__/defined-vs-registered.test.ts`.
 * What that guard cannot see is whether the record is coherent: one publication-anchored
 * clock of 615 s, five gapless chapter segments, keyframes that sit inside the epoch and
 * strictly increase, and a transcript whose offsets came from a cue start rather than from
 * a reflowed paragraph. Those are pinned here.
 */

const SEC = 1_000_000_000n;

const universe = cartoonPhysicsUniverse as unknown as Universe & {
  temporalStructure: {
    segments: Array<{ id: string; start: bigint; end: bigint; type: string }>;
    keyframes: Array<{
      id: string;
      timestamp: bigint;
      significance: number;
      certainty?: number;
      tags: string[];
      description?: string;
      type?: KeyframeType;
      precision?: TimePrecision;
    }>;
    windows: { strategy: string };
  };
  metadata: Record<string, unknown>;
};

const epoch = (universe.layers.find((layer) => (layer as { layerId?: string }).layerId === 'primary_layer') as unknown as {
  epochs: Record<string, { epochId?: string; startTime?: bigint; endTime?: bigint; precision?: TimePrecision }>;
}).epochs.runtime;

/** Seconds from the publication instant, fractional. */
const offsetSeconds = (timestamp: bigint): number =>
  Number(timestamp - CARTOON_PHYSICS_PUBLISHED) / Number(SEC);

describe('the cartoon-physics essay is a publication-anchored work (youtube:G5dFEqC46rw)', () => {
  test('the id is a series id, produced by the factory and not merely well-formed', () => {
    expect(CARTOON_PHYSICS_UNIVERSE_ID).toBe(
      createSeriesUniverseId(
        'series',
        'cartoon_physics_are_more_logical_than_you_think',
        2023,
      ),
    );
    expect(isSeriesUniverseId(CARTOON_PHYSICS_UNIVERSE_ID)).toBe(true);
    expect(isValidUniverseId(CARTOON_PHYSICS_UNIVERSE_ID)).toBe(true);
    expect(universe.universeId).toBe(CARTOON_PHYSICS_UNIVERSE_ID);
  });

  test('it is registered and retrievable after initialize()', async () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    expect(registry.getUniverse(CARTOON_PHYSICS_UNIVERSE_ID)).toBeDefined();
    expect(
      (allUniverses as unknown as unknown[]).some(
        (entry) =>
          (entry as { universeId?: string })?.universeId === CARTOON_PHYSICS_UNIVERSE_ID,
      ),
    ).toBe(true);
  });

  test('one runtime epoch of 615 s, starting at the measured upload instant', () => {
    expect(epoch).toBeDefined();
    expect(epoch.epochId).toBe(
      'youtube:cartoon_physics_are_more_logical_than_you_think:runtime',
    );
    expect(epoch.startTime).toBe(CARTOON_PHYSICS_PUBLISHED);
    expect(epoch.endTime).toBe(CARTOON_PHYSICS_PUBLISHED + BigInt(CARTOON_PHYSICS_RUNTIME_SECONDS) * SEC);
    expect(epoch.precision).toBe(TimePrecision.SECOND);
    expect(universe.metadata.durationSeconds).toBe(CARTOON_PHYSICS_RUNTIME_SECONDS);
    expect(CARTOON_PHYSICS_RUNTIME_SECONDS).toBe(615);
  });

  test('the five published chapters become five gapless segments that cover the runtime', () => {
    const { segments } = universe.temporalStructure;

    expect(segments).toHaveLength(5);
    expect(segments.map((segment) => segment.id)).toEqual(
      cartoonPhysicsChapters.map((chapter) => chapter.id),
    );
    expect(segments[0].start).toBe(CARTOON_PHYSICS_PUBLISHED);
    expect(segments[segments.length - 1].end).toBe(epoch.endTime);
    expect(segments.every((segment) => segment.type === 'phase')).toBe(true);

    for (let i = 1; i < segments.length; i += 1) {
      expect(segments[i].start).toBe(segments[i - 1].end);
      expect(segments[i].start).toBeGreaterThan(segments[i - 1].start);
    }

    // The chapter list published by the channel, in seconds.
    expect(cartoonPhysicsChapters.map((chapter) => chapter.startSeconds)).toEqual([
      0, 85, 182, 351, 429,
    ]);
  });

  test('every keyframe sits inside the epoch and the offsets strictly increase', () => {
    const { keyframes } = universe.temporalStructure;

    expect(keyframes).toHaveLength(19);

    const ids = keyframes.map((keyframe) => keyframe.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const keyframe of keyframes) {
      expect(keyframe.timestamp).toBeGreaterThanOrEqual(epoch.startTime!);
      expect(keyframe.timestamp).toBeLessThan(epoch.endTime!);
      expect(keyframe.description?.length ?? 0).toBeGreaterThan(0);
      expect(keyframe.certainty).toBeGreaterThan(0);
      expect(keyframe.precision).toBe(TimePrecision.SECOND);
    }

    const offsets = keyframes.map((keyframe) => offsetSeconds(keyframe.timestamp));
    expect(offsets[0]).toBe(0);
    for (let i = 1; i < offsets.length; i += 1) {
      expect(offsets[i]).toBeGreaterThan(offsets[i - 1]);
    }
  });

  test('each chapter carries at least one keyframe, and none is placed after the runtime', () => {
    const { segments, keyframes } = universe.temporalStructure;

    for (const segment of segments) {
      const inside = keyframes.filter(
        (keyframe) => keyframe.timestamp >= segment.start && keyframe.timestamp < segment.end,
      );
      expect(inside.length).toBeGreaterThan(0);
    }

    const trackTail = 614.259;
    expect(Math.max(...keyframes.map((keyframe) => offsetSeconds(keyframe.timestamp)))).toBeLessThanOrEqual(
      CARTOON_PHYSICS_RUNTIME_SECONDS,
    );
    // The essay's last line is the closing quotation, and it is on the record. The final
    // ~25 s are the outro: the track's last spoken cue is at 589.92 s and its final event
    // is an 18.4 s [Music] cue ending at 614.259 s.
    expect(keyframes[keyframes.length - 1].id).toBe('closing_callback');
    const closingOffset = offsetSeconds(keyframes[keyframes.length - 1].timestamp);
    expect(closingOffset).toBeGreaterThan(CARTOON_PHYSICS_RUNTIME_SECONDS - 60);
    expect(closingOffset).toBeLessThan(589.92);
    expect(closingOffset).toBeLessThan(trackTail);
  });

  test('the thesis is a keyframe at its stated offset, not only in the prose', () => {
    const thesis = universe.temporalStructure.keyframes.find(
      (keyframe) => keyframe.id === 'thesis_not_random',
    );

    expect(thesis).toBeDefined();
    expect(offsetSeconds(thesis!.timestamp)).toBeCloseTo(23.12, 2);
    expect(thesis!.tags).toContain('thesis');
    expect(thesis!.significance).toBe(1);
    expect(thesis!.certainty).toBeLessThanOrEqual(0.95);
  });

  test('the work is an interpretation with no invented facts, and one container', () => {
    const relation = universe.realityRelation;
    expect(relation.type).toBe('interpretation');
    expect(relation.fictionalizationDegree).toBe(0);

    expect(universe.connections?.natural?.parentUniverses).toEqual([
      CommonUniverseIds.HOLLYWOOD_SYSTEM,
    ]);
  });
});

describe('the three analysed works are presumed, not declared', () => {
  test('the ledger and the anchors are the same three ids', () => {
    expect(cartoonPhysicsPresumedAnchors).toHaveLength(3);
    const ledger = universe.metadata.presumed as Array<{
      universeId: string;
      hydration: string;
      contributesCharge: boolean;
    }>;

    expect(ledger.map((entry) => entry.universeId)).toEqual(
      cartoonPhysicsPresumedAnchors.map((anchor) => anchor.realEventId),
    );
    expect(ledger.every((entry) => entry.hydration === 'presumed')).toBe(true);
    expect(ledger.every((entry) => entry.contributesCharge === false)).toBe(true);
  });

  test('a presumed id is well-formed and still unregistered', async () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();

    for (const anchor of cartoonPhysicsPresumedAnchors) {
      expect(isValidUniverseId(anchor.realEventId)).toBe(true);
      // The day one of these is authored, this fails — which is the reminder to flip
      // `hydration` rather than a silent entry into the charge graph.
      expect(registry.getUniverse(anchor.realEventId)).toBeUndefined();
    }
  });
});

describe('the caption artifacts are recorded, not normalised away', () => {
  test('the quoted cartoon line is the one the two tracks disagree about', () => {
    const artifact = cartoonPhysicsCaptionArtifacts.find(
      (entry) => entry.atSeconds === 409.76,
    );

    expect(artifact).toBeDefined();
    expect(artifact!.enOrig).toContain('audacious bacon powder');
    expect(artifact!.enUs).toContain('baking powder');
    expect(artifact!.enUs).toContain('"');
    expect(artifact!.reading).toBe('A dash of baking powder…');
  });

  test('the term spelling disagreement is kept as a second artifact', () => {
    const artifact = cartoonPhysicsCaptionArtifacts.find(
      (entry) => entry.atSeconds === 210.44,
    );

    expect(artifact).toBeDefined();
    expect(artifact!.enOrig).toContain('butt monkey');
    expect(artifact!.enUs).toContain('butt-monkey');
  });

  test('the artifacts are also linked from metadata, so they survive a field-level read', () => {
    expect(universe.metadata.captionArtifacts).toBe(cartoonPhysicsCaptionArtifacts);
  });
});
