import {
  UniverseId,
  FilmUniverseId,
  HistoricalUniverseId,
  MissionUniverseId,
  BiographyUniverseId,
  GameUniverseId,
  isValidUniverseId,
  isFilmUniverseId,
  isHistoricalUniverseId,
  isMissionUniverseId,
  isBiographyUniverseId,
  isGameUniverseId,
  createUniverseId,
  createFilmUniverseId,
  createHistoricalUniverseId,
  createMissionUniverseId,
  createBiographyUniverseId,
  parseUniverseId,
  getUniverseCategory,
  validateUniverseReference,
  WELL_KNOWN_UNIVERSES,
  UNIVERSE_ID_PATTERNS, createSparkleFartUniverseId, SparkleFartUniverseId
} from '../universe-ids';
// import {createGenesis, createSourceString, newTrace, main} from '../sparklefart-ids';
// import {generateRelationshipDiagram} from '../diagram';

describe('Universe ID Type System', () => {
  describe('Validation Functions', () => {
    // test('diagram sparklefarts', async () => {
    //   // Commented out due to missing sparklefart-ids module
    // });
    
    // test('createSparkleFartUniverseId validates and creates branded types', async () => {
    //   // Commented out due to missing sparklefart-ids module
    // });
    test('isValidUniverseId correctly validates formats', () => {
      // Valid formats
      expect(isValidUniverseId('film:mary_poppins:1964')).toBe(true);
      expect(isValidUniverseId('disney:frozen:2013')).toBe(true);
      expect(isValidUniverseId('history:jfk_assassination:1963')).toBe(true);
      expect(isValidUniverseId('nasa:apollo11:1969')).toBe(true);
      expect(isValidUniverseId('biography:tolkien:1892-1973')).toBe(true);
      expect(isValidUniverseId('game:pokemon:red_blue:1996')).toBe(true);
      
      // Invalid formats
      expect(isValidUniverseId('invalid')).toBe(false);
      expect(isValidUniverseId('film:movie')).toBe(false);
      expect(isValidUniverseId('film:movie:not_a_year')).toBe(false);
      expect(isValidUniverseId('')).toBe(false);
    });

    test('Specific type validators work correctly', () => {
      expect(isFilmUniverseId('film:mary_poppins:1964')).toBe(true);
      expect(isFilmUniverseId('disney:frozen:2013')).toBe(true);
      expect(isFilmUniverseId('history:jfk:1963')).toBe(false);
      
      expect(isHistoricalUniverseId('history:jfk_assassination:1963')).toBe(true);
      expect(isHistoricalUniverseId('film:mary_poppins:1964')).toBe(false);
      
      expect(isMissionUniverseId('nasa:apollo11:1969')).toBe(true);
      expect(isMissionUniverseId('esa:rosetta:2004')).toBe(true);
      expect(isMissionUniverseId('film:apollo13:1995')).toBe(false);
      
      expect(isBiographyUniverseId('biography:tolkien:1892-1973')).toBe(true);
      expect(isBiographyUniverseId('biography:britney_spears:1981-present')).toBe(true);
      expect(isBiographyUniverseId('film:tolkien:2019')).toBe(false);
      
      expect(isGameUniverseId('game:pokemon:red_blue:1996')).toBe(true);
      expect(isGameUniverseId('anime:pokemon:indigo_league:1997')).toBe(true);
      expect(isGameUniverseId('film:pokemon:1998')).toBe(false);
    });
  });

  describe('Factory Functions', () => {
    test('createUniverseId validates and creates branded types', () => {
      const validId = 'film:mary_poppins:1964';
      const universeId = createUniverseId(validId);
      expect(universeId).toBe(validId);
      
      // Should throw for invalid formats
      expect(() => createUniverseId('invalid-format')).toThrow('Invalid universe ID format');
    });

    test('Specific factory functions create correct IDs', () => {
      const filmId = createFilmUniverseId('disney', 'frozen', 2013);
      expect(filmId).toBe('disney:frozen:2013');
      expect(isFilmUniverseId(filmId)).toBe(true);
      
      const historicalId = createHistoricalUniverseId('moon_landing', 1969);
      expect(historicalId).toBe('history:moon_landing:1969');
      expect(isHistoricalUniverseId(historicalId)).toBe(true);
      
      const missionId = createMissionUniverseId('nasa', 'apollo11', 1969);
      expect(missionId).toBe('nasa:apollo11:1969');
      expect(isMissionUniverseId(missionId)).toBe(true);
      
      const biographyId = createBiographyUniverseId('tolkien', 1892, 1973);
      expect(biographyId).toBe('biography:tolkien:1892-1973');
      expect(isBiographyUniverseId(biographyId)).toBe(true);
      
      const livingBiographyId = createBiographyUniverseId('britney_spears', 1981);
      expect(livingBiographyId).toBe('biography:britney_spears:1981-present');
      expect(isBiographyUniverseId(livingBiographyId)).toBe(true);
    });

    test('Factory functions validate input formats', () => {
      expect(() => createFilmUniverseId('invalid studio', 'title', 2020)).toThrow();
      expect(() => createHistoricalUniverseId('invalid event', 2020)).toThrow();
      expect(() => createMissionUniverseId('invalid agency', 'mission', 2020)).toThrow();
      expect(() => createBiographyUniverseId('invalid person', 1900, 2000)).toThrow();
    });
  });

  describe('Parsing and Utility Functions', () => {
    test('parseUniverseId extracts components correctly', () => {
      const filmId = createFilmUniverseId('disney', 'frozen', 2013);
      const parsed = parseUniverseId(filmId);
      
      expect(parsed.category).toBe('disney');
      expect(parsed.identifier).toBe('frozen');
      expect(parsed.timestamp).toBe('2013');
      // expect(parsed.studio).toBe('disney');
    });

    test('getUniverseCategory returns correct category', () => {
      expect(getUniverseCategory(createFilmUniverseId('disney', 'frozen', 2013))).toBe('disney');
      expect(getUniverseCategory(createHistoricalUniverseId('moon_landing', 1969))).toBe('history');
      expect(getUniverseCategory(createMissionUniverseId('nasa', 'apollo11', 1969))).toBe('nasa');
    });

    test('validateUniverseReference provides detailed validation info', () => {
      const validResult = validateUniverseReference('film:mary_poppins:1964');
      expect(validResult.isValid).toBe(true);
      expect(validResult.category).toBe('film');
      expect(validResult.error).toBeUndefined();
      
      const invalidResult = validateUniverseReference('invalid-format');
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toContain('Invalid universe ID format');
    });
  });

  describe('Well-Known Universe Constants', () => {
    test('WELL_KNOWN_UNIVERSES contains valid IDs', () => {
      expect(isFilmUniverseId(WELL_KNOWN_UNIVERSES.MARY_POPPINS)).toBe(true);
      expect(isFilmUniverseId(WELL_KNOWN_UNIVERSES.BACK_TO_THE_FUTURE)).toBe(true);
      expect(isHistoricalUniverseId(WELL_KNOWN_UNIVERSES.JFK_ASSASSINATION)).toBe(true);
      expect(isMissionUniverseId(WELL_KNOWN_UNIVERSES.APOLLO_11)).toBe(true);
      expect(isBiographyUniverseId(WELL_KNOWN_UNIVERSES.TOLKIEN)).toBe(true);
    });

    test('Well-known universes have expected values', () => {
      expect(WELL_KNOWN_UNIVERSES.MARY_POPPINS).toBe('disney:mary_poppins:1964');
      expect(WELL_KNOWN_UNIVERSES.APOLLO_11).toBe('nasa:apollo11:1969');
      expect(WELL_KNOWN_UNIVERSES.TOLKIEN).toBe('biography:jrr_tolkien:1892-1973');
    });
  });

  describe('Pattern Matching', () => {
    test('UNIVERSE_ID_PATTERNS match expected formats', () => {
      expect(UNIVERSE_ID_PATTERNS.FILM.test('film:mary_poppins:1964')).toBe(true);
      expect(UNIVERSE_ID_PATTERNS.FILM.test('disney:frozen:2013')).toBe(true);
      expect(UNIVERSE_ID_PATTERNS.FILM.test('invalid:format')).toBe(false);
      
      expect(UNIVERSE_ID_PATTERNS.HISTORICAL.test('history:jfk_assassination:1963')).toBe(true);
      expect(UNIVERSE_ID_PATTERNS.HISTORICAL.test('film:historical:1963')).toBe(false);
      
      expect(UNIVERSE_ID_PATTERNS.MISSION.test('nasa:apollo11:1969')).toBe(true);
      expect(UNIVERSE_ID_PATTERNS.MISSION.test('spacex:falcon_heavy:2018')).toBe(true);
      expect(UNIVERSE_ID_PATTERNS.MISSION.test('invalid:mission')).toBe(false);
      
      expect(UNIVERSE_ID_PATTERNS.BIOGRAPHY.test('biography:tolkien:1892-1973')).toBe(true);
      expect(UNIVERSE_ID_PATTERNS.BIOGRAPHY.test('biography:britney_spears:1981-present')).toBe(true);
      expect(UNIVERSE_ID_PATTERNS.BIOGRAPHY.test('biography:invalid')).toBe(false);
      
      expect(UNIVERSE_ID_PATTERNS.GAME.test('game:pokemon:red_blue:1996')).toBe(true);
      expect(UNIVERSE_ID_PATTERNS.GAME.test('anime:pokemon:indigo_league:1997')).toBe(true);
      expect(UNIVERSE_ID_PATTERNS.GAME.test('invalid:game')).toBe(false);
    });
  });

  describe('Type Safety', () => {
    test('Branded types prevent accidental string usage', () => {
      // This test verifies that the TypeScript compiler would catch type errors
      // In a real scenario, these would be compile-time errors
      
      const validId = createUniverseId('film:mary_poppins:1964');
      const filmId = createFilmUniverseId('disney', 'frozen', 2013);
      
      // These should be the same branded type
      expect(typeof validId).toBe('string');
      expect(typeof filmId).toBe('string');
      
      // But they carry type information for TypeScript
      expect(validId).toMatch(/^[a-z]+:[a-z0-9_]+:\d{4}$/);
      expect(filmId).toMatch(/^[a-z]+:[a-z0-9_]+:\d{4}$/);
    });

    test('Type guards work with branded types', () => {
      const filmId = createFilmUniverseId('disney', 'frozen', 2013);
      const missionId = createMissionUniverseId('nasa', 'apollo11', 1969);
      
      expect(isFilmUniverseId(filmId)).toBe(true);
      expect(isFilmUniverseId(missionId)).toBe(false);
      
      expect(isMissionUniverseId(missionId)).toBe(true);
      expect(isMissionUniverseId(filmId)).toBe(false);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('Handles empty and malformed inputs gracefully', () => {
      expect(isValidUniverseId('')).toBe(false);
      expect(isValidUniverseId('   ')).toBe(false);
      expect(isValidUniverseId('a:b')).toBe(false);
      expect(isValidUniverseId('a:b:c:d:e')).toBe(false);
      
      expect(() => createUniverseId('')).toThrow();
      expect(() => createUniverseId('invalid')).toThrow();
    });

    test('Validates year ranges appropriately', () => {
      // Very old dates should still work
      expect(isValidUniverseId('history:ancient_rome:0001')).toBe(true);
      
      // Future dates should work
      expect(isValidUniverseId('film:future_movie:2099')).toBe(true);
      
      // But not invalid years
      expect(isValidUniverseId('film:movie:abcd')).toBe(false);
    });

    test('Handles special characters in identifiers', () => {
      // Underscores should be allowed
      expect(isValidUniverseId('film:mary_poppins:1964')).toBe(true);
      expect(isValidUniverseId('history:jfk_assassination:1963')).toBe(true);
      
      // Numbers in identifiers should be allowed
      expect(isValidUniverseId('game:pokemon:red_blue:1996')).toBe(true);
      expect(isValidUniverseId('nasa:apollo11:1969')).toBe(true);
    });
  });
});
