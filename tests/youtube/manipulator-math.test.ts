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
  MANIPULATOR_MATH_PUBLISHED,
  MANIPULATOR_MATH_RUNTIME_SECONDS,
  MANIPULATOR_MATH_UNIVERSE_ID,
  manipulatorMathCaptionArtifacts,
  manipulatorMathChapters,
  manipulatorMathUniverse,
} from '../../src/config/universes/youtube';

/**
 * The content guard for the braintruffle market-manipulation explainer.
 *
 * Registration is proved repo-wide by `defined-vs-registered.test.ts`. What that
 * guard cannot see is whether the record is coherent: one publication-anchored
 * clock of 1885 s, the six *published* chapters from info.json (not invented
 * phases), and fifty-two keyframes whose offsets are exact cue starts from the
 * automatic track. The human-authored track is a genuine second rendering, so
 * this test also pins the 0.9 confidence and the recorded disagreements.
 */

const SEC = 1_000_000_000n;

const universe = manipulatorMathUniverse as unknown as Universe & {
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
  Number(timestamp - MANIPULATOR_MATH_PUBLISHED) / Number(SEC);

/** Exact `tStartMs / 1000` values from the automatic track, read 2026-11-19. */
const measuredCueStarts = [
  1.199, 11.759, 23.519, 35.76, 46.96, 66.799, 82.4, 112.0, 119.28, 148.08,
  187.28, 194.72, 235.44, 283.6, 354.4, 369.12, 453.919, 466.479, 512.24, 593.2,
  675.2, 739.68, 770.48, 802.32, 899.36, 906.079, 942.0, 983.6, 1035.679, 1063.2,
  1099.28, 1131.84, 1159.24, 1197.2, 1251.84, 1270.4, 1304.88, 1333.6, 1393.84, 1432.08,
  1462.88, 1493.52, 1519.76, 1569.84, 1588.48, 1649.919, 1689.6, 1717.76, 1726.399, 1761.039,
  1788.24,
];

describe('the manipulator-math explainer is a publication-anchored work (youtube:-jF9gW2r_bk)', () => {
  test('the id is a series id, produced by the factory and not merely well-formed', () => {
    expect(MANIPULATOR_MATH_UNIVERSE_ID).toBe(
      createSeriesUniverseId('series', 'the_manipulators_sneaky_math_to_beat_chaos', 2025),
    );
    expect(isSeriesUniverseId(MANIPULATOR_MATH_UNIVERSE_ID)).toBe(true);
    expect(isValidUniverseId(MANIPULATOR_MATH_UNIVERSE_ID)).toBe(true);
    expect(universe.universeId).toBe(MANIPULATOR_MATH_UNIVERSE_ID);
  });

  test('it is registered and retrievable after initialize()', async () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    expect(registry.getUniverse(MANIPULATOR_MATH_UNIVERSE_ID)).toBeDefined();
    expect(
      (allUniverses as unknown as unknown[]).some(
        (entry) =>
          (entry as { universeId?: string })?.universeId === MANIPULATOR_MATH_UNIVERSE_ID,
      ),
    ).toBe(true);
  });

  test('one runtime epoch of 1885 s starting at the measured upload instant', () => {
    expect(epoch).toBeDefined();
    expect(epoch.epochId).toBe(`${MANIPULATOR_MATH_UNIVERSE_ID}:runtime`);
    expect(epoch.startTime).toBe(MANIPULATOR_MATH_PUBLISHED);
    expect(epoch.endTime).toBe(
      MANIPULATOR_MATH_PUBLISHED + BigInt(MANIPULATOR_MATH_RUNTIME_SECONDS) * SEC,
    );
    expect(epoch.precision).toBe(TimePrecision.SECOND);
    expect(universe.metadata.durationSeconds).toBe(MANIPULATOR_MATH_RUNTIME_SECONDS);
    expect(MANIPULATOR_MATH_RUNTIME_SECONDS).toBe(1885);
    expect(new Date(Number(MANIPULATOR_MATH_PUBLISHED / 1_000_000n)).toISOString()).toBe(
      '2025-04-24T14:25:42.000Z',
    );
  });

  test('six published chapters are gapless and cover the runtime, verbatim from info.json', () => {
    const { segments } = universe.temporalStructure;

    expect(segments).toHaveLength(6);
    expect(segments.map((segment) => segment.id)).toEqual(
      manipulatorMathChapters.map((chapter) => chapter.id),
    );
    expect(universe.metadata.chapters).toEqual(manipulatorMathChapters.map((chapter) => ({ ...chapter })));
    expect(segments[0].start).toBe(MANIPULATOR_MATH_PUBLISHED);
    expect(segments[segments.length - 1].end).toBe(epoch.endTime);
    expect(segments.every((segment) => segment.type === 'phase')).toBe(true);

    for (let i = 1; i < segments.length; i += 1) {
      expect(segments[i].start).toBe(segments[i - 1].end);
      expect(segments[i].start).toBeGreaterThan(segments[i - 1].start);
    }

    expect(manipulatorMathChapters.map((chapter) => chapter.startSeconds)).toEqual([
      0, 145, 507, 939, 1228, 1462,
    ]);
    expect(manipulatorMathChapters.map((chapter) => chapter.endSeconds)).toEqual([
      145, 507, 939, 1228, 1462, 1885,
    ]);
    expect(manipulatorMathChapters.map((chapter) => chapter.title)).toEqual([
      'FOREX Case',
      'Market Simulator',
      'Random Dynamics',
      'Self-Trading & Price-Setting',
      'Manipulation Cycle',
      'Hidden in Plain Sight',
    ]);
  });

  test('every keyframe sits inside the epoch and offsets strictly increase', () => {
    const { keyframes } = universe.temporalStructure;

    expect(keyframes).toHaveLength(52);
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
    expect(offsets[offsets.length - 1]).toBeLessThan(1882.72);
    expect(offsets[offsets.length - 1]).toBeLessThanOrEqual(MANIPULATOR_MATH_RUNTIME_SECONDS);
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

  test('the pivot and the monopoly claim are keyframes at their stated offsets', () => {
    const { keyframes } = universe.temporalStructure;

    const pivot = keyframes.find((keyframe) => keyframe.id === 'only_variable_is_you');
    expect(pivot).toBeDefined();
    expect(offsetSeconds(pivot!.timestamp)).toBeCloseTo(899.36, 3);
    expect(pivot!.significance).toBeGreaterThan(0.9);

    const monopoly = keyframes.find((keyframe) => keyframe.id === 'monopoly_power');
    expect(monopoly).toBeDefined();
    expect(offsetSeconds(monopoly!.timestamp)).toBeCloseTo(1159.24, 3);
    expect(monopoly!.significance).toBeGreaterThan(0.9);
  });

  test('the work is an interpretation with one declared container', () => {
    const relation = universe.realityRelation;
    expect(relation.type).toBe('interpretation');
    expect(relation.fictionalizationDegree).toBe(0);
    expect(relation.realityAnchors).toEqual([]);
    expect(universe.connections?.natural?.parentUniverses).toEqual([
      CommonUniverseIds.GLOBAL_ECONOMY,
    ]);
  });

  test('the two distinct tracks are recorded with the 0.9 ceiling and no second attempt', () => {
    const verification = universe.metadata.verification as {
      confidence: number;
      scope: { start: number; end: number };
      secondAttempt: { recommended: boolean; attempted: string };
      measured: {
        publishedChapterCount: number;
        captionEventsAutomatic: number;
        captionEventsManual: number;
      };
    };

    expect(verification.confidence).toBe(0.9);
    expect(verification.scope).toEqual({ start: 0, end: 1885 });
    expect(verification.secondAttempt.recommended).toBe(false);
    expect(verification.secondAttempt.attempted).toContain('they differ');
    expect(verification.measured.publishedChapterCount).toBe(6);
    expect(verification.measured.captionEventsAutomatic).toBe(768);
    expect(verification.measured.captionEventsManual).toBe(591);
  });

  test('track disagreements are recorded as readings, with both renderings present', () => {
    expect(manipulatorMathCaptionArtifacts).toHaveLength(9);
    expect(universe.metadata.captionArtifacts).toBe(manipulatorMathCaptionArtifacts);
    expect(
      manipulatorMathCaptionArtifacts.every((entry) => entry.enOrig && entry.enUs && entry.reading),
    ).toBe(true);

    const nod = manipulatorMathCaptionArtifacts.find((entry) => entry.atSeconds === 1797.279);
    expect(nod).toBeDefined();
    expect(nod!.enOrig).toContain('a not to their work');
    expect(nod!.enUs).toContain('a nod to their work');
    expect(nod!.reading).toContain('a nod to their work');
  });
});
