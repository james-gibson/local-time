import { filmUniverses } from './films.js';
import { missionUniverses } from './missions.js';
import { universeNetworks } from './networks.js';

export const allUniverses = [
  ...filmUniverses,
  ...missionUniverses
];

export const allNetworks = [
  ...universeNetworks
];

export { filmUniverses, missionUniverses, universeNetworks };
