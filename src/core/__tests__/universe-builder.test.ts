import { UniverseBuilder, createFilmBuilder, createHistoricalBuilder } from '../universe-builder';
import {UniverseType, TimePrecision, TemporalKeyframe, TemporalSegment} from '../types';

describe('UniverseBuilder', () => {
  describe('Film universe creation', () => {
    test('creates basic film universe', () => {
      const universe = new UniverseBuilder()
        .film('disney', 'test_film', 2023)
        .withRuntime(120)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['Disney'], 2023, 'active')
        .withCulturalSignificance(0.8)
        .build();

      expect(universe.universeId).toBe('disney:test_film:2023');
      expect(universe.type).toBe(UniverseType.FILM);
      expect(universe.realityRelation.fictionalizationDegree).toBe(1.0);
      expect(universe.attribution.copyright?.holders).toEqual(['Disney']);
      expect(universe.metadata?.cultural_significance).toBe(0.8);
      expect(universe.layers).toHaveLength(1);
      expect(universe.layers[0].layerId).toBe('runtime');
    });

    test('adds runtime keyframes correctly', () => {
      const universe = new UniverseBuilder()
        .film('film', 'movie', 2023)
        .withRuntime(120)
        .withRealityRelation('pure_fiction', 1.0)
        .withPublicDomain(['Test'])
        .addRuntimeKeyframe(87, 15, 'iconic_scene', 0.95, ['iconic', 'memorable'])
        .addRuntimeKeyframe(45, 30, 'plot_twist', 0.8, ['twist', 'surprise'])
        .build();

      expect(universe.temporalStructure?.keyframes).toHaveLength(2);
      
      const iconicScene = universe.temporalStructure?.keyframes.find(kf => kf.id === 'iconic_scene');
      expect(iconicScene).toBeDefined();
      expect(iconicScene?.significance).toBe(0.95);
      expect(iconicScene?.tags).toEqual(['iconic', 'memorable']);
    });

    test('adds runtime segments correctly', () => {
      const universe = new UniverseBuilder()
        .film('film', 'movie', 2023)
        .withRuntime(120)
        .withRealityRelation('pure_fiction', 1.0)
        .withPublicDomain(['Test'])
        .addRuntimeSegment(0, 0, 5, 0, 'opening', 'sequence')
        .addRuntimeSegment(115, 0, 120, 0, 'climax', 'sequence')
        .build();

      expect(universe.temporalStructure?.segments).toHaveLength(2);
      
      const opening = universe.temporalStructure?.segments.find(seg => seg.id === 'opening');
      expect(opening).toBeDefined();
      expect(opening?.type).toBe('sequence');
    });
  });

  describe('Historical event universe creation', () => {
    test('creates basic historical universe', () => {
      const universe = new UniverseBuilder()
        .historicalEvent('test_event', 1963)
        .withDateRange(1963, 11, 22, 1963, 11, 22, TimePrecision.SECOND)
        .withRealityRelation('documentary', 0.0)
        .withPublicDomain(['Historical Records'])
        .withCulturalSignificance(1.0)
        .build();

      expect(universe.universeId).toBe('history:test_event:1963');
      expect(universe.type).toBe(UniverseType.HISTORICAL_EVENT);
      expect(universe.realityRelation.fictionalizationDegree).toBe(0.0);
      expect(universe.attribution.public_domain).toBe(true);
      expect(universe.metadata?.cultural_significance).toBe(1.0);
    });

    test('adds date keyframes correctly', () => {
      const universe = new UniverseBuilder()
        .historicalEvent('test_event', 1963)
        .withDateRange(1963, 11, 22, 1963, 11, 22, TimePrecision.SECOND)
        .withRealityRelation('documentary', 0.0)
        .withPublicDomain(['Historical Records'])
        .addDateKeyframe(1963, 11, 22, 12, 30, 0, 'critical_moment', 1.0, ['historic'])
        .build();

      expect(universe.temporalStructure?.keyframes).toHaveLength(1);
      
      const moment:TemporalKeyframe | undefined = universe.temporalStructure?.keyframes[0];
      expect(moment?.id).toBe('critical_moment');
      expect(moment?.significance).toBe(1.0);
      expect(moment?.tags).toEqual(['historic']);
    });
  });

  describe('Mission universe creation', () => {
    test('creates mission with zero-reference epoch', () => {
      const universe = new UniverseBuilder()
        .mission('nasa', 'test_mission', 1969)
        .withZeroReference(1969, 7, 16, 13, 32, 0, 'Liftoff', 'T-', 'T+', 48)
        .withRealityRelation('documentary', 0.0)
        .withPublicDomain(['NASA Archives'])
        .build();

      expect(universe.universeId).toBe('nasa:test_mission:1969');
      expect(universe.type).toBe(UniverseType.MISSION);
      
      const zeroLayer = universe.layers.find(layer => layer.layerId === 'zero_reference');
      expect(zeroLayer).toBeDefined();
      
      const zeroEpoch = zeroLayer?.epochs.zero_ref as any;
      expect(zeroEpoch.zeroEvent).toBe('Liftoff');
      expect(zeroEpoch.beforePrefix).toBe('T-');
      expect(zeroEpoch.afterPrefix).toBe('T+');
    });
  });

  describe('Biography universe creation', () => {
    test('creates biography universe', () => {
      const universe = new UniverseBuilder()
        .biography('test_person', 1892, 1973)
        .withDateRange(1892, 1, 3, 1973, 9, 2, TimePrecision.DAY)
        .withRealityRelation('documentary', 0.0)
        .withPublicDomain(['Biographical Records'])
        .addDateSegment('1892-01-03', '1911-01-01', 'childhood', 'life_period')
        .addDateSegment('1911-01-01', '1925-01-01', 'education', 'education')
        .build();

      expect(universe.universeId).toBe('biography:test_person:1892-1973');
      expect(universe.type).toBe(UniverseType.BIOGRAPHY);
      expect(universe.temporalStructure?.segments).toHaveLength(2);
      
      const segments: TemporalSegment[] = (universe.temporalStructure ? universe.temporalStructure.segments : []);

      expect(segments[0].type).toBe('life_period');
      expect(segments[1].type).toBe('education');
    });
  });

  describe('Validation', () => {
    test('throws error for invalid fictionalization degree', () => {
      expect(() => {
        new UniverseBuilder()
          .film('film', 'movie', 2023)
          .withRealityRelation('pure_fiction', 1.5) // Invalid: > 1.0
          .withPublicDomain(['Test'])
          .build();
      }).toThrow('Universe validation failed');
    });

    test('throws error for invalid significance', () => {
      expect(() => {
        new UniverseBuilder()
          .film('film', 'movie', 2023)
          .withRealityRelation('pure_fiction', 1.0)
          .withPublicDomain(['Test'])
          .withCulturalSignificance(1.5) // Invalid: > 1.0
          .build();
      }).toThrow('Universe validation failed');
    });

    test('throws error for missing attribution', () => {
      expect(() => {
        new UniverseBuilder()
          .film('film', 'movie', 2023)
          .withRealityRelation('pure_fiction', 1.0)
          // Missing attribution
          .build();
      }).toThrow('Attribution is required');
    });

    test('throws error for no primary layer', () => {
      expect(() => {
        new UniverseBuilder()
          .film('film', 'movie', 2023)
          .withRealityRelation('pure_fiction', 1.0)
          .withPublicDomain(['Test'])
          .addLayer('meta_layer', 'meta', {}) // Only meta layer, no primary
          .build();
      }).toThrow('At least one primary temporal layer is required');
    });

    test('validates keyframe significance bounds', () => {
      expect(() => {
        new UniverseBuilder()
          .film('film', 'movie', 2023)
          .withRuntime(120)
          .withRealityRelation('pure_fiction', 1.0)
          .withPublicDomain(['Test'])
          .addRuntimeKeyframe(60, 0, 'invalid_keyframe', 1.5, ['test']) // Invalid significance
          .build();
      }).toThrow('Keyframe significance must be between 0.0 and 1.0');
    });
  });

  describe('Builder convenience functions', () => {
    test('createFilmBuilder provides film defaults', () => {
      const universe = createFilmBuilder()
        .film('film', 'movie', 2023)
        .withRuntime(120)
        .withCopyright(['Test Studio'], 2023)
        .build();

      expect(universe.realityRelation.type).toBe('pure_fiction');
      expect(universe.realityRelation.fictionalizationDegree).toBe(1.0);
      expect(universe.temporalStructure?.windows.strategy).toBe('scene_based');
    });

    test('createHistoricalBuilder provides historical defaults', () => {
      const universe = createHistoricalBuilder()
        .historicalEvent('test_event', 1963)
        .withDateRange(1963, 1, 1, 1963, 12, 31, TimePrecision.DAY)
        .withPublicDomain(['Historical Records'])
        .build();

      expect(universe.realityRelation.type).toBe('documentary');
      expect(universe.realityRelation.fictionalizationDegree).toBe(0.0);
      expect(universe.temporalStructure?.windows.strategy).toBe('time_based');
    });
  });

  describe('Metadata extraction', () => {
    test('extracts canonical name from aliases', () => {
      const universe = new UniverseBuilder()
        .film('film', 'test_movie', 2023)
        .withRuntime(120)
        .withRealityRelation('pure_fiction', 1.0)
        .withPublicDomain(['Test'])
        .build();

      expect(universe.metadata?.canonicalName).toBe('Test Movie');
    });

    test('extracts creators from attribution', () => {
      const universe = new UniverseBuilder()
        .film('film', 'movie', 2023)
        .withRuntime(120)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['Test Studio'], 2023)
        .withCreators({ director: ['Test Director'], writer: ['Test Writer'] })
        .build();

      expect(universe.metadata?.creators).toEqual(['Test Director', 'Test Writer', 'Test Studio']);
    });

    test('extracts release date from universe ID', () => {
      const universe = new UniverseBuilder()
        .film('film', 'movie', 2023)
        .withRuntime(120)
        .withRealityRelation('pure_fiction', 1.0)
        .withPublicDomain(['Test'])
        .build();
// console.dir(universe)
      expect(universe.metadata?.released?.getFullYear()).toBe(2023);
    });
  });

  describe('Complex universe building', () => {
    test('builds comprehensive film universe', () => {
      const universe = new UniverseBuilder()
        .film('disney', 'comprehensive_test', 2023)
        .withRuntime(139)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['Walt Disney Productions'], 2023, 'active')
        .withCreators({ 
          director: ['Test Director'], 
          writer: ['Test Writer'] 
        })
        .withIdentifiers({ 
          imdb: 'tt1234567',
          aliases: ['comprehensive_test', 'test_film'] 
        })
        .withCulturalSignificance(0.95)
        .withWindowing('scene_based', 3n * 60n * 1000000000n)
        .addRuntimeKeyframe(87, 15, 'iconic_moment', 0.95, ['iconic', 'memorable'])
        .addRuntimeKeyframe(45, 30, 'plot_point', 0.8, ['plot', 'development'])
        .addRuntimeSegment(0, 0, 5, 0, 'opening', 'sequence')
        .addRuntimeSegment(85, 0, 90, 0, 'climax', 'sequence')
        .build();

      // Verify all components are present
      expect(universe.universeId).toBe('disney:comprehensive_test:2023');
      expect(universe.type).toBe(UniverseType.FILM);
      expect(universe.layers).toHaveLength(1);
      expect(universe.temporalStructure?.keyframes).toHaveLength(2);
      expect(universe.temporalStructure?.segments).toHaveLength(2);
      expect(universe.temporalStructure?.windows.strategy).toBe('scene_based');
      expect(universe.identifiers.imdb).toBe('tt1234567');
      expect(universe.metadata?.cultural_significance).toBe(0.95);
    });
  });
});
