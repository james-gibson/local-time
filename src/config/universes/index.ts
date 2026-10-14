
import {missionUniverses} from './apollo-eleven/missions';
import {universeNetworks, readyPlayerOneUniverse, toyStory2RecoveryMissionUniverse, spaceballsUniverse,disneyNetwork, disneyPixarAcquisition2006Universe} from './disney';
import {
  biographicalUniverses,
  robinWilliamsFilmography,
  jamesCameronFilmography,
  edSheeranCopyrightTrial2023Universe,
  trumpAssassinationAttemptUniverse,
} from './people';
import {
  zirpUsEconomyUniverse,
  damImpactTimelineUniverse,
  legalUniverses,
  presidentialElectionUniverses,
  recurringElectionIssueUniverses,
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
, theBeatlesHistoricalUniverse, gamestopUniverses, costcoUniverses} from './historical';
import {allCybersecurityUniverses} from './cybersecurity';
import {chuckBerryUniverse} from './chuckBerryUniverse';
import {calvinKleinHistory} from './calvinKleinHistory';
import {middleEarthUniverse} from './middleEarthUniverse';
import {tolkienWWIExperience} from './tolkienWWIExperience';
import {filmUniverses} from "./films"
import {idiocracyUniverse} from "./films/20th"
import {usHistoryUniverses} from "./us-history"
import {pixarFilmUniverses} from "./pixar"
import {versionControlUniverses} from "./version-control"
import {wikidataTypologyUniverses} from "./system"
import {nasaUniverses, nasaNetwork} from "./nasa"
import {rogersCommissionUniverse} from "./us-gov/rogers-commission"
import {apollo13FilmUniverse} from "./films/apollo13-film"
import {hillaryClintonUniverses} from "./people/hillary-clinton"
import {hillaryClintonConspiracyTheoriesUniverses} from "./people/clinton-conspiracy-theories"
import {hillaryClintonConspiracyRebuttalsUniverses} from "./people/clinton-conspiracy-rebuttals"
export const allUniverses = [
    ...filmUniverses,
  ...pixarFilmUniverses,
  ...missionUniverses,
  ...biographicalUniverses,
  ...robinWilliamsFilmography,
  // The rest of the `people` namespace. These build at module scope and used to be
  // exported from the barrel but spread into nothing, so they were constructed,
  // validated and then discarded (james-gibson/local-time#27). A test in
  // `people/people-registration.test.ts` now fails if a new one is not wired here.
  ...jamesCameronFilmography,
  edSheeranCopyrightTrial2023Universe,
  trumpAssassinationAttemptUniverse,
  ...legalUniverses,
  ...pokemonUniverses,
  ...historicalUniverses,
  ...allCybersecurityUniverses,
  usMilitaryOperationsUniverse,
  usNativeAmericanPolicyUniverse,
  electricTelegraphUniverse,
  readyPlayerOneUniverse, toyStory2RecoveryMissionUniverse, spaceballsUniverse,
  september11AttacksUniverse,
  penicillinDiscoveryUniverse, tulsaMassacreMediaCoverageUniverse, tulsaRaceMassacre1921Universe, transistorInventionUniverse, worldWideWebUniverse
  , theBeatlesHistoricalUniverse,
  chuckBerryUniverse,
  calvinKleinHistory,
  tolkienWWIExperience,
  middleEarthUniverse,
  zirpUsEconomyUniverse,
  damImpactTimelineUniverse,
  usCopyrightLawChangesUniverse,
  ...presidentialElectionUniverses,
  ...recurringElectionIssueUniverses,
  ...usHistoryUniverses,
  ...versionControlUniverses,
  ...wikidataTypologyUniverses,
  ...gamestopUniverses,
  idiocracyUniverse,
  ...costcoUniverses,
  ...nasaUniverses,
  rogersCommissionUniverse,
  apollo13FilmUniverse,
  ...hillaryClintonUniverses,
  ...hillaryClintonConspiracyTheoriesUniverses,
  ...hillaryClintonConspiracyRebuttalsUniverses,
];

export const allNetworks = [
  ...universeNetworks,
  // Added here rather than in `disney/networks.ts`, which exports `universeNetworks`, so
  // that the nasa network does not create a disney -> nasa import edge.
  nasaNetwork,
];

export { 
  filmUniverses, 
  missionUniverses, 
  universeNetworks, 
  biographicalUniverses, 
  legalUniverses,
  pokemonUniverses,
  historicalUniverses,
  allCybersecurityUniverses,
  usHistoryUniverses,
  pixarFilmUniverses,
  versionControlUniverses,
  gamestopUniverses,
  costcoUniverses,
  idiocracyUniverse,
  robinWilliamsFilmography,
  jamesCameronFilmography,
  edSheeranCopyrightTrial2023Universe,
  trumpAssassinationAttemptUniverse
};
