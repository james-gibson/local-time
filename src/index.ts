export * from './core/types.js';
export * from './core/temporal-precision.js';
export * from './utils/ksuid-converter.js';
export * from './config/universe-registry.js';
export * from './config/config-loader.js';
export * from './addressing/zero-reference-addressing.js';
export * from './query/window-search.js';

import { UniverseRegistry } from './config/universe-registry.js';
import { ConfigLoader } from './config/config-loader.js';
import { WindowSearch } from './query/window-search.js';

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
} from './utils/reference-helpers.js';
export { ReferenceType, ReferenceChain } from './core/types.js';

// Export attribution and copyright utilities
export { AttributionEngine, AttributionRequirement } from './utils/attribution-engine.js';

// Export reality gradient utilities
export { 
  RealityGradientAnalyzer, 
  RealityGradient, 
  RealityCategory 
} from './utils/reality-gradient.js';

// Export biographical and legal query utilities
export { 
  BiographicalQueryService,
  BiographicalQuery,
  LegalQuery
} from './utils/biographical-query.js';

// Export convenience function for age-based queries
export async function queryPersonAge(
  personName: string,
  eventTag: string,
  ageThreshold: number,
  registry: any
) {
  const { BiographicalQueryService } = await import('./utils/biographical-query.js');
  const queryService = new BiographicalQueryService(registry);
  return await queryService.answerAgeQuery(personName, eventTag, ageThreshold);
}

// Export convenience function for Free Britney timeline query
export async function queryFreeBritneyTimeline(registry: any) {
  const { BiographicalQueryService } = await import('./utils/biographical-query.js');
  const queryService = new BiographicalQueryService(registry);
  return await queryService.calculateTimeBetweenEvents(
    "britney spears",
    "free_britney",
    "conservatorship_end"
  );
}
