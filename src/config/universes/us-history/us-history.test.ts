import { isValidUniverseId } from '../../../core/universe-ids';
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
});
