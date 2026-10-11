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
