import { Universe, UniverseNetwork } from '../core/types.js';
import { ConfigLoader } from './config-loader.js';

export class UniverseRegistry {
  private universes = new Map<string, Universe>();
  private aliases = new Map<string, string>();
  private networks = new Map<string, UniverseNetwork>();
  
  constructor(private configLoader: ConfigLoader) {}
  
  async initialize(): Promise<void> {
    await this.loadBuiltInUniverses();
    await this.loadExternalConfig();
  }
  
  registerUniverse(universe: Universe): void {
    this.universes.set(universe.universeId, universe);
    
    if (universe.identifiers.aliases) {
      for (const alias of universe.identifiers.aliases) {
        this.aliases.set(alias, universe.universeId);
      }
    }
  }
  
  getUniverse(idOrAlias: string): Universe | undefined {
    let universe = this.universes.get(idOrAlias);
    if (universe) return universe;
    
    const universeId = this.aliases.get(idOrAlias);
    if (universeId) {
      return this.universes.get(universeId);
    }
    
    return undefined;
  }
  
  registerNetwork(network: UniverseNetwork): void {
    this.networks.set(network.networkId, network);
  }
  
  getNetwork(networkId: string): UniverseNetwork | undefined {
    return this.networks.get(networkId);
  }
  
  getAllUniverses(): Universe[] {
    return Array.from(this.universes.values());
  }
  
  private async loadBuiltInUniverses(): Promise<void> {
    try {
      const builtIn = await import('./built-in-universes.js');
      for (const universe of builtIn.default.universes) {
        this.registerUniverse(universe);
      }
      for (const network of builtIn.default.networks || []) {
        this.registerNetwork(network);
      }
    } catch (error) {
      console.warn('Failed to load built-in universes:', error);
    }
  }
  
  private async loadExternalConfig(): Promise<void> {
    const configs = await this.configLoader.loadConfigurations();
    for (const config of configs) {
      for (const universe of config.universes) {
        this.registerUniverse(universe);
      }
      for (const network of config.networks || []) {
        this.registerNetwork(network);
      }
    }
  }
}
