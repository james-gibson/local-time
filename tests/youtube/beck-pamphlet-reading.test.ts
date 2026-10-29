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
  BECK_PAMPHLET_READING_UNIVERSE_ID,
  BECK_READING_CLIP_ID,
  BECK_READING_DOCUMENT_ID,
  BECK_READING_EXCERPT_ID,
  BECK_READING_PARENT_ID,
  beckPamphletReadingUniverse,
  beckReadingBlocks,
  beckReadingCaptionArtifacts,
  beckReadingClaimInventory,
  beckReadingCorrections,
  beckReadingKeyframes,
  beckReadingSegments,
} from '../../src/config/universes/youtube';
import { beckPamphletTranscriptUniverse } from '../../src/config/universes/youtube/beck-pamphlet-transcript';

/**
 * The content guard for the reading map of james-gibson/local-time#206.
 *
 * Registration is proved repo-wide by `src/config/defined-vs-registered.test.ts`. What
 * that guard cannot see is whether this record is coherent: one band on the response
 * clock, thirteen blocks in reading order, a segment partition that covers the band, a
 * keyframe at every block start, the three audio corrections applied, and — the point of
 * the module — the two address readings addressing the same instants as the transcription
 * record rather than a second set invented here.
 */

const SEC = 1_000_000_000n;

type AnyKeyframe = {
  id: string;
  timestamp: bigint;
  significance: number;
  certainty?: number;
  type?: KeyframeType;
  tags: string[];
  description?: string;
};

type AnySegment = {
  id: string;
  start: bigint;
  end: bigint;
  type: string;
  status?: string;
};

const universe = beckPamphletReadingUniverse as unknown as Universe & {
  temporalStructure: {
    segments: AnySegment[];
    keyframes: AnyKeyframe[];
    windows: { strategy: string };
  };
  metadata: Record<string, unknown> & {
    readingMap: {
      blocks: number;
      verifiedAgainstAudio: number;
      captionOnly: number;
      printedOrderDeviations: Array<{ block: string; printedSlot: string; readOrder: number }>;
    };
    presumed: Array<{
      universeId: string;
      hydration: string;
      contributesCharge: boolean;
    }>;
  };
};

const epoch = (
  universe.layers.find(
    (layer) => (layer as { layerId?: string }).layerId === 'runtime',
  ) as unknown as {
    epochs: Record<
      string,
      { epochId?: string; startTime?: bigint; endTime?: bigint; precision?: TimePrecision }
    >;
  }
).epochs.reading_band;

const offsetSeconds = (timestamp: bigint): number =>
  Number(timestamp - epoch.startTime!) / Number(SEC);


describe('#206 — the Beck pamphlet reading map', () => {
  describe('registration and shape', () => {
    test('the id is a series id, produced by the factory and not merely well-formed', () => {
      expect(BECK_PAMPHLET_READING_UNIVERSE_ID).toBe(
        createSeriesUniverseId('series', 'beck_pamphlet_reading_map', 2026),
      );
      expect(isSeriesUniverseId(BECK_PAMPHLET_READING_UNIVERSE_ID)).toBe(true);
      expect(isValidUniverseId(BECK_PAMPHLET_READING_UNIVERSE_ID)).toBe(true);
      expect(universe.universeId).toBe(BECK_PAMPHLET_READING_UNIVERSE_ID);
    });

    test('it is registered, retrievable and spread into allUniverses', async () => {
      const registry = new UniverseRegistry(new ConfigLoader());
      await registry.initialize();

      expect(registry.getUniverse(BECK_PAMPHLET_READING_UNIVERSE_ID)).toBeDefined();
      expect(
        (allUniverses as unknown as unknown[]).some(
          (entry) =>
            (entry as { universeId?: string })?.universeId ===
            BECK_PAMPHLET_READING_UNIVERSE_ID,
        ),
      ).toBe(true);
    });

    test('it is a series, not a film, and it does not inherit the segment\'s cultural weight', () => {
      expect((universe as unknown as { type: string }).type).toBe('series');
      expect(universe.metadata.cultural_significance).toBe(0.3);
      expect(universe.metadata.cultural_significance).not.toBe(0.45);
    });

    test('every keyframe type is a member of the enum', () => {
      const members = new Set(Object.values(KeyframeType) as string[]);

      for (const keyframe of universe.temporalStructure.keyframes) {
        expect(keyframe.type).toBeDefined();
        expect(members.has(keyframe.type as string)).toBe(true);
      }
    });

  });

  describe('the band', () => {
    test('one epoch on the response video\'s clock, 44:52.52 to 59:03', () => {
      expect(epoch).toBeDefined();
      expect(epoch.epochId).toBe(`${BECK_PAMPHLET_READING_UNIVERSE_ID}:runtime`);
      expect(epoch.precision).toBe(TimePrecision.SECOND);

      const bandSeconds = Number(epoch.endTime! - epoch.startTime!) / Number(SEC);
      expect(bandSeconds).toBeCloseTo(59 * 60 + 3 - 2692.52, 6);
    });

    test('the band starts at the transcript record\'s playback start, not at a restated midnight', () => {
      const transcript = beckPamphletTranscriptUniverse as unknown as {
        temporalStructure: { keyframes: AnyKeyframe[] };
      };
      const playbackStart = transcript.temporalStructure.keyframes.find(
        (keyframe) => keyframe.id === 'playback_start',
      );

      expect(playbackStart).toBeDefined();
      expect(epoch.startTime).toBe(playbackStart!.timestamp);
    });
  });

  describe('the thirteen readings', () => {
    test('there are thirteen, numbered 1-13 in reading order', () => {
      expect(beckReadingBlocks).toHaveLength(13);
      expect(beckReadingBlocks.map((block) => block.readOrder)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      ]);
      expect(universe.metadata.readingMap.blocks).toBe(13);
    });

    test('every block sits inside the band, and the blocks do not overlap', () => {
      const bandStartSeconds = 2692.52;
      const bandEndSeconds = 59 * 60 + 3;

      for (const block of beckReadingBlocks) {
        expect(block.startSeconds).toBeGreaterThanOrEqual(bandStartSeconds);
        expect(block.endSeconds).toBeGreaterThan(block.startSeconds);
        expect(block.endSeconds).toBeLessThanOrEqual(bandEndSeconds);
      }

      for (let i = 1; i < beckReadingBlocks.length; i += 1) {
        expect(beckReadingBlocks[i].startSeconds).toBeGreaterThanOrEqual(
          beckReadingBlocks[i - 1].endSeconds,
        );
      }
    });

    test('no block claims a verified voice or wording it has not earned', () => {
      const audioBlocks = beckReadingBlocks.filter(
        (block) => block.verifiedAgainst === 'audio',
      );

      // Only the household field was re-verified against the audio. The second address
      // reading lives inside `emancipation_heading`, whose own text is caption-only.
      expect(audioBlocks.map((block) => block.id)).toEqual(['household_field']);
      expect(universe.metadata.readingMap.verifiedAgainstAudio).toBe(1);
      expect(universe.metadata.readingMap.captionOnly).toBe(12);

      for (const block of beckReadingBlocks) {
        expect(block.certainty).toBeGreaterThan(0);
        expect(block.certainty).toBeLessThanOrEqual(0.9);
        if (block.verifiedAgainst === 'caption') {
          expect(block.certainty).toBeLessThanOrEqual(0.75);
        }
      }
    });

    test('the envelope panels are recorded as read out of printed order', () => {
      const deviations = universe.metadata.readingMap.printedOrderDeviations;

      expect(deviations.map((entry) => entry.block)).toEqual([
        'return_address',
        'household_field',
      ]);
      expect(
        beckReadingBlocks
          .filter((block) => block.outOfPrintedOrder)
          .map((block) => block.printedSlot),
      ).toEqual(['envelope_return_address', 'envelope_addressee']);

      // Read after body text: the envelope is printed before it.
      expect(deviations.every((entry) => entry.readOrder > 3)).toBe(true);
    });

    test('the document is preferred to the speaker where the two disagree', () => {
      // The draft's worst error is an attribution error, so it is guarded directly:
      // nothing in the map may attribute the cost line to the producer.
      const cost = beckReadingClaimInventory.find(
        (entry) => entry.id === 'production_value',
      );
      expect(cost).toBeDefined();
      expect(cost!.voice).toBe('beck');
      expect(cost!.standing).toBe('measured');
      expect(cost!.certainty).toBe(0.95);
      expect(cost!.note).toMatch(/epistemic modal/i);

      // And the "double switcheroo" correction runs the other way: producer, not Beck.
      const intent = beckReadingClaimInventory.find((entry) => entry.id === 'intent');
      expect(intent!.voice).toBe('producer');
      expect(intent!.note).toMatch(/52:16/);
    });
  });

  describe('the segment partition', () => {
    test('segments tile the whole band, from its start to its end, without gaps', () => {
      const { segments } = universe.temporalStructure;

      expect(segments).toHaveLength(beckReadingSegments.length);
      expect(segments[0].start).toBe(epoch.startTime);
      expect(segments[segments.length - 1].end).toBe(epoch.endTime);
      expect(segments.every((segment) => segment.type === 'phase')).toBe(true);

      for (let i = 1; i < segments.length; i += 1) {
        expect(segments[i].start).toBe(segments[i - 1].end);
      }
    });

    test('each reading is a segment, and the space between readings is marked suspended', () => {
      const active = universe.temporalStructure.segments.filter(
        (segment) => segment.status === 'active',
      );

      expect(active.map((segment) => segment.id)).toEqual(
        beckReadingBlocks.map((block) => block.id),
      );
      expect(
        universe.temporalStructure.segments
          .filter((segment) => segment.status === 'suspended')
          .every((segment) => segment.id.startsWith('gap_')),
      ).toBe(true);
    });

    test('every active segment is exactly the block it names', () => {
      for (const block of beckReadingBlocks) {
        const segment = universe.temporalStructure.segments.find(
          (candidate) => candidate.id === block.id,
        );

        expect(segment).toBeDefined();
        expect(offsetSeconds(segment!.start)).toBeCloseTo(
          block.startSeconds - 2692.52,
          6,
        );
        expect(Number(segment!.end - segment!.start) / Number(SEC)).toBeCloseTo(
          block.endSeconds - block.startSeconds,
          6,
        );
      }
    });
  });

  describe('the keyframes', () => {
    test('they sit inside the epoch, strictly increase, and have unique ids', () => {
      const { keyframes } = universe.temporalStructure;

      expect(keyframes.length).toBe(beckReadingKeyframes.length);
      expect(new Set(keyframes.map((keyframe) => keyframe.id)).size).toBe(
        keyframes.length,
      );

      for (const keyframe of keyframes) {
        expect(keyframe.timestamp).toBeGreaterThanOrEqual(epoch.startTime!);
        expect(keyframe.timestamp).toBeLessThan(epoch.endTime!);
        expect(keyframe.description?.length ?? 0).toBeGreaterThan(20);
        expect(keyframe.certainty).toBeGreaterThan(0);
      }

      for (let i = 1; i < keyframes.length; i += 1) {
        expect(keyframes[i].timestamp).toBeGreaterThan(keyframes[i - 1].timestamp);
      }
    });

    test('every reading has a keyframe at its start, and the reading is its description', () => {
      for (const block of beckReadingBlocks) {
        const keyframe = universe.temporalStructure.keyframes.find(
          (candidate) => candidate.id === block.id,
        );

        expect(keyframe).toBeDefined();
        expect(offsetSeconds(keyframe!.timestamp)).toBeCloseTo(
          block.startSeconds - 2692.52,
          6,
        );
        expect(keyframe!.description).toContain(block.text);
        expect(keyframe!.tags).toContain('read_aloud');
      }
    });

    test('the three corrections are keyframed, not only narrated in the header', () => {
      const ids = universe.temporalStructure.keyframes.map((keyframe) => keyframe.id);

      expect(ids).toContain('reading_map_opens');
      expect(ids).toContain('producer_name_resolved');
      expect(ids).toContain('cost_claim_is_the_hosts');
      expect(ids).toContain('second_household_read');

      expect(beckReadingCorrections.map((correction) => correction.id)).toEqual([
        'C1',
        'C2',
        'C3',
      ]);
      expect(beckReadingCorrections[0]).toMatchObject({
        draft: 'producer',
        corrected: 'beck',
      });
      expect(beckReadingCorrections[2].draft).toMatch(/Allie Stuckey/);
      expect(beckReadingCorrections[2].corrected).toMatch(
        /Why Christians Lie About Transgender Kids/,
      );
    });

    test('the two address readings address the transcription record\'s instants', () => {
      const transcript = beckPamphletTranscriptUniverse as unknown as {
        temporalStructure: { keyframes: AnyKeyframe[] };
      };
      const transcriptAddress = transcript.temporalStructure.keyframes.find(
        (keyframe) => keyframe.id === 'addressing_read',
      );
      const transcriptHousehold = transcript.temporalStructure.keyframes.find(
        (keyframe) => keyframe.id === 'household_read',
      );

      const first = universe.temporalStructure.keyframes.find(
        (keyframe) => keyframe.id === 'household_field',
      );
      const second = universe.temporalStructure.keyframes.find(
        (keyframe) => keyframe.id === 'second_household_read',
      );

      // The same instant, expressed twice: this is the module's whole claim about the
      // clock, so it is checked against the record rather than restated as arithmetic.
      expect(first!.timestamp).toBe(transcriptAddress!.timestamp);
      expect(second!.timestamp).toBe(transcriptHousehold!.timestamp);
    });

    test('the parent identity correction is on the zero point, where the map opens', () => {
      const open = universe.temporalStructure.keyframes.find(
        (keyframe) => keyframe.id === 'reading_map_opens',
      );

      expect(open!.type).toBe(KeyframeType.ZERO_POINT);
      expect(open!.description).toMatch(/Allie Stuckey/);
      expect(open!.description).toMatch(/Why Christians Lie About Transgender Kids/);
    });
  });

  describe('the caption artifacts', () => {
    test('the invented cast and the invented source are both recorded', () => {
      const ids = beckReadingCaptionArtifacts.map((artifact) => artifact.id);

      expect(ids).toContain('grace_for_jason');
      expect(ids).toContain('tint_for_tent');
      expect(ids).toContain('lambda_legal_garble');
      expect(ids).toContain('transtexas_url_garble');

      const grace = beckReadingCaptionArtifacts.find(
        (artifact) => artifact.id === 'grace_for_jason',
      );
      expect(grace!.caption).toMatch(/Grace/);
      expect(grace!.verified).toMatch(/Jason/);
    });

    test('the denial\'s two renderings are kept as an artifact, not merged', () => {
      const denial = beckReadingCaptionArtifacts.find(
        (artifact) => artifact.id === 'tent_denial_two_renderings',
      );

      expect(denial).toBeDefined();
      expect(denial!.caption).toMatch(/were are authorized/);
      expect(denial!.verified).toMatch(/were not authorized/);
    });
  });

  describe('the presumed document', () => {
    test('the ledger and the anchor are the same id, and it is still unregistered', async () => {
      const ledger = universe.metadata.presumed;

      expect(ledger.map((entry) => entry.universeId)).toEqual([BECK_READING_DOCUMENT_ID]);
      expect(ledger.every((entry) => entry.hydration === 'presumed')).toBe(true);
      expect(ledger.every((entry) => entry.contributesCharge === false)).toBe(true);

      const registry = new UniverseRegistry(new ConfigLoader());
      await registry.initialize();

      expect(isValidUniverseId(BECK_READING_DOCUMENT_ID)).toBe(true);
      // The day a copy of the guide is authored, this fails — which is the reminder to
      // flip `hydration`, not a silent entry into the charge graph.
      expect(registry.getUniverse(BECK_READING_DOCUMENT_ID)).toBeUndefined();
    });
  });

  describe('the connections', () => {
    test('containment is the object form, with the US history container', () => {
      expect(universe.connections?.natural?.parentUniverses).toEqual([
        CommonUniverseIds.US_HISTORY,
      ]);
    });

    test('every declared reference resolves to a registered universe', async () => {
      const registry = new UniverseRegistry(new ConfigLoader());
      await registry.initialize();

      const references = universe.connections?.references ?? [];
      expect(references.map((reference) => reference.targetUniverseId).sort()).toEqual(
        [BECK_READING_CLIP_ID, BECK_READING_EXCERPT_ID, BECK_READING_PARENT_ID].sort(),
      );

      for (const reference of references) {
        expect(registry.getUniverse(reference.targetUniverseId)).toBeDefined();
      }
    });
  });
});
