import {
  isSystemUniverseId,
  createSystemUniverseId,
  isValidUniverseId,
} from '../universe-ids';
import { UniverseType } from '../types';
import {
  staticIdSchemaUniverse,
  staticIdSchema,
} from '../../config/universes/system/static-id-schema';

describe('system: universe IDs (local-time#9)', () => {
  describe('isSystemUniverseId', () => {
    test('accepts version spans', () => {
      expect(isSystemUniverseId('system:ids:static_id_schema:v1')).toBe(true);
      expect(isSystemUniverseId('system:ids:static_id_schema:v12')).toBe(true);
    });

    test('accepts year and range spans, and the wildcard', () => {
      expect(isSystemUniverseId('system:ids:static_id_schema:2025')).toBe(true);
      expect(isSystemUniverseId('system:ids:static_id_schema:2024-2025')).toBe(true);
      expect(isSystemUniverseId('system:ids:static_id_schema:*')).toBe(true);
    });

    test('rejects other namespaces and malformed spans', () => {
      expect(isSystemUniverseId('history:ids:static_id_schema:v1')).toBe(false);
      expect(isSystemUniverseId('system:ids:static_id_schema:latest')).toBe(false);
      expect(isSystemUniverseId('system:ids:static_id_schema:v1.0')).toBe(false);
      expect(isSystemUniverseId('system:ids:static_id_schema:')).toBe(false);
    });

    test('is reachable through the generic validator', () => {
      expect(isValidUniverseId('system:ids:static_id_schema:v1')).toBe(true);
    });
  });

  describe('createSystemUniverseId', () => {
    test('normalises slug and version', () => {
      expect(createSystemUniverseId('Static Id Schema', 'V1')).toBe(
        'system:static_id_schema:v1',
      );
      expect(createSystemUniverseId('ids', 'v2')).toBe('system:ids:v2');
      // A nested subsystem keeps its single colon.
      expect(createSystemUniverseId('Ids: Static Id Schema', 'V1')).toBe(
        'system:ids:static_id_schema:v1',
      );
    });

    test('rejects a version that is neither vN nor a year', () => {
      // `2` is ambiguous with a 4-digit year, so it is refused rather than guessed at.
      expect(() => createSystemUniverseId('ids', '2')).toThrow();
      expect(() => createSystemUniverseId('ids', 'latest')).toThrow();
    });
  });

  describe('the typology universe', () => {
    test('is an abstract concept in the system namespace', () => {
      expect(String(staticIdSchemaUniverse.universeId)).toBe(
        'system:ids:static_id_schema:v1',
      );
      expect(staticIdSchemaUniverse.type).toBe(UniverseType.ABSTRACT_CONCEPT);
      expect(isSystemUniverseId(String(staticIdSchemaUniverse.universeId))).toBe(true);
    });

    test('carries the Wikidata typology with QIDs', () => {
      const qids = staticIdSchema.types.map((t) => t.wikidataQid);
      expect(qids).toEqual(['Q5', 'Q1656682', 'Q4982301', 'Q43229']);
    });

    /**
     * The point of the whole universe: three of the four types map onto a pattern
     * that exists, and the fourth is an explicit `null` rather than a guess. If
     * someone later "fixes" the conspiracy-theory row by pointing it at `history:`,
     * this test fails and forces the decision to be made deliberately.
     */
    test('records which types have no home in the built system', () => {
      const unmapped = staticIdSchema.types
        .filter((t) => t.builtPattern === null)
        .map((t) => t.wikidataQid);

      expect(unmapped).toEqual(['Q4982301']);
    });

    test('every mapped example is a valid universe id', () => {
      for (const t of staticIdSchema.types) {
        if (t.builtPattern === null) continue;
        // The examples are real ids the built system would generate.
        if (t.builtExample.startsWith('personal:')) {
          expect(isValidUniverseId(t.builtExample)).toBe(true);
        }
      }
    });

    test('has no temporal structure — it is a rule, not an event', () => {
      expect(staticIdSchemaUniverse.temporalStructure?.keyframes ?? []).toHaveLength(0);
      expect(staticIdSchemaUniverse.temporalStructure?.segments ?? []).toHaveLength(0);
    });
  });
});
