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
  WHITE_BOOMERS_PUBLISHED,
  WHITE_BOOMERS_RUNTIME_SECONDS,
  WHITE_BOOMERS_UNIVERSE_ID,
  whiteBoomersCaptionArtifacts,
  whiteBoomersPhases,
  whiteBoomersUniverse,
} from '../../src/config/universes/youtube';

/**
 * The content guard for the David Hoffman / Theodore Roszak clip.
 *
 * Registration is proved repo-wide by `defined-vs-registered.test.ts`. What that
 * guard cannot see is whether the record is coherent: one publication-anchored
 * clock of 351 s, eight gapless *editorial* phases (the channel publishes no
 * chapters), and twenty-four keyframes whose offsets are exact cue starts from
 * the single caption rendering. The two English tracks are byte-identical, so
 * this test also pins the single-source confidence and the second-attempt verdict.
 */

const SEC = 1_000_000_000n;

const universe = whiteBoomersUniverse as unknown as Universe & {
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
  Number(timestamp - WHITE_BOOMERS_PUBLISHED) / Number(SEC);

/** Exact `tStartMs / 1000` values from the caption rendering, read 2026-11-19. */
const measuredCueStarts = [
  4.7, 31.289, 38.579, 67.29, 84.09, 108.119, 114.45, 129.36, 143.73, 154.26,
  167.459, 184.2, 193.02, 218.51, 228.78, 240.57, 253.11, 273.88, 286.03, 293.169,
  315.61, 327.789, 339.219,
];

describe('the Roszak baby-boomer clip is a publication-anchored work (youtube:gXro9FaNkIU)', () => {
  test('the id is a series id, produced by the factory and not merely well-formed', () => {
    expect(WHITE_BOOMERS_UNIVERSE_ID).toBe(
      createSeriesUniverseId('series', 'the_white_baby_boomers_had_so_much_money', 2018),
    );
    expect(isSeriesUniverseId(WHITE_BOOMERS_UNIVERSE_ID)).toBe(true);
    expect(isValidUniverseId(WHITE_BOOMERS_UNIVERSE_ID)).toBe(true);
    expect(universe.universeId).toBe(WHITE_BOOMERS_UNIVERSE_ID);
  });

  test('it is registered and retrievable after initialize()', async () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    expect(registry.getUniverse(WHITE_BOOMERS_UNIVERSE_ID)).toBeDefined();
    expect(
      (allUniverses as unknown as unknown[]).some(
        (entry) =>
          (entry as { universeId?: string })?.universeId === WHITE_BOOMERS_UNIVERSE_ID,
      ),
    ).toBe(true);
  });

  test('one runtime epoch of 351 s starting at the measured upload instant', () => {
    expect(epoch).toBeDefined();
    expect(epoch.epochId).toBe(`${WHITE_BOOMERS_UNIVERSE_ID}:runtime`);
    expect(epoch.startTime).toBe(WHITE_BOOMERS_PUBLISHED);
    expect(epoch.endTime).toBe(
      WHITE_BOOMERS_PUBLISHED + BigInt(WHITE_BOOMERS_RUNTIME_SECONDS) * SEC,
    );
    expect(epoch.precision).toBe(TimePrecision.SECOND);
    expect(universe.metadata.durationSeconds).toBe(WHITE_BOOMERS_RUNTIME_SECONDS);
    expect(WHITE_BOOMERS_RUNTIME_SECONDS).toBe(351);
    expect(new Date(Number(WHITE_BOOMERS_PUBLISHED / 1_000_000n)).toISOString()).toBe(
      '2018-11-08T14:17:22.000Z',
    );
  });

  test('eight editorial phases are gapless and cover the runtime; no chapters are claimed', () => {
    const { segments } = universe.temporalStructure;

    expect(segments).toHaveLength(8);
    expect(segments.map((segment) => segment.id)).toEqual(
      whiteBoomersPhases.map((phase) => phase.id),
    );
    expect(universe.metadata.chapters).toEqual([]);
    expect(universe.metadata.phases).toEqual(whiteBoomersPhases.map((phase) => ({ ...phase })));
    expect(segments[0].start).toBe(WHITE_BOOMERS_PUBLISHED);
    expect(segments[segments.length - 1].end).toBe(epoch.endTime);
    expect(segments.every((segment) => segment.type === 'phase')).toBe(true);

    for (let i = 1; i < segments.length; i += 1) {
      expect(segments[i].start).toBe(segments[i - 1].end);
      expect(segments[i].start).toBeGreaterThan(segments[i - 1].start);
    }

    expect(whiteBoomersPhases.map((phase) => phase.startSeconds)).toEqual([
      0, 38.579, 84.09, 138.6, 152.13, 198.57, 258.63, 290.8,
    ]);
    expect(whiteBoomersPhases.map((phase) => phase.endSeconds)).toEqual([
      38.579, 84.09, 138.6, 152.13, 198.57, 258.63, 290.8, 351,
    ]);
  });

  test('every keyframe sits inside the epoch and offsets strictly increase', () => {
    const { keyframes } = universe.temporalStructure;

    expect(keyframes).toHaveLength(24);
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
    expect(offsets[offsets.length - 1]).toBeLessThan(348.639);
    expect(offsets[offsets.length - 1]).toBeLessThanOrEqual(WHITE_BOOMERS_RUNTIME_SECONDS);
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

  test('the framing claim and the closing claim are keyframes at their stated offsets', () => {
    const { keyframes } = universe.temporalStructure;

    const framing = keyframes.find((keyframe) => keyframe.id === 'social_vacuum');
    expect(framing).toBeDefined();
    expect(offsetSeconds(framing!.timestamp)).toBeCloseTo(4.7, 3);
    expect(framing!.significance).toBe(1);

    const closing = keyframes.find((keyframe) => keyframe.id === 'cultural_plateau');
    expect(closing).toBeDefined();
    expect(offsetSeconds(closing!.timestamp)).toBeCloseTo(339.219, 3);
    expect(closing!.significance).toBeGreaterThan(0.9);
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

  test('the single rendering is recorded with its verdict, not mistaken for a cross-check', () => {
    const verification = universe.metadata.verification as {
      confidence: number;
      scope: { start: number; end: number };
      secondAttempt: { recommended: boolean; attempted: string };
      measured: { publishedChapterCount: number; captionEvents: number };
    };

    expect(verification.confidence).toBe(0.8);
    expect(verification.scope).toEqual({ start: 0, end: 351 });
    expect(verification.secondAttempt.recommended).toBe(true);
    expect(verification.secondAttempt.attempted).toContain('byte-identical');
    expect(verification.measured.publishedChapterCount).toBe(0);
    expect(verification.measured.captionEvents).toBe(150);
  });

  test('caption repairs are marked single-source rather than invented as a second track', () => {
    expect(whiteBoomersCaptionArtifacts).toHaveLength(6);
    expect(whiteBoomersCaptionArtifacts.every((entry) => entry.enUs === null)).toBe(true);
    expect(universe.metadata.captionArtifacts).toBe(whiteBoomersCaptionArtifacts);

    const cannon = whiteBoomersCaptionArtifacts.find(
      (entry) => entry.atSeconds === 256.65,
    );
    expect(cannon).toBeDefined();
    expect(cannon!.enOrig).toContain('obediently cannon fodder');
    expect(cannon!.reading).toContain('obedient cannon fodder');
  });
});
