import { UniverseId } from '../universe-ids';

export function createTechnicalUniverseId(category: string, identifier: string, version?: string): UniverseId {
  const versionSuffix = version ? `:${version}` : '';
  const id = `${category}:${identifier}${versionSuffix}:${new Date().getFullYear()}`;
  return id as UniverseId;
}

export function createSystemUniverseId(system: string, component: string): UniverseId {
  return createTechnicalUniverseId('system', `${system}_${component}`);
}

export function createLogUniverseId(system: string, logType: string): UniverseId {
  return createTechnicalUniverseId('log', `${system}_${logType}`);
}
