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
  PLC_PROGRAMMING_10_LESSONS_PUBLISHED,
  PLC_PROGRAMMING_10_LESSONS_RUNTIME_SECONDS,
  PLC_PROGRAMMING_10_LESSONS_UNIVERSE_ID,
  plcProgramming10LessonsCaptionArtifacts,
  plcProgramming10LessonsChapters,
  plcProgramming10LessonsUniverse,
} from '../../src/config/universes/youtube';

/**
 * The content guard for the 20:01 PLC-programming talk.
 *
 * info.json publishes 11 chapters (introduction plus ten lessons); with 85
 * keyframes — the metadata zero-point plus 84 exact cue starts. The secondary
 * English track 429\'d on every attempt, so the single-source verdict is asserted too.
 */

type RuntimeEpoch = NonNullable<NonNullable<Universe['layers']>[number]['epochs']>[string];

/** The generated module is cast through `unknown` to its literal shape, as in the sibling guards. */
const universe = plcProgramming10LessonsUniverse as unknown as Universe & {
  temporalStructure: {
    segments: Array<{ id: string; start: bigint; end: bigint; type: string }>;
    keyframes: Array<{
      id: string;
      timestamp: bigint;
      description?: string;
      certainty?: number;
      precision?: TimePrecision;
      type?: KeyframeType;
    }>;
  };
  metadata: Record<string, unknown>;
};
const epoch = universe.layers![0].epochs!.runtime as RuntimeEpoch;
const SEC = 1_000_000_000n;

const offsetSeconds = (timestamp: bigint): number =>
  Number(timestamp - PLC_PROGRAMMING_10_LESSONS_PUBLISHED) / Number(SEC);

/** Exact `tStartMs / 1000` values from the automatic track, read 2026-11-19. */
const measuredCueStarts = [
  13.76, 19.28, 32.439, 51.44, 60.92, 71.92, 89.08, 107.76, 139.36, 162.68, 177.08, 193.882, 210.72,
  220.28, 236.6, 247.44, 263.68, 275.32, 285.44, 297.68, 311.64, 317.8, 327.6, 335.4, 345.84, 369.28,
  378.96, 390.04, 412.52, 417.6, 431.44, 444.12, 467.12, 488.76, 510.64, 526.0, 538.8, 552.32, 565.24,
  581.48, 609.64, 620.36, 640.36, 660.72, 666.96, 686.28, 698.52, 713.72, 747.08, 754.48, 765.4, 776.4,
  795.28, 809.88, 824.16, 831.36, 840.68, 858.92, 877.68, 885.92, 902.44, 923.2, 930.8, 947.64, 958.0,
  968.28, 974.36, 1001.56, 1011.839, 1024.04, 1032.839, 1045.199, 1052.56, 1059.2, 1068.04, 1078.92,
  1091.76, 1101.0, 1111.52, 1122.16, 1143.56, 1165.6, 1177.28, 1200.6,
];

describe('the PLC-programming lessons are a publication-anchored work (youtube:3cNdaWl_7dY)', () => {
  test('the id is a series id, produced by the factory and not merely well-formed', () => {
    expect(PLC_PROGRAMMING_10_LESSONS_UNIVERSE_ID).toBe(
      createSeriesUniverseId('series', 'plc_programming_10_lessons', 2026),
    );
    expect(isSeriesUniverseId(PLC_PROGRAMMING_10_LESSONS_UNIVERSE_ID)).toBe(true);
    expect(isValidUniverseId(PLC_PROGRAMMING_10_LESSONS_UNIVERSE_ID)).toBe(true);
    expect(universe.universeId).toBe(PLC_PROGRAMMING_10_LESSONS_UNIVERSE_ID);
  });

  test('it is registered and retrievable after initialize()', async () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    expect(registry.getUniverse(PLC_PROGRAMMING_10_LESSONS_UNIVERSE_ID)).toBeDefined();
    expect(
      (allUniverses as unknown as unknown[]).some(
        (entry) =>
          (entry as { universeId?: string })?.universeId === PLC_PROGRAMMING_10_LESSONS_UNIVERSE_ID,
      ),
    ).toBe(true);
  });

  test('one runtime epoch of 1201 s starting at the measured upload instant', () => {
    expect(epoch.epochId).toBe(`${PLC_PROGRAMMING_10_LESSONS_UNIVERSE_ID}:runtime`);
    expect(epoch.startTime).toBe(PLC_PROGRAMMING_10_LESSONS_PUBLISHED);
    expect(epoch.endTime).toBe(
      PLC_PROGRAMMING_10_LESSONS_PUBLISHED +
        BigInt(PLC_PROGRAMMING_10_LESSONS_RUNTIME_SECONDS) * SEC,
    );
    expect(epoch.precision).toBe(TimePrecision.SECOND);
    expect(universe.metadata.durationSeconds).toBe(PLC_PROGRAMMING_10_LESSONS_RUNTIME_SECONDS);
    expect(PLC_PROGRAMMING_10_LESSONS_RUNTIME_SECONDS).toBe(1201);
    expect(new Date(Number(PLC_PROGRAMMING_10_LESSONS_PUBLISHED / 1_000_000n)).toISOString()).toBe(
      '2026-10-19T20:13:00.000Z',
    );
  });

  test('11 published chapters are gapless and cover the runtime', () => {
    const { segments } = universe.temporalStructure;

    expect(segments).toHaveLength(11);
    expect(segments.map((segment) => segment.id)).toEqual(
      plcProgramming10LessonsChapters.map((chapter) => chapter.id),
    );
    expect(universe.metadata.chapters).toEqual(
      plcProgramming10LessonsChapters.map((chapter) => ({ ...chapter })),
    );
    expect(segments[0].start).toBe(PLC_PROGRAMMING_10_LESSONS_PUBLISHED);
    expect(segments[segments.length - 1].end).toBe(epoch.endTime);
    expect(segments.every((segment) => segment.type === 'phase')).toBe(true);
    for (let i = 1; i < segments.length; i += 1) {
      expect(segments[i].start).toBe(segments[i - 1].end);
      expect(segments[i].start).toBeGreaterThan(segments[i - 1].start);
    }
    expect(plcProgramming10LessonsChapters.map((chapter) => chapter.startSeconds)).toEqual([
      0.0, 69.0, 220.0, 311.0, 411.0, 526.0, 659.0, 824.0, 860.0, 969.0, 1054.0,
    ]);
    expect(plcProgramming10LessonsChapters.map((chapter) => chapter.endSeconds)).toEqual([
      69.0, 220.0, 311.0, 411.0, 526.0, 659.0, 824.0, 860.0, 969.0, 1054.0, 1201.0,
    ]);
  });

  test('every keyframe sits inside the epoch and offsets strictly increase', () => {
    const { keyframes } = universe.temporalStructure;

    expect(keyframes).toHaveLength(85);
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
    expect(offsets[offsets.length - 1]).toBe(1200.6);
    expect(offsets[offsets.length - 1]).toBeLessThanOrEqual(
      PLC_PROGRAMMING_10_LESSONS_RUNTIME_SECONDS,
    );
  });

  test('each published chapter carries at least one keyframe', () => {
    const { segments, keyframes } = universe.temporalStructure;
    for (const segment of segments) {
      const inside = keyframes.filter(
        (keyframe) => keyframe.timestamp >= segment.start && keyframe.timestamp < segment.end,
      );
      expect(inside.length).toBeGreaterThan(0);
    }
  });

  test('the opening frame, the signal-path lesson and the handover close are pinned', () => {
    const { keyframes } = universe.temporalStructure;
    const at = (id: string) => keyframes.find((keyframe) => keyframe.id === id);
    const opening = at('published')!;
    expect(offsetSeconds(opening.timestamp)).toBeCloseTo(0, 3);
    expect(opening.description).toContain('ladder logic instruction');
    for (const interpretation of universe.metadata.interpretations as Array<{
      id: string;
      statedAtSeconds: number;
    }>) {
      expect(interpretation.statedAtSeconds).toBeGreaterThan(0);
      expect(
        keyframes.some(
          (keyframe) => offsetSeconds(keyframe.timestamp) === interpretation.statedAtSeconds,
        ),
      ).toBe(true);
    }
    const publication = keyframes.find((keyframe) => keyframe.id === 'published');
    expect(publication!.type).toBe(KeyframeType.RELEASE);
    expect(publication!.certainty).toBe(1);
  });

  test('0 caption repairs, all at exact cue starts, and a single-source verdict', () => {
    // The single caption track needed no repair; do not invent a normalisation.
    expect(plcProgramming10LessonsCaptionArtifacts).toHaveLength(0);
    const verification = universe.metadata.verification as unknown as {
      confidence: number;
      secondAttempt: { recommended: boolean; attempted: string };
    };
    expect(verification.confidence).toBe(0.8);
    expect(verification.secondAttempt.recommended).toBe(true);
    expect(verification.secondAttempt.attempted).toContain('HTTP 429');
    expect(universe.connections!.natural!.parentUniverses).toContain(CommonUniverseIds.SOFTWARE_ENGINEERING);
  });
});
