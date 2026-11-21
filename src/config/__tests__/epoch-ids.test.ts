import { allUniverses } from '../universes';

/**
 * Every epoch declares its own id (james-gibson/local-time#234).
 *
 * `UniverseRegistry.registerUniverse` does not drop an epoch that arrives without an
 * `epochId`: it renames the epoch to its layer key and logs a warning on every
 * `initialize()`. Four epochs did exactly that — three layers of *Saving Private Ryan*
 * and the zero-reference epoch of the Pixar Toy Story 2 recovery — and #182 had already
 * fixed the same omission in Back to the Future, so the class was known and still
 * recurring.
 *
 * The rename is the damage, not the warning. A reference to an epoch by the id its author
 * thought it had cannot resolve, and two layers that both key an epoch `present` collide
 * in `universe.epochs`. The registry's fallback stays — dropping a whole universe would be
 * worse — but it should be unreachable in the corpus, which is what this guard asserts.
 *
 * Read the **static** set: `registerUniverse` mutates the epoch it was handed, so any test
 * that initialised a registry first would see the substituted id and pass vacuously.
 */
describe('every epoch declares an epochId (#234)', () => {
  test('no epoch falls back to its layer key', () => {
    const undeclared: string[] = [];

    for (const universe of allUniverses) {
      for (const layer of universe.layers ?? []) {
        for (const [key, epoch] of Object.entries(layer.epochs ?? {})) {
          const epochId = (epoch as { epochId?: unknown } | null | undefined)?.epochId;
          if (typeof epochId !== 'string' || epochId.length === 0) {
            undeclared.push(`${universe.universeId} :: ${layer.layerId}.${key}`);
          }
        }
      }
    }

    expect(undeclared).toEqual([]);
  });

  test('epoch ids are unique inside a universe', () => {
    const collisions: string[] = [];

    for (const universe of allUniverses) {
      const owners = new Map<string, string[]>();

      for (const layer of universe.layers ?? []) {
        for (const [key, epoch] of Object.entries(layer.epochs ?? {})) {
          const epochId = (epoch as { epochId?: unknown } | null | undefined)?.epochId;
          if (typeof epochId !== 'string') continue;
          const addresses = owners.get(epochId) ?? [];
          addresses.push(`${layer.layerId}.${key}`);
          owners.set(epochId, addresses);
        }
      }

      for (const [epochId, addresses] of owners) {
        if (addresses.length > 1) {
          collisions.push(`${universe.universeId} :: ${epochId} <- ${addresses.join(', ')}`);
        }
      }
    }

    expect(collisions).toEqual([]);
  });
});
