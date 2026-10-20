import { UniverseRegistry } from '../universe-registry';
import { ConfigLoader } from '../config-loader';
import { TimePrecision, Universe } from '../../core/types';

/**
 * james-gibson/local-time#173 — a frame's accuracy and calendar are assertions.
 *
 * Every universe is readable against the injected `utc:unix_epoch` and
 * `utc:gregorian` frames. Those frames are how a BCE/CE claim is expressed: the
 * Gregorian frame names its own zero (`Anno Domini start`) and its BC/AD
 * prefixes, so an assertion about a date pins the *calendar frame*, not a
 * nanosecond literal.
 *
 * Both frames used to carry decimal strings (`"precision": "DAY"`, `"0"`) behind
 * an `as unknown as TemporalEpoch` cast, so the declared accuracy disagreed with
 * its own type. These tests are the type-level half of the doctrine.
 */

const emptyLoader = { loadConfigurations: async () => [] } as unknown as ConfigLoader;

describe('injected calendar frames', () => {
    let universe: Universe;

    beforeAll(async () => {
        const registry = new UniverseRegistry(emptyLoader);
        await registry.initialize();
        universe = registry.getUniverse('history:costco:1983')!;
    });

    /**
     * The frame is addressed by its **id**, because the map key is the id — an
     * injected frame used to be keyed `unix` while its `epochId` said
     * `utc:unix_epoch`, so the label could not find it.
     */
    const frame = (id: string): TemporalEpochView => {
        const entry = universe.epochs?.[id];
        if (!entry) throw new Error(`No injected frame "${id}"`);
        expect(entry.epochId).toBe(id);
        return entry as TemporalEpochView;
    };

    interface TemporalEpochView {
        epochId?: string;
        precision: TimePrecision;
        startTime?: bigint;
        endTime?: bigint;
        zeroPoint?: bigint;
        zeroEvent?: string;
        beforePrefix?: string;
        afterPrefix?: string;
    }

    test.each(['utc:unix_epoch', 'utc:gregorian'])('%s declares a numeric TimePrecision', (id) => {
        const entry = frame(id);
        expect(typeof entry.precision).toBe('number');
        expect(Object.values(TimePrecision)).toContain(entry.precision);
    });

    test.each(['utc:unix_epoch', 'utc:gregorian'])('%s carries bigint bounds in the corpus unit', (id) => {
        const entry = frame(id);
        expect(typeof entry.startTime).toBe('bigint');
        expect(typeof entry.endTime).toBe('bigint');
        expect(typeof entry.zeroPoint).toBe('bigint');
    });

    test('the Gregorian frame is where a BC/AD claim is expressed', () => {
        const gregorian = frame('utc:gregorian');
        expect(gregorian.zeroEvent).toMatch(/Anno Domini/);
        expect(gregorian.beforePrefix).toBe('BCE ');
        expect(gregorian.afterPrefix).toBe('CE ');
        expect(gregorian.precision).toBe(TimePrecision.DAY);
    });

    test("the Unix frame's zero is its own identity", () => {
        const unix = frame('utc:unix_epoch');
        expect(unix.zeroEvent).toMatch(/Unix epoch/);
        expect(unix.zeroPoint).toBe(0n);
        expect(unix.precision).toBe(TimePrecision.NANOSECOND);
    });

    test('a BCE instant is before the Gregorian zero point, not a negative literal', () => {
        // The relation is the assertion; `zeroPoint - 1n` is defined by the frame,
        // not by a date someone typed into the test.
        const gregorian = frame('utc:gregorian');
        const justBeforeTheCommonEra = gregorian.zeroPoint! - 1n;

        expect(justBeforeTheCommonEra < gregorian.zeroPoint!).toBe(true);
        expect(gregorian.beforePrefix).toBe('BCE ');
    });

    test('a historical universe inherits both frames without overriding them', () => {
        expect(universe.epochs?.['utc:gregorian']).toBeDefined();
        expect(universe.epochs?.['utc:unix_epoch']).toBeDefined();
    });
});
