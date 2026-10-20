import { LocalTime } from '../../../index';
import { TimePrecision } from '../../../core/types';
import type { Universe } from '../../../core/types';
import { createUniverseId } from '../../../core/universe-ids';
import { UniverseRegistry } from '../../universe-registry';
import { ConfigLoader } from '../../config-loader';
import { disneyNetwork, marvelNetwork } from './networks';

/**
 * james-gibson/local-time#103 — `UniverseNetwork.sharedEpochs` and `eras`.
 *
 * Both were declared and never read. `sharedEpochs` is now inherited by every
 * member at registration (the member's own epoch of the same id wins), and an
 * era's `universes` is validated against the network's membership, because an
 * era is a slice of that membership rather than an independent claim.
 */
describe('network shared epochs and eras (james-gibson/local-time#103)', () => {
    let registry: ReturnType<LocalTime['getRegistry']>;

    beforeAll(async () => {
        const localTime = new LocalTime();
        await localTime.initialize();
        registry = localTime.getRegistry();
    });

    test('the disney network has a real member to share with', () => {
        expect(registry.getNetwork('disney')!.universes.size).toBeGreaterThan(0);
        expect(registry.getNetwork('disney')!.universes.has(createUniverseId('disney:mary_poppins:1964'))).toBe(true);
    });

    test("a member inherits the network's shared epochs", () => {
        const mary = registry.getUniverse('disney:mary_poppins:1964')!;

        expect(mary.epochs?.['disney:corporate']).toBeDefined();
        expect(mary.epochs?.['disney:corporate'].epochId).toBe('disney:corporate');
        expect(mary.epochs?.['disney:corporate'].startTime).toBe(
            BigInt(Date.UTC(1923, 10, 16)) * 1000000n,
        );

        expect(mary.epochs?.['disney:cultural_impact']).toBeDefined();
        expect(mary.epochs?.['disney:cultural_impact'].startTime).toBe(
            BigInt(Date.UTC(1937, 11, 21)) * 1000000n,
        );
    });

    test('the inherited epoch is a copy, not the network definition itself', () => {
        const mary = registry.getUniverse('disney:mary_poppins:1964')!;
        expect(mary.epochs!['disney:corporate']).not.toBe(
            disneyNetwork.sharedEpochs!.corporate,
        );
    });

    test("a member's own epoch wins over the shared epoch of the same id", () => {
        const fresh = new UniverseRegistry(new ConfigLoader());
        const mary = registry.getUniverse('disney:mary_poppins:1964')!;
        const clone = { ...mary, epochs: { ...mary.epochs } } as Universe;
        const ownStart = clone.epochs!.unix.startTime;

        return fresh
            .registerNetwork({
                networkId: 'collision',
                universes: new Set([createUniverseId('disney:mary_poppins:1964')]),
                sharedEpochs: {
                    corporate: {
                        epochId: 'unix',
                        startTime: 1n,
                        endTime: 2n,
                        precision: TimePrecision.DAY,
                    },
                },
                eras: [],
            })
            .then(() => {
                fresh.registerUniverse(clone.universeId, clone);
                expect(clone.epochs!.unix.startTime).toBe(ownStart);
            });
    });

    test('a member registered before its network still inherits the shared epochs', async () => {
        const fresh = new UniverseRegistry(new ConfigLoader());
        const mary = registry.getUniverse('disney:mary_poppins:1964')!;
        const clone = { ...mary, epochs: { ...mary.epochs } } as Universe;
        // Start from a member that has not inherited anything yet.
        delete clone.epochs!['disney:corporate'];
        delete clone.epochs!['disney:cultural_impact'];

        fresh.registerUniverse(clone.universeId, clone);
        expect(clone.epochs?.['disney:corporate']).toBeUndefined();

        await fresh.registerNetwork(disneyNetwork);
        expect(clone.epochs?.['disney:corporate']).toBeDefined();
    });

    test('an era is a slice of the network membership', () => {
        for (const network of [disneyNetwork, marvelNetwork, registry.getNetwork('nasa')!]) {
            for (const era of network.eras) {
                for (const id of era.universes) {
                    expect([network.networkId, era.eraId, network.universes.has(id)]).toEqual([
                        network.networkId,
                        era.eraId,
                        true,
                    ]);
                }
            }
        }
    });

    test('an era naming a non-member is reported, not silently accepted', async () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
        try {
            const fresh = new UniverseRegistry(new ConfigLoader());
            await fresh.registerNetwork({
                networkId: 'stray-era',
                universes: new Set([createUniverseId('disney:mary_poppins:1964')]),
                eras: [
                    {
                        eraId: 'outside',
                        name: 'Outside',
                        start: 0n,
                        end: 1n,
                        universes: [createUniverseId('history:not_a_member:2000')],
                    },
                ],
            });
            expect(warn).toHaveBeenCalledWith(
                expect.stringContaining('names 1 universe(s) outside the network'),
            );
        } finally {
            warn.mockRestore();
        }
    });
});
