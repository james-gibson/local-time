import { LocalTime } from '../../../index';
import { isLegalUniverseId, isValidUniverseId } from '../../../core/universe-ids';
import { TimePrecision, Universe, UniverseType } from '../../../core/types';
import { allUniverses } from '../index';
import { usConstitutionUniverse } from '../us-history/usFoundingDocuments.universe';
import { sokoviaAccords2016Universe, sokoviaAccordsUniverseId } from './sokovia-accords';
import { captainAmericaCivilWar2016Universe } from './marvel';

/**
 * The Sokovia Accords — a worked example of the collection model.
 *
 * The in-universe legal instrument is its own universe, not a keyframe: the id
 * says `legal-…` (what it is), the folder says Marvel (where it is authored),
 * the network says it is part of the collection, and the film points at it with
 * a typed `DEPICTS` edge.
 *
 * ## No nanosecond literals
 *
 * Every temporal assertion names a **frame** (a keyframe or epoch id) and relates
 * it to another named frame. The storage unit is an implementation detail — ADR
 * 0001 already moves the in-memory nanosecond value to microseconds at rest — so
 * `expect(timestamp).toBe(1430438400000000000n)` would break on that migration
 * while proving nothing about the timeline. The label is the durable identifier;
 * the number is one representation of it.
 *
 * Accuracy is part of the frame as well: a keyframe whose event the film does
 * not date declares `TimePrecision.YEAR`, and `certainty` says how sure we are
 * of that year. Neither is a number to pin — they are the frame's own claims.
 */

interface LabelledFrame {
    id: string;
    timestamp: bigint;
    certainty?: number;
    precision?: TimePrecision;
    dateRange?: { earliest: bigint; latest: bigint };
}

/** Resolve a keyframe by its label, the way a caller addresses it. */
const frame = (universe: Universe, id: string): LabelledFrame => {
    const keyframe = universe.temporalStructure?.keyframes.find((entry) => entry.id === id);
    if (!keyframe) throw new Error(`No keyframe "${id}" in ${universe.universeId}`);
    return keyframe as LabelledFrame;
};

/** Resolve an epoch by its label. */
const epoch = (universe: Universe, id: string) => {
    const entry = universe.epochs?.[id];
    if (!entry) throw new Error(`No epoch "${id}" in ${universe.universeId}`);
    return entry;
};

/**
 * Assert that the frames occur in the given label order. The comparison is
 * between two labels; neither operand is written down as a number.
 */
const expectOrdered = (universe: Universe, ids: string[]): void => {
    for (let index = 1; index < ids.length; index += 1) {
        const earlier = frame(universe, ids[index - 1]);
        const later = frame(universe, ids[index]);
        expect(`${earlier.id} < ${later.id}: ${earlier.timestamp < later.timestamp}`).toBe(
            `${earlier.id} < ${later.id}: true`,
        );
    }
};

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

    test('its frames are ordered by label', () => {
        // The names are the timeline; the timestamps are only how it is compared.
        expectOrdered(accords, [
            'battle_of_sokovia',
            'lagos_incident',
            'accords_drafted',
            'vienna_signing',
        ]);
    });

    test('an undated frame declares YEAR accuracy, not a false day', () => {
        const yearOf = (value: bigint): number =>
            new Date(Number(value / 1_000_000n)).getUTCFullYear();

        for (const keyframe of accords.temporalStructure?.keyframes ?? []) {
            // The film shows these events but does not date them. The accuracy of
            // the frame is the year, and the range it carries stays inside that
            // year — both derived from the frame, never written down as a literal.
            expect(`${keyframe.id}: ${keyframe.precision}`).toBe(`${keyframe.id}: ${TimePrecision.YEAR}`);
            expect(keyframe.dateRange).toBeDefined();
            expect(`${keyframe.id}: ${yearOf(keyframe.dateRange!.earliest)}`).toBe(
                `${keyframe.id}: ${yearOf(keyframe.timestamp)}`,
            );
            expect(`${keyframe.id}: ${yearOf(keyframe.dateRange!.latest)}`).toBe(
                `${keyframe.id}: ${yearOf(keyframe.timestamp)}`,
            );
        }

        // Accuracy belongs to the frame, not to the universe: the negotiation
        // window is a day-precision epoch even though its events are year-precision
        // keyframes.
        expect(epoch(accords, 'negotiation').precision).toBe(TimePrecision.DAY);
    });

    test('an approximate frame carries a range that contains it, inside its epoch', () => {
        const negotiation = epoch(accords, 'negotiation');

        for (const keyframe of accords.temporalStructure?.keyframes ?? []) {
            if (keyframe.certainty !== undefined && keyframe.certainty < 1) {
                expect(`${keyframe.id}: ${keyframe.dateRange !== undefined}`).toBe(`${keyframe.id}: true`);
            }
            if (!keyframe.dateRange) continue;
            expect(keyframe.timestamp).toBeGreaterThanOrEqual(keyframe.dateRange.earliest);
            expect(keyframe.timestamp).toBeLessThanOrEqual(keyframe.dateRange.latest);
        }

        // Lagos is placed, not dated. The bound it carries is the negotiation
        // epoch's own bound — a relation between two labels, not a literal.
        const lagos = frame(accords, 'lagos_incident');
        expect(lagos.dateRange!.earliest).toBeGreaterThanOrEqual(negotiation.startTime!);
        expect(lagos.dateRange!.latest).toBeLessThanOrEqual(negotiation.endTime!);
    });

    test('the Accords are later than the Constitutional Convention', () => {
        // Two universes, two labels, one shared timeline: the fictional instrument
        // (2016) after the real convention (1787). The test names the frames; it
        // does not know or care what unit the timestamps are stored in.
        const accordsSigning = frame(accords, 'vienna_signing');
        const conventionSigning = frame(usConstitutionUniverse, 'convention_signing');

        expect(
            `${conventionSigning.id} < ${accordsSigning.id}: ${
                conventionSigning.timestamp < accordsSigning.timestamp
            }`,
        ).toBe(`${conventionSigning.id} < ${accordsSigning.id}: true`);
    });
});
