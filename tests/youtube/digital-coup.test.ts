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
  DIGITAL_COUP_PUBLISHED,
  DIGITAL_COUP_RUNTIME_SECONDS,
  DIGITAL_COUP_UNIVERSE_ID,
  digitalCoupCaptionArtifacts,
  digitalCoupChapters,
  digitalCoupUniverse,
} from '../../src/config/universes/youtube';

/**
 * The content guard for the Cadwalladr TED2025 digital-coup talk.
 *
 * Registration is proved repo-wide by `src/config/__tests__/defined-vs-registered.test.ts`.
 * What that guard cannot see is whether the record is coherent: one publication-anchored
 * clock of 1062 s, ten gapless chapter segments, and thirty-five keyframes whose offsets
 * are caption cue starts on the automatic English track rather than guessed positions.
 * Those are pinned here, together with the two-track readings of the disputed words.
 */

const SEC = 1_000_000_000n;

const universe = digitalCoupUniverse as unknown as Universe & {
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

/** Seconds from the publication instant, fractional. */
const offsetSeconds = (timestamp: bigint): number =>
  Number(timestamp - DIGITAL_COUP_PUBLISHED) / Number(SEC);

/**
 * The starts of the automatic-track cues the keyframes are pinned to, in seconds.
 * Read from `TZOoT8AbkNE.en-orig.json3` (331 text events) on 2026-11-19. `published`
 * is the zero reference from metadata, not a caption cue, so it is not in this list.
 */
const measuredCueStarts = [
  42.079, 63.559, 79.36, 140.2, 143.239, 168.76, 198.28, 215.72, 251.239, 258.959,
  278.32, 327.36, 359.039, 392.479, 403.28, 412.199, 445.36, 477.44, 510.0, 551.0,
  576.36, 633.2, 671.72, 678.079, 687.6, 729.56, 769.12, 821.399, 851.519, 912.92,
  937.16, 964.56, 1007.72, 1027.079,
];

describe('the digital-coup talk is a publication-anchored work (youtube:TZOoT8AbkNE)', () => {
  test('the id is a series id, produced by the factory and not merely well-formed', () => {
    expect(DIGITAL_COUP_UNIVERSE_ID).toBe(
      createSeriesUniverseId('series', 'this_is_what_a_digital_coup_looks_like', 2025),
    );
    expect(isSeriesUniverseId(DIGITAL_COUP_UNIVERSE_ID)).toBe(true);
    expect(isValidUniverseId(DIGITAL_COUP_UNIVERSE_ID)).toBe(true);
    expect(universe.universeId).toBe(DIGITAL_COUP_UNIVERSE_ID);
  });

  test('it is registered and retrievable after initialize()', async () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    expect(registry.getUniverse(DIGITAL_COUP_UNIVERSE_ID)).toBeDefined();
    expect(
      (allUniverses as unknown as unknown[]).some(
        (entry) =>
          (entry as { universeId?: string })?.universeId === DIGITAL_COUP_UNIVERSE_ID,
      ),
    ).toBe(true);
  });

  test('one runtime epoch of 1062 s, starting at the measured upload instant', () => {
    expect(epoch).toBeDefined();
    expect(epoch.epochId).toBe(`${DIGITAL_COUP_UNIVERSE_ID}:runtime`);
    expect(epoch.startTime).toBe(DIGITAL_COUP_PUBLISHED);
    expect(epoch.endTime).toBe(
      DIGITAL_COUP_PUBLISHED + BigInt(DIGITAL_COUP_RUNTIME_SECONDS) * SEC,
    );
    expect(epoch.precision).toBe(TimePrecision.SECOND);
    expect(universe.metadata.durationSeconds).toBe(DIGITAL_COUP_RUNTIME_SECONDS);
    expect(DIGITAL_COUP_RUNTIME_SECONDS).toBe(1062);
    expect(new Date(Number(DIGITAL_COUP_PUBLISHED / 1_000_000n)).toISOString()).toBe(
      '2025-04-10T01:42:44.000Z',
    );
  });

  test('the ten published chapters become ten gapless segments covering the runtime', () => {
    const { segments } = universe.temporalStructure;

    expect(segments).toHaveLength(10);
    expect(segments.map((segment) => segment.id)).toEqual(
      digitalCoupChapters.map((chapter) => chapter.id),
    );
    expect(segments[0].start).toBe(DIGITAL_COUP_PUBLISHED);
    expect(segments[segments.length - 1].end).toBe(epoch.endTime);
    expect(segments.every((segment) => segment.type === 'phase')).toBe(true);

    for (let i = 1; i < segments.length; i += 1) {
      expect(segments[i].start).toBe(segments[i - 1].end);
      expect(segments[i].start).toBeGreaterThan(segments[i - 1].start);
    }

    expect(digitalCoupChapters.map((chapter) => chapter.startSeconds)).toEqual([
      0, 115, 179, 249, 357, 433, 560, 635, 751, 868,
    ]);
    expect(digitalCoupChapters.map((chapter) => chapter.endSeconds)).toEqual([
      115, 179, 249, 357, 433, 560, 635, 751, 868, 1062,
    ]);
  });

  test('every keyframe sits inside the epoch and the offsets strictly increase', () => {
    const { keyframes } = universe.temporalStructure;

    expect(keyframes).toHaveLength(35);

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

  test('every keyframe offset is a measured caption cue start, not a guessed position', () => {
    const offsets = universe.temporalStructure.keyframes.map((keyframe) =>
      offsetSeconds(keyframe.timestamp),
    );

    expect(offsets.slice(1)).toEqual(measuredCueStarts);
    // The last spoken cue starts here; no claim is keyframed into the tail.
    expect(offsets[offsets.length - 1]).toBeLessThan(1045.959);
    expect(offsets[offsets.length - 1]).toBeLessThanOrEqual(DIGITAL_COUP_RUNTIME_SECONDS);
  });

  test('each chapter carries at least one keyframe', () => {
    const { segments, keyframes } = universe.temporalStructure;

    for (const segment of segments) {
      const inside = keyframes.filter(
        (keyframe) => keyframe.timestamp >= segment.start && keyframe.timestamp < segment.end,
      );
      expect(inside.length).toBeGreaterThan(0);
    }
  });

  test('the naming claim and the closing claim are keyframes at their stated offsets', () => {
    const { keyframes } = universe.temporalStructure;

    const naming = keyframes.find((keyframe) => keyframe.id === 'it_is_a_coup');
    expect(naming).toBeDefined();
    expect(offsetSeconds(naming!.timestamp)).toBeCloseTo(143.239, 3);
    expect(naming!.tags).toContain('coup');
    expect(naming!.significance).toBe(1);

    const closing = keyframes.find((keyframe) => keyframe.id === 'we_are_not_powerless');
    expect(closing).toBeDefined();
    expect(offsetSeconds(closing!.timestamp)).toBeCloseTo(1027.079, 3);
    expect(closing!.significance).toBe(1);
    expect(closing!.id).toBe(keyframes[keyframes.length - 1].id);
  });

  test('the work is an interpretation with no invented facts, and two declared containers', () => {
    const relation = universe.realityRelation;
    expect(relation.type).toBe('interpretation');
    expect(relation.fictionalizationDegree).toBe(0);

    expect(universe.connections?.natural?.parentUniverses).toEqual([
      CommonUniverseIds.SILICON_VALLEY,
      CommonUniverseIds.US_GOVERNMENT,
    ]);
  });

  test('the measurement is recorded with its cross-check and its limits', () => {
    const verification = universe.metadata.verification as {
      confidence: number;
      scope: { start: number; end: number };
      secondAttempt: { recommended: boolean };
      measured: { chapterCount: number; automaticCaptionEvents: number };
    };

    expect(verification.confidence).toBeLessThanOrEqual(0.9);
    expect(verification.scope).toEqual({ start: 0, end: 1062 });
    expect(verification.secondAttempt.recommended).toBe(false);
    expect(verification.measured.chapterCount).toBe(10);
    expect(verification.measured.automaticCaptionEvents).toBe(331);
  });
});

describe('the two English renderings are kept, not normalised away', () => {
  test('the disputed term is recorded with both spellings and a documented reading', () => {
    const artifact = digitalCoupCaptionArtifacts.find(
      (entry) => entry.atSeconds === 215.72,
    );

    expect(artifact).toBeDefined();
    expect(artifact!.enOrig).toContain('brolyarchy');
    expect(artifact!.enUs).toContain('broligarchy');
    expect(artifact!.reading).toBe('broligarchy');
  });

  test('every proper noun quoted in a keyframe has a corrected artifact', () => {
    const readings = digitalCoupCaptionArtifacts.map((entry) => entry.reading);

    expect(readings).toEqual(
      expect.arrayContaining([
        'broligarchy',
        'Instagram is the Stasi',
        'Cardinal Richelieu',
        'Alexei Navalny',
        'Sam Altman',
        'Mikhail Khodorkovsky',
      ]),
    );
    expect(digitalCoupCaptionArtifacts).toHaveLength(7);
    expect(universe.metadata.captionArtifacts).toBe(digitalCoupCaptionArtifacts);
  });
});
