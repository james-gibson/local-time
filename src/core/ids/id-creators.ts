import { UniverseId, createTechnicalUniverseId } from '../universe-ids';

/**
 * ID creators that live outside the canonical `core/universe-ids.ts`.
 *
 * `createTechnicalUniverseId` was originally *defined* here, byte-identically to a
 * second copy in `core/types.ts` (local-time#51). Two definitions meant the function
 * identity depended on the import path — `config/universes/james/solar.ts` got this
 * one, `config/universes/cybersecurity/access-control.ts` got the other, and neither
 * could see the other's. The definition now lives in `core/universe-ids.ts`, next to
 * the validators and the other factories, and is re-exported here so this import path
 * keeps working.
 *
 * Note that `createSystemUniverseId` below is a *different* function from the
 * `createSystemUniverseId(name, version)` in `core/universe-ids.ts`. Same name, unrelated
 * signatures and unrelated id shapes. Both are exported from `core`, so the collision is
 * live; it is not resolved here.
 */
export { createTechnicalUniverseId };

export function createSystemUniverseId(system: string, component: string): UniverseId {
  return createTechnicalUniverseId('system', `${system}_${component}`);
}

export function createLogUniverseId(system: string, logType: string): UniverseId {
  return createTechnicalUniverseId('log', `${system}_${logType}`);
}