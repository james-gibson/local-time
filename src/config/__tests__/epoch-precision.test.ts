import { allUniverses } from '../universes';
import { TimePrecision } from '../../core/types';

/**
 * Every epoch declares a resolution (james-gibson/local-time#193).
 *
 * `TemporalEpoch.precision` is required by the type, but `src/config/universes/index.ts`
 * narrows every entry with `as unknown as Universe`, and that cast erases the missing
 * field. 26 epochs — 24 studio containers, Costco's founding era and the Aladdin
 * dispute — declared none and reached the database as null until the read of the column
 * was made to fail. This guard reads the static set before the seed does, so the failure
 * names the epoch rather than arriving as a NOT NULL violation.
 *
 * The corpus authors precision both ways: the numeric enum and, in a few
 * zero-reference epochs, the enum's name as a string. Both are accepted here; the seed
 * normalises to the name for storage.
 */
describe('every epoch declares a precision (#193)', () => {
  const numeric = new Set(
    Object.values(TimePrecision).filter((value): value is number => typeof value === 'number'),
  );
  const names = new Set(
    Object.values(TimePrecision).filter((value): value is string => typeof value === 'string'),
  );

  test('no epoch leaves precision undefined', () => {
    const undeclared: string[] = [];

    for (const universe of allUniverses) {
      for (const layer of universe.layers ?? []) {
        for (const [epochId, epoch] of Object.entries(layer.epochs ?? {})) {
          if ((epoch as { precision?: unknown }).precision === undefined) {
            undeclared.push(`${universe.universeId} :: ${epochId}`);
          }
        }
      }
    }

    expect(undeclared).toEqual([]);
  });

  test('every declared precision is a member, by value or by name', () => {
    const offenders: string[] = [];

    for (const universe of allUniverses) {
      for (const layer of universe.layers ?? []) {
        for (const [epochId, epoch] of Object.entries(layer.epochs ?? {})) {
          const precision = (epoch as { precision?: unknown }).precision;
          const ok =
            typeof precision === 'number'
              ? numeric.has(precision)
              : typeof precision === 'string'
                ? names.has(precision)
                : false;
          if (!ok) {
            offenders.push(`${universe.universeId} :: ${epochId} -> ${String(precision)}`);
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
