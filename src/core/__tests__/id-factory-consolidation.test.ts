import {
    createQualifiedId,
    createTechnologyEventId,
    createTechnologyUniverseId,
} from '../universe-ids';

/**
 * local-time#51 — one definition, one import path. local-time#121 — one name per
 * responsibility.
 *
 * `createTechnicalUniverseId(category, identifier, version?)` was defined twice,
 * byte-identically, in `core/ids/id-creators.ts` and `core/types.ts`. Both were
 * exported, so which function a caller received depended on its import path —
 * `config/universes/james/solar.ts` imported the `id-creators` copy,
 * `config/universes/cybersecurity/access-control.ts` the `types` copy, and neither file
 * could see the other's. `core/index.ts` re-exported `./types`, so the second copy was
 * also public API, which is why the fix had to be a re-export rather than a deletion.
 *
 * It is now `createQualifiedId`: the old name was four characters from
 * `createTechnologyUniverseId` while meaning something unrelated, and that collision is
 * what produced #21 and the dead three-argument calls in `historical/stem.ts`. The
 * renamed function's output is unchanged, so the five live `system:`/`home_energy_*:` ids
 * do not move.
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
        expect('createQualifiedId' in types).toBe(false);
        expect('createTechnologyUniverseId' in types).toBe(false);
        expect('createTechnologyEventId' in types).toBe(false);
        expect('createHistoricalUniverseId' in types).toBe(false);
    });

    test('the package barrel still exposes every id factory', () => {
        // Removing the deep paths must not narrow the public surface.
        const barrel = require('../index');
        for (const name of [
            'createQualifiedId',
            'createTechnologyUniverseId',
            'createTechnologyEventId',
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

    test('the renamed factory still produces the ids the live universes already use', () => {
        // Four cybersecurity universes in access-control.ts and one in solar.ts are
        // built with this function. #121 renamed it and must not move them.
        const year = new Date().getFullYear();
        expect(createQualifiedId('system', 'secure_ledger', 'authentication_v1'))
            .toBe(`system:secure_ledger:authentication_v1:${year}`);
        expect(createQualifiedId('log', 'auth_event')).toBe(`log:auth_event:${year}`);
    });

    /**
     * The two names differ by four characters and mean unrelated things. Conflating them
     * is what produced #21 and the dead commented-out three-argument calls in
     * `historical/stem.ts`.
     */
    test('it is not the same function as createTechnologyUniverseId', () => {
        expect(createQualifiedId).not.toBe(createTechnologyUniverseId);
        expect(createTechnologyUniverseId('electric_telegraph'))
            .toBe('technology:electric_telegraph:*');
        expect(createQualifiedId('system', 'secure_ledger', 'authentication_v1'))
            .not.toBe(createTechnologyUniverseId('system'));
    });

    test('the old name is gone, not aliased', () => {
        // An alias would preserve the four-character collision #121 exists to remove.
        const ids = require('../universe-ids');
        expect('createTechnicalUniverseId' in ids).toBe(false);
    });
});

/**
 * local-time#121 Q2 — the dated technology-event factory.
 *
 * `createTechnologyUniverseId` can only emit `technology:<name>:*`; the corpus's real
 * technology ids are year-anchored (`technology:git:2005`, `technology:sccs:1972`, …),
 * which is why `historical/stem.ts` carried hardcoded literals beside dead
 * three-argument calls. This pins the factory that replaces them.
 */
describe('createTechnologyEventId emits the dated technology shape (#121)', () => {
    test('normalises the name and appends the year', () => {
        expect(createTechnologyEventId('electric_telegraph', 1837))
            .toBe('technology:electric_telegraph:1837');
        expect(createTechnologyEventId('Electric Telegraph', 1837))
            .toBe('technology:electric_telegraph:1837');
        expect(createTechnologyEventId('  World-Wide Web  ', 1989))
            .toBe('technology:world_wide_web:1989');
    });

    test('reproduces every literal it replaced in historical/stem.ts', () => {
        expect(createTechnologyEventId('electric_telegraph', 1837)).toBe('technology:electric_telegraph:1837');
        expect(createTechnologyEventId('penicillin', 1928)).toBe('technology:penicillin:1928');
        expect(createTechnologyEventId('transistor', 1947)).toBe('technology:transistor:1947');
        expect(createTechnologyEventId('world_wide_web', 1989)).toBe('technology:world_wide_web:1989');
    });

    test('reproduces the version-control ids it replaced', () => {
        expect(createTechnologyEventId('sccs', 1972)).toBe('technology:sccs:1972');
        expect(createTechnologyEventId('rcs', 1982)).toBe('technology:rcs:1982');
        expect(createTechnologyEventId('cvs', 1986)).toBe('technology:cvs:1986');
        expect(createTechnologyEventId('subversion', 2000)).toBe('technology:subversion:2000');
        expect(createTechnologyEventId('bitkeeper', 2000)).toBe('technology:bitkeeper:2000');
        expect(createTechnologyEventId('git', 2005)).toBe('technology:git:2005');
        expect(createTechnologyEventId('mercurial', 2005)).toBe('technology:mercurial:2005');
    });

    test('rejects a span the TECHNOLOGY pattern does not accept', () => {
        // The pattern wants a four-digit year; 89 is not "1989".
        expect(() => createTechnologyEventId('git', 89)).toThrow(
            /Invalid technology event universe ID format/,
        );
        // Nor does it accept an empty name.
        expect(() => createTechnologyEventId('!!!', 2005)).toThrow(
            /Invalid technology event universe ID format/,
        );
    });

    test('is a technology id by the same guard as the undated factory', () => {
        const { isTechnologyUniverseId } = require('../universe-ids');
        expect(isTechnologyUniverseId(createTechnologyEventId('git', 2005))).toBe(true);
        expect(isTechnologyUniverseId(createTechnologyEventId('git', 2005)))
            .toBe(isTechnologyUniverseId(createTechnologyUniverseId('git')));
    });
});
