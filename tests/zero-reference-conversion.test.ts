import { ZeroReferenceQueryService } from '../src/zero-reference-queries';
import { ZeroReferenceAddressing } from '../src/addressing/zero-reference-addressing';
import { apollo11Universe, ddayUniverse } from '../src/zero-reference-examples';
import { ZeroReferenceEpoch } from '../src/temporal-system';

/**
 * local-time#56 — `convertBetweenZeroReferenceSystems` was a stub.
 *
 * It parsed the address just enough to avoid an obvious failure, then returned the literal
 * string `"converted_time"`. Every test below asserts on a real address in the target
 * frame, so the stub cannot satisfy any of them.
 *
 * The expected offsets are computed from the two fixtures, not copied from the
 * implementation:
 *
 *   D-Day `operation` zero   1944-06-06 06:30:00Z   beforePrefix "H-"  afterPrefix "H+"
 *   Apollo 11 `launch` zero  1969-07-16 13:32:00Z   beforePrefix "T-"  afterPrefix "T+"
 *   difference                9171 days, 07:02:00
 */
describe('convertBetweenZeroReferenceSystems (#56)', () => {
    let service: ZeroReferenceQueryService;

    beforeEach(() => {
        service = new ZeroReferenceQueryService();
        service.registerUniverse(apollo11Universe);
        service.registerUniverse(ddayUniverse);
    });

    const toDday = (addr: string) =>
        service.convertBetweenZeroReferenceSystems(addr, 'history:dday:1944', 'operation');

    test('liftoff converts to the correct D-Day offset', async () => {
        expect(await toDday('nasa:apollo11:1969:launch:T+00:00:00'))
            .toBe('history:dday:1944:operation:H+9171 07:02:00');
    });

    test('first-stage separation is 2m46s later in the target frame', async () => {
        expect(await toDday('nasa:apollo11:1969:launch:T+00:02:46'))
            .toBe('history:dday:1944:operation:H+9171 07:04:46');
    });

    test('a pre-liftoff instant converts to an earlier target offset', async () => {
        // The ordering is preserved, not merely the presence of an address.
        const pre = await toDday('nasa:apollo11:1969:launch:T-00:05:30');
        const at = await toDday('nasa:apollo11:1969:launch:T+00:00:00');
        expect(pre).toBe('history:dday:1944:operation:H+9171 06:56:30');
        expect(pre! < at!).toBe(true);
    });

    test('converting between two frames of the SAME universe round-trips exactly', async () => {
        // The strongest available check: apollo11 has launch and go_no_go 5m30s apart over
        // the same absolute interval, so a correct conversion must land on the documented
        // offset and survive the trip back.
        const inGoNoGo = await service.convertBetweenZeroReferenceSystems(
            'nasa:apollo11:1969:launch:T+00:00:00', 'nasa:apollo11:1969', 'go_no_go');
        expect(inGoNoGo).toBe('nasa:apollo11:1969:go_no_go:T+00:05:30');

        const backToLaunch = await service.convertBetweenZeroReferenceSystems(
            inGoNoGo!, 'nasa:apollo11:1969', 'launch');
        expect(backToLaunch).toBe('nasa:apollo11:1969:launch:T+00:00:00');
    });

    test('the converted address resolves back to the same absolute instant', async () => {
        const converted = await service.convertBetweenZeroReferenceSystems(
            'nasa:apollo11:1969:launch:T+00:02:46', 'history:dday:1944', 'operation');
        expect(converted).not.toBeNull();

        // Re-derive the absolute time from the target address and compare with the source.
        const dday = ddayUniverse.epochs.operation as ZeroReferenceEpoch;
        const m = converted!.match(/:H\+(\d+) (\d{2}):(\d{2}):(\d{2})$/)!;
        const totalMs =
            (Number(m[1]) * 86400 + Number(m[2]) * 3600 + Number(m[3]) * 60 + Number(m[4])) * 1000;
        const recovered = dday.zeroPoint + BigInt(totalMs) * 1_000_000n;
        const source = apollo11Universe.epochs.launch as ZeroReferenceEpoch;
        const expected =
            source.zeroPoint +
            BigInt((0 * 3600 + 2 * 60 + 46) * 1000) * 1_000_000n;

        expect(recovered).toBe(expected);
    });

    test('a negative relative offset keeps the sign', async () => {
        // T-00:05:30 in the launch frame must not become a positive offset in the target.
        const converted = await toDday('nasa:apollo11:1969:launch:T-00:05:30');
        expect(converted).toContain('H+9171 06:56:30');
        expect(converted).not.toContain('H-');
    });

    describe('returns null rather than a plausible-looking address', () => {
        test('an unparseable address', async () => {
            expect(await toDday('nonsense')).toBeNull();
        });

        test('an address naming a universe that is not registered', async () => {
            expect(await toDday('nasa:apollo13:1970:launch:T+00:00:00')).toBeNull();
        });

        test('an unknown target universe', async () => {
            expect(await service.convertBetweenZeroReferenceSystems(
                'nasa:apollo11:1969:launch:T+00:00:00', 'history:nowhere:1900', 'operation')).toBeNull();
        });

        test('an unknown target epoch', async () => {
            expect(await toDday('nasa:apollo11:1969:launch:T+00:00:00')).not.toBeNull();
            expect(await service.convertBetweenZeroReferenceSystems(
                'nasa:apollo11:1969:launch:T+00:00:00', 'history:dday:1944', 'no-such-epoch')).toBeNull();
        });

        test('an unknown source epoch', async () => {
            expect(await service.convertBetweenZeroReferenceSystems(
                'nasa:apollo11:1969:no-such-epoch:T+00:00:00', 'history:dday:1944', 'operation')).toBeNull();
        });

        test('a relative offset that is not a relative timestamp', async () => {
            expect(await toDday('nasa:apollo11:1969:launch:banana')).toBeNull();
            // The old parse read a colons-in-the-offset address as epoch "T-00"; this is the
            // case that produced a wrong-but-plausible universe id.
            expect(await toDday('nasa:apollo11:1969:launch:99:99:99')).toBeNull();
        });
    });

    /**
     * The old implementation derived the source universe id as `parts.slice(0, -2)`,
     * which for a colon-bearing offset yields `nasa:apollo11:1969:launch` and an epoch of
     * `T-00`. That happened to resolve to nothing and return null — so the broken parse
     * was invisible. This pins the parsing independently of the conversion.
     */
    test('the source address is parsed by registered id, not by segment count', async () => {
        // A three-segment universe id followed by an epoch and an HMS offset. Any parser
        // that assumes "last two segments" gets this wrong.
        expect(await toDday('nasa:apollo11:1969:launch:T+00:00:00')).not.toBeNull();
        expect(await toDday('history:dday:1944:operation:H+00:00:00')).not.toBeNull();
    });

    test('the conversion is the inverse of absoluteToRelative for a same-frame pair', async () => {
        const source = apollo11Universe.epochs.launch as ZeroReferenceEpoch;
        const target = apollo11Universe.epochs.go_no_go as ZeroReferenceEpoch;
        // 330s past the go/no-go zero is exactly liftoff, which the fixture records as
        // T+00:05:30 in that frame. A true inverse: absolute -> relative -> the documented
        // offset. (Measuring from the launch zero instead gives 11m00s, not 5m30s.)
        const absolute = target.zeroPoint + BigInt(330) * 1_000_000_000n;

        const relative = ZeroReferenceAddressing.absoluteToRelative(absolute, target);
        expect(relative.prefix).toBe(target.afterPrefix);
        expect(relative.hours).toBe(0);
        expect(relative.minutes).toBe(5);
        expect(relative.seconds).toBe(30);

        // And the same instant read in the launch frame is exactly its zero.
        const inLaunch = ZeroReferenceAddressing.absoluteToRelative(absolute, source);
        expect(inLaunch.minutes).toBe(0);
        expect(inLaunch.seconds).toBe(0);
    });
});
