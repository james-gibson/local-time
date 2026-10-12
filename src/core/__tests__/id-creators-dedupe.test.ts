import { createTechnicalUniverseId as fromUniverseIds } from '../universe-ids';
import { createTechnicalUniverseId as fromTypes } from '../types';
import { createTechnicalUniverseId as fromIdCreators } from '../ids/id-creators';
import { createTechnologyUniverseId } from '../universe-ids';

/**
 * local-time#51 — `createTechnicalUniverseId` was defined twice, byte-identically.
 *
 * Once in `core/ids/id-creators.ts` and once in `core/types.ts`. Both were exported, so
 * the function a caller got depended on its import path: `config/universes/james/solar.ts`
 * imported the `id-creators` copy, `config/universes/cybersecurity/access-control.ts`
 * the `types` copy, and neither file could see the other's. `core/index.ts` re-exports
 * `./types`, so the `types` copy was also public API and could not simply be deleted.
 *
 * The single definition now lives in `core/universe-ids.ts` — a file with **no imports at
 * all**, so it introduces no cycle — and both former homes re-export it.
 */
describe('createTechnicalUniverseId is defined once (local-time#51)', () => {
    /**
     * The direct statement of "not a duplicate": these are not two functions that happen
     * to behave alike, they are one function reachable by three paths.
     */
    test('all three import paths resolve to the same function', () => {
        expect(fromTypes).toBe(fromUniverseIds);
        expect(fromIdCreators).toBe(fromUniverseIds);
    });

    test('every import path produces the same id for the same arguments', () => {
        // Behavioural counterpart to the identity check above: if a path were ever
        // re-pointed at a fork that drifts, this catches it even if the function
        // identity check were somehow satisfied.
        const args: [string, string, string?][] = [
            ['system', 'secure_ledger', 'authentication_v1'],
            ['log', 'auth_event'],
            ['home_energy_monitoring', 'user_redacted_202509'],
        ];
        for (const a of args) {
            const expected = fromUniverseIds(...a);
            expect(`${a.join(':')}:${fromTypes(...a) === expected}`).toBe(`${a.join(':')}:true`);
            expect(`${a.join(':')}:${fromIdCreators(...a) === expected}`).toBe(`${a.join(':')}:true`);
        }
    });

    test('the factory still produces the ids the live universes already use', () => {
        // The 4 cybersecurity universes in access-control.ts and the 1 in solar.ts are
        // built with this function. Their shape must not change as a side effect of
        // de-duplication.
        const year = new Date().getFullYear();
        expect(fromTypes('system', 'secure_ledger', 'authentication_v1'))
            .toBe(`system:secure_ledger:authentication_v1:${year}`);
        expect(fromTypes('log', 'auth_event')).toBe(`log:auth_event:${year}`);
    });

    /**
     * The two names differ by four characters and mean unrelated things. Conflating them
     * is what produced #21 and the dead commented-out calls in `historical/stem.ts`.
     */
    test('it is not the same function as createTechnologyUniverseId', () => {
        expect(fromTypes).not.toBe(createTechnologyUniverseId);
        // createTechnologyUniverseId makes a technology universe; this one does not.
        expect(createTechnologyUniverseId('electric_telegraph'))
            .toBe('technology:electric_telegraph:*');
        expect(fromTypes('system', 'secure_ledger', 'authentication_v1'))
            .not.toBe(createTechnologyUniverseId('system'));
    });
});