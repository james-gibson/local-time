import { LocalTime } from '../../../index';

/**
 * local-time#57 — the `nasa` network.
 *
 * ## The bug this pins
 *
 * `UniverseRegistry.registerNetwork` used to register the *network* as a universe under its
 * own `networkId`:
 *
 *     this.registerUniverse(network.networkId, network as unknown as Universe);
 *
 * `registerUniverse` throws for anything that is not a valid universe id, and a network id
 * never is — `nasa` is not `category:identifier:year`. Because `registerNetwork` was
 * `async` and its callers did not await it, the throw escaped as an unhandled rejection and
 * the `this.networks.set(...)` on the following line never ran.
 *
 * **A network with any members could therefore never be registered at all.** `disney` and
 * `marvel` appeared to work only because their member sets are empty.
 *
 * The first test below is that regression, stated directly: a network with a non-empty
 * `universes` set must be retrievable.
 */
describe('the nasa network (#57)', () => {
    let registry: ReturnType<LocalTime['getRegistry']>;

    beforeAll(async () => {
        const localTime = new LocalTime();
        await localTime.initialize();
        registry = localTime.getRegistry();
    });

    describe('registration', () => {
        /** The regression. `nasa` has four members; `disney` and `marvel` have none. */
        test('a network WITH members is retrievable', () => {
            const nasa = registry.getNetwork('nasa');
            expect(nasa).toBeDefined();
            expect(nasa!.networkId).toBe('nasa');
            expect(nasa!.universes.size).toBeGreaterThan(0);
        });

        /** The empty networks must not have been broken by the fix. */
        test.each(['disney', 'marvel'])('the empty %s network still registers', id => {
            expect(registry.getNetwork(id)).toBeDefined();
        });
    });

    describe('eras', () => {
        test('both eras the jfk test looks for exist', () => {
            const eras = registry.getNetwork('nasa')!.eras;
            expect(eras.map(e => e.eraId)).toEqual(['disaster_investigations', 'cultural_impact']);
        });

        test('era boundaries are ordered', () => {
            for (const era of registry.getNetwork('nasa')!.eras) {
                expect(`${era.eraId}:${era.end > era.start}`).toBe(`${era.eraId}:true`);
            }
        });

        /**
         * Era membership is a claim about universes that exist. A dangling id would make
         * the era quietly wrong, which is the same class of defect as the vacuous jfk
         * assertions #57 was filed for.
         */
        test('every era member resolves to a registered universe', () => {
            for (const era of registry.getNetwork('nasa')!.eras) {
                expect(`${era.eraId}:${era.universes.length}`).not.toBe(`${era.eraId}:0`);
                for (const id of era.universes) {
                    expect(`${era.eraId}/${id}:${Boolean(registry.getUniverse(id))}`)
                        .toBe(`${era.eraId}/${id}:true`);
                }
            }
        });

        test('every network member resolves too', () => {
            for (const id of registry.getNetwork('nasa')!.universes) {
                expect(`${id}:${Boolean(registry.getUniverse(id))}`).toBe(`${id}:true`);
            }
        });
    });

    /**
     * 1e15 ns is 1970-01-12, eleven days after the Unix epoch. Every timestamp in these
     * universes is decades past that, while a *seconds* value for any of them is around
     * 1e9 — six orders of magnitude below the bound. So this cannot reject a legitimate
     * date and cannot admit a seconds value.
     *
     * The first threshold I picked, 1e17 ns (1973-03-03), was too high: it rejected
     * Apollo 13, which is legitimately in 1970. Caught by the test, which is the only
     * reason to write one.
     */
    const NS_MIN_NS = 1_000_000_000_000_000n;

    describe('the universes the jfk test needs', () => {
        test('all four exist', () => {
            for (const id of [
                'nasa:challenger:1986',
                'nasa:apollo13:1970',
                'history:rogers_commission:1986',
                'movie:apollo13:1995',
            ]) {
                expect(`${id}:${Boolean(registry.getUniverse(id))}`).toBe(`${id}:true`);
            }
        });

        /**
         * `tests/jfk.test.ts` selects the disaster by tag. A renamed tag empties the result
         * silently instead of failing loudly, so the tag vocabulary is pinned here.
         */
        test("the challenger carries a keyframe tagged 'disaster'", () => {
            const kfs = registry.getUniverse('nasa:challenger:1986')!.temporalStructure!.keyframes!;
            expect(kfs.some(k => k.tags?.includes('disaster') || k.tags?.includes('explosion'))).toBe(true);
        });

        /**
         * The registry normalises epochs at registration and indexes them by `epochId`, not
         * by layer key. The jfk test originally read `epochs.hearing`, which is why it had to
         * change to `epochs['rogers:hearing']`. Pinned so the key is not "simplified" back.
         */
        test("the commission's hearing epoch is keyed by epochId", () => {
            const epochs = registry.getUniverse('history:rogers_commission:1986')!.epochs!;
            expect(Object.keys(epochs)).toContain('rogers:hearing');
            expect(epochs['rogers:hearing']!.startTime).toBeDefined();
        });

        test('the accident precedes the commission, by six days', () => {
            const challenger = registry.getUniverse('nasa:challenger:1986')!;
            const commission = registry.getUniverse('history:rogers_commission:1986')!;
            const breakup = challenger.temporalStructure!.keyframes!.find(k => k.tags?.includes('disaster'))!;
            const hearingEpoch = commission.epochs!['rogers:hearing'];
            expect(hearingEpoch).toBeDefined();
            const hearing = hearingEpoch!.startTime!;

            // Exact: 5 days 7h 19m 47s, because the breakup is at 16:40:13 and the
            // commission was created at the start of a day. Counting calendar days gives
            // "the sixth day", which is why the coarser jfk assertion reads 5 when it
            // truncates to whole days. Both are right about different things.
            const seconds = Number(hearing - breakup.timestamp) / 1_000_000_000;
            expect(seconds).toBe(458387);
        });

        /** Timestamps are nanoseconds. A seconds value here is the #8 defect all over again. */
        test('timestamps are nanoseconds, not seconds', () => {
            for (const id of ['nasa:challenger:1986', 'nasa:apollo13:1970', 'history:rogers_commission:1986']) {
                for (const kf of registry.getUniverse(id)!.temporalStructure!.keyframes!) {
                    expect(`${id}/${kf.id}:${kf.timestamp > NS_MIN_NS}`)
                        .toBe(`${id}/${kf.id}:true`);
                }
            }
        });

        /**
         * The film is a dramatisation and says so. `nasa:apollo13:1970` is the mission
         * record; keeping them separate is what stops the film's rearrangement of the
         * explosion being read as history.
         */
        test('the film is marked fictionalised and points at the mission', () => {
            const film = registry.getUniverse('movie:apollo13:1995')! as any;
            expect(film.realityRelation.fictionalizationDegree).toBeGreaterThan(0.5);
            expect(film.realityRelation.realityAnchors[0].realEventId).toBe('nasa:apollo13:1970');
            expect(film.attribution.public_domain).toBe(false);
        });
    });
});
