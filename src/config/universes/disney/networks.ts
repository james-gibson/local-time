import { UniverseNetwork } from '../../../core/types';

export const disneyNetwork: UniverseNetwork = {
  networkId: "disney",
  universes: new Set([
    // "disney:mary_poppins:1964"
    // Additional universes would be added here as they're created
    // "disney:lion_king:1994",
    // "disney:frozen:2013",
    // "disney_channel:high_school_musical:2006",
    // "disney_plus:mandalorian:2019"
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
      universes: [],
      // universes: ["disney:cinderella:1950", "disney:mary_poppins:1964", "disney:jungle_book:1967"]
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
    // MCU films and Disney+ series would be added here
    // "marvel:iron_man:2008",
    // "marvel:avengers:2012", 
    // "disney_plus:wandavision:2021"
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
      universes: [],
      // universes: ["marvel:iron_man:2008", "marvel:hulk:2008", "marvel:thor:2011"]
    },
    {
      eraId: "disney_plus_expansion", 
      name: "Disney+ Marvel Series",
      start: BigInt(Date.UTC(2021, 0, 15)) * 1000000n, // WandaVision premiere
      end: BigInt(Date.now()) * 1000000n,
      universes: [],
      // universes: ["disney_plus:wandavision:2021", "disney_plus:falcon_winter:2021"]
    }
  ]
};

export const universeNetworks = [
  disneyNetwork,
  marvelNetwork
];
