import { Universe, UniverseType } from '../../../core/types';
import { createSystemUniverseId } from '../../../core/universe-ids';

/**
 * Static Identifier Generation Schema — `system:ids:static_id_schema:v1`.
 *
 * james-gibson/local-time#9.
 *
 * The issue derives a typology from Wikidata's `instance of` (P31) property over the
 * QIDs used in the Hillary Clinton research, and proposes an internal ID convention
 * `id::{type}::{region_or_context}::{specific_name}`. The owner's comment formalises
 * the schema itself as a universe so the rules are inspectable rather than prose.
 *
 * That is this universe. It is the first `ABSTRACT_CONCEPT`: not an entity that
 * happened in time, and not a work, but a rule set other universes are measured
 * against. Hence the `system:` namespace and the version span (`v1`, not a year) —
 * a schema is versioned, not dated.
 *
 * ## Why this does NOT adopt the issue's ID shape
 *
 * The issue proposes `id::person::us::hillary_clinton`. **That convention was never
 * adopted and has since been superseded.** The system that was actually built is
 * `domain:type:slug:year` with a closed set of domains — `history:costco:1983`,
 * `disney:aladdin:1992`, `personal:<name>:<year>`, `film_studio:<slug>:<span>`. So
 * this universe records the typology, which is the part that transferred, and maps
 * each type onto the pattern that *does* exist. Three of the four map cleanly; the
 * fourth is the interesting one and is called out below.
 *
 * ## The gap the issue actually found
 *
 * `Conspiracy Theory (Q4982301)` has no equivalent in the built system. The other
 * three map onto existing domains (person → `personal:`, event → `history:`,
 * organization → `history:` as an institutional period). A conspiracy theory is
 * categorically different: it is a *real, documented phenomenon* — people genuinely
 * believe it, it genuinely circulates, it genuinely has effects — whose *claims*
 * are unsubstantiated. Neither the documentary end of `reality-gradient` nor the
 * fictional end fits, because both would mis-file it.
 *
 * The 42i work suggested the resolution: model the phenomenon at the reality level
 * and the claims at a derived level, so the belief is `documents` while the claim is
 * `interpretation` anchored to it. That is left as an open item — it needs a decision
 * about whether an unsubstantiated claim can carry its own universe, and it is not
 * settled by recording the typology.
 */

/**
 * One row of the typology: a Wikidata type, mapped onto the pattern that exists. */
export interface IdentifierTypeDefinition {
  /** The common name for the entity type, as Wikidata states it. */
  name: string;
  /** The Wikidata QID for `instance of` (P31). */
  wikidataQid: string;
  /**
   * The pattern in the built system that carries this kind of entity, or `null`
   * where the system has no equivalent — see the module comment.
   */
  builtPattern: string | null;
  /** Example of an ID the built system would actually generate. */
  builtExample: string;
  description: string;
}

export interface IdentifierSchema {
  /**
   * The shape the issue *proposed*. Recorded for provenance only — the built system
   * uses `domain:type:slug:year`, not this.
   */
  proposedPattern: 'id::{type}::{region_or_context}::{specific_name}';
  /** The shape actually in force. */
  builtPattern: 'domain:type:slug:year';
  types: IdentifierTypeDefinition[];
}

export const staticIdSchema: IdentifierSchema = {
  proposedPattern: 'id::{type}::{region_or_context}::{specific_name}',
  builtPattern: 'domain:type:slug:year',
  types: [
    {
      name: 'Human',
      wikidataQid: 'Q5',
      builtPattern: 'personal:<name>:<year>',
      builtExample: 'personal:hillary_clinton:1947',
      description:
        'An individual human being. Maps cleanly: the PERSONAL pattern already carries people, with the birth year as the span.',
    },
    {
      name: 'Event',
      wikidataQid: 'Q1656682',
      builtPattern: 'history:<slug>:<year>',
      builtExample: 'history:gamestop_squeeze:2021',
      description:
        'An occurrence over a specific period — an election, an incident. Maps cleanly: HISTORICAL_EVENT universes, year as the span.',
    },
    {
      name: 'Conspiracy Theory',
      wikidataQid: 'Q4982301',
      builtPattern: null,
      builtExample: '(none)',
      description:
        'An unsubstantiated explanation documented as a socio-political phenomenon. **No equivalent exists.** The phenomenon is real and documentable; its claims are not. Mapping it to `history:` would assert the claim; mapping it to a fiction pattern would erase the phenomenon.',
    },
    {
      name: 'Organization',
      wikidataQid: 'Q43229',
      builtPattern: 'history:<slug>:<year>',
      builtExample: 'history:costco:1983',
      description:
        'An organized group of people. Maps cleanly as an INSTITUTIONAL_PERIOD with the founding year — which is what the Costco universe already does. Wikidata subtypes (select committee, news organization) are carried as `tags`, not as separate namespaces.',
    },
  ],
};

/**
 * The payload that makes this an `ABSTRACT_CONCEPT` rather than a temporal entity:
 * what kind of rule it states, what it supersedes, and the evidence for it.
 *
 * Kept local to this module rather than in `core/types` — an abstract concept is a
 * rare universe kind and the core type surface does not need to grow for one.
 */
export interface AbstractConceptDetail {
  conceptKind: 'identifier_schema';
  /** Version-spanned ids this spec supersedes; a spec is versioned, not dated. */
  supersedes: string[];
  /** The rule, stated as a single sentence. */
  statement: string;
  evidence: string[];
}

export const abstractConceptDetail: AbstractConceptDetail = {
  conceptKind: 'identifier_schema',
  /**
   * Nothing, and deliberately so. The issue's draft referred to a `v2`; there is no
   * recorded `v0` universe and this is `v1`, so the predecessor list is empty rather
   * than citing a spec that was never written down. A `v2` that supersedes this one
   * should keep `…:v1` here, so the chain stays legible.
   */
  supersedes: [],
  statement:
    'Static universe IDs are `domain:type:slug:year`, from a closed set of domains. ' +
    'A schema specification is itself a universe of type ABSTRACT_CONCEPT in the `system:` ' +
    'namespace, spanned by a version rather than a date.',
  evidence: [
    'james-gibson/local-time#9 — the Wikidata P31 typology and the proposed ID convention',
    'Wikidata documentation on items (QIDs) and the P31 ("instance of") property',
    'The `domain:type:slug:year` scheme in `src/core/universe-ids.ts`',
  ],
};

export const staticIdSchemaUniverse: Universe = {
  universeId: createSystemUniverseId('ids:static_id_schema', 'v1'),
  type: UniverseType.ABSTRACT_CONCEPT,
  identifiers: {
    primary: 'system:ids:static_id_schema:v1',
    aliases: [
      'Static Identifier Generation Schema',
      'The ID typology',
      'Wikidata-derived entity typology',
    ],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'Wikidata (Q2013)',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Wikidata documentation on items (QIDs) and properties (P31).',
          'Internal analysis of the QIDs referenced in the issue.',
        ],
      },
    ],
  },
  attribution: {
    public_domain: true,
    citations_required: false,
    usage_restrictions: ['For internal system use.'],
    sources: [
      'Wikidata (Q2013) — items and the P31 "instance of" property',
      'james-gibson/local-time#9',
    ],
  },
  layers: [],
  epochs: {},
  temporalStructure: {
    segments: [],
    keyframes: [],
    windows: { strategy: 'point_in_time' as unknown as never },
  },
  metadata: {
    canonicalName: 'Static Identifier Generation Schema',
    description:
      'The typology of entity kinds that internal static IDs are namespaced by, derived from Wikidata P31, and the mapping from each type onto the pattern actually in force.',
    cultural_significance: 0.7,
    tags: ['system', 'schema', 'ids', 'wikidata', 'typology', 'meta'],
    schemaVersion: '1.0.0',
    schemaDefinition: staticIdSchema,
    abstractConcept: abstractConceptDetail,
  },
  connections: {
    natural: {
      parentUniverses: [],
    },
    references: [],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#9. */
export const wikidataTypologyUniverses: Universe[] = [staticIdSchemaUniverse];
