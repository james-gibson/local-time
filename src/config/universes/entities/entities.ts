import {
  TimePrecision,
  UniverseType,
  type TemporalEpoch,
  type Universe,
} from '../../../core/types';
import {
  createOrganizationUniverseId,
  createPersonUniverseId,
  type OrganizationSpan,
  type PersonSpan,
} from '../../../core/universe-ids';
import type { EntityKind } from '../../../core/entities';

/**
 * The first `organization:` and `person:` universes (james-gibson/local-time#209).
 *
 * These are the entities `#207` had to demote to `metadata.entities` because the
 * vocabulary had no type for them. The model is both halves at once:
 *
 * - every row is an **entity** — `organization:<slug>` / `person:<slug>` — addressable
 *   in the registry's entity table, and deliberately not a universe id;
 * - a row that has an **existence span** is promoted to a **universe** with a temporal
 *   layer, which is what this module builds.
 *
 * The span tokens carry the honesty. `founded` (`organization:`) and `born` (`person:`)
 * mean *the entity exists and this record does not establish the year*. They do not
 * invent one: the epoch is open at the start, and `entities.test.ts` asserts that a
 * promoted `founded`/`born` row has no `startTime`.
 *
 * **Scope.** These are the eleven rows whose existence is established by the record.
 * The three held rows (`organization:newman_ministries`, `person:bill_zarusen`,
 * `person:matt_zarusen`) stay entity rows on the `#207` event with no span: a held claim
 * is a mention, not a fact, and promoting it would launder a single-source allegation
 * into a registered universe.
 */

/** The present of the `#207` record. Fixed so builds and tests are deterministic. */
const RECORD_PRESENT = BigInt(Date.UTC(2026, 10, 2)) * 1_000_000n;

function yearStart(year: string): bigint {
  return BigInt(Date.UTC(Number(year), 0, 1)) * 1_000_000n;
}

function yearEnd(year: string): bigint {
  return BigInt(Date.UTC(Number(year), 11, 31)) * 1_000_000n;
}

interface EntitySpec {
  kind: EntityKind;
  /** The slug shared by the entity id and the universe id. */
  slug: string;
  name: string;
  span: OrganizationSpan | PersonSpan;
  /** A finer start than the span's year, when the record gives one. */
  startIso?: string;
  /** The sources that establish the entity. */
  sources: string[];
}

/** The #207 source list, shared by the entity universes it establishes. */
const TTSU_SOURCES = [
  'Texas Tribune, "False pamphlets causing backlash and confusion…" (2026-10-20)',
  'Texas Tribune, "West Texas DA opens forgery probe…" (2026-10-23)',
  'CBS News Texas, "Fight over transgender mystery mailers heads to court"',
  'Click2Houston (2026-10-20); Chron; LGBTQ Nation',
  'james-gibson/local-time#207 (LT-2026-1026-TTSU)',
];

export const ENTITY_SPECS: readonly EntitySpec[] = [
  {
    kind: 'organization',
    slug: 'transgender_education_network_of_texas',
    name: 'Transgender Education Network of Texas (TENT)',
    span: 'founded',
    sources: TTSU_SOURCES,
  },
  {
    kind: 'organization',
    slug: 'texas_transgender_student_union_llc',
    name: '"Texas Transgender Student Union" LLC (Wyoming)',
    span: '2026-present',
    startIso: '2026-09-01',
    sources: TTSU_SOURCES,
  },
  {
    kind: 'organization',
    slug: 'three_z_printing',
    name: 'Three Z Printing (Teutopolis, Illinois)',
    span: 'founded',
    sources: TTSU_SOURCES,
  },
  {
    kind: 'organization',
    slug: 'snailworks',
    name: 'SnailWorks (Maryland)',
    span: 'founded',
    sources: TTSU_SOURCES,
  },
  {
    kind: 'organization',
    slug: 'northwest_registered_agent',
    name: 'Northwest Registered Agent (Sheridan, Wyoming)',
    span: 'founded',
    sources: TTSU_SOURCES,
  },
  {
    kind: 'organization',
    slug: 'national_republican_congressional_committee',
    name: 'National Republican Congressional Committee',
    span: 'founded',
    sources: TTSU_SOURCES,
  },
  {
    kind: 'organization',
    slug: 'preservation_austin',
    name: 'Preservation Austin',
    span: 'founded',
    sources: TTSU_SOURCES,
  },
  {
    kind: 'person',
    slug: 'jon_bonck',
    name: 'Jon Bonck',
    span: 'born',
    sources: TTSU_SOURCES,
  },
  {
    kind: 'person',
    slug: 'jeff_leach',
    name: 'Jeff Leach',
    span: 'born',
    sources: TTSU_SOURCES,
  },
  {
    kind: 'person',
    slug: 'steven_monacelli',
    name: 'Steven Monacelli',
    span: 'born',
    sources: TTSU_SOURCES,
  },
  {
    kind: 'person',
    slug: 'ayden_runnels',
    name: 'Ayden Runnels',
    span: 'born',
    sources: TTSU_SOURCES,
  },
];

/**
 * The epoch for an entity's existence.
 *
 * A known year bounds the epoch to that year; `present` ends it at the record's
 * present; `founded` / `born` leave it open at the start, which is the point. A row
 * with `startIso` uses the finer date the record gives (the LLC's formation month).
 */
function existenceEpoch(spec: EntitySpec): TemporalEpoch {
  const epoch: TemporalEpoch = {
    epochId: `${spec.slug}:existence`,
    precision: TimePrecision.YEAR,
  };

  if (spec.startIso) {
    epoch.startTime = BigInt(Date.parse(spec.startIso)) * 1_000_000n;
    epoch.precision = TimePrecision.MONTH;
  } else if (/^\d{4}/.test(spec.span)) {
    const startYear = spec.span.slice(0, 4);
    epoch.startTime = yearStart(startYear);
  }

  const range = /^\d{4}-(\d{4}|present)$/.exec(spec.span);
  if (range) {
    epoch.endTime = range[1] === 'present' ? RECORD_PRESENT : yearEnd(range[1]);
  } else if (/^\d{4}$/.test(spec.span)) {
    epoch.endTime = yearEnd(spec.span);
  } else if (spec.span === 'founded' || spec.span === 'born') {
    epoch.endTime = RECORD_PRESENT;
  }

  if (spec.span === 'founded') {
    epoch.description =
      `${spec.name} exists; the founding year is not established in this record, ` +
      'so the epoch is open at the start.';
  } else if (spec.span === 'born') {
    epoch.description =
      `${spec.name} is established; the birth year is not established in this record, ` +
      'so the epoch is open at the start.';
  } else if (spec.span === '*') {
    epoch.description =
      `${spec.name} is attested, but neither end of its existence is established in this record.`;
  } else if (spec.startIso) {
    epoch.description =
      `${spec.name}, from the formation the record dates to ${spec.startIso.slice(0, 7)}.`;
  } else {
    epoch.description = `${spec.name}, recorded to the year.`;
  }

  return epoch;
}

function buildEntityUniverse(spec: EntitySpec): Universe {
  const entityId =
    spec.kind === 'organization'
      ? `organization:${spec.slug}`
      : `person:${spec.slug}`;

  const universeId =
    spec.kind === 'organization'
      ? createOrganizationUniverseId(spec.slug, spec.span as OrganizationSpan)
      : createPersonUniverseId(spec.slug, spec.span as PersonSpan);

  const epoch = existenceEpoch(spec);

  return {
    universeId,
    type:
      spec.kind === 'organization'
        ? UniverseType.ORGANIZATION
        : UniverseType.PERSON,
    identifiers: {
      primary: universeId,
      // The entity id is an alias, not a second universe id: it is the addressable
      // mention, and `isValidUniverseId` refuses it. Registering it as an alias is
      // what lets a caller who has the row look the universe up without re-deriving
      // the span.
      aliases: [entityId, spec.name],
    },
    realityRelation: {
      type: 'documentary',
      fictionalizationDegree: 0.0,
      realityAnchors: [
        {
          realEventId: universeId,
          relationshipType: 'documents',
          confidence: 1.0,
          evidence: spec.sources,
        },
      ],
    },
    attribution: {
      citations_required: true,
      sources: spec.sources,
    },
    layers: [
      {
        layerId: 'identity',
        type: 'primary',
        epochs: { existence: epoch },
      },
    ],
    epochs: { existence: epoch },
    metadata: {
      canonicalName: spec.name,
      // Existence is not a cultural claim. A flat 0.5 says "recorded, not ranked";
      // the event's entity row carries the role's own certainty.
      cultural_significance: 0.5,
    },
  };
}

export const entityUniverses: Universe[] = ENTITY_SPECS.map(buildEntityUniverse);
