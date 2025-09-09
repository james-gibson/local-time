export * from './core/types';
export * from './core/temporal-precision';
export * from './utils/ksuid-converter';
export * from './config/universe-registry';
export * from './config/config-loader';
export * from './addressing/zero-reference-addressing';
export * from './query/window-search';

import { UniverseRegistry } from './config/universe-registry';
import { ConfigLoader } from './config/config-loader';
import { WindowSearch } from './query/window-search';

export class LocalTime {
  private registry: UniverseRegistry;
  private windowSearch: WindowSearch;
  
  constructor() {
    const configLoader = new ConfigLoader();
    this.registry = new UniverseRegistry(configLoader);
    this.windowSearch = new WindowSearch(this.registry);
  }
  
  async initialize(): Promise<void> {
    await this.registry.initialize();
  }
  
  getRegistry(): UniverseRegistry {
    return this.registry;
  }
  
  getWindowSearch(): WindowSearch {
    return this.windowSearch;
  }
}

// Export utilities for creating references
export { 
  ReferenceHelpers, 
  generateReferenceId, 
  generateTemporalId,
  createTolkienInfluenceChain,
  createBTTFTestReferences,
  createMultilayerReference
} from './utils/reference-helpers';
export { ReferenceType, ReferenceChain } from './core/types';

// Export universe ID utilities for type safety
export {
  UniverseId,
  FilmUniverseId,
  SeriesUniverseId,
  BookUniverseId,
  HistoricalUniverseId,
  PersonalUniverseId,
  MissionUniverseId,
  LegalUniverseId,
  BiographyUniverseId,
  GameUniverseId,
  TypedUniverseId,
  isValidUniverseId,
  isFilmUniverseId,
  isSeriesUniverseId,
  isBookUniverseId,
  isHistoricalUniverseId,
  isPersonalUniverseId,
  isMissionUniverseId,
  isLegalUniverseId,
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
  UNIVERSE_ID_PATTERNS
} from './core/universe-ids';

// Export attribution and copyright utilities
export { AttributionEngine, AttributionRequirement } from './utils/attribution-engine';

// Export reality gradient utilities
export { 
  RealityGradientAnalyzer, 
  RealityGradient, 
  RealityCategory 
} from './utils/reality-gradient';

// Export biographical and legal query utilities
export { 
  BiographicalQueryService,
  BiographicalQuery,
  LegalQuery
} from './utils/biographical-query';

// Export convenience function for age-based queries
export async function queryPersonAge(
  personName: string,
  eventTag: string,
  ageThreshold: number,
  registry: any
) {
  const { BiographicalQueryService } = await import('./utils/biographical-query');
  const queryService = new BiographicalQueryService(registry);
  return await queryService.answerAgeQuery(personName, eventTag, ageThreshold);
}

// Export convenience function for Free Britney timeline query
export async function queryFreeBritneyTimeline(registry: any) {
  const { BiographicalQueryService } = await import('./utils/biographical-query');
  const queryService = new BiographicalQueryService(registry);
  return await queryService.calculateTimeBetweenEvents(
    "britney spears",
    "free_britney",
    "conservatorship_end"
  );
}

// Export temporal conversion utilities
export { 
  TemporalConversion,
  dateToNanoseconds,
  nanosecondsToDate,
  createEpoch,
  createDayEpoch,
  createYearEpoch,
  createKeyframe,
  createSegment,
  createRuntimeEpoch,
  createRuntimeKeyframe,
  createRuntimeSegment,
  formatDuration,
  calculateDuration,
  isWithinRange,
  yearsToNanoseconds,
  daysToNanoseconds,
  hoursToNanoseconds,
  minutesToNanoseconds
} from './utils/temporal-conversion';

// Export universe builder utilities
export { 
  UniverseBuilder,
  createFilmBuilder,
  createHistoricalBuilder,
  createMissionBuilder,
  createBiographyBuilder
} from './core/universe-builder';
