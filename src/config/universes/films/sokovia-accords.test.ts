import { LocalTime } from '../../../index';
import { isLegalUniverseId, isValidUniverseId } from '../../../core/universe-ids';
import { UniverseType } from '../../../core/types';
import { allUniverses } from '../index';
import { sokoviaAccords2016Universe, sokoviaAccordsUniverseId } from './sokovia-accords';
import { captainAmericaCivilWar2016Universe } from './marvel';

/**
 * The Sokovia Accords — a worked example of the collection model.
 *
 * The in-universe legal instrument is its own universe, not a keyframe: the id
 * says `legal-…` (what it is), the folder says Marvel (where it is authored),
 * the network says it is part of the collection, and the film points at it with
 * a typed `DEPICTS` edge. This suite pins those four claims.
 */
describe('the Sokovia Accords', () => {
    const accords = sokoviaAccords2016Universe;

    test('is a legal universe with the legal id grammar', () => {
        expect(accords.type).toBe(UniverseType.LEGAL_TIMELINE);
        expect(accords.universeId).toBe('legal-united_nations:sokovia_accords:law_evolution:2016');
        expect(isLegalUniverseId(accords.universeId)).toBe(true);
        expect(isValidUniverseId(accords.universeId)).toBe(true);
        expect(sokoviaAccordsUniverseId).toBe(accords.universeId);
    });

    test('is registered and retrievable', () => {
        expect(allUniverses.map((u) => (u as { universeId: string }).universeId)).toContain(accords.universeId);

        const registry = new LocalTime();
        return registry.initialize().then(() => {
            expect(registry.getRegistry().getUniverse(accords.universeId)).toBeDefined();
        });
    });

    test('the film depicts it, and the edge is on the film', () => {
        const civilWar = captainAmericaCivilWar2016Universe;
        const references = civilWar.connections?.references ?? [];

        expect(references).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    type: 'DEPICTS',
                    targetUniverseId: accords.universeId,
                }),
            ]),
        );
        // One-way: the document does not reference the film back.
        expect(accords.connections?.references ?? []).not.toEqual(
            expect.arrayContaining([expect.objectContaining({ targetUniverseId: civilWar.universeId })]),
        );
    });

    test('it is a member of the Marvel collection and inherits its shared epoch', () => {
        const localTime = new LocalTime();
        return localTime.initialize().then(() => {
            const registry = localTime.getRegistry();
            const network = registry.getNetwork('marvel');

            expect(network?.universes.has(sokoviaAccordsUniverseId)).toBe(true);
            // `UniverseNetwork.sharedEpochs` is inherited at registration (#103).
            expect(registry.getUniverse(sokoviaAccordsUniverseId)?.epochs?.['marvel:disney_acquisition']).toBeDefined();
        });
    });

    test('the timeline separates what the film dates from what it only places', () => {
        expect(accords.epochs?.negotiation).toBeDefined();
        expect(accords.epochs?.signed_and_contested).toBeDefined();

        const keyframes = accords.temporalStructure?.keyframes ?? [];
        const byId = new Map(keyframes.map((keyframe) => [keyframe.id, keyframe]));

        // A documented event with no on-screen date: the timestamp is a guess and
        // the range is the honest bound.
        const lagos = byId.get('lagos_incident')!;
        expect(lagos.certainty).toBeLessThan(1);
        expect(lagos.dateRange).toEqual({
            earliest: BigInt(Date.UTC(2016, 0, 1)) * 1_000_000n,
            latest: BigInt(Date.UTC(2016, 5, 30, 23, 59, 59)) * 1_000_000n,
        });

        // Chronology is real even where precision is not.
        expect(byId.get('battle_of_sokovia')!.timestamp).toBeLessThan(
            byId.get('vienna_signing')!.timestamp,
        );
    });
});
