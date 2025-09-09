import {TemporalEpoch, Universe, UniverseNetwork} from '../core/types';
import { UniverseId, isValidUniverseId, createUniverseId } from '../core/universe-ids';
import { ConfigLoader } from './config-loader';

export class UniverseRegistry {
  private universes = new Map<UniverseId, Universe>();
  private aliases = new Map<string, UniverseId>();
  private networks = new Map<string, UniverseNetwork>();
  
  constructor(private configLoader: ConfigLoader) {}
  
  async initialize(): Promise<void> {
    await this.loadBuiltInUniverses();
    await this.loadExternalConfig();
  }
  
  registerUniverse(id: string, universe: Universe): void {
    // Validate and convert to branded UniverseId
    if (!isValidUniverseId(id)) {
      throw new Error(`Invalid universe ID format: ${id}. Must follow pattern like 'category:identifier:year'`);
    }
    
    const universeId = createUniverseId(id);
    
    // Ensure universe object uses the same ID
    if (universe.universeId !== universeId) {
      universe.universeId = universeId;
    }

      const epochs = {
        "unix": {
          "epochId": "utc:unix_epoch",
          "startTime": "0",
          "endTime": "2147483647000000000",
          "precision": "NANOSECOND",
          "description": "Unix epoch (January 1, 1970, 00:00:00 UTC to January 19, 2038, 03:14:07 UTC)",
          "zeroPoint": "0", // + Math.random().toString(36),
          "zeroEvent": "Unix epoch start",
          "beforePrefix": "BCE-",
          "afterPrefix": "CE+",
          "relativeFormat": "TIMESTAMP"
        } as unknown as TemporalEpoch,

        // "gregorian": {
        //   "epochId": "utc:gregorian",
        //   "startTime": "-62135596800000000000",
        //   "endTime": "253402300799000000000",
        //   "precision": "DAY",
        //   "description": "Gregorian calendar system (January 1, 0001 to December 31, 9999)",
        //   "zeroPoint": "-62135596800000000000",
        //   "zeroEvent": "Anno Domini start",
        //   "beforePrefix": "BCE ",
        //   "afterPrefix": "CE ",
        //   "relativeFormat": "CALENDAR"
        // } as unknown as TemporalEpoch,
        // "modern": {
        //   "epochId": "utc:atomic_time",
        //   "startTime": "-315619200000000000",
        //   "endTime": "1722441600000000000",
        //   "precision": "SECOND",
        //   "description": "International Atomic Time coordination (January 1, 1960 to present)",
        //   "zeroPoint": "-315619200000000000",
        //   "zeroEvent": "TAI established",
        //   "beforePrefix": "Pre-TAI-",
        //   "afterPrefix": "TAI+",
        //   "relativeFormat": "SECONDS"
        // } as unknown as TemporalEpoch,
        // "y2k": {
        //   "epochId": "utc:millennium",
        //   "startTime": "946684800000000000",
        //   "endTime": "32503680000000000000",
        //   "precision": "MILLISECOND",
        //   "description": "21st century epoch (January 1, 2000, 00:00:00 UTC to December 31, 2999, 23:59:59 UTC)",
        //   "zeroPoint": "946684800000000000",
        //   "zeroEvent": "Y2K millennium start",
        //   "beforePrefix": "Y2K-",
        //   "afterPrefix": "Y2K+",
        //   "relativeFormat": "ISO8601"
        // } as unknown as TemporalEpoch,
        // "javascript": {
        //   "epochId": "utc:ecmascript",
        //   "startTime": "0",
        //   "endTime": "8640000000000000",
        //   "precision": "MILLISECOND",
        //   "description": "JavaScript Date range (±100,000,000 days from Unix epoch)",
        //   "zeroPoint": "0",
        //   "zeroEvent": "ECMAScript epoch",
        //   "beforePrefix": "JS-",
        //   "afterPrefix": "JS+",
        //   "relativeFormat": "MILLISECONDS"
        // } as unknown as TemporalEpoch,
      }
      if (!universe.epochs) universe.epochs = {};
    universe.epochs = { ...universe.epochs, ...epochs};

    if (universe.layers) {
      for (const layer of universe.layers) {
        // console.dir(layer)
        for (const e in layer.epochs) {
          const epoch = layer.epochs[e];
          const id = epoch.epochId ?? '';
          if (!id) { return;}
          universe.epochs[id] = epoch;
        }

      }
    }

    // console.trace(universe.epochs);
    !this.universes.has(universeId) && this.universes.set(universeId, universe);
    
    if (universe.identifiers?.aliases) {
      for (const alias of universe.identifiers.aliases) {
        this.aliases.set(alias, universeId);
      }
    }
  }
  
  getUniverse(idOrAlias: string): Universe | undefined {
    // Try as direct universe ID first
    if (isValidUniverseId(idOrAlias)) {
      const universeId = createUniverseId(idOrAlias);
      const universe = this.universes.get(universeId);
      if (universe) return universe;
    }
    
    // Try as alias
    const universeId = this.aliases.get(idOrAlias);
    if (universeId) {
      return this.universes.get(universeId);
    }
    
    return undefined;
  }
  
  async registerNetwork(network: UniverseNetwork) {
    if (network.universes && network.universes.size > 0) {
      for (const universe of network.universes?.values()) {
        const exists = this.getUniverse(universe);

        if (!exists) {
          if (isValidUniverseId(universe)) {
            const universeId = createUniverseId(universe);
            this.aliases.set(network.networkId, universeId);
          }
          // console.error('uhh')
          this.registerUniverse(network.networkId, network as unknown as Universe);
        }
      }
    }
    if (!network.networkId) {
      const id = (network as any)['universeId'] ?? '';
      const alreadyExists = await this.getUniverse(id);
      !alreadyExists && this.registerUniverse(id, network as unknown as Universe);
      // console.error('this probably is wrong or not fully accurate: ', {alreadyExists, id, network,n:this.networks});
    }


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
      const builtIn = await import('./built-in-universes');
      for (const network of builtIn.default.networks || []) {
        this.registerNetwork(network);
      }
      for (const universe of builtIn.default.universes) {
        this.registerUniverse(universe.universeId,universe);
      }

    } catch (error) {
      console.warn('Failed to load built-in universes:', error);
    }
  }
  
  private async loadExternalConfig(): Promise<void> {
    const configs = await this.configLoader.loadConfigurations();
    for (const config of configs) {
      for (const network of config.networks || []) {
        this.registerNetwork(network);
      }
      for (const universe of config.universes) {
        this.registerUniverse(universe.universeId,universe);
      }

    }
  }
}
