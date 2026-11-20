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
  TALARICO_NATIONALISM_PUBLISHED,
  TALARICO_NATIONALISM_RUNTIME_SECONDS,
  TALARICO_NATIONALISM_UNIVERSE_ID,
  talaricoNationalismCaptionArtifacts,
  talaricoNationalismPhases,
  talaricoNationalismUniverse,
} from '../../src/config/universes/youtube';

/**
 * The content guard for the Talarico Christian-nationalism sermon.
 *
 * Registration is proved repo-wide by `defined-vs-registered.test.ts`. What that
 * guard cannot see is whether the record is coherent: one publication-anchored
 * clock of 1127 s, eight *editorial* phases (info.json publishes no chapters),
 * and sixty-six keyframes whose offsets are exact cue starts from the single
 * caption rendering. The two English tracks are byte-identical, so this test
 * also pins the 0.8 single-source confidence and the second-attempt verdict.
 */

const SEC = 1_000_000_000n;

const universe = talaricoNationalismUniverse as unknown as Universe & {
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
  Number(timestamp - TALARICO_NATIONALISM_PUBLISHED) / Number(SEC);

/** Exact `tStartMs / 1000` values from the caption track, read 2026-11-19. */
const measuredCueStarts = [
  67.88, 80.04, 87.759, 92.159, 96.52, 110.24, 114.84, 126.759, 150.64, 168.8,
  176.68, 183.799, 191.08, 196.08, 208.159, 222.319, 229.2, 234.36, 250.959, 257.919,
  279.8, 285.52, 292.72, 312.199, 320.56, 345.199, 351.44, 361.56, 374.639, 387.0,
  397.12, 415.879, 435.24, 448.16, 458.879, 468.159, 489.72, 503.44, 516.159, 523.68,
  536.2, 573.64, 583.64, 596.88, 613.56, 641.68, 668.44, 737.639, 763.839, 793.36,
  808.04, 828.519, 835.519, 851.36, 886.8, 894.639, 936.399, 945.8, 972.44, 990.399,
  1009.44, 1044.799, 1068.919, 1087.799, 1118.559,
];

describe('the Talarico Christian-nationalism sermon is a publication-anchored work (youtube:Blph_2RSBno)', () => {
  test('the id is a series id, produced by the factory and not merely well-formed', () => {
    expect(TALARICO_NATIONALISM_UNIVERSE_ID).toBe(
      createSeriesUniverseId('series', 'james_talarico_christian_nationalism_sermon', 2024),
    );
    expect(isSeriesUniverseId(TALARICO_NATIONALISM_UNIVERSE_ID)).toBe(true);
    expect(isValidUniverseId(TALARICO_NATIONALISM_UNIVERSE_ID)).toBe(true);
    expect(universe.universeId).toBe(TALARICO_NATIONALISM_UNIVERSE_ID);
  });

  test('it is registered and retrievable after initialize()', async () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    expect(registry.getUniverse(TALARICO_NATIONALISM_UNIVERSE_ID)).toBeDefined();
    expect(
      (allUniverses as unknown as unknown[]).some(
        (entry) =>
          (entry as { universeId?: string })?.universeId === TALARICO_NATIONALISM_UNIVERSE_ID,
      ),
    ).toBe(true);
  });

  test('one runtime epoch of 1127 s starting at the measured upload instant, not the delivery date', () => {
    expect(epoch).toBeDefined();
    expect(epoch.epochId).toBe(`${TALARICO_NATIONALISM_UNIVERSE_ID}:runtime`);
    expect(epoch.startTime).toBe(TALARICO_NATIONALISM_PUBLISHED);
    expect(epoch.endTime).toBe(
      TALARICO_NATIONALISM_PUBLISHED + BigInt(TALARICO_NATIONALISM_RUNTIME_SECONDS) * SEC,
    );
    expect(epoch.precision).toBe(TimePrecision.SECOND);
    expect(universe.metadata.durationSeconds).toBe(TALARICO_NATIONALISM_RUNTIME_SECONDS);
    expect(TALARICO_NATIONALISM_RUNTIME_SECONDS).toBe(1127);
    expect(new Date(Number(TALARICO_NATIONALISM_PUBLISHED / 1_000_000n)).toISOString()).toBe(
      '2024-03-28T01:28:40.000Z',
    );
    const verification = universe.metadata.verification as {
      measured: { delivered: string; published: string };
    };
    expect(verification.measured.published).toBe('2024-03-28T01:28:40Z');
    expect(verification.measured.delivered).toBe('2023-10-22');
  });

  test('eight editorial phases are gapless and cover the runtime; none claim to be published chapters', () => {
    const { segments } = universe.temporalStructure;

    expect(segments).toHaveLength(8);
    expect(segments.map((segment) => segment.id)).toEqual(
      talaricoNationalismPhases.map((phase) => phase.id),
    );
    expect(segments[0].start).toBe(TALARICO_NATIONALISM_PUBLISHED);
    expect(segments[segments.length - 1].end).toBe(epoch.endTime);
    expect(segments.every((segment) => segment.type === 'phase')).toBe(true);

    for (let i = 1; i < segments.length; i += 1) {
      expect(segments[i].start).toBe(segments[i - 1].end);
      expect(segments[i].start).toBeGreaterThan(segments[i - 1].start);
    }

    expect(universe.metadata.phases).toEqual(
      talaricoNationalismPhases.map((phase) => ({ ...phase })),
    );
    const verification = universe.metadata.verification as {
      measured: { publishedChapterCount: number };
    };
    expect(verification.measured.publishedChapterCount).toBe(0);
  });

  test('every keyframe sits inside the epoch and offsets strictly increase', () => {
    const { keyframes } = universe.temporalStructure;

    expect(keyframes).toHaveLength(66);
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
    expect(offsets[offsets.length - 1]).toBeLessThan(1125.48);
    expect(offsets[offsets.length - 1]).toBeLessThanOrEqual(TALARICO_NATIONALISM_RUNTIME_SECONDS);
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

  test('the thesis keyframes sit at their stated offsets', () => {
    const { keyframes } = universe.temporalStructure;

    const cancer = keyframes.find((keyframe) => keyframe.id === 'cancer_on_our_religion');
    expect(cancer).toBeDefined();
    expect(offsetSeconds(cancer!.timestamp)).toBeCloseTo(92.159, 3);
    expect(cancer!.significance).toBeGreaterThan(0.9);

    const inversion = keyframes.find((keyframe) => keyframe.id === 'inverts_power');
    expect(inversion).toBeDefined();
    expect(offsetSeconds(inversion!.timestamp)).toBeCloseTo(613.56, 3);
    expect(inversion!.significance).toBeGreaterThan(0.9);

    const control = keyframes.find((keyframe) => keyframe.id === 'opposite_of_faith_is_control');
    expect(control).toBeDefined();
    expect(offsetSeconds(control!.timestamp)).toBeCloseTo(763.839, 3);
    expect(control!.significance).toBeGreaterThan(0.9);
  });

  test('the work is an interpretation with one declared container', () => {
    const relation = universe.realityRelation;
    expect(relation.type).toBe('interpretation');
    expect(relation.fictionalizationDegree).toBe(0);
    expect(relation.realityAnchors).toEqual([]);
    expect(universe.connections?.natural?.parentUniverses).toEqual([
      CommonUniverseIds.US_GOVERNANCE,
    ]);
  });

  test('the single rendering is recorded with the 0.8 cap and a recommended second attempt', () => {
    const verification = universe.metadata.verification as {
      confidence: number;
      scope: { start: number; end: number };
      secondAttempt: { recommended: boolean; attempted: string; why: string };
      measured: {
        publishedChapterCount: number;
        captionEvents: number;
        captionWords: number;
        firstSpokenCueSeconds: number;
        lastSpokenCueSeconds: number;
      };
    };

    expect(verification.confidence).toBe(0.8);
    expect(verification.scope).toEqual({ start: 0, end: 1127 });
    expect(verification.secondAttempt.recommended).toBe(true);
    expect(verification.secondAttempt.attempted).toContain('byte-identical');
    expect(verification.secondAttempt.why).toContain('0.80');
    expect(verification.measured.publishedChapterCount).toBe(0);
    expect(verification.measured.captionEvents).toBe(378);
    expect(verification.measured.captionWords).toBe(2099);
    expect(verification.measured.firstSpokenCueSeconds).toBe(22.88);
    expect(verification.measured.lastSpokenCueSeconds).toBe(1125.48);
  });

  test('caption repairs are marked single-source rather than invented as a second track', () => {
    expect(talaricoNationalismCaptionArtifacts).toHaveLength(10);
    expect(talaricoNationalismCaptionArtifacts.every((entry) => entry.enUs === null)).toBe(true);
    expect(universe.metadata.captionArtifacts).toBe(talaricoNationalismCaptionArtifacts);

    const roe = talaricoNationalismCaptionArtifacts.find((entry) => entry.atSeconds === 208.159);
    expect(roe).toBeDefined();
    expect(roe!.enOrig).toContain('overturned Road');
    expect(roe!.reading).toContain('overturned Roe');
  });
});
