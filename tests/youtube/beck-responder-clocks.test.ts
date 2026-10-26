import { ZeroReferenceAddressing } from '../../src/addressing/zero-reference-addressing';
import { ZeroReferenceEpoch } from '../../src/core/types';
import { allUniverses } from '../../src/config/universes';
import {
  CLIP_PUBLICATION_INSTANT,
  CLIP_RUNTIME_NS,
  RESPONSE_PUBLICATION_INSTANT,
  RESPONSE_RUNTIME_NS,
  beckMailClipUniverse,
  beckResponderAlignedEvents,
  beckResponderDrift,
  clipRuntimeOf,
  responseRuntimeOf,
  timWhitakerResponseUniverse,
} from '../../src/config/universes/youtube';
import { toDerived, toSource, totalDrift, validateClockDrift } from '../../src/utils/clock-drift';

const SEC = 1_000_000_000n;

const CLIP_ID = 'series:glenn_beck_you_wont_believe_what_i_got_in_the_mail:2026';
const RESPONDER_ID = 'series:tim_whitaker_why_christians_lie_about_transgender_kids:2026';

/** The tolerance the measurement earns: caption tracks resolve an instant to about a second. */
const MEASUREMENT_TOLERANCE = 1500n * 1_000_000n;

const keyframesOf = (universe: typeof beckMailClipUniverse) =>
  ((universe.temporalStructure as any).keyframes ?? []) as Array<{
    id: string;
    timestamp: bigint;
    type?: string;
    targetUniverseId?: string;
    targetKeyframeId?: string;
    targetKeyframeType?: string;
  }>;

const zeroEpochOf = (universe: typeof beckMailClipUniverse): ZeroReferenceEpoch => {
  const layer = (universe as any).layers.find(
    (candidate: any) => candidate.layerId === 'zero_reference',
  );
  return layer.epochs.runtime_zero as ZeroReferenceEpoch;
};

describe('the clip and the response as two clocks', () => {
  describe('registration', () => {
    it('registers both works in the corpus', () => {
      const ids = allUniverses.map((universe) => universe.universeId);
      expect(ids).toContain(CLIP_ID);
      expect(ids).toContain(RESPONDER_ID);
    });

    it('keeps the two clocks distinct', () => {
      expect(beckResponderDrift.sourceId).toBe(CLIP_ID);
      expect(beckResponderDrift.derivedId).toBe(RESPONDER_ID);
      expect(validateClockDrift(beckResponderDrift)).toEqual([]);
    });
  });

  describe('the drift table', () => {
    it('records ten stops totalling 333.39 s', () => {
      expect(beckResponderDrift.pauses).toHaveLength(10);
      expect(totalDrift(beckResponderDrift)).toBe(333_390_000_000n);
    });

    it('starts the clip 44:52.52 into the response', () => {
      expect(beckResponderDrift.baseOffset).toBe(2_692_520_000_000n);
      expect(beckResponderDrift.baseOffset).toBe(2692n * SEC + 520n * 1_000_000n);
    });

    it('keeps the base offset and the pause total separate', () => {
      // Both numbers are seconds, but they answer different questions: where the clip
      // starts, and how much time the response spends with it stopped.
      expect(beckResponderDrift.baseOffset).not.toBe(totalDrift(beckResponderDrift));
      expect(
        beckResponderDrift.baseOffset + totalDrift(beckResponderDrift),
      ).toBe(3_025_910_000_000n);
    });
  });

  describe('the two clocks agree at every aligned event', () => {
    it('maps each clip instant onto its recorded response instant', () => {
      const residuals = beckResponderAlignedEvents.map((event) => {
        const clipKf = keyframesOf(beckMailClipUniverse).find((kf) => kf.id === event.id);
        const responseKf = keyframesOf(timWhitakerResponseUniverse).find((kf) => kf.id === event.id);
        expect(clipKf).toBeDefined();
        expect(responseKf).toBeDefined();

        const predicted = toDerived(beckResponderDrift, clipRuntimeOf(clipKf!.timestamp));
        const actual = responseRuntimeOf(responseKf!.timestamp);
        return { id: event.id, residual: predicted > actual ? predicted - actual : actual - predicted };
      });

      for (const { id, residual } of residuals) {
        expect({ id, withinTolerance: residual <= MEASUREMENT_TOLERANCE }).toEqual({
          id,
          withinTolerance: true,
        });
      }
      // The measurement's own precision is about a second; anything larger means the
      // drift table and the keyframes disagree, not that the fit was marginal.
      expect(Math.max(...residuals.map((entry) => Number(entry.residual) / 1e9))).toBeLessThan(1.5);
    });

    it('round-trips each response instant back to the clip instant that produced it', () => {
      for (const event of beckResponderAlignedEvents) {
        const responseKf = keyframesOf(timWhitakerResponseUniverse).find((kf) => kf.id === event.id)!;
        const clipKf = keyframesOf(beckMailClipUniverse).find((kf) => kf.id === event.id)!;
        const back = toSource(beckResponderDrift, responseRuntimeOf(responseKf.timestamp));
        // Only the cost claim sits far enough from a pause to round-trip without touching
        // one; for the rest the instant is either before or after a stop, never inside.
        expect(back.insidePause).toBe(false);
        const offset = back.sourceTime - clipRuntimeOf(clipKf.timestamp);
        expect(offset <= MEASUREMENT_TOLERANCE && offset >= -MEASUREMENT_TOLERANCE).toBe(true);
      }
    });

    it('covers the whole playback rather than a prefix of it', () => {
      const first = beckResponderAlignedEvents[0];
      const last = beckResponderAlignedEvents[beckResponderAlignedEvents.length - 1];
      expect(first.clipSeconds).toBe(0);
      expect(last.clipSeconds).toBe(517);
      // The clip is 663 s; the response leaves it at 517 s, so the final 146 s are never
      // played and must not appear in the drift as if they were.
      expect(last.clipSeconds).toBeLessThan(Number(CLIP_RUNTIME_NS / SEC));
    });
  });

  describe('the keyframe links name the same occurrences', () => {
    it('has a clip keyframe for every aligned event and no stray ones', () => {
      const clipIds = keyframesOf(beckMailClipUniverse).map((kf) => kf.id);
      expect(clipIds).toEqual(beckResponderAlignedEvents.map((event) => event.id));
      expect(keyframesOf(timWhitakerResponseUniverse).map((kf) => kf.id)).toEqual(clipIds);
    });

    it('points every response keyframe at the clip keyframe it replays', () => {
      const clipIds = new Set(keyframesOf(beckMailClipUniverse).map((kf) => kf.id));
      for (const keyframe of keyframesOf(timWhitakerResponseUniverse)) {
        expect(keyframe.targetUniverseId).toBe(CLIP_ID);
        expect(keyframe.targetKeyframeId).toBe(keyframe.id);
        expect(clipIds.has(keyframe.targetKeyframeId!)).toBe(true);
      }
    });

    it('leaves the clip free of per-occurrence links', () => {
      // The clip does not know it will be played inside this response; the response owns
      // the occurrence, so the converse is a universe-level `PLAYED_IN` edge.
      for (const keyframe of keyframesOf(beckMailClipUniverse)) {
        expect(keyframe.targetUniverseId).toBeUndefined();
      }
    });
  });

  describe('the two universes are connected more than one way', () => {
    it('declares the excerpt and the playback-with-pauses edges from the response', () => {
      const types = ((timWhitakerResponseUniverse as any).connections.references ?? []).map(
        (reference: any) => reference.type,
      );
      expect(types).toContain('EXCERPTS');
      expect(types).toContain('PLAYED_BACK_WITH_PAUSES');
    });

    it('declares the converse edge from the clip', () => {
      const references = ((beckMailClipUniverse as any).connections.references ?? []) as any[];
      const playedIn = references.find((reference) => reference.type === 'PLAYED_IN');
      expect(playedIn?.targetUniverseId).toBe(RESPONDER_ID);
    });

    it('anchors the response to the clip in its reality relation', () => {
      const anchors = (timWhitakerResponseUniverse as any).realityRelation.realityAnchors;
      expect(anchors.map((anchor: any) => anchor.realEventId)).toContain(CLIP_ID);
    });
  });

  describe('zero-reference addressing on both clocks', () => {
    const clipZero = zeroEpochOf(beckMailClipUniverse);
    const responseZero = zeroEpochOf(timWhitakerResponseUniverse);

    it('addresses the cost claim as T+00:01:19 on the clip and T+00:46:54 on the response', () => {
      const clipAddress = ZeroReferenceAddressing.generateRelativeAddress(
        CLIP_ID,
        'runtime_zero',
        'T+',
        0,
        1,
        19,
      );
      const responseAddress = ZeroReferenceAddressing.generateRelativeAddress(
        RESPONDER_ID,
        'runtime_zero',
        'T+',
        0,
        46,
        54,
      );

      expect(clipAddress).toBe(`${CLIP_ID}:runtime_zero:T+00:01:19`);
      expect(responseAddress).toBe(`${RESPONDER_ID}:runtime_zero:T+00:46:54`);
      expect((beckMailClipUniverse as any).metadata.startingPoints.addresses.cost_claim).toEqual({
        clip: clipAddress,
        response: responseAddress,
      });
    });

    it('resolves the two addresses to instants the drift model connects', () => {
      const clipParsed = ZeroReferenceAddressing.parseRelativeAddress(
        `${CLIP_ID}:runtime_zero:T+00:01:19`,
      );
      const responseParsed = ZeroReferenceAddressing.parseRelativeAddress(
        `${RESPONDER_ID}:runtime_zero:T+00:46:54`,
      );

      expect(clipParsed.isValid).toBe(true);
      expect(responseParsed.isValid).toBe(true);

      const clipInstant = ZeroReferenceAddressing.relativeToAbsolute(clipParsed.relativeTime, clipZero);
      const responseInstant = ZeroReferenceAddressing.relativeToAbsolute(
        responseParsed.relativeTime,
        responseZero,
      );

      expect(clipInstant).toBe(CLIP_PUBLICATION_INSTANT + 79n * SEC);

      // The address pair is only correct if the drift model puts the clip's T+1:19 at the
      // response's T+46:54. This is the assertion that makes the two addressings one fact.
      const predicted = RESPONSE_PUBLICATION_INSTANT + toDerived(beckResponderDrift, 79n * SEC);
      const difference = predicted - responseInstant;
      expect(difference <= MEASUREMENT_TOLERANCE && difference >= -MEASUREMENT_TOLERANCE).toBe(
        true,
      );
    });
  });

  describe('publication drift is a different quantity from playback drift', () => {
    it('separates the two days between the uploads from the six minutes inside one of them', () => {
      const publicationLag =
        (RESPONSE_PUBLICATION_INSTANT - CLIP_PUBLICATION_INSTANT) / 1_000_000_000n;
      expect(publicationLag).toBe(162_909n); // 1 d 21 h 15 m 09 s

      // The clip's zero lands 2,692.52 s into the response *runtime*, and the response was
      // published 162,909 s after the clip — so the segment's absolute offset is the sum,
      // and conflating them would misplace every instant by two days.
      expect(publicationLag).not.toBe(beckResponderDrift.baseOffset);
      expect(RESPONSE_RUNTIME_NS).toBeGreaterThan(beckResponderDrift.baseOffset);
    });
  });
});
