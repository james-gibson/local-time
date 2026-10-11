import { Universe, UniverseType } from '../../../core/types';
import { US_APPLICABLE_UNIVERSES } from './parents';

/**
 * Local Time helper: milliseconds since epoch -> nanoseconds (bigint),
 * matching the `BigInt(Date.UTC(...)) * 1000000n` convention used across
 * `src/config/universes`.
 */
const fromIso = (iso: string): bigint => BigInt(new Date(iso).getTime()) * 1_000_000n;

/**
 * United States Constitution - The foundational governing document of the U.S.
 *
 * Covers the Constitutional Convention through ratification by the ninth state
 * (New Hampshire), which established the Constitution as the framework of the
 * U.S. government.
 *
 * Cultural Significance: 1.0 - one of the most influential legal documents in
 * world history and a model for constitutional governance globally.
 * Reality Relation: documents, 0.0 fictionalization.
 *
 * Research Sources:
 * - National Archives: "The Constitution of the United States: A Transcription"
 * - Library of Congress: Documents from the Continental Congress and the
 *   Constitutional Convention, 1774-1789
 * - The Federalist Papers (contemporary context and intent)
 * - National Constitution Center
 *
 * Hierarchical Context: US_GOVERNMENT -> US_HISTORY -> WORLD_HISTORY
 */
export const usConstitutionUniverse: Universe = {
  universeId: 'us:constitution:1787',
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: {
    primary: 'us:constitution:1787',
    aliases: ['US Constitution', 'Constitutional Convention'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'us:constitution:1787',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Annals of Congress',
          "James Madison's Notes of the Constitutional Convention",
        ],
      },
    ],
  },
  attribution: {
    public_domain: true,
    sources: ['National Archives and Records Administration'],
    citations_required: false,
    usage_restrictions: [],
  },
  layers: [{ layerId: 'primary', type: 'primary', epochs: {} }],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'drafting_and_ratification',
        start: fromIso('1787-05-25T12:00:00Z'), // Convention convenes
        end: fromIso('1788-06-21T12:00:00Z'), // Ratified by the 9th state
        type: 'legal_period',
        status: 'active',
        jurisdiction: 'United States',
        description:
          'Period covering the drafting, debate, and state-by-state ratification of the Constitution.',
      },
    ],
    keyframes: [
      {
        id: 'convention_signing',
        timestamp: fromIso('1787-09-17T12:00:00Z'),
        significance: 0.9,
        tags: ['legal', 'drafting', 'milestone'],
        certainty: 1.0,
      },
      {
        id: 'ratification_complete',
        timestamp: fromIso('1788-06-21T12:00:00Z'),
        significance: 1.0,
        tags: ['legal', 'ratification', 'government_formation'],
        certainty: 1.0,
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'United States Constitution',
    description:
      'The supreme law of the United States of America, establishing the framework for the federal government.',
    creators: ['Delegates of the Constitutional Convention'],
    released: new Date('1787-09-17'),
    cultural_significance: 1.0,
  },
  // Informational connection metadata (not yet a first-class `Universe` field).
  connections: {
    natural: { parentUniverses: US_APPLICABLE_UNIVERSES },
  },
} as unknown as Universe;

/**
 * The Bill of Rights - the first ten amendments to the U.S. Constitution.
 *
 * Defines the collective ratification of the first ten amendments, which
 * guarantee essential rights and civil liberties.
 *
 * Cultural Significance: 1.0 - foundational to American concepts of individual
 * liberty and limited government; a cornerstone of U.S. law.
 * Reality Relation: documents, 0.0 fictionalization.
 *
 * Research Sources:
 * - National Archives: "The Bill of Rights: A Transcription"
 * - Library of Congress: Primary Documents in American History - The Bill of Rights
 * - Cornell Law School Legal Information Institute (LII)
 *
 * Hierarchical Context: US_CONSTITUTION -> US_GOVERNMENT -> US_HISTORY
 */
export const billOfRightsUniverse: Universe = {
  universeId: 'us:bill_of_rights:1791',
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: {
    primary: 'us:bill_of_rights:1791',
    aliases: ['Bill of Rights', 'First Ten Amendments'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'us:bill_of_rights:1791',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: ['State legislative records', 'Annals of Congress'],
      },
    ],
  },
  attribution: {
    public_domain: true,
    sources: ['National Archives and Records Administration'],
    citations_required: false,
    usage_restrictions: [],
  },
  layers: [{ layerId: 'primary', type: 'primary', epochs: {} }],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'proposal_and_ratification',
        start: fromIso('1789-09-25T12:00:00Z'), // Proposed by Congress
        end: fromIso('1791-12-15T12:00:00Z'), // Ratified by Virginia (11th state)
        type: 'legal_period',
        status: 'active',
        jurisdiction: 'United States',
        description:
          'Period covering the proposal by Congress and subsequent ratification by the states.',
      },
    ],
    keyframes: [
      {
        id: 'proposed_by_congress',
        timestamp: fromIso('1789-09-25T12:00:00Z'),
        significance: 0.8,
        tags: ['legal', 'proposal', 'congress'],
        certainty: 1.0,
      },
      {
        id: 'ratification_complete',
        timestamp: fromIso('1791-12-15T12:00:00Z'),
        significance: 1.0,
        tags: ['legal', 'civil_rights', 'ratification'],
        certainty: 1.0,
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Bill of Rights',
    description:
      'The first ten amendments to the U.S. Constitution, guaranteeing fundamental rights and freedoms.',
    creators: ['First United States Congress'],
    released: new Date('1791-12-15'),
    cultural_significance: 1.0,
  },
  connections: {
    natural: {
      parentUniverses: [
        usConstitutionUniverse.universeId,
        ...US_APPLICABLE_UNIVERSES,
      ],
    },
    references: [
      {
        type: 'AMENDS',
        targetUniverseId: usConstitutionUniverse.universeId,
        description:
          'The Bill of Rights consists of the first ten amendments to the U.S. Constitution.',
        confidence: 1.0,
        evidence: ['Article V of the U.S. Constitution'],
      },
    ],
  },
} as unknown as Universe;
