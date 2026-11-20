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
  FUNDAMENTALIST_CONSPIRACIES_PUBLISHED,
  FUNDAMENTALIST_CONSPIRACIES_RUNTIME_SECONDS,
  FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID,
  fundamentalistConspiraciesCaptionArtifacts,
  fundamentalistConspiraciesPhases,
  fundamentalistConspiraciesUniverse,
} from '../../src/config/universes/youtube';

/**
 * The content guard for the fundamentalist-homeschooler conspiracy testimony.
 *
 * Registration is proved repo-wide by `defined-vs-registered.test.ts`. What that
 * guard cannot see is whether the record is coherent: one publication-anchored
 * clock of 3589 s, fourteen explicitly editorial phases (info.json publishes a
 * single empty "Intro" chapter, not a chapter list), and seventy keyframes —
 * the metadata zero-point plus sixty-eight exact cue starts. Both requested
 * English renderings were byte-identical, so this test also pins the 0.8
 * single-source confidence, the recommended second attempt and the ten context
 * repairs recorded with enUs:null.
 */

const SEC = 1_000_000_000n;

const universe = fundamentalistConspiraciesUniverse as unknown as Universe & {
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

const epoch = (
  universe.layers.find(
    (layer) => (layer as { layerId?: string }).layerId === 'primary_layer',
  ) as unknown as {
    epochs: Record<
      string,
      {
        epochId?: string;
        startTime?: bigint;
        endTime?: bigint;
        precision?: TimePrecision;
      }
    >;
  }
).epochs.runtime;

const offsetSeconds = (timestamp: bigint): number =>
  Number(timestamp - FUNDAMENTALIST_CONSPIRACIES_PUBLISHED) / Number(SEC);

/** Exact `tStartMs / 1000` values from the automatic track, read 2026-11-19. */
const measuredCueStarts = [
  4.24, 18.0, 41.36, 42.879, 112.399, 131.599, 160.319, 265.759, 276.56, 342.24,
  399.28, 486.56, 513.44, 554.959, 689.12, 710.079, 736.639, 818.72, 881.199, 898.24,
  954.639, 962.48, 1024.24, 1171.679, 1210.16, 1258.08, 1290.48, 1329.28, 1436.08, 1514.72,
  1547.76, 1573.039, 1703.279, 1801.84, 1831.039, 1867.36, 2014.24, 2075.839,
  2121.52, 2155.76, 2221.599, 2369.599, 2383.52, 2425.92, 2486.4, 2546.72, 2571.92,
  2592.0, 2671.839, 2725.2, 2807.599, 2876.56, 2960.64, 3030.319, 3082.079,
  3112.8, 3181.76, 3188.079, 3234.8, 3257.76, 3312.88, 3331.359, 3352.079,
  3360.559, 3444.72, 3495.04, 3511.28, 3542.16, 3576.64,
];

describe('the fundamentalist-homeschooler testimony is a publication-anchored work (youtube:LS6CNpSwpEs)', () => {
  test('the id is a series id, produced by the factory and not merely well-formed', () => {
    expect(FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID).toBe(
      createSeriesUniverseId('series', 'every_conspiracy_theory_fundamentalist_homeschooler', 2025),
    );
    expect(isSeriesUniverseId(FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID)).toBe(true);
    expect(isValidUniverseId(FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID)).toBe(true);
    expect(universe.universeId).toBe(FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID);
  });

  test('it is registered and retrievable after initialize()', async () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    expect(registry.getUniverse(FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID)).toBeDefined();
    expect(
      (allUniverses as unknown as unknown[]).some(
        (entry) =>
          (entry as { universeId?: string })?.universeId === FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID,
      ),
    ).toBe(true);
  });

  test('one runtime epoch of 3589 s starting at the measured upload instant', () => {
    expect(epoch).toBeDefined();
    expect(epoch.epochId).toBe(`${FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID}:runtime`);
    expect(epoch.startTime).toBe(FUNDAMENTALIST_CONSPIRACIES_PUBLISHED);
    expect(epoch.endTime).toBe(
      FUNDAMENTALIST_CONSPIRACIES_PUBLISHED +
        BigInt(FUNDAMENTALIST_CONSPIRACIES_RUNTIME_SECONDS) * SEC,
    );
    expect(epoch.precision).toBe(TimePrecision.SECOND);
    expect(universe.metadata.durationSeconds).toBe(FUNDAMENTALIST_CONSPIRACIES_RUNTIME_SECONDS);
    expect(FUNDAMENTALIST_CONSPIRACIES_RUNTIME_SECONDS).toBe(3589);
    expect(new Date(Number(FUNDAMENTALIST_CONSPIRACIES_PUBLISHED / 1_000_000n)).toISOString()).toBe(
      '2025-08-29T16:25:11.000Z',
    );
  });

  test('fourteen editorial phases are gapless and cover the runtime, not a chapter list', () => {
    const { segments } = universe.temporalStructure;

    expect(segments).toHaveLength(14);
    expect(segments.map((segment) => segment.id)).toEqual(
      fundamentalistConspiraciesPhases.map((phase) => phase.id),
    );
    expect(universe.metadata.phases).toEqual(
      fundamentalistConspiraciesPhases.map((phase) => ({ ...phase })),
    );
    expect(segments[0].start).toBe(FUNDAMENTALIST_CONSPIRACIES_PUBLISHED);
    expect(segments[segments.length - 1].end).toBe(epoch.endTime);
    expect(segments.every((segment) => segment.type === 'phase')).toBe(true);

    for (let i = 1; i < segments.length; i += 1) {
      expect(segments[i].start).toBe(segments[i - 1].end);
      expect(segments[i].start).toBeGreaterThan(segments[i - 1].start);
    }

    expect(fundamentalistConspiraciesPhases.map((phase) => phase.startSeconds)).toEqual([
      0, 42.879, 276.56, 689.12, 898.24, 1258.08, 1514.72, 1831.039, 2383.52,
      2592.0, 3030.319, 3234.8, 3331.359, 3511.28,
    ]);
    expect(fundamentalistConspiraciesPhases.map((phase) => phase.endSeconds)).toEqual([
      42.879, 276.56, 689.12, 898.24, 1258.08, 1514.72, 1831.039, 2383.52,
      2592.0, 3030.319, 3234.8, 3331.359, 3511.28, 3589,
    ]);
  });

  test('every keyframe sits inside the epoch and offsets strictly increase', () => {
    const { keyframes } = universe.temporalStructure;

    expect(keyframes).toHaveLength(70);
    const ids = keyframes.map((keyframe) => keyframe.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const keyframe of keyframes) {
      expect(keyframe.timestamp).toBeGreaterThanOrEqual(epoch.startTime!);
      expect(keyframe.timestamp).toBeLessThan(epoch.endTime!);
      expect(keyframe.description?.length ?? 0).toBeGreaterThan(0);
      expect(keyframe.certainty).toBeGreaterThan(0);
      expect(keyframe.certainty).toBeLessThanOrEqual(1);
      expect(keyframe.precision).toBe(TimePrecision.SECOND);
      expect(keyframe.type).toBeDefined();
    }

    const offsets = keyframes.map((keyframe) => offsetSeconds(keyframe.timestamp));
    expect(offsets[0]).toBe(0);
    for (let i = 1; i < offsets.length; i += 1) {
      expect(offsets[i]).toBeGreaterThan(offsets[i - 1]);
    }
  });

  test('every keyframe offset is an exact measured cue start, not a guessed position', () => {
    const offsets = universe.temporalStructure.keyframes.map((keyframe) =>
      offsetSeconds(keyframe.timestamp),
    );

    expect(offsets.slice(1)).toEqual(measuredCueStarts);
    expect(offsets[offsets.length - 1]).toBeLessThan(3587.359);
    expect(offsets[offsets.length - 1]).toBeLessThanOrEqual(
      FUNDAMENTALIST_CONSPIRACIES_RUNTIME_SECONDS,
    );
  });

  test('each editorial phase carries at least one keyframe', () => {
    const { segments, keyframes } = universe.temporalStructure;

    for (const segment of segments) {
      const inside = keyframes.filter(
        (keyframe) => keyframe.timestamp >= segment.start && keyframe.timestamp < segment.end,
      );
      expect(inside.length).toBeGreaterThan(0);
    }
  });

  test('the controlling thesis, the RFID mark and the identity claim are keyframes at their stated offsets', () => {
    const { keyframes } = universe.temporalStructure;

    const grand = keyframes.find((keyframe) => keyframe.id === 'grand_conspiracy');
    expect(grand).toBeDefined();
    expect(offsetSeconds(grand!.timestamp)).toBeCloseTo(265.759, 3);
    expect(grand!.significance).toBeGreaterThan(0.9);

    const rfid = keyframes.find((keyframe) => keyframe.id === 'rfid_mark');
    expect(rfid).toBeDefined();
    expect(offsetSeconds(rfid!.timestamp)).toBeCloseTo(1258.08, 3);
    expect(rfid!.significance).toBeGreaterThan(0.9);

    const identity = keyframes.find((keyframe) => keyframe.id === 'identity_differentiation');
    expect(identity).toBeDefined();
    expect(offsetSeconds(identity!.timestamp)).toBeCloseTo(3352.079, 3);
    expect(identity!.significance).toBeGreaterThan(0.9);
  });

  test('the work is an interpretation with one declared container', () => {
    const relation = universe.realityRelation;
    expect(relation.type).toBe('interpretation');
    expect(relation.fictionalizationDegree).toBe(0);
    expect(relation.realityAnchors).toEqual([]);
    expect(universe.connections?.natural?.parentUniverses).toEqual([
      CommonUniverseIds.US_HISTORY,
    ]);
  });

  test('byte-identical tracks get the 0.8 single-source cap and a recommended second attempt', () => {
    const verification = universe.metadata.verification as {
      confidence: number;
      scope: { start: number; end: number };
      secondAttempt: { recommended: boolean; attempted: string };
      measured: {
        publishedChapterCount: number;
        captionEvents: number;
        captionWords: number;
      };
    };

    expect(verification.confidence).toBe(0.8);
    expect(verification.scope).toEqual({ start: 0, end: 3589 });
    expect(verification.secondAttempt.recommended).toBe(true);
    expect(verification.secondAttempt.attempted).toContain('byte-identical');
    expect(verification.measured.publishedChapterCount).toBe(1);
    expect(verification.measured.captionEvents).toBe(1496);
    expect(verification.measured.captionWords).toBe(10114);
  });

  test('single-source repairs are recorded with enUs:null, never an invented second reading', () => {
    expect(fundamentalistConspiraciesCaptionArtifacts).toHaveLength(10);
    expect(universe.metadata.captionArtifacts).toBe(fundamentalistConspiraciesCaptionArtifacts);
    expect(
      fundamentalistConspiraciesCaptionArtifacts.every(
        (entry) => entry.enOrig && entry.enUs === null && entry.reading,
      ),
    ).toBe(true);

    const abeka = fundamentalistConspiraciesCaptionArtifacts.find(
      (entry) => entry.atSeconds === 3033.68,
    );
    expect(abeka).toBeDefined();
    expect(abeka!.enOrig).toContain('Abeca');
    expect(abeka!.reading).toContain('Abeka');
  });
});
