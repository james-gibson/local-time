import { createTechnicalUniverseId, createTechnologyUniverseId } from '../universe-ids';

/**
 * local-time#51 — one definition, one import path.
 *
 * `createTechnicalUniverseId(category, identifier, version?)` was defined twice,
 * byte-identically, in `core/ids/id-creators.ts` and `core/types.ts`. Both were
 * exported, so which function a caller received depended on its import path —
 * `config/universes/james/solar.ts` imported the `id-creators` copy,
 * `config/universes/cybersecurity/access-control.ts` the `types` copy, and neither file
 * could see the other's. `core/index.ts` re-exported `./types`, so the second copy was
 * also public API, which is why the fix had to be a re-export rather than a deletion.
 *
 * This test is the regression guard for the *end state*. It asserts the duplicate paths
 * are gone, because a duplicate is invisible to behaviour: both copies produced
 * identical strings, so only module shape could reveal it.
 */
describe('universe-id factories are defined once (local-time#51)', () => {
    test('the duplicate modules no longer exist', () => {
        // The second copy lived in `core/ids/id-creators.ts`. Both of its remaining
        // exports (`createSystemUniverseId`, `createLogUniverseId`) had no importers at
        // all, so the file was removed rather than kept as an alias.
        expect(() => require('../ids/id-creators')).toThrow();
        expect(() => require('../ids')).toThrow();
    });

    test('the factories are no longer reachable through core/types', () => {
        // `core/types` used to define `createTechnicalUniverseId` and re-export the
        // other two. Nothing imported them from there once every config file was
        // pointed at `core/universe-ids`, so the deep path is gone. The package barrel
        // (`core/index.ts`) still exports them via `export * from './universe-ids'`.
        const types = require('../types');
        expect('createTechnicalUniverseId' in types).toBe(false);
        expect('createTechnologyUniverseId' in types).toBe(false);
        expect('createHistoricalUniverseId' in types).toBe(false);
    });

    test('the package barrel still exposes every id factory', () => {
        // Removing the deep paths must not narrow the public surface.
        const barrel = require('../index');
        for (const name of [
            'createTechnicalUniverseId',
            'createTechnologyUniverseId',
            'createHistoricalUniverseId',
            'createSystemUniverseId',
            'createFilmUniverseId',
            'createSeriesUniverseId',
            'createMissionUniverseId',
            'createBiographyUniverseId',
            'createLegalUniverseId',
            'createGameUniverseId',
            'createFashionUniverseId',
            'createPersonalUniverseId',
            'createBookUniverseId',
            'createCyberSecurityUniverseId',
            'createFilmStudioUniverseId',
            'createSparkleFartUniverseId',
        ]) {
            expect(`${name}:${typeof barrel[name] === 'function'}`).toBe(`${name}:true`);
        }
    });

    test('it still produces the ids the live universes already use', () => {
        // Four cybersecurity universes in access-control.ts and one in solar.ts are
        // built with this function. Their shape must be unchanged by the consolidation.
        const year = new Date().getFullYear();
        expect(createTechnicalUniverseId('system', 'secure_ledger', 'authentication_v1'))
            .toBe(`system:secure_ledger:authentication_v1:${year}`);
        expect(createTechnicalUniverseId('log', 'auth_event')).toBe(`log:auth_event:${year}`);
    });

    /**
     * The two names differ by four characters and mean unrelated things. Conflating them
     * is what produced #21 and the dead commented-out three-argument calls in
     * `historical/stem.ts`.
     */
    test('it is not the same function as createTechnologyUniverseId', () => {
        expect(createTechnicalUniverseId).not.toBe(createTechnologyUniverseId);
        expect(createTechnologyUniverseId('electric_telegraph'))
            .toBe('technology:electric_telegraph:*');
        expect(createTechnicalUniverseId('system', 'secure_ledger', 'authentication_v1'))
            .not.toBe(createTechnologyUniverseId('system'));
    });
});