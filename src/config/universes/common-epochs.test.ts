import { Universe } from '../../core/types';
import { NamedBoundary, NamedBoundaryEpoch } from '../../core/named-boundary';
import { allUniverses } from './index';
import {
    COMMON_NAMED_EPOCHS,
    POST_ENRON,
    POST_NINE_ELEVEN,
    PRE_ENRON,
    PRE_NINE_ELEVEN,
} from './common-epochs';
import { NINE_ELEVEN_BOUNDARY, september11AttacksUniverse } from './historical/911';
import { ENRON_BOUNDARY, enronCollapseUniverse } from './historical/enron';
import { post911SkyscraperShiftUniverse } from './historical/skyscrapers';
import { aumf2001UsageUniverse } from './us-politics/aumf';

/**
 * Common named epochs — pre/post 9/11 and pre/post Enron (james-gibson/local-time#175).
 *
 * The point of the model is that the boundary is declared **once**, on the event
 * universe, and every consumer carries the same labelled frame. These tests
 * assert the derivation and the sharing; none of them writes the boundary date
 * down as a number.
 */

const registeredIds = new Set(
    allUniverses.map((universe) => (universe as { universeId: string }).universeId),
);

const epochOf = (universe: Universe, epochId: string) => universe.epochs?.[epochId];

const keyframeOf = (universe: Universe, keyframeId: string) =>
    universe.temporalStructure?.keyframes.find((keyframe) => keyframe.id === keyframeId);

const boundaries: Array<[NamedBoundary, Universe]> = [
    [NINE_ELEVEN_BOUNDARY, september11AttacksUniverse],
    [ENRON_BOUNDARY, enronCollapseUniverse],
];

const pairs: Array<[NamedBoundary, NamedBoundaryEpoch, NamedBoundaryEpoch]> = [
    [NINE_ELEVEN_BOUNDARY, PRE_NINE_ELEVEN, POST_NINE_ELEVEN],
    [ENRON_BOUNDARY, PRE_ENRON, POST_ENRON],
];

describe('common named epochs', () => {
    for (const [boundary, universe] of boundaries) {
        test(`the ${boundary.label} boundary is read from a registered event frame`, () => {
            expect(universe.universeId).toBe(boundary.source!.universeId);
            expect(registeredIds.has(universe.universeId)).toBe(true);

            const boundaryKeyframe = keyframeOf(universe, boundary.source!.keyframeId);
            expect(boundaryKeyframe).toBeDefined();
            // Provenance, not a duplicated date: the epoch's instant *is* the frame.
            expect(boundaryKeyframe!.timestamp).toBe(boundary.instant);
        });
    }

    for (const [boundary, before, after] of pairs) {
        test(`the ${boundary.label} boundary derives a half-open pre/post pair`, () => {
            expect(before.epochId).toBe(`${boundary.idPrefix}:pre`);
            expect(after.epochId).toBe(`${boundary.idPrefix}:post`);

            // The boundary is the only instant the pair claims.
            expect(before.endTime).toBe(boundary.instant);
            expect(before.startTime).toBeUndefined();
            expect(after.startTime).toBe(boundary.instant);
            expect(after.endTime).toBeUndefined();
        });
    }

    test('every named epoch claims exactly one end of its interval', () => {
        for (const epoch of COMMON_NAMED_EPOCHS) {
            const bounds = [epoch.startTime !== undefined, epoch.endTime !== undefined].filter(Boolean);
            expect(`${epoch.epochId}: ${bounds.length}`).toBe(`${epoch.epochId}: 1`);
        }
    });

    test('the ids are unique', () => {
        const ids = COMMON_NAMED_EPOCHS.map((epoch) => epoch.epochId);
        expect(new Set(ids).size).toBe(ids.length);
    });

    test('a consumer carries the same labelled frame, not a re-typed date', () => {
        const carriers: Array<[Universe, NamedBoundaryEpoch[]]> = [
            // The post-9/11 skyscraper shift is explicitly a before/after universe.
            [post911SkyscraperShiftUniverse, [PRE_NINE_ELEVEN, POST_NINE_ELEVEN]],
            // The AUMF is the post-9/11 statute.
            [aumf2001UsageUniverse, [POST_NINE_ELEVEN]],
            // Enron's own timeline is divided by its bankruptcy.
            [enronCollapseUniverse, [PRE_ENRON, POST_ENRON]],
        ];

        for (const [universe, epochs] of carriers) {
            for (const shared of epochs) {
                const carried = epochOf(universe, shared.epochId);
                expect(`${universe.universeId}#${shared.epochId}: ${carried !== undefined}`).toBe(
                    `${universe.universeId}#${shared.epochId}: true`,
                );
                expect(carried!.startTime).toBe(shared.startTime);
                expect(carried!.endTime).toBe(shared.endTime);
                expect(carried!.precision).toBe(shared.precision);
            }
        }
    });

    test('the boundary universes are registered', () => {
        for (const [, universe] of boundaries) {
            expect(registeredIds.has(universe.universeId)).toBe(true);
        }
    });
});
