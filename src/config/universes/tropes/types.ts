import type { UniverseMetadata } from '../../../core/types';

/**
 * The typed shape of a *trope* — a named, recurring film convention.
 *
 * james-gibson/local-time#130.
 *
 * ## Why a trope is data, not a universe
 *
 * The guide's hard content rule is "real content only — real events and real
 * works". A trope is neither: it is a critical category that real films are
 * instances of. Minting a `universeId` per trope would assert that "The Training
 * Montage" is a work that happened, and there would be no honest reality
 * relation for it.
 *
 * So the tropes live as typed data inside one *container* universe
 * (`CommonUniverseIds.EIGHTIES_MOVIE_TROPES`), and the films that canonise them
 * are ordinary, separately-owned `film:` universes that declare membership of
 * that container. One owner, many memberships (james-gibson/local-time#74).
 */

/** Which convention a trope is a convention *of*. */
export enum TropeCategory {
  /** A recurring social role or character type (the ensemble, the ace). */
  CHARACTER = 'character',
  /** A recurring shape of the telling (direct address, the freeze-frame). */
  STRUCTURAL = 'structural',
  /** A recurring editing unit (the music-driven montage). */
  MONTAGE = 'montage',
  /** A recurring story premise (the modified-vehicle time machine). */
  PREMISE = 'premise',
}

/**
 * A position in one film's runtime that exhibits a trope.
 *
 * `runtimeKeyframeId` names a keyframe that must actually exist on
 * `universeId` — a pointer, not a restatement of the moment (the registration
 * test checks it). `verified` is `false` until the position has been checked
 * against a reference copy: an unverified exemplar says "this film has the
 * moment", never "the moment is at minute N".
 */
export interface TropeExemplar {
  /** The film universe the moment is a position in. */
  universeId: string;
  /** The runtime keyframe on that universe. Must exist. */
  runtimeKeyframeId: string;
  /** false until the position is checked against a reference copy. */
  verified: boolean;
}

/** One trope in the collection's registry. */
export interface TropeDefinition {
  /** Stable slug; the film side refers back to it by this id. */
  tropeId: string;
  name: string;
  category: TropeCategory;
  /**
   * The real film whose release canonised the trope. Must be a *registered*
   * universe id — a dangling anchor is not a connection (#129).
   */
  anchorFilmId: string;
  /**
   * The anchor film's release date, ISO-8601. Duplicated from the film on
   * purpose: it dates the container keyframe, and the registration test asserts
   * it equals the film's own `metadata.released`, so the two cannot drift.
   */
  anchorReleased: string;
  /**
   * The container keyframe that marks this trope's canonising release. Its
   * timestamp is the anchor film's release date, so the two cannot drift.
   */
  anchorKeyframeId: string;
  /** Other real works that exhibit it. Membership, never a redefinition (#74). */
  alsoExhibitedBy?: readonly string[];
  /** Runtime moments that exhibit it, if any are documented. */
  exemplars?: readonly TropeExemplar[];
  /** 0.0-1.0 on the guide's Cultural Significance Scale. */
  culturalSignificance: number;
  /** Why that number, for every trope rated above 0.9 (guide §Cultural Significance). */
  culturalNote: string;
  /** The retrieval corpus sentence: what the trope is, and what it looks like. */
  description: string;
}

/** The container's metadata: the trope registry lives here, typed. */
export type TropeCollectionMetadata = Partial<UniverseMetadata> & {
  tropes: readonly TropeDefinition[];
};

/**
 * A film's metadata: the trope memberships it contributes, plus any exemplar
 * moments. Declared on the film (its owner), so the fact is stated once.
 */
export type TropeFilmMetadata = Partial<UniverseMetadata> & {
  tropes: readonly string[];
  tropeExemplars?: readonly TropeExemplar[];
};
