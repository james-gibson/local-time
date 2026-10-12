import { ZeroReferenceQueryService } from '../src/zero-reference-queries';
import { ZeroReferenceAddressing } from '../src/addressing/zero-reference-addressing';
import { apollo11Universe } from '../src/zero-reference-examples';
import { ZeroReferenceEpoch } from '../src/temporal-system';

/**
 * local-time#55 — `findEventsInRelativeRange` ignored its bounds.
 *
 * The old implementation never read either argument. It returned
 * `[zeroPoint, zeroPoint + 1h]`, so the function's result depended only on the epoch and
 * not on the query. Every test below is written so that it would pass or fail on the
 * *bounds*, not merely on the fixture.
 *
 * Fixture facts this relies on (apollo11, all already on `main`):
 *   go_no_go_poll           1969-07-16 13:26:30Z   T-00:05:30 in the `launch` frame
 *   liftoff                1969-07-16 13:32:00Z   T+00:00:00
 *   first_stage_separation 1969-07-16 13:34:46Z   T+00:02:46
 */
const NS = (iso: string) => BigInt(new Date(iso).getTime()) * 1_000_000n;

const rel = (prefix: string, o: Partial<{ days: number; hours: number; minutes: number; seconds: number }> = {}) => ({
    prefix,
    days: o.days ?? 0,
    hours: o.hours ?? 0,
    minutes: o.minutes ?? 0,
    seconds: o.seconds ?? 0,
    milliseconds: 0,
});

describe('findEventsInRelativeRange honours its bounds (#55)', () => {
    let service: ZeroReferenceQueryService;

    beforeEach(() => {
        service = new ZeroReferenceQueryService();
        service.registerUniverse(apollo11Universe);
    });

    const ids = (events: any[]) => events.map(e => e.id);

    test('a range reaching before the zero includes a pre-zero keyframe', async () => {
        // The regression. Previously this returned only the hour after liftoff.
        const events = await service.findEventsInRelativeRange(
            'nasa:apollo11:1969', 'launch',
            rel('T-', { minutes: 10 }),
            rel('T+', { minutes: 5 }),
        );
        expect(ids(events)).toContain('go_no_go_poll');
        expect(ids(events)).toEqual(
            expect.arrayContaining(['go_no_go_poll', 'liftoff', 'first_stage_separation']),
        );
    });

    test('narrowing the range narrows the result — the old stub could not do this', async () => {
        const wide = await service.findEventsInRelativeRange(
            'nasa:apollo11:1969', 'launch', rel('T-', { hours: 1 }), rel('T+', { hours: 1 }));
        // first_stage_separation sits at T+00:02:46; bracket it and nothing else.
        const narrow = await service.findEventsInRelativeRange(
            'nasa:apollo11:1969', 'launch', rel('T+', { minutes: 2, seconds: 30 }), rel('T+', { minutes: 5 }));

        expect(narrow.length).toBeLessThan(wide.length);
        expect(ids(narrow)).toEqual(['first_stage_separation']);
    });

    test('a single-instant range returns nothing, because no keyframe is on a boundary', async () => {
        const events = await service.findEventsInRelativeRange(
            'nasa:apollo11:1969', 'launch', rel('T+', { minutes: 30 }), rel('T+', { minutes: 31 }));
        expect(events).toEqual([]);
    });

    test('an exactly-zero range does not match the liftoff keyframe inclusively twice', async () => {
        // Bounds are inclusive at both ends, so T+00:00:00..T+00:00:00 must match liftoff
        // exactly once rather than returning a duplicate.
        const events = await service.findEventsInRelativeRange(
            'nasa:apollo11:1969', 'launch', rel('T+'), rel('T+'));
        expect(ids(events)).toEqual(['liftoff']);
    });

    test('reversed bounds return the same set as correctly ordered bounds', async () => {
        const ordered = await service.findEventsInRelativeRange(
            'nasa:apollo11:1969', 'launch', rel('T-', { minutes: 10 }), rel('T+', { minutes: 5 }));
        const reversed = await service.findEventsInRelativeRange(
            'nasa:apollo11:1969', 'launch', rel('T+', { minutes: 5 }), rel('T-', { minutes: 10 }));
        expect(ids(reversed)).toEqual(ids(ordered));
    });

    test('the same relative range means different absolute spans in different frames', async () => {
        // T-00:05:30..T+00:00:00 straddles the launch zero but sits entirely before the
        // go/no-go zero. Same query, different epoch, different answer.
        const inLaunch = await service.findEventsInRelativeRange(
            'nasa:apollo11:1969', 'launch', rel('T-', { minutes: 5, seconds: 30 }), rel('T+'));
        const inGoNoGo = await service.findEventsInRelativeRange(
            'nasa:apollo11:1969', 'go_no_go', rel('T-', { minutes: 5, seconds: 30 }), rel('T-', { minutes: 1 }));

        expect(ids(inLaunch)).toContain('go_no_go_poll');
        // In the go_no_go frame that same window is 13:21:00-13:25:30, entirely before the
        // poll at 13:26:30, so the query that finds the poll in one frame misses it in the other.
        expect(ids(inGoNoGo)).not.toContain('go_no_go_poll');
        expect(inGoNoGo).toEqual([]);
    });

    test('multi-day bounds are applied, not truncated to hours', async () => {
        // A range that only exists if `days` is honoured: 1 day out is far beyond any
        // keyframe, so the result must be empty rather than the same as a 0-day query.
        const oneDay = await service.findEventsInRelativeRange(
            'nasa:apollo11:1969', 'launch', rel('T+', { days: 1 }), rel('T+', { days: 1, hours: 1 }));
        expect(oneDay).toEqual([]);

        const coveringAll = await service.findEventsInRelativeRange(
            'nasa:apollo11:1969', 'launch', rel('T-', { days: 1 }), rel('T+', { days: 1 }));
        expect(ids(coveringAll)).toEqual(
            expect.arrayContaining(['go_no_go_poll', 'liftoff', 'first_stage_separation']),
        );
    });

    test('an unrecognised prefix is rejected rather than guessed at', async () => {
        // The epoch declares beforePrefix "T-"/afterPrefix "T+". Silently treating "X-" as
        // a negative offset would return a valid timestamp for the wrong interval.
        await expect(
            service.findEventsInRelativeRange(
                'nasa:apollo11:1969', 'launch', rel('X-', { minutes: 5 }), rel('T+')),
        ).rejects.toThrow(/Unrecognised prefix/);
    });

    test('an unknown universe or non-zero-reference epoch still returns empty', async () => {
        await expect(
            service.findEventsInRelativeRange('nasa:does-not-exist:1969', 'launch', rel('T-'), rel('T+')),
        ).resolves.toEqual([]);
        await expect(
            service.findEventsInRelativeRange('nasa:apollo11:1969', 'no-such-epoch', rel('T-'), rel('T+')),
        ).resolves.toEqual([]);
    });
});

describe('relativeToAbsolute applies days (#55 dependency)', () => {
    const epoch = apollo11Universe.epochs.launch as ZeroReferenceEpoch;

    test('one day is 86,400 seconds, not zero', () => {
        const oneDay = ZeroReferenceAddressing.relativeToAbsolute(rel('T+', { days: 1 }), epoch);
        expect(oneDay - epoch.zeroPoint).toBe(86_400_000_000_000n);
    });

    test('days compose with hours, minutes and seconds', () => {
        const composed = ZeroReferenceAddressing.relativeToAbsolute(
            rel('T+', { days: 1, hours: 2, minutes: 3, seconds: 4 }), epoch);
        const expected = BigInt(((86400 + 2 * 3600 + 3 * 60 + 4) * 1000)) * 1_000_000n;
        expect(composed - epoch.zeroPoint).toBe(expected);
    });

    test('the epoch zero resolves to itself in both frames', () => {
        const launchZero = apollo11Universe.epochs.launch as ZeroReferenceEpoch;
        expect(ZeroReferenceAddressing.relativeToAbsolute(rel('T+'), launchZero)).toBe(launchZero.zeroPoint);
        expect(ZeroReferenceAddressing.relativeToAbsolute(rel('T-'), launchZero)).toBe(launchZero.zeroPoint);
    });

    test('the go/no-go frame is 5:30 earlier, matching the fixture', () => {
        const goNoGo = apollo11Universe.epochs.go_no_go as ZeroReferenceEpoch;
        expect(NS('1969-07-16T13:26:30Z') - goNoGo.zeroPoint).toBe(0n);
        expect(NS('1969-07-16T13:32:00Z') - goNoGo.zeroPoint).toBe(330_000_000_000n);
    });
});
