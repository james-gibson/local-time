import { Universe, UniverseNetwork } from '../core/types.js';

export interface UniverseConfig {
  version: string;
  universes: Universe[];
  networks?: UniverseNetwork[];
}

export class ConfigLoader {
  async loadConfigurations(): Promise<UniverseConfig[]> {
    const configs: UniverseConfig[] = [];
    
    const fileConfigs = await this.loadFileConfigurations();
    configs.push(...fileConfigs);
    
    const packageConfigs = await this.loadPackageConfigurations();
    configs.push(...packageConfigs);
    
    return configs;
  }
  
  private async loadFileConfigurations(): Promise<UniverseConfig[]> {
    const configs: UniverseConfig[] = [];
    
    const configPaths = [
      './local-time.config.json',
      './config/local-time.json',
      process.env.LOCAL_TIME_CONFIG_PATH
    ].filter(Boolean);
    
    for (const configPath of configPaths) {
      try {
        const { readFile } = await import('fs/promises');
        const configData = await readFile(configPath!, 'utf-8');
        const config = JSON.parse(configData) as UniverseConfig;
        configs.push(config);
      } catch (error) {
        continue;
      }
    }
    
    return configs;
  }
  
  private async loadPackageConfigurations(): Promise<UniverseConfig[]> {
    const configs: UniverseConfig[] = [];
    
    const configPackages = [
      '@local-time/universes-film',
      '@local-time/universes-history',
      '@local-time/universes-literature'
    ];
    
    for (const packageName of configPackages) {
      try {
        const configModule = await import(packageName);
        const config = configModule.default as UniverseConfig;
        configs.push(config);
      } catch (error) {
        continue;
      }
    }
    
    return configs;
  }
}
