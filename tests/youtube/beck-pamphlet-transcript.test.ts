import { KeyframeType } from '../../src/core/types';
import { allUniverses } from '../../src/config/universes';
import { CommonUniverseIds } from '../../src/core/common-universe-ids';
import {
  CLIP_PUBLICATION_INSTANT,
  RESPONSE_PUBLICATION_INSTANT,
  beckPamphletTranscriptUniverse,
  beckResponderAlignedEvents,
  beckResponderDrift,
  responseRuntimeOf,
  timWhitakerResponseUniverse,
} from '../../src/config/universes/youtube';
import {
  beckAddressReadings,
  beckAuditedPassage,
  beckCaptionArtifacts,
  beckLaughterMarks,
  beckSecondaryFinding,
  beckSpeakerAttribution,
  deriveResponseSeconds,
} from '../../src/config/universes/youtube/beck-pamphlet-transcript';
import { toDerived, toSource } from '../../src/utils/clock-drift';

/**
 * #200's transcription record, held to its own claims.
 *
 * The record's value is that it does not restate what it can derive: response offsets
 * come from `beckResponderDrift`, and the pre-drift table's stale rows are kept as
 * `supersededResponseSeconds` with the model asserted to *disagree* with them. These
 * tests are the difference between "the number is written down" and "the number is
 * right".
 */

const SEC = 1_000_000_000n;
const UNIVERSE_ID = 'series:beck_pamphlet_transcript:2026';
const RESPONDER_ID = 'series:tim_whitaker_why_christians_lie_about_transgender_kids:2026';

/** What the caption-track alignment earns: about a second. */
const TOLERANCE = 1.5;

type AnyKeyframe = {
  id: string;
  timestamp: bigint;
  type?: KeyframeType;
  targetUniverseId?: string;
  targetKeyframeId?: string;
  targetKeyframeType?: KeyframeType;
};

const keyframesOf = (universe: unknown): AnyKeyframe[] =>
  ((universe as { temporalStructure: { keyframes: AnyKeyframe[] } }).temporalStructure
    .keyframes ?? []) as AnyKeyframe[];

const secondsInto = (universe: unknown, keyframe: AnyKeyframe): number =>
  Number(responseRuntimeOf(keyframe.timestamp)) / Number(SEC);

/** Where a keyframe's instant lands on the clip's own clock — the same fact, one hop back. */
const clipSecondsOf = (keyframe: AnyKeyframe): number =>
  Number(toSource(beckResponderDrift, responseRuntimeOf(keyframe.timestamp)).sourceTime) /
  Number(SEC);

const transcript = beckPamphletTranscriptUniverse as unknown as {
  universeId: string;
  type: string;
  identifiers: { primary: string; aliases: string[] };
  connections: {
    natural: { parentUniverses: string[] };
    references: Array<{ type: string; targetUniverseId: string }>;
  };
  metadata: {
    creators: string[];
    transcript: Record<string, unknown>;
    findings: string[];
    uncertaintyNotes: string[];
    credences: Record<string, number>;
  };
};

describe('#200 — the transcription record', () => {
  describe('registration and shape', () => {
    it('registers the excerpt as a third work in the youtube namespace', () => {
      const ids = allUniverses.map((universe) => String(universe.universeId));
      expect(ids).toContain(UNIVERSE_ID);
      expect(transcript.universeId).toBe(UNIVERSE_ID);
      expect(transcript.type).toBe('series');
    });

    it('addresses itself on the parent video rather than on a new clock', () => {
      expect(transcript.identifiers.primary).toBe(`${RESPONDER_ID}#t=44m21s-59m09s`);
      expect(transcript.identifiers.aliases).toContain('Responding To Glenn Beck');

      // The band starts at the chapter boundary the parent names, not at the playback
      // point and not at the 44:34 the first draft of this module used.
      const first = keyframesOf(beckPamphletTranscriptUniverse)[0];
      expect(secondsInto(beckPamphletTranscriptUniverse, first)).toBe(44 * 60 + 21);
    });

    it('declares containment the literals actually read', () => {
      // #200's draft used `connections: [{ type: 'member_of', ... }]` — an array, which
      // the literal shape does not read, so the membership would have been invisible.
      expect(transcript.connections.natural.parentUniverses).toEqual([
        CommonUniverseIds.US_HISTORY,
      ]);
      const edges = transcript.connections.references.map((reference) => reference.type);
      expect(edges).toEqual(expect.arrayContaining(['EXCERPTS', 'QUOTES']));
    });
  });

  describe('the clock it borrows', () => {
    it('puts the same instant on the excerpt and on the parent, with no conversion', () => {
      const parents = new Map(
        keyframesOf(timWhitakerResponseUniverse).map((keyframe) => [keyframe.id, keyframe]),
      );

      for (const keyframe of keyframesOf(beckPamphletTranscriptUniverse)) {
        const parent = parents.get(keyframe.id);
        if (!parent) continue;
        // Absolute instants: the excerpt has no zero-reference epoch, so an instant is
        // addressable on the parent's runtime by construction.
        expect(keyframe.timestamp).toBe(parent.timestamp);
      }
    });

    it('stops the excerpt at the clip\'s last played frame and not at its runtime', () => {
      const playbackEnd = keyframesOf(beckPamphletTranscriptUniverse).find(
        (keyframe) => keyframe.id === 'playback_end',
      )!;
      const verdict = keyframesOf(beckPamphletTranscriptUniverse).find(
        (keyframe) => keyframe.id === 'verdict',
      )!;

      expect(secondsInto(beckPamphletTranscriptUniverse, playbackEnd)).toBe(59 * 60 + 3);
      // 8:37 of an 11:03 clip: the last 146 s are never played and are not in the band.
      // Resolving the keyframe back through the drift lands on the clip's 517 s frame,
      // not on its 663 s runtime.
      expect(clipSecondsOf(playbackEnd)).toBeCloseTo(517, 0);
      expect(clipSecondsOf(playbackEnd)).toBeLessThan(663);
      expect(secondsInto(beckPamphletTranscriptUniverse, verdict)).toBe(59 * 60 + 4);
      expect(verdict.targetUniverseId).toBeUndefined();
    });
  });

  describe('the audited passage', () => {
    it('is ten lines, opening on the host and closing on the producer', () => {
      expect(beckAuditedPassage).toHaveLength(10);
      expect(transcript.metadata.transcript.auditedUtterances).toBe(beckAuditedPassage.length);
      expect(transcript.metadata.transcript.laughterMarks).toBe(beckLaughterMarks.length);
      expect(transcript.metadata.transcript.captionArtifacts).toBe(beckCaptionArtifacts.length);
      expect(beckAuditedPassage[0].clipSeconds).toBe(67);
      expect(beckAuditedPassage[beckAuditedPassage.length - 1].clipSeconds).toBe(96);
    });

    it('reconciles every independently measured response position with the drift model', () => {
      const measured = beckAuditedPassage.filter(
        (utterance) => utterance.responseSeconds !== undefined,
      );
      expect(measured.length).toBeGreaterThanOrEqual(6);

      for (const utterance of measured) {
        const delta = Math.abs(deriveResponseSeconds(utterance) - utterance.responseSeconds!);
        expect({ id: utterance.id, withinTolerance: delta <= TOLERANCE }).toEqual({
          id: utterance.id,
          withinTolerance: true,
        });
      }
    });

    it('keeps the four stale rows, and proves the model disagrees with them', () => {
      const stale = beckAuditedPassage.filter(
        (utterance) => utterance.supersededResponseSeconds !== undefined,
      );

      // The pause at clip 01:26.48 flips every later row. Four rows, not one: the
      // hand-off correction generalises, and each is off by roughly one overlay.
      expect(stale.map((utterance) => utterance.id)).toEqual([
        'handoff_to_producer',
        'producer_opens',
        'goes_without_saying',
        'resources_listed',
      ]);

      for (const utterance of stale) {
        const drift = deriveResponseSeconds(utterance) - utterance.supersededResponseSeconds!;
        // Early by a whole overlay, not marginal: this is the assertion that stops a
        // stale value being re-imported as a measurement.
        expect({ id: utterance.id, offByAnOverlay: drift > 30 }).toEqual({
          id: utterance.id,
          offByAnOverlay: true,
        });
        expect(deriveResponseSeconds(utterance)).toBeGreaterThan(
          utterance.supersededResponseSeconds!,
        );
      }
    });

    it('starts the stale run exactly at the pause, and not before it', () => {
      const staleStart = Math.min(
        ...beckAuditedPassage
          .filter((utterance) => utterance.supersededResponseSeconds !== undefined)
          .map((utterance) => utterance.clipSeconds),
      );
      const pause = beckResponderDrift.pauses.find((candidate) => candidate.id === 'overlay_4703')!;

      // 01:26.48 is where the responder cuts in; the hand-off at 01:28 is the first line
      // the stop moves.
      expect(Number(pause.at) / 1e9).toBeCloseTo(86.48, 2);
      expect(staleStart).toBe(88);
      expect(88).toBeGreaterThan(Number(pause.at) / 1e9);
    });

    it('lines up with the aligned events it shares with the drift model', () => {
      const aligned = new Map(beckResponderAlignedEvents.map((event) => [event.id, event]));

      for (const utterance of beckAuditedPassage) {
        const event = aligned.get(utterance.id);
        if (!event) continue;
        expect(Math.abs(deriveResponseSeconds(utterance) - event.responseSeconds)).toBeLessThanOrEqual(
          TOLERANCE,
        );
      }

      // At least the three the drift PR built the correspondence on.
      const shared = beckAuditedPassage.filter((utterance) => aligned.has(utterance.id));
      expect(shared.map((utterance) => utterance.id)).toEqual(
        expect.arrayContaining(['producer_question', 'cost_claim', 'handoff_to_producer']),
      );
    });

    it('never labels a line it cannot attribute', () => {
      for (const utterance of beckAuditedPassage) {
        if (utterance.speaker !== 'unresolved') continue;
        // An unresolved label is allowed; an unresolved label without a reason is a
        // guess with a neutral name.
        expect(utterance.note).toBeTruthy();
        expect(utterance.attribution).toBeLessThan(0.7);
      }
    });
  });

  describe('the measurements that forced the corrections', () => {
    it('scores the cost claim as the host\'s and the producer passage as the reverse', () => {
      const { auditedPassage, producerPassage } = beckSpeakerAttribution;

      expect(auditedPassage.beck).toBeGreaterThan(0.8);
      expect(auditedPassage.producer.max).toBeLessThan(0.4);
      expect(auditedPassage.verdict).toBe('beck');

      expect(producerPassage.beck.max).toBeLessThan(0.3);
      expect(producerPassage.producer.min).toBeGreaterThan(0.8);
      expect(producerPassage.verdict).toBe('producer');
    });

    it('names one producer, and records the caption that invented a second', () => {
      expect(beckSpeakerAttribution.namedProducer).toBe('Jason');

      const grace = beckCaptionArtifacts.find((artifact) => artifact.id === 'grace_for_jason')!;
      expect(grace.caption).toContain('Grace');
      expect(grace.verified).toContain('Jason');

      // The responder names one producer on air and never a second. Nothing in the
      // record may present "Grace" as a person who spoke.
      const spokenNames = beckAuditedPassage
        .map((utterance) => utterance.text)
        .join(' ');
      expect(spokenNames).not.toContain('Grace');
    });

    it('records the second caption artifact as an artifact rather than correcting it', () => {
      const tint = beckCaptionArtifacts.find((artifact) => artifact.id === 'tint_for_tent')!;
      expect(tint.caption).toBe('Tint');
      expect(tint.verified).toBe('TENT');
    });

    it('puts no laughter on the cost claim', () => {
      const claimStart = 79;
      const claimEnd = 86;
      const nearest = beckLaughterMarks
        .map((mark) => mark.clipSeconds)
        .sort((a, b) => Math.abs(a - claimEnd) - Math.abs(b - claimEnd))[0];

      // Nine seconds after the claim ends, on the producer's "well, it's weird": the
      // studio laughs at the hand-off, not at the figure.
      expect(nearest).toBe(95);
      expect(nearest - claimEnd).toBe(9);
      for (const mark of beckLaughterMarks) {
        expect(mark.clipSeconds < claimStart || mark.clipSeconds > claimEnd).toBe(true);
      }
    });

    it('keeps the error class running the other way', () => {
      expect(beckSecondaryFinding.verdict).toBe('producer');
      expect(beckSecondaryFinding.producer).toBeGreaterThan(0.8);
      expect(beckSecondaryFinding.beck).toBeLessThan(0.2);
    });
  });

  describe('the address field', () => {
    it('records both readings, in the same role-keyed form', () => {
      expect(beckAddressReadings).toHaveLength(2);
      expect(transcript.metadata.transcript.addressReadings).toBe(beckAddressReadings.length);

      for (const reading of beckAddressReadings) {
        expect(reading.text).toContain('students of the Glenn Beck');
      }
      expect(beckAddressReadings[0].text).toContain('family');
      expect(beckAddressReadings[1].text).toContain('household');
    });

    it('points each reading at a keyframe that resolves back to it', () => {
      const keyframes = keyframesOf(beckPamphletTranscriptUniverse);

      for (const reading of beckAddressReadings) {
        const keyframe = keyframes.find((candidate) => candidate.id === reading.keyframeId);
        expect(keyframe).toBeDefined();
        // The keyframe is placed on the parent's runtime; resolving it through the drift
        // must land on the clip second the reading was transcribed at.
        expect(
          Math.abs(clipSecondsOf(keyframe!) - reading.keyframeClipSeconds),
        ).toBeLessThanOrEqual(TOLERANCE);
      }
    });

    it('keeps the five-second boundary disagreement rather than hiding it', () => {
      const second = beckAddressReadings[1];
      const gap = second.keyframeClipSeconds - second.clipSeconds;

      // 05:11 in the transcript audit, 05:16 at the aligned keyframe. Documented, not
      // resolved: picking one would be a guess wearing a timestamp.
      expect(gap).toBe(5);
      expect(second.note).toMatch(/boundary/i);
      expect(
        transcript.metadata.uncertaintyNotes.some((note) => /05:11/.test(note)),
      ).toBe(true);
    });
  });

  describe('what the record still cannot say', () => {
    it('does not use a KeyframeType the enum does not have', () => {
      // #200's draft used `KeyframeType.TESTIMONY` throughout and asked, in its last
      // paragraph, whether the type had other members. It does not: the enum has no
      // TESTIMONY, so the draft could not have compiled. Pinned here so it is not
      // reintroduced from the comment.
      expect(Object.keys(KeyframeType)).not.toContain('TESTIMONY');

      const known = new Set<string>(Object.values(KeyframeType));
      for (const keyframe of keyframesOf(beckPamphletTranscriptUniverse)) {
        expect(known.has(String(keyframe.type))).toBe(true);
      }
    });

    it('carries the pamphlet\'s unexamined status next to the data', () => {
      expect(
        transcript.metadata.uncertaintyNotes.some((note) => /pamphlet has not been examined/i.test(note)),
      ).toBe(true);
      expect(transcript.metadata.credences.register_is_sincere).toBeGreaterThan(
        transcript.metadata.credences.register_is_ironic_or_mocking,
      );
    });

    it('separates publication drift from playback drift in the record it imports', () => {
      const publicationLag =
        (RESPONSE_PUBLICATION_INSTANT - CLIP_PUBLICATION_INSTANT) / SEC;
      expect(publicationLag).toBe(162_909n);

      // The transcript's offsets are playback offsets; nesting them under a publication
      // offset would shift every line by nearly two days.
      const costClaim = beckAuditedPassage.find((utterance) => utterance.id === 'cost_claim')!;
      expect(deriveResponseSeconds(costClaim)).toBeLessThan(3600);
      expect(toDerived(beckResponderDrift, 79n * SEC)).toBe(2_814_100_000_000n);
    });
  });
});
