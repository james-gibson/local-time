
import {missionUniverses} from './apollo-eleven/missions';
import {universeNetworks, readyPlayerOneUniverse, toyStory2RecoveryMissionUniverse, spaceballsUniverse, disneyPixarAcquisition2006Universe} from './disney';
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
import {gamesUniverses, pokemonUniverses} from './games';
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
import {scotus2013Universes} from "./scotus-ot2013"
import {scotus2025Universes} from "./scotus-ot2025"
// The `film_studio:` container universes. They were defined but never spread into
// `allUniverses`, so the registry never registered them: the studio containers had no
// owner, and containment could not transit from a film, through its studio, up to
// `HOLLYWOOD_SYSTEM` (james-gibson/local-time#111).
import {filmStudioUniverses} from "./studios"
export const allUniverses = [
    ...filmUniverses,
  ...filmStudioUniverses,
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
  ...gamesUniverses,
  ...historicalUniverses,
  ...allCybersecurityUniverses,
  usMilitaryOperationsUniverse,
  usNativeAmericanPolicyUniverse,
  electricTelegraphUniverse,
  readyPlayerOneUniverse, toyStory2RecoveryMissionUniverse, spaceballsUniverse,
  // Imported since it was written but never placed in this array — so it built, validated
  // and was discarded, and its id was invalid besides (james-gibson/local-time#70).
  disneyPixarAcquisition2006Universe,
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
  ...scotus2013Universes,
  ...scotus2025Universes,
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
