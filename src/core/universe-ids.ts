import {
  createFromMerge, createSourceString,decodeSourceString,
  RUNTIME_GENESIS_FART,

    main,
} from './sparklefart-ids';
/**
 * Branded types for Universe IDs to prevent magic string issues
 * and provide type safety for universe identification
 */
import KSUID from 'ksuid';
import {KSUIDConverter} from '../utils/ksuid-converter';
export type Brand<K, T extends string> = K & { readonly [P in T]: T};
// Base branded type for universe IDs
export type UniverseId = Brand<string & { __brand: 'UniverseId'},'UniverseId'>;
/** A reversed, base64 encoded UniverseId, representing the direct parent or parents. */
export type SourceString = Brand<UniverseId, 'SourceString'>;

/** A time-ordered UUIDv7 used to identify the specific event or "trace". */
export type UuidV7String = Brand<string, 'UuidV7String'>;

/** A KSUID string, providing the primary sort key for UniverseIds. */
export type KsuidString = Brand<string, 'KsuidString'>;

/** An identifier for the event, which can be another entity's source or a new UUID. */
export type TraceId = SourceString | UuidV7String;

/** The parsed components of a Universe ID. */
export type ParsedUniverseId = {
  source: SourceString;
  trace: TraceId;
  ksuid: KsuidString;
};
// Specific branded types for different universe categories
export type SparkleFartUniverseId = Brand<SourceString, 'SparkleFartUniverseId'>;
export type FilmUniverseId = UniverseId & { readonly __filmBrand: true };
export type SeriesUniverseId = UniverseId & { readonly __seriesBrand: true };
export type BookUniverseId = UniverseId & { readonly __bookBrand: true };
export type FashionUniverseId = UniverseId & { readonly __fashionBrand: true };
export type HistoricalUniverseId = UniverseId & { readonly __historicalBrand: true };
export type PersonalUniverseId = UniverseId & { readonly __personalBrand: true };
export type MissionUniverseId = UniverseId & { readonly __missionBrand: true };
export type LegalUniverseId = UniverseId & { readonly __legalBrand: true };
export type BiographyUniverseId = UniverseId & { readonly __biographyBrand: true };
export type GameUniverseId = UniverseId & { readonly __gameBrand: true };
export type CyberSecurityUniverseId = UniverseId & { readonly __cyberSecurityBrand: true };

// Union type for all specific universe ID types
export type TypedUniverseId = 
  | FilmUniverseId 
  | SeriesUniverseId 
  | BookUniverseId
  | FashionUniverseId
  | HistoricalUniverseId 
  | PersonalUniverseId 
  | MissionUniverseId 
  | LegalUniverseId 
  | BiographyUniverseId
  | SparkleFartUniverseId
  | CyberSecurityUniverseId
  | GameUniverseId;

/**
 * Universe ID validation patterns
 */
export const UNIVERSE_ID_PATTERNS = {
  FILM: /^(film|disney|paramount|universal|warner|sony|mgm):[a-z0-9_]+:\d{4}$/,
  SERIES: /^(series|tv|netflix|hbo|disney_plus|amazon):[a-z0-9_]+:\d{4}$/,
  BOOK: /^(book|literature|publisher):[a-z0-9_]+:\d{4}$/,
  FASHION: /^fashion:[a-z0-9_]+:(career|founded|\d{4}|\d{4}-\d{4}|\d{4}-present)$/,
  HISTORICAL: /^history:[a-z0-9_]+:(career|founded|\d{4}|\d{4}-\d{4}|\d{4}-present)$/,
  PERSONAL: /^personal:[a-z0-9_]+:\d{4}$/,
  MISSION: /^(nasa|esa|spacex|military):[a-z0-9_]+:\d{4}$/,
  LEGAL: /^legal[a-z0-9_]+:[a-z0-9_]+:[a-z0-9_]+:\d{4}$/,
  // COUNTRY: /^usa:[a-z0-9_]+:\d{4}-(\d{4}|present)$/,
  BIOGRAPHY: /^biography:[a-z0-9_]+:\d{4}-(\d{4}|present)$/,
  GAME: /^(game|anime)[a-z0-9_]?:[a-z0-9_]+:[a-z0-9_]+:\d{4}$/,
  CYBERSECURITY: /^cybersecurity:.*$/,
  SPARKLE_FART: /^8J\+mhPCfkqgu.*$/,
  FALLBACK: /^[a-z0-9_:]+:[a-z0-9_]+:\d{4}$/
} as const;

/**
 * Type guards for universe ID validation
 */
export function isValidUniverseId(id: string): id is UniverseId {
  // return true; //so so wrong
  return Object.values(UNIVERSE_ID_PATTERNS).some(pattern => pattern.test(id));
}

export function isSparkleFartUniverseId(id: string): id is SparkleFartUniverseId {
  return UNIVERSE_ID_PATTERNS.SPARKLE_FART.test(id);
}

export function isFashionUniverseId(id: string): id is FashionUniverseId {
  return UNIVERSE_ID_PATTERNS.FASHION.test(id);
}
export function isFilmUniverseId(id: string): id is FilmUniverseId {
  return UNIVERSE_ID_PATTERNS.FILM.test(id);
}

export function isSeriesUniverseId(id: string): id is SeriesUniverseId {
  return UNIVERSE_ID_PATTERNS.SERIES.test(id);
}

export function isBookUniverseId(id: string): id is BookUniverseId {
  return UNIVERSE_ID_PATTERNS.BOOK.test(id);
}

export function isHistoricalUniverseId(id: string): id is HistoricalUniverseId {
  return UNIVERSE_ID_PATTERNS.HISTORICAL.test(id);
}

export function isPersonalUniverseId(id: string): id is PersonalUniverseId {
  return UNIVERSE_ID_PATTERNS.PERSONAL.test(id);
}

export function isMissionUniverseId(id: string): id is MissionUniverseId {
  return UNIVERSE_ID_PATTERNS.MISSION.test(id);
}

export function isLegalUniverseId(id: string): id is LegalUniverseId {
  return UNIVERSE_ID_PATTERNS.LEGAL.test(id);
}

export function isBiographyUniverseId(id: string): id is BiographyUniverseId {
  return UNIVERSE_ID_PATTERNS.BIOGRAPHY.test(id);
}

export function isGameUniverseId(id: string): id is GameUniverseId {
  return UNIVERSE_ID_PATTERNS.GAME.test(id);
}

export function isCyberSecurityUniverseId(id: string): id is CyberSecurityUniverseId {
  return UNIVERSE_ID_PATTERNS.CYBERSECURITY.test(id);
}

/**
 * Factory functions for creating typed universe IDs
 */
export function createUniverseId(id: string): UniverseId {
  if (!isValidUniverseId(id)) {
    throw new Error(`Invalid universe ID format: ${id}`);
  }
  return id as UniverseId;
}

export async function createSparkleFartUniverseId(source: SourceString, traceId: TraceId) {

  return createFromMerge(await RUNTIME_GENESIS_FART, createSourceString(source) as unknown as SparkleFartUniverseId, traceId)
}

export function createFilmUniverseId(studio: string, title: string, year: number): FilmUniverseId {
  const id = `${studio}:${title}:${year}`;
  if (!isFilmUniverseId(id)) {
    // console.error('the system didnt like that id');
    // return `film:${id}` as FilmUniverseId;
    throw new Error(`Invalid film universe ID format: ${id}`);
  }
  return id as FilmUniverseId;
}
export function createCyberSecurityUniverseId(name: string, cve: string): CyberSecurityUniverseId {
  const id = `cybersecurity:${name}:${cve}`;
  if (!isCyberSecurityUniverseId(id)) {
    throw new Error(`Invalid cybersecurity universe ID format: ${id}`);
  }
  return id as CyberSecurityUniverseId;
}
export function createFashionUniverseId(event: string, year: number): FashionUniverseId {
  const id = `fashion:${event}:${year}`;
  if (!isFashionUniverseId(id)) {
    throw new Error(`Invalid fashion universe ID format: ${id}`);
  }
  return id as FashionUniverseId;
}
export function createHistoricalUniverseId(event: string, year: number): HistoricalUniverseId {
  const id = `history:${event}:${year}`;
  if (!isHistoricalUniverseId(id)) {
    throw new Error(`Invalid historical universe ID format: ${id}`);
  }
  return id as HistoricalUniverseId;
}

export function createMissionUniverseId(agency: string, mission: string, year: number): MissionUniverseId {
  const id = `${agency}:${mission}:${year}`;
  if (!isMissionUniverseId(id)) {
    throw new Error(`Invalid mission universe ID format: ${id}`);
  }
  return id as MissionUniverseId;
}

export function createBiographyUniverseId(person: string, birthYear: number, deathYear?: number): BiographyUniverseId {
  const endYear = deathYear ? deathYear.toString() : 'present';
  const id = `biography:${person}:${birthYear}-${endYear}`;
  if (!isBiographyUniverseId(id)) {
    throw new Error(`Invalid biography universe ID format: ${id}`);
  }
  return id as BiographyUniverseId;
}

/**
 * Utility functions for working with universe IDs
 */
export function parseUniverseId(id: UniverseId): {
  category: string;
  identifier: string;
  timestamp: string
  // year?: number;
  // studio?: string;
} {
  const parts = (id as unknown as string).split(':');
  
  return {
    category: parts[0],
    identifier: parts[1],
    timestamp: parts[2],
    // year: parts[2] ? parseInt(parts[2]) : undefined,
    // studio: parts[0]
  };
}

export function getUniverseCategory(id: UniverseId): string {
  return parseUniverseId(id).category;
}

/**
 * Well-known universe IDs as constants to prevent typos
 */
export const WELL_KNOWN_UNIVERSES = {
  // Films
  MARY_POPPINS: createFilmUniverseId('disney', 'mary_poppins', 1964),
  BACK_TO_THE_FUTURE: createFilmUniverseId('film', 'bttf', 1985),
  // STAR_WARS_ANH: createFilmUniverseId('film', 'star_wars:a_new_hope', 1977),
  
  // Historical Events
  JFK_ASSASSINATION: createHistoricalUniverseId('jfk_assassination', 1963),
  JFK_MOON_SPEECH: createHistoricalUniverseId('jfk_moon_speech', 1961),
  
  // Missions
  APOLLO_11: createMissionUniverseId('nasa', 'apollo11', 1969),
  
  // Biographies
  TOLKIEN: createBiographyUniverseId('jrr_tolkien', 1892, 1973),
  BRITNEY_SPEARS: createBiographyUniverseId('britney_spears', 1981),
} as const;

/**
 * Type-safe universe ID sets for networks
 */
export type DisneyUniverseId = 
  | typeof WELL_KNOWN_UNIVERSES.MARY_POPPINS
  | FilmUniverseId; // Allow other Disney films

export type NASAUniverseId = 
  | typeof WELL_KNOWN_UNIVERSES.APOLLO_11
  | MissionUniverseId; // Allow other NASA missions

/**
 * Reference validation - ensures referenced universes exist or are properly formatted
 */
export function validateUniverseReference(id: string): {
  isValid: boolean;
  category?: string;
  shouldGenerate?: boolean;
  error?: string;
} {
  if (!isValidUniverseId(id)) {
    return {
      isValid: false,
      error: `Invalid universe ID format: ${id}`
    };
  }
  
  const category = getUniverseCategory(id as UniverseId);
  
  return {
    isValid: true,
    category,
    shouldGenerate: false // Could be enhanced to check if universe exists in registry
  };
}
