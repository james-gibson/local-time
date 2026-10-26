
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
, theBeatlesHistoricalUniverse, gamestopUniverses, costcoUniverses, pagerankHistoryUniverses, post911SkyscraperShiftUniverse, enronCollapseUniverse} from './historical';
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
import {globalPoliticsUniverses} from "./global-politics"
import {usPoliticsUniverses} from "./us-politics"
// OpenTTD community works: the Master Hellish channel and its series, the Season 12
// "Connect The World" Let's Play, the AI-vs-community video essay, and the platform
// lineage they run on (Transport Tycoon Deluxe -> OpenTTD -> the AAAhogEx AI).
import {openttdUniverses} from "./openttd"
// The 1980s film-tropes collection (#130). The container holds the trope registry;
// the films it anchors are ordinary film universes that declare membership of it. Spread,
// never nested (#45, #68) — a nested array yields `universeId: undefined`.
import {tropesUniverses} from "./tropes"
// The `film_studio:` container universes. They were defined but never spread into
// `allUniverses`, so the registry never registered them: the studio containers had no
// owner, and containment could not transit from a film, through its studio, up to
// `HOLLYWOOD_SYSTEM` (james-gibson/local-time#111).
import {filmStudioUniverses} from "./studios"
// Three more universes that were defined and never handed to the registry
// (james-gibson/local-time#153). `williamsDisneyAladdinDisputeUniverse` is re-exported
// by the `historical` barrel and was simply not in the import list above; the other two
// live in modules no barrel reached at all, so nothing imported them.
import {williamsDisneyAladdinDisputeUniverse} from "./historical"
import {homeEnergyLogSept2025Universe} from "./james/solar"
import {damPodcastEpisodeUniverse} from "./podcast/hydrology-impacts"
// The `youtube/` namespace: a clip and the response video that plays it, with the
// measured drift between their runtime clocks. Two universes, one drift record.
import {youtubeUniverses} from "./youtube"
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
  // The PageRank timeline: one container plus five era universes (#103). Spread,
  // not nested — the container is a member's parent, never an array element (#45).
  ...pagerankHistoryUniverses,
  ...nasaUniverses,
  rogersCommissionUniverse,
  apollo13FilmUniverse,
  ...hillaryClintonUniverses,
  ...hillaryClintonConspiracyTheoriesUniverses,
  ...hillaryClintonConspiracyRebuttalsUniverses,
  ...scotus2013Universes,
  ...scotus2025Universes,
  // james-gibson/local-time#153 — the three orphans not owned by the `cybersecurity`
  // barrel. Registering them is the point: an unregistered universe is unreachable from
  // every query, so `getOwner`/`contains`/search could not see them at all.
  williamsDisneyAladdinDisputeUniverse,
  homeEnergyLogSept2025Universe,
  damPodcastEpisodeUniverse,
  // The politics namespaces (#126). `global-politics/` had no barrel and nothing
  // imported it, so its modules were never evaluated — which is why three of them
  // throwing on import went unnoticed. `us-politics/` is the domestic counterpart.
  ...globalPoliticsUniverses,
  ...usPoliticsUniverses,
  post911SkyscraperShiftUniverse,
  // The second common boundary (#175): pre/post Enron is derived from this
  // universe's `chapter_11_filing` keyframe.
  enronCollapseUniverse,
  ...openttdUniverses,
  // The 1980s tropes collection (#130): the container first, then the films it
  // anchors. *Back to the Future* is a member too, but it is owned by the film
  // namespace and appears in `filmUniverses` — never here (#74).
  ...tropesUniverses,
  // The clip and the response video that plays it, with the drift between their clocks.
  ...youtubeUniverses,
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
  trumpAssassinationAttemptUniverse,
  globalPoliticsUniverses,
  usPoliticsUniverses,
  post911SkyscraperShiftUniverse,
  enronCollapseUniverse,
  youtubeUniverses
};
