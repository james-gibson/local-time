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
  EVERY_WAY_EVANGELICAL_CHRISTIANITY_PUBLISHED,
  EVERY_WAY_EVANGELICAL_CHRISTIANITY_RUNTIME_SECONDS,
  EVERY_WAY_EVANGELICAL_CHRISTIANITY_UNIVERSE_ID,
  everyWayEvangelicalChristianityCaptionArtifacts,
  everyWayEvangelicalChristianityPhases,
  everyWayEvangelicalChristianityUniverse,
} from '../../src/config/universes/youtube';

/**
 * The content guard for the 4:42:08 autobiographical compilation.
 *
 * info.json publishes only one empty "Intro" chapter, so the editorial phases
 * are measured here instead, with 234 keyframes — the metadata zero-point plus
 * 233 exact cue starts. Both requested English renderings were byte-identical,
 * so the single-source verdict is asserted too.
 */

type RuntimeEpoch = NonNullable<NonNullable<Universe['layers']>[number]['epochs']>[string];

/** The generated module is cast through `unknown` to its literal shape, as in the sibling guards. */
const universe = everyWayEvangelicalChristianityUniverse as unknown as Universe & {
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
  Number(timestamp - EVERY_WAY_EVANGELICAL_CHRISTIANITY_PUBLISHED) / Number(SEC);

/** Exact `tStartMs / 1000` values from the automatic track, read 2026-11-19. */
const measuredCueStarts = [
  0.24, 16.72, 38.96, 73.68, 91.28, 101.52, 190.56, 302.56, 428.88, 492.879, 531.92, 564.56, 616.88,
  634.959, 673.6, 706.88, 736.56, 788.959, 903.519, 946.639, 984.639, 1008.56, 1025.919, 1306.48,
  1392.96, 1563.12, 1609.12, 1677.279, 1800.64, 1843.679, 1999.919, 2051.44, 2170.0, 2346.48, 2416.4,
  2474.319, 2618.24, 2640.48, 2702.0, 2734.88, 2862.64, 2922.16, 3007.04, 3078.72, 3154.48, 3221.119,
  3269.76, 3323.119, 3393.119, 3596.4, 3636.559, 3797.039, 3830.319, 3932.88, 3962.48, 4063.119, 4090.0,
  4154.719, 4195.92, 4201.36, 4286.08, 4323.76, 4416.96, 4506.0, 4582.96, 4642.239, 4705.12, 4846.88,
  5116.639, 5156.639, 5179.92, 5218.4, 5247.36, 5298.08, 5326.239, 5416.159, 5483.52, 5630.159, 5736.32,
  5790.48, 5886.639, 5903.679, 5930.88, 5979.28, 6027.84, 6082.0, 6139.199, 6235.6, 6307.52, 6384.32,
  6446.639, 6486.08, 6528.239, 6547.119, 6744.48, 6794.56, 6810.159, 6827.52, 6896.08, 6919.92, 7059.599,
  7102.239, 7194.08, 7229.04, 7350.639, 7410.48, 7514.719, 7653.119, 7681.76, 7700.719, 7813.92, 7864.0,
  7922.4, 8042.639, 8225.04, 8298.08, 8379.679, 8406.479, 8488.64, 8559.04, 8631.439, 8686.24, 8758.88,
  8862.16, 8946.16, 8986.16, 9039.439, 9122.08, 9205.84, 9286.479, 9391.12, 9469.359, 9511.84, 9595.84,
  9666.319, 9693.439, 9800.64, 9867.52, 9951.04, 10069.12, 10161.68, 10240.88, 10308.08, 10391.2,
  10475.92, 10565.359, 10631.92, 10677.92, 10705.68, 10805.92, 10830.72, 10912.96, 10951.84, 11014.399,
  11073.76, 11131.6, 11197.76, 11237.12, 11340.08, 11427.279, 11489.279, 11596.16, 11647.12, 11751.84,
  11805.12, 11882.56, 11972.319, 12069.12, 12126.319, 12214.8, 12306.56, 12368.72, 12446.96, 12536.319,
  12596.319, 12601.359, 12679.04, 12739.12, 12800.96, 12868.56, 12938.0, 13044.72, 13102.08, 13216.239,
  13301.439, 13341.12, 13446.479, 13531.6, 13593.6, 13657.359, 13741.04, 13800.96, 13900.72, 13962.08,
  14000.239, 14109.439, 14209.52, 14275.6, 14290.56, 14337.84, 14469.439, 14535.84, 14562.96, 14715.439,
  14801.04, 14867.359, 14917.52, 14966.88, 15050.399, 15064.479, 15117.279, 15228.8, 15446.08, 15478.159,
  15623.92, 15763.68, 15833.359, 15874.239, 15917.04, 15996.0, 16059.04, 16080.319, 16156.159, 16189.52,
  16255.359, 16314.64, 16453.52, 16479.84, 16605.359, 16652.16, 16684.48, 16865.12, 16925.68,
];

describe('the evangelical-autobiography compilation is a publication-anchored work (youtube:EvBKPWcHqrs)', () => {
  test('the id is a series id, produced by the factory and not merely well-formed', () => {
    expect(EVERY_WAY_EVANGELICAL_CHRISTIANITY_UNIVERSE_ID).toBe(
      createSeriesUniverseId('series', 'every_way_evangelical_christianity_ruined_my_life', 2026),
    );
    expect(isSeriesUniverseId(EVERY_WAY_EVANGELICAL_CHRISTIANITY_UNIVERSE_ID)).toBe(true);
    expect(isValidUniverseId(EVERY_WAY_EVANGELICAL_CHRISTIANITY_UNIVERSE_ID)).toBe(true);
    expect(universe.universeId).toBe(EVERY_WAY_EVANGELICAL_CHRISTIANITY_UNIVERSE_ID);
  });

  test('it is registered and retrievable after initialize()', async () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    expect(registry.getUniverse(EVERY_WAY_EVANGELICAL_CHRISTIANITY_UNIVERSE_ID)).toBeDefined();
    expect(
      (allUniverses as unknown as unknown[]).some(
        (entry) =>
          (entry as { universeId?: string })?.universeId === EVERY_WAY_EVANGELICAL_CHRISTIANITY_UNIVERSE_ID,
      ),
    ).toBe(true);
  });

  test('one runtime epoch of 16928 s starting at the measured upload instant', () => {
    expect(epoch.epochId).toBe(`${EVERY_WAY_EVANGELICAL_CHRISTIANITY_UNIVERSE_ID}:runtime`);
    expect(epoch.startTime).toBe(EVERY_WAY_EVANGELICAL_CHRISTIANITY_PUBLISHED);
    expect(epoch.endTime).toBe(
      EVERY_WAY_EVANGELICAL_CHRISTIANITY_PUBLISHED +
        BigInt(EVERY_WAY_EVANGELICAL_CHRISTIANITY_RUNTIME_SECONDS) * SEC,
    );
    expect(epoch.precision).toBe(TimePrecision.SECOND);
    expect(universe.metadata.durationSeconds).toBe(EVERY_WAY_EVANGELICAL_CHRISTIANITY_RUNTIME_SECONDS);
    expect(EVERY_WAY_EVANGELICAL_CHRISTIANITY_RUNTIME_SECONDS).toBe(16928);
    expect(new Date(Number(EVERY_WAY_EVANGELICAL_CHRISTIANITY_PUBLISHED / 1_000_000n)).toISOString()).toBe(
      '2026-11-17T17:06:53.000Z',
    );
  });

  test('40 editorial phases are gapless and cover the runtime, not a chapter list', () => {
    const { segments } = universe.temporalStructure;

    expect(segments).toHaveLength(40);
    expect(segments.map((segment) => segment.id)).toEqual(
      everyWayEvangelicalChristianityPhases.map((phase) => phase.id),
    );
    expect(universe.metadata.phases).toEqual(
      everyWayEvangelicalChristianityPhases.map((phase) => ({ ...phase })),
    );
    expect(segments[0].start).toBe(EVERY_WAY_EVANGELICAL_CHRISTIANITY_PUBLISHED);
    expect(segments[segments.length - 1].end).toBe(epoch.endTime);
    expect(segments.every((segment) => segment.type === 'phase')).toBe(true);
    for (let i = 1; i < segments.length; i += 1) {
      expect(segments[i].start).toBe(segments[i - 1].end);
      expect(segments[i].start).toBeGreaterThan(segments[i - 1].start);
    }
    expect(everyWayEvangelicalChristianityPhases.map((phase) => phase.startSeconds)).toEqual([
      0.0, 101.52, 428.88, 736.56, 946.639, 1306.48, 1563.12, 2431.839, 3078.72, 3596.4, 4201.36, 4679.12, 5218.4, 5717.84, 6010.0, 6463.44, 6888.96, 7167.84, 7596.239, 8042.639, 8400.24, 8745.68, 9013.52, 9144.56, 9450.399, 9899.439, 10361.359, 10701.04, 11113.68, 12312.319, 12601.359, 12739.12, 13216.239, 13615.439, 14162.8, 14535.84, 14958.16, 15614.319, 16059.04, 16605.359,
    ]);
    expect(everyWayEvangelicalChristianityPhases.map((phase) => phase.endSeconds)).toEqual([
      101.52, 428.88, 736.56, 946.639, 1306.48, 1563.12, 2431.839, 3078.72, 3596.4, 4201.36, 4679.12, 5218.4, 5717.84, 6010.0, 6463.44, 6888.96, 7167.84, 7596.239, 8042.639, 8400.24, 8745.68, 9013.52, 9144.56, 9450.399, 9899.439, 10361.359, 10701.04, 11113.68, 12312.319, 12601.359, 12739.12, 13216.239, 13615.439, 14162.8, 14535.84, 14958.16, 15614.319, 16059.04, 16605.359, 16928.0,
    ]);
  });

  test('every keyframe sits inside the epoch and offsets strictly increase', () => {
    const { keyframes } = universe.temporalStructure;

    expect(keyframes).toHaveLength(234);
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
    expect(offsets[offsets.length - 1]).toBe(16925.68);
    expect(offsets[offsets.length - 1]).toBeLessThanOrEqual(
      EVERY_WAY_EVANGELICAL_CHRISTIANITY_RUNTIME_SECONDS,
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

  test('the framing, the myth-making claim and the closing political turn are pinned', () => {
    const { keyframes } = universe.temporalStructure;
    const at = (id: string) => keyframes.find((keyframe) => keyframe.id === id);
    const opening = at("a_opening_premise")!;
    expect(offsetSeconds(opening.timestamp)).toBeCloseTo(0.24, 3);
    const thesis = keyframes.find(
      (keyframe) => offsetSeconds(keyframe.timestamp) === 73.68,
    );
    expect(thesis).toBeDefined();
    const myth = keyframes.find(
      (keyframe) => offsetSeconds(keyframe.timestamp) === 1800.64,
    );
    expect(myth).toBeDefined();
    const politics = keyframes.find(
      (keyframe) => offsetSeconds(keyframe.timestamp) === 16479.84,
    );
    expect(politics).toBeDefined();
    const publication = keyframes.find((keyframe) => keyframe.id === 'published');
    expect(publication!.type).toBe(KeyframeType.RELEASE);
    expect(publication!.certainty).toBe(1);
  });

  test('caption artifacts are exact cue starts and the verdict stays single-source', () => {
    expect(everyWayEvangelicalChristianityCaptionArtifacts.map((a) => a.atSeconds)).toEqual([
      40.719, 993.199, 2139.839, 2414.24, 2449.76, 3082.079, 7657.679, 9899.439, 15887.84,
    ]);
    expect(everyWayEvangelicalChristianityCaptionArtifacts.every((a) => a.enUs === null)).toBe(true);
    const verification = universe.metadata.verification as unknown as {
      confidence: number;
      secondAttempt: { recommended: boolean };
    };
    expect(verification.confidence).toBe(0.8);
    expect(verification.secondAttempt.recommended).toBe(true);
    expect(universe.connections!.natural!.parentUniverses).toContain(CommonUniverseIds.US_HISTORY);
  });
});
