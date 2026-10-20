import { isValidUniverseId, isUSUniverseId } from '../../../core/universe-ids';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { UniverseRegistry } from '../../universe-registry';
import { ConfigLoader } from '../../config-loader';
import {
  usConstitutionUniverse,
  billOfRightsUniverse,
} from './usFoundingDocuments.universe';
import { usConstitutionalAmendments } from './usConstitutionalAmendments.universe';
import { usStatehoodHistory } from './usStatehoodHistory.universe';
import { usHistoryUniverses } from './index';

describe('US History universes (james-gibson/local-time#5)', () => {
  test('exposes the expected collection sizes', () => {
    expect(usConstitutionUniverse).toBeDefined();
    expect(billOfRightsUniverse).toBeDefined();
    expect(usConstitutionalAmendments).toHaveLength(17); // amendments 11-27
    expect(usStatehoodHistory).toHaveLength(50);
    expect(usHistoryUniverses).toHaveLength(2 + 17 + 50);
  });

  test('uses valid, unique universe IDs', () => {
    const ids = usHistoryUniverses.map((u) => u.universeId);
    for (const id of ids) {
      expect(isValidUniverseId(id)).toBe(true);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  /**
   * james-gibson/local-time#50: these nineteen ids are what made the domain worth declaring.
   * Before it, each validated only through `ANY_YEAR_TERMINATED` — so the domain that orders
   * them had no shape, and `us:` read as a film.
   */
  test('every us: id is a declared us: universe, not a catch-all accident', () => {
    const usIds = usHistoryUniverses
      .map((u) => u.universeId as string)
      .filter((id) => id.startsWith('us:'));
    expect(usIds).toHaveLength(19); // constitution + bill of rights + amendments 11-27
    const offenders = usIds.filter((id) => !isUSUniverseId(id));
    expect(offenders).toEqual([]);
  });

  test('every us: id ends in a four-digit year, so year and decade ordering work', () => {
    // The trailing year is the reason the domain is year-terminated; a later change that
    // admitted a span or a wildcard would silently take that away.
    for (const universe of usHistoryUniverses) {
      const id = universe.universeId as string;
      if (!id.startsWith('us:')) continue;
      expect(`${id} -> ${/^us:[a-z0-9_]+(?::[a-z0-9_]+)?:\d{4}$/.test(id)}`).toBe(`${id} -> true`);
    }
  });

  test('anchors the founding documents to their canonical IDs', () => {
    expect(usConstitutionUniverse.universeId).toBe('us:constitution:1787');
    expect(billOfRightsUniverse.universeId).toBe('us:bill_of_rights:1791');
  });

  test('zero-references the Constitutional Convention to itself', () => {
    const epochs = (
      usConstitutionUniverse as unknown as {
        layers: Array<{
          epochs: Record<string, { zeroPoint?: bigint; zeroEvent?: string }>;
        }>;
      }
    ).layers[0].epochs;

    const convention = epochs.convention;
    expect(convention).toBeDefined();
    // The frame's own origin is its T+00:00:00: the delegates convening.
    expect(convention.zeroPoint).toBe(BigInt(Date.UTC(1787, 4, 25, 12)) * 1_000_000n);
    expect(convention.zeroEvent).toMatch(/convenes/i);

    // Signing is addressed from inside the convention, not as a negative offset
    // from ratification: 1787-05-25 -> 1787-09-17 is T+115 days.
    const signing = BigInt(Date.UTC(1787, 8, 17, 12)) * 1_000_000n;
    const days = Number((signing - convention.zeroPoint!) / (86_400_000n * 1_000_000n));
    expect(days).toBe(115);
  });

  test('models the 21st amendment as repealing the 18th', () => {
    const repeal = usConstitutionalAmendments.find(
      (u) => u.universeId === 'us:amendment:21:1933',
    ) as unknown as { connections: { references: Array<{ type: string; targetUniverseId: string }> } };
    expect(repeal).toBeDefined();
    expect(
      repeal.connections.references.some(
        (r) => r.type === 'REPEALS' && r.targetUniverseId === 'us:amendment:18:1919',
      ),
    ).toBe(true);
  });

  test('bounds a repealed amendment by its repealer, not by its own ratification', () => {
    const prohibition = usConstitutionalAmendments.find(
      (u) => u.universeId === 'us:amendment:18:1919',
    ) as unknown as {
      temporalStructure: {
        segments: Array<{ id: string; end: bigint; status: string }>;
        keyframes: Array<{ id: string; timestamp: bigint }>;
      };
    };
    expect(prohibition).toBeDefined();

    const period = prohibition.temporalStructure.segments.find(
      (s) => s.id === 'ratification_period',
    );
    const repeal = prohibition.temporalStructure.keyframes.find((k) => k.id === 'repealed');
    expect(period).toBeDefined();
    expect(repeal).toBeDefined();
    // Forced until the 21st was ratified (1933-12-05), not 1919-01-16.
    expect(period!.status).toBe('overturned');
    expect(period!.end).toBe(repeal!.timestamp);
    expect(period!.end).toBe(BigInt(Date.UTC(1933, 11, 5, 12)) * 1_000_000n);
  });

  test('a repealed amendment must itself have been ratified (nothing repeals a non-amendment)', () => {
    const ratifiedIds = new Set(
      usConstitutionalAmendments.map((u) => u.universeId).filter((id): id is string => Boolean(id)),
    );
    for (const universe of usConstitutionalAmendments) {
      const references = (
        universe as unknown as {
          connections?: { references?: Array<{ type: string; targetUniverseId: string }> };
        }
      ).connections?.references ?? [];
      for (const reference of references.filter((r) => r.type === 'REPEALS')) {
        expect(ratifiedIds.has(reference.targetUniverseId)).toBe(true);
      }
    }
  });

  test('records admission, secession and readmission keyframes where applicable', () => {
    const georgia = usStatehoodHistory.find(
      (u) => u.universeId === 'history:georgia:1788',
    ) as unknown as { temporalStructure: { keyframes: Array<{ id: string }> } };
    expect(georgia).toBeDefined();
    const keyframeIds = georgia.temporalStructure.keyframes.map((k) => k.id);
    expect(keyframeIds).toEqual([
      'admission_to_union',
      'secession_from_union',
      'readmission_to_union',
    ]);
  });

  /**
   * james-gibson/local-time#103 — the states are one container's members, not
   * fifty copies of the same containment block, and the Civil War is one shared
   * epoch rather than fifty inline copies.
   */
  describe('the US_STATEHOOD container', () => {
    const registry = (() => {
      const instance = new UniverseRegistry(new ConfigLoader());
      for (const universe of usStatehoodHistory) {
        instance.registerUniverse(universe.universeId, universe);
      }
      return instance;
    })();

    test('every state declares exactly one membership — the statehood container', () => {
      for (const universe of usStatehoodHistory) {
        expect(registry.getMemberships(universe.universeId)).toEqual([
          CommonUniverseIds.US_STATEHOOD,
        ]);
      }
    });

    test('the container places the states under both national ancestors', () => {
      for (const universe of usStatehoodHistory) {
        expect(registry.contains(CommonUniverseIds.US_STATEHOOD, universe.universeId)).toBe(true);
        expect(registry.contains(CommonUniverseIds.US_HISTORY, universe.universeId)).toBe(true);
        expect(registry.contains(CommonUniverseIds.US_GOVERNMENT, universe.universeId)).toBe(true);
      }
    });

    test('the Civil War is one shared epoch, not fifty inline copies', () => {
      for (const universe of usStatehoodHistory) {
        const epoch = universe.epochs?.civil_war;
        expect(epoch).toBeDefined();
        expect(epoch!.epochId).toBe('civil_war');
        expect(epoch!.startTime).toBe(BigInt(Date.UTC(1861, 3, 12, 12)) * 1_000_000n);
        expect(epoch!.endTime).toBe(BigInt(Date.UTC(1865, 3, 9, 12)) * 1_000_000n);
      }
    });
  });
});
