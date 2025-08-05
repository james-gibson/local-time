import { filmUniverses } from './films.js';
import { missionUniverses } from './missions.js';
import { universeNetworks } from './networks.js';

// Add historical universes for BTTF test cases
export const chuckBerryUniverse = {
  universeId: "history:chuck_berry:career",
  type: 'historical_event',
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: []
  },
  attribution: {
    public_domain: true,
    sources: ["Music history records", "Biography sources"]
  },
  keyEvents: {
    johnny_b_goode_composed: {
      timestamp: BigInt(Date.UTC(1958, 0, 1)) * 1000000n,
      precision: 31_536_000_000_000_000 // YEAR precision
    }
  }
};

export const calvinKleinHistory = {
  universeId: "history:fashion:calvin_klein:founded",
  type: 'historical_event',
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: []
  },
  attribution: {
    public_domain: true,
    sources: ["Fashion industry records", "Company history"]
  },
  keyEvents: {
    company_founded: {
      timestamp: BigInt(Date.UTC(1968, 0, 1)) * 1000000n,
      precision: 31_536_000_000_000_000 // YEAR precision
    }
  }
};

export const allUniverses = [
  ...filmUniverses,
  ...missionUniverses,
  chuckBerryUniverse,
  calvinKleinHistory
];

export const allNetworks = [
  ...universeNetworks
];

export { filmUniverses, missionUniverses, universeNetworks };
