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
  SOLO_BILLION_DOLLAR_PUBLISHED,
  SOLO_BILLION_DOLLAR_RUNTIME_SECONDS,
  SOLO_BILLION_DOLLAR_UNIVERSE_ID,
  soloBillionDollarCaptionArtifacts,
  soloBillionDollarChapters,
  soloBillionDollarUniverse,
} from '../../src/config/universes/youtube';

/**
 * The content guard for the Sam Altman solopreneurship episode.
 *
 * Registration is proved repo-wide by `defined-vs-registered.test.ts`. What that
 * guard cannot see is whether the record is coherent: one publication-anchored
 * clock of 1473 s, the ten *published* chapters from info.json (not invented
 * phases), and forty-eight keyframes whose offsets are exact cue starts from
 * the automatic track. Both requested English renderings were byte-identical,
 * so this test also pins the single-source 0.8 confidence, the recommended
 * second attempt and the nine context repairs recorded with enUs:null.
 */

const SEC = 1_000_000_000n;

const universe = soloBillionDollarUniverse as unknown as Universe & {
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
  Number(timestamp - SOLO_BILLION_DOLLAR_PUBLISHED) / Number(SEC);

/** Exact `tStartMs / 1000` values from the automatic track, read 2026-11-19. */
const measuredCueStarts = [
  68.799, 75.68, 87.759, 96.32, 174.319, 186.319, 229.28, 242.64, 258.959, 291.199,
  317.36, 346.0, 421.12, 460.319, 465.759, 512.8, 528.399, 553.76, 578.08, 605.68,
  663.839, 679.04, 687.279, 727.44, 779.2, 786.32, 818.48, 856.48, 874.56, 910.959,
  944.32, 1044.48, 1053.52, 1084.72, 1119.28, 1166.72, 1193.6, 1202.799, 1212.08,
  1228.88, 1287.039, 1302.48, 1322.48, 1334.96, 1341.12, 1370.08, 1432.08,
];

describe('the Sam Altman solopreneurship episode is a publication-anchored work (youtube:c1NYw35eIjk)', () => {
  test('the id is a series id, produced by the factory and not merely well-formed', () => {
    expect(SOLO_BILLION_DOLLAR_UNIVERSE_ID).toBe(
      createSeriesUniverseId('series', 'making_money_with_sam_altmans_solopreneurship_thesis', 2025),
    );
    expect(isSeriesUniverseId(SOLO_BILLION_DOLLAR_UNIVERSE_ID)).toBe(true);
    expect(isValidUniverseId(SOLO_BILLION_DOLLAR_UNIVERSE_ID)).toBe(true);
    expect(universe.universeId).toBe(SOLO_BILLION_DOLLAR_UNIVERSE_ID);
  });

  test('it is registered and retrievable after initialize()', async () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    expect(registry.getUniverse(SOLO_BILLION_DOLLAR_UNIVERSE_ID)).toBeDefined();
    expect(
      (allUniverses as unknown as unknown[]).some(
        (entry) =>
          (entry as { universeId?: string })?.universeId === SOLO_BILLION_DOLLAR_UNIVERSE_ID,
      ),
    ).toBe(true);
  });

  test('one runtime epoch of 1473 s starting at the measured upload instant', () => {
    expect(epoch).toBeDefined();
    expect(epoch.epochId).toBe(`${SOLO_BILLION_DOLLAR_UNIVERSE_ID}:runtime`);
    expect(epoch.startTime).toBe(SOLO_BILLION_DOLLAR_PUBLISHED);
    expect(epoch.endTime).toBe(
      SOLO_BILLION_DOLLAR_PUBLISHED + BigInt(SOLO_BILLION_DOLLAR_RUNTIME_SECONDS) * SEC,
    );
    expect(epoch.precision).toBe(TimePrecision.SECOND);
    expect(universe.metadata.durationSeconds).toBe(SOLO_BILLION_DOLLAR_RUNTIME_SECONDS);
    expect(SOLO_BILLION_DOLLAR_RUNTIME_SECONDS).toBe(1473);
    expect(new Date(Number(SOLO_BILLION_DOLLAR_PUBLISHED / 1_000_000n)).toISOString()).toBe(
      '2025-08-07T18:15:08.000Z',
    );
  });

  test('ten published chapters are gapless and cover the runtime, verbatim from info.json', () => {
    const { segments } = universe.temporalStructure;

    expect(segments).toHaveLength(10);
    expect(segments.map((segment) => segment.id)).toEqual(
      soloBillionDollarChapters.map((chapter) => chapter.id),
    );
    expect(universe.metadata.chapters).toEqual(
      soloBillionDollarChapters.map((chapter) => ({ ...chapter })),
    );
    expect(segments[0].start).toBe(SOLO_BILLION_DOLLAR_PUBLISHED);
    expect(segments[segments.length - 1].end).toBe(epoch.endTime);
    expect(segments.every((segment) => segment.type === 'phase')).toBe(true);

    for (let i = 1; i < segments.length; i += 1) {
      expect(segments[i].start).toBe(segments[i - 1].end);
      expect(segments[i].start).toBeGreaterThan(segments[i - 1].start);
    }

    expect(soloBillionDollarChapters.map((chapter) => chapter.startSeconds)).toEqual([
      0, 73, 105, 398, 605, 733, 1032, 1087, 1186, 1306,
    ]);
    expect(soloBillionDollarChapters.map((chapter) => chapter.endSeconds)).toEqual([
      73, 105, 398, 605, 733, 1032, 1087, 1186, 1306, 1473,
    ]);
    expect(soloBillionDollarChapters.map((chapter) => chapter.title)).toEqual([
      'Intro',
      "Sam Altman's $1B Solo Founder Prediction",
      'The new path to building a company',
      '5 mega trends enabling solo billion-dollar companies',
      'How to get started as a solopreneur',
      'Organizational structure with AI agents',
      'AI Agent Framework',
      'AI Pricing Framework',
      'What can be $1B Solo Business',
      'Conclusion on feasibility and timeline',
    ]);
  });

  test('every keyframe sits inside the epoch and offsets strictly increase', () => {
    const { keyframes } = universe.temporalStructure;

    expect(keyframes).toHaveLength(48);
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
    expect(offsets[offsets.length - 1]).toBeLessThan(1470.4);
    expect(offsets[offsets.length - 1]).toBeLessThanOrEqual(SOLO_BILLION_DOLLAR_RUNTIME_SECONDS);
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

  test('the AI-first definition, the three leverages and the verdict are keyframes at their stated offsets', () => {
    const { keyframes } = universe.temporalStructure;

    const aiFirst = keyframes.find((keyframe) => keyframe.id === 'ai_first_company');
    expect(aiFirst).toBeDefined();
    expect(offsetSeconds(aiFirst!.timestamp)).toBeCloseTo(96.32, 3);
    expect(aiFirst!.significance).toBeGreaterThan(0.9);

    const leverages = keyframes.find((keyframe) => keyframe.id === 'three_leverages');
    expect(leverages).toBeDefined();
    expect(offsetSeconds(leverages!.timestamp)).toBeCloseTo(605.68, 3);
    expect(leverages!.significance).toBeGreaterThan(0.9);

    const verdict = keyframes.find((keyframe) => keyframe.id === 'conclusion_technically_yes');
    expect(verdict).toBeDefined();
    expect(offsetSeconds(verdict!.timestamp)).toBeCloseTo(1322.48, 3);
    expect(verdict!.significance).toBeGreaterThan(0.9);
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
    expect(verification.scope).toEqual({ start: 0, end: 1473 });
    expect(verification.secondAttempt.recommended).toBe(true);
    expect(verification.secondAttempt.attempted).toContain('byte-identical');
    expect(verification.measured.publishedChapterCount).toBe(10);
    expect(verification.measured.captionEvents).toBe(625);
    expect(verification.measured.captionWords).toBe(4442);
  });

  test('single-source repairs are recorded with enUs:null, never an invented second reading', () => {
    expect(soloBillionDollarCaptionArtifacts).toHaveLength(9);
    expect(universe.metadata.captionArtifacts).toBe(soloBillionDollarCaptionArtifacts);
    expect(
      soloBillionDollarCaptionArtifacts.every(
        (entry) => entry.enOrig && entry.enUs === null && entry.reading,
      ),
    ).toBe(true);

    const tenPerson = soloBillionDollarCaptionArtifacts.find(
      (entry) => entry.atSeconds === 70.799,
    );
    expect(tenPerson).toBeDefined();
    expect(tenPerson!.enOrig).toContain('10erson companies');
    expect(tenPerson!.reading).toContain('10-person companies');
  });
});
