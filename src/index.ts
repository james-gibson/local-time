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
