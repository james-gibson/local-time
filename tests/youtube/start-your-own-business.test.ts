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
  START_YOUR_OWN_BUSINESS_PUBLISHED,
  START_YOUR_OWN_BUSINESS_RUNTIME_SECONDS,
  START_YOUR_OWN_BUSINESS_UNIVERSE_ID,
  startYourOwnBusinessCaptionArtifacts,
  startYourOwnBusinessChapters,
  startYourOwnBusinessUniverse,
} from '../../src/config/universes/youtube';

/**
 * The content guard for the developer-to-owner business playbook.
 *
 * Registration is proved repo-wide by `defined-vs-registered.test.ts`. What that
 * guard cannot see is whether the record is coherent: one publication-anchored
 * clock of 4750 s, the 25 *published* chapters from info.json (not invented
 * phases), and ninety-eight keyframes — the metadata zero-point plus ninety-seven
 * exact cue starts from the automatic track. Both requested English renderings
 * were byte-identical, so this test also pins the 0.8 single-source confidence,
 * the recommended second attempt and the eight context repairs recorded with
 * enUs:null.
 */

const SEC = 1_000_000_000n;

const universe = startYourOwnBusinessUniverse as unknown as Universe & {
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
  Number(timestamp - START_YOUR_OWN_BUSINESS_PUBLISHED) / Number(SEC);

/** Exact `tStartMs / 1000` values from the automatic track, read 2026-11-19. */
const measuredCueStarts = [
  0.080, 14.000, 33.040, 44.320, 149.040, 151.200, 204.879, 276.560, 301.600, 324.320,
  354.320, 365.840, 427.919, 442.720, 526.880, 616.480, 660.800, 699.760, 791.440, 830.000,
  877.040, 922.959, 1118.799,
  1127.440, 1152.960, 1204.640, 1220.559, 1233.760, 1246.159, 1284.559, 1305.440, 1391.039, 1428.080,
  1461.760, 1524.480, 1562.799, 1631.360, 1676.240, 1710.240, 1727.919, 1796.080, 1830.240, 1850.960,
  1892.320, 1975.039, 2110.079, 2122.880, 2143.040, 2194.800, 2291.920, 2301.040, 2356.880, 2431.680,
  2457.599, 2484.160, 2516.160, 2686.560, 2714.240, 2745.839, 2796.319, 2841.839, 2919.200, 2981.119,
  3024.480, 3052.079, 3077.040, 3097.680, 3163.839, 3229.599, 3330.880, 3414.400, 3474.480, 3521.680,
  3528.720, 3539.359, 3684.640, 3826.160, 3877.520, 3896.400, 3928.240, 3973.599, 3980.640, 4025.599,
  4042.079, 4060.319, 4119.440, 4141.279, 4167.520, 4192.960, 4204.560, 4333.040, 4377.360, 4440.960,
  4508.400, 4663.199, 4708.960, 4731.679,
];

describe('the developer-to-owner playbook is a publication-anchored work (youtube:HNn9j3sD6S0)', () => {
  test('the id is a series id, produced by the factory and not merely well-formed', () => {
    expect(START_YOUR_OWN_BUSINESS_UNIVERSE_ID).toBe(
      createSeriesUniverseId('series', 'start_your_own_software_business', 2026),
    );
    expect(isSeriesUniverseId(START_YOUR_OWN_BUSINESS_UNIVERSE_ID)).toBe(true);
    expect(isValidUniverseId(START_YOUR_OWN_BUSINESS_UNIVERSE_ID)).toBe(true);
    expect(universe.universeId).toBe(START_YOUR_OWN_BUSINESS_UNIVERSE_ID);
  });

  test('it is registered and retrievable after initialize()', async () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    expect(registry.getUniverse(START_YOUR_OWN_BUSINESS_UNIVERSE_ID)).toBeDefined();
    expect(
      (allUniverses as unknown as unknown[]).some(
        (entry) =>
          (entry as { universeId?: string })?.universeId === START_YOUR_OWN_BUSINESS_UNIVERSE_ID,
      ),
    ).toBe(true);
  });

  test('one runtime epoch of 4750 s starting at the measured upload instant', () => {
    expect(epoch).toBeDefined();
    expect(epoch.epochId).toBe(`${START_YOUR_OWN_BUSINESS_UNIVERSE_ID}:runtime`);
    expect(epoch.startTime).toBe(START_YOUR_OWN_BUSINESS_PUBLISHED);
    expect(epoch.endTime).toBe(
      START_YOUR_OWN_BUSINESS_PUBLISHED + BigInt(START_YOUR_OWN_BUSINESS_RUNTIME_SECONDS) * SEC,
    );
    expect(epoch.precision).toBe(TimePrecision.SECOND);
    expect(universe.metadata.durationSeconds).toBe(START_YOUR_OWN_BUSINESS_RUNTIME_SECONDS);
    expect(START_YOUR_OWN_BUSINESS_RUNTIME_SECONDS).toBe(4750);
    expect(new Date(Number(START_YOUR_OWN_BUSINESS_PUBLISHED / 1_000_000n)).toISOString()).toBe(
      '2025-08-25T14:45:03.000Z',
    );
  });

  test('25 published chapters are gapless and cover the runtime, verbatim from info.json', () => {
    const { segments } = universe.temporalStructure;

    expect(segments).toHaveLength(25);
    expect(segments.map((segment) => segment.id)).toEqual(
      startYourOwnBusinessChapters.map((chapter) => chapter.id),
    );
    expect(universe.metadata.chapters).toEqual(
      startYourOwnBusinessChapters.map((chapter) => ({ ...chapter })),
    );
    expect(segments[0].start).toBe(START_YOUR_OWN_BUSINESS_PUBLISHED);
    expect(segments[segments.length - 1].end).toBe(epoch.endTime);
    expect(segments.every((segment) => segment.type === 'phase')).toBe(true);

    for (let i = 1; i < segments.length; i += 1) {
      expect(segments[i].start).toBe(segments[i - 1].end);
      expect(segments[i].start).toBeGreaterThan(segments[i - 1].start);
    }

    expect(startYourOwnBusinessChapters.map((chapter) => chapter.startSeconds)).toEqual([
      0, 149, 269, 423, 659, 790, 1116, 1121, 1212, 1407, 1676, 1819, 2121, 2263, 2451,
      3024, 3197, 3462, 3824, 3896, 3972, 4040, 4119, 4187, 4377,
    ]);
    expect(startYourOwnBusinessChapters.map((chapter) => chapter.endSeconds)).toEqual([
      149, 269, 423, 659, 790, 1116, 1121, 1212, 1407, 1676, 1819, 2121, 2263, 2451, 3024,
      3197, 3462, 3824, 3896, 3972, 4040, 4119, 4187, 4377, 4750,
    ]);
    expect(startYourOwnBusinessChapters.map((chapter) => chapter.title)).toEqual([
      '<Untitled Chapter 1>',
      'Self-Assessment',
      'Mindset Shift',
      'Financial Cushion',
      '3-6-9 Year Outlook',
      'Unique Advantages',
      'Action Items',
      'The SaaS Curse',
      'Business Models',
      'Market Demand',
      'MVP',
      'Understanding Revenue Streams',
      'Action Items',
      'Leverage Your Network',
      'Grab Life by the Horns (IMPORTANT)',
      'Credibility Hacking',
      'Free Value Hacking',
      'Referrals & Strategic Partnerships',
      'Action Items',
      'Customer Feedback Loops',
      'Process Optimization',
      'Skill Enhancement',
      'Adaptation',
      'Data-Driven Decisions',
      'Action Items',
    ]);
  });

  test('every keyframe sits inside the epoch and offsets strictly increase', () => {
    const { keyframes } = universe.temporalStructure;

    expect(keyframes).toHaveLength(98);
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
    expect(offsets[offsets.length - 1]).toBeCloseTo(4731.679, 3);
    expect(offsets[offsets.length - 1]).toBeLessThanOrEqual(
      START_YOUR_OWN_BUSINESS_RUNTIME_SECONDS,
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

  test('the SaaS curse, the MVP and the data-is-king verdict are keyframes at their stated offsets', () => {
    const { keyframes } = universe.temporalStructure;

    const curse = keyframes.find((keyframe) => keyframe.id === 'saas_curse_named');
    expect(curse).toBeDefined();
    expect(offsetSeconds(curse!.timestamp)).toBeCloseTo(1152.96, 3);
    expect(curse!.significance).toBeGreaterThan(0.9);

    const mvp = keyframes.find((keyframe) => keyframe.id === 'create_mvp');
    expect(mvp).toBeDefined();
    expect(offsetSeconds(mvp!.timestamp)).toBeCloseTo(1676.24, 3);
    expect(mvp!.significance).toBeGreaterThan(0.9);

    const data = keyframes.find((keyframe) => keyframe.id === 'data_driven');
    expect(data).toBeDefined();
    expect(offsetSeconds(data!.timestamp)).toBeCloseTo(4192.96, 3);
    expect(data!.significance).toBeGreaterThan(0.9);
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
    expect(verification.scope).toEqual({ start: 0, end: 4750 });
    expect(verification.secondAttempt.recommended).toBe(true);
    expect(verification.secondAttempt.attempted).toContain('byte-identical');
    expect(verification.measured.publishedChapterCount).toBe(25);
    expect(verification.measured.captionEvents).toBe(2407);
    expect(verification.measured.captionWords).toBe(16366);
  });

  test('single-source repairs are recorded with enUs:null, never an invented second reading', () => {
    expect(startYourOwnBusinessCaptionArtifacts).toHaveLength(8);
    expect(universe.metadata.captionArtifacts).toBe(startYourOwnBusinessCaptionArtifacts);
    expect(
      startYourOwnBusinessCaptionArtifacts.every(
        (entry) => entry.enOrig && entry.enUs === null && entry.reading,
      ),
    ).toBe(true);

    const cortes = startYourOwnBusinessCaptionArtifacts.find(
      (entry) => entry.atSeconds === 427.919,
    );
    expect(cortes).toBeDefined();
    expect(cortes!.enOrig).toContain('Herdan Cortez');
    expect(cortes!.reading).toContain('Hernán Cortés');
  });
});
