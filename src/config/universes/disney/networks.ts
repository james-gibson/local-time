import { UniverseNetwork } from '../../../core/types';
import {
  createFilmUniverseId,
  createHistoricalUniverseId,
  createUniverseId,
} from '../../../core/universe-ids';

/**
 * The Disney and Marvel networks.
 *
 * `sharedEpochs` used to be declared and never read (james-gibson/local-time#103):
 * the corporate and cultural timelines described the network and no universe
 * carried them. They are now inherited by every member at registration —
 * `UniverseRegistry.inheritSharedEpochs` copies each epoch into the member's own
 * epoch map under its `epochId`, and a member's own epoch of that id wins. An
 * `eras[].universes` entry is a declared slice of `universes`, and registration
 * warns when the two disagree.
 */

export const disneyNetwork: UniverseNetwork = {
  networkId: "disney",
  // Membership is what makes `sharedEpochs` do anything: a member inherits the
  // corporate and cultural epochs below at registration
  // (james-gibson/local-time#103). Only universes that actually exist are listed —
  // a member id with no universe is a claim the registry cannot honour.
  universes: new Set([
    createFilmUniverseId('disney', 'mary_poppins', 1964),
    createHistoricalUniverseId('disney:pixar_acquisition', 2006),
  ]),
  
  sharedEpochs: {
    corporate: {
      epochId: "disney:corporate",
      startTime: BigInt(Date.UTC(1923, 10, 16)) * 1000000n, // Disney founded
      endTime: BigInt(Date.now()) * 1000000n,
      precision: 86_400_000_000_000, // DAY precision
      description: "Disney corporate timeline from founding to present"
    },
    cultural: {
      epochId: "disney:cultural_impact",
      startTime: BigInt(Date.UTC(1937, 11, 21)) * 1000000n, // Snow White release
      endTime: BigInt(Date.now()) * 1000000n,
      precision: 31_536_000_000_000_000, // YEAR precision
      description: "Disney's cultural influence timeline"
    }
  },
  
  eras: [
    {
      eraId: "golden_age",
      name: "Golden Age",
      start: BigInt(Date.UTC(1937, 0, 1)) * 1000000n,
      end: BigInt(Date.UTC(1942, 0, 1)) * 1000000n,
      universes: [],
      // universes: ["disney:snow_white:1937", "disney:pinocchio:1940", "disney:fantasia:1940"]
    },
    {
      eraId: "silver_age", 
      name: "Silver Age",
      start: BigInt(Date.UTC(1950, 0, 1)) * 1000000n,
      end: BigInt(Date.UTC(1967, 0, 1)) * 1000000n,
      universes: [createFilmUniverseId('disney', 'mary_poppins', 1964)],
      // universes: ["disney:cinderella:1950", "disney:jungle_book:1967"]
    },
    {
      eraId: "renaissance",
      name: "Disney Renaissance", 
      start: BigInt(Date.UTC(1989, 0, 1)) * 1000000n,
      end: BigInt(Date.UTC(1999, 0, 1)) * 1000000n,
      universes: [],
      // universes: ["disney:little_mermaid:1989", "disney:beauty_beast:1991", "disney:lion_king:1994"]
    },
    {
      eraId: "modern_era",
      name: "Modern Disney Era",
      start: BigInt(Date.UTC(2009, 0, 1)) * 1000000n,
      end: BigInt(Date.now()) * 1000000n,
      universes: [],
      // universes: ["disney:tangled:2010", "disney:frozen:2013", "disney:moana:2016"]
    },
    {
      eraId: "streaming_expansion",
      name: "Disney+ and Streaming Expansion",
      start: BigInt(Date.UTC(2019, 10, 12)) * 1000000n, // Disney+ launch
      end: BigInt(Date.now()) * 1000000n,
      universes: [],
      // universes: ["disney_plus:mandalorian:2019", "disney_plus:wandavision:2021"]
    }
  ]
};

export const marvelNetwork: UniverseNetwork = {
  networkId: "marvel",
  universes: new Set([
    createFilmUniverseId('marvel_studios', 'iron_man', 2008),
    createFilmUniverseId('marvel_studios', 'the_avengers', 2012),
    createFilmUniverseId('marvel_studios', 'avengers_endgame', 2019),
    createUniverseId('marvel_studios:wandavision:2021'),
  ]),
  
  sharedEpochs: {
    corporate: {
      epochId: "marvel:disney_acquisition",
      startTime: BigInt(Date.UTC(2009, 7, 31)) * 1000000n, // Disney acquires Marvel
      endTime: BigInt(Date.now()) * 1000000n,
      precision: 86_400_000_000_000, // DAY precision
      description: "Marvel under Disney ownership"
    }
  },
  
  eras: [
    {
      eraId: "phase_one",
      name: "MCU Phase One",
      start: BigInt(Date.UTC(2008, 4, 2)) * 1000000n, // Iron Man release
      end: BigInt(Date.UTC(2012, 4, 4)) * 1000000n, // Avengers release
      universes: [
        createFilmUniverseId('marvel_studios', 'iron_man', 2008),
        createFilmUniverseId('marvel_studios', 'the_avengers', 2012),
      ],
      // universes: ["marvel:hulk:2008", "marvel:thor:2011"]
    },
    {
      eraId: "disney_plus_expansion", 
      name: "Disney+ Marvel Series",
      start: BigInt(Date.UTC(2021, 0, 15)) * 1000000n, // WandaVision premiere
      end: BigInt(Date.now()) * 1000000n,
      universes: [createUniverseId('marvel_studios:wandavision:2021')],
      // universes: ["disney_plus:falcon_winter:2021"]
    }
  ]
};

export const universeNetworks = [
  disneyNetwork,
  marvelNetwork
];
