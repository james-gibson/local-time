// Re-export core modules through barrel files for better tree shaking
export * from './core';
export * from './config';
export * from './utils';
export * from './addressing';
export * from './query';

// Import only what's needed to avoid circular dependencies
import type { UniverseRegistry } from './config/universe-registry';
import type { ConfigLoader } from './config/config-loader';
import type { WindowSearch } from './query/window-search';

export class LocalTime {
  private registry: UniverseRegistry;
  private windowSearch: WindowSearch;
  
  constructor() {
    // Use dynamic imports to avoid circular dependencies
    const { ConfigLoader } = require('./config/config-loader');
    const { UniverseRegistry } = require('./config/universe-registry');
    const { WindowSearch } = require('./query/window-search');
    
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

// All specific exports are now handled through barrel files
// This prevents circular dependencies and improves tree shaking

// Convenience functions for common queries
export async function queryPersonAge(
  personName: string,
  eventTag: string,
  ageThreshold: number,
  registry: any
) {
  const { BiographicalQueryService } = await import('./utils');
  const queryService = new BiographicalQueryService(registry);
  return await queryService.answerAgeQuery(personName, eventTag, ageThreshold);
}

export async function queryFreeBritneyTimeline(registry: any) {
  const { BiographicalQueryService } = await import('./utils');
  const queryService = new BiographicalQueryService(registry);
  return await queryService.calculateTimeBetweenEvents(
    "britney spears",
    "free_britney",
    "conservatorship_end"
  );
}
