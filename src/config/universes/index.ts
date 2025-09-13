
import {missionUniverses} from './apollo-eleven/missions';
import {universeNetworks, readyPlayerOneUniverse, toyStory2RecoveryMissionUniverse, toyStoryUniverse, spaceballsUniverse,disneyNetwork, disneyPixarAcquisition2006Universe} from './disney';
import {biographicalUniverses} from './people';
import {
  zirpUsEconomyUniverse,
  damImpactTimelineUniverse,
  legalUniverses,
  presidentialElectionUniverses,
  usCopyrightLawChangesUniverse
} from './us-gov';
import {pokemonUniverses} from './games/pokemon';
import {historicalUniverses} from './historical/jfk';
import {
  usMilitaryOperationsUniverse,
  usNativeAmericanPolicyUniverse,
  electricTelegraphUniverse,
  september11AttacksUniverse,
  penicillinDiscoveryUniverse, tulsaMassacreMediaCoverageUniverse, tulsaRaceMassacre1921Universe, transistorInventionUniverse, worldWideWebUniverse
, theBeatlesHistoricalUniverse} from './historical';
import {allCybersecurityUniverses} from './cybersecurity';
import {chuckBerryUniverse} from './chuckBerryUniverse';
import {calvinKleinHistory} from './calvinKleinHistory';
import {middleEarthUniverse} from './middleEarthUniverse';
import {tolkienWWIExperience} from './tolkienWWIExperience';
import {filmUniverses} from "./films"
export const allUniverses = [
    ...filmUniverses,
  ...missionUniverses,
  ...biographicalUniverses,
  ...legalUniverses,
  ...pokemonUniverses,
  ...historicalUniverses,
  ...allCybersecurityUniverses,
  usMilitaryOperationsUniverse,
  usNativeAmericanPolicyUniverse,
  electricTelegraphUniverse,
  readyPlayerOneUniverse, toyStory2RecoveryMissionUniverse, toyStoryUniverse, spaceballsUniverse,
  september11AttacksUniverse,
  penicillinDiscoveryUniverse, tulsaMassacreMediaCoverageUniverse, tulsaRaceMassacre1921Universe, transistorInventionUniverse, worldWideWebUniverse
  , theBeatlesHistoricalUniverse,
  chuckBerryUniverse,
  calvinKleinHistory,
  tolkienWWIExperience,
  middleEarthUniverse,
  zirpUsEconomyUniverse,
  damImpactTimelineUniverse,
  presidentialElectionUniverses,
  usCopyrightLawChangesUniverse,
];

export const allNetworks = [
  ...universeNetworks
];

export { 
  filmUniverses, 
  missionUniverses, 
  universeNetworks, 
  biographicalUniverses, 
  legalUniverses,
  pokemonUniverses,
  historicalUniverses,
  allCybersecurityUniverses
};
