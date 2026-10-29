import { Universe, UniverseType, TimePrecision, KeyframeType } from '../../../core/types';

/** Decimal years → nanoseconds since the Unix epoch. Same arithmetic as the
 * authority: the corrections inherit its ±1e9-year range and must not go
 * through `Date`, whose range is ±273,000 years. */
const ns = (year: number): bigint => BigInt(Math.round((year - 1970) * 365.2425 * 86400 * 1e9));

const AUTHORITY = 'system:chart:xkcd_1491_authority:v1' as const;

/**
 * The erratum sheet beside the rendering authority — `system:chart:xkcd_1491_corrections:v1`
 * (james-gibson/local-time#230).
 *
 * The authority (#229) records what xkcd #1491 *claims*. This universe records what is
 * true, and points at the authority keyframe each claim touches. Nothing in the authority
 * points back: a fixture whose job is "reproduce this from one file" cannot depend on its
 * own correction, or regenerating it would lose the corrections and keeping them would
 * break the reproduction. The edge runs one way, like an erratum slip that the book does
 * not cite.
 *
 * ## What this sheet can and cannot correct
 *
 * The authority is built from the comic's **data listing**, not from its pixels. That
 * bounds what a correction can say:
 *
 * - *Listing-level* claims — a printed magnitude, an approximation, a spelling — are
 *   correctable here and the authority's own value can be compared against them.
 * - *Drawing-level* claims — where a point actually sits on the page — are **not** in the
 *   listing at all. The three documented misplacements are recorded as
 *   `drawn_position` corrections: they say what the drawing does and what the truth is,
 *   and they explicitly note that the authority cannot express the difference. A test
 *   cannot reproduce a position that no file contains, and pretending otherwise would
 *   make the correction look verified when it is only written down.
 *
 * ## Corrections are dated too
 *
 * Each keyframe is stamped with the instant its claim is about, and carries `certainty`.
 * A reader in 2040 must be able to tell what 2026 believed. This sheet is not a timeless
 * fact; it is the record of a moment's best knowledge, which is the same thing the chart
 * itself is.
 */
export const xkcd1491CorrectionsUniverse: Universe = {
  universeId: 'system:chart:xkcd_1491_corrections:v1',
  type: UniverseType.ABSTRACT_CONCEPT,
  identifiers: {
    primary: 'system:chart:xkcd_1491_corrections:v1',
    aliases: ['xkcd-1491-corrections', 'stories-erratum'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0,
    realityAnchors: [
      {
        realEventId: 'xkcd:1491',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'explainxkcd.com/wiki/index.php/1491 § Errors — the three misplacements and two misspellings',
          'the works named in each correction, as cited in the entry note',
        ],
      },
    ],
  },
  attribution: {
    public_domain: false,
    sources: [
      'explainxkcd listing for 1491 § Errors § Dates and § Spelling',
      'the correction evidence fields below, one per claim',
    ],
    citations_required: true,
  },
  metadata: {
    canonicalName: 'Stories of the Past and Future — corrections',
    creators: ['James Gibson'],
    released: new Date('2026-10-28T00:00:00Z'),
    cultural_significance: 0.3,
  },
  epochs: {
    lest_darkness_fall: {
      epochId: 'lest_darkness_fall',
      startTime: ns(535),
      precision: TimePrecision.YEAR,
      description:
        'corrected setting of Lest Darkness Fall: 535 CE, i.e. ~1404 years before its 1939 publication, not the ~535 years the drawing places it at',
    },
    gospels: {
      epochId: 'gospels',
      startTime: ns(87),
      endTime: ns(110),
      precision: TimePrecision.YEAR,
      description:
        'corrected authorship window of the Gospels: 65–110 CE (Mark c.65–73, Matthew 70–100, Luke 80–100, John 90–110); the drawing puts them at ~250 CE',
    },
    tng: {
      epochId: 'tng',
      startTime: ns(2364),
      precision: TimePrecision.YEAR,
      description:
        'corrected setting of Star Trek: The Next Generation: 2364, ~377 years after its 1987 première, not the ~500 the drawing shows',
    },
    star_wars: {
      epochId: 'star_wars',
      startTime: ns(-4e8),
      precision: TimePrecision.MILLION_YEARS,
      description:
        'upper bound on "a long time ago": the oldest known galaxy had formed within ~400 Myr of the Big Bang, so the setting cannot be 1 Gyr before a 13 Gyr-old galaxy existed in it',
    },
  },
  layers: [
    {
      layerId: 'corrections',
      type: 'primary',
      epochs: {},
    },
  ],
  temporalStructure: {
    segments: [],
    keyframes: [
      {
        id: 'lest-darkness-fall--drawn-position',
        timestamp: ns(535),
        significance: 0.7,
        tags: ['correction', 'drawn_position'],
        description:
          'Lest Darkness Fall: the drawing places it ~535 years in the past, which reads as set in 1400; the novel is set in 535 CE. The listing gives the correct 1404-year difference, so the authority carries the right value and this correction is about the drawing, which the authority cannot express.',
        type: KeyframeType.MILESTONE,
        precision: TimePrecision.YEAR,
        certainty: 0.95,
        targetUniverseId: AUTHORITY as never,
        targetKeyframeId: 'lest-darkness-fall--setting',
        targetKeyframeType: KeyframeType.MILESTONE,
      },
      {
        id: 'gospels--drawn-position',
        timestamp: ns(87),
        significance: 0.6,
        tags: ['correction', 'drawn_position'],
        description:
          'Gospels: drawn at ~250 CE; authorship is 65–110 CE, and the plotted offset implies 50–100 CE. The drawing is displaced to the right of any defensible date.',
        type: KeyframeType.MILESTONE,
        precision: TimePrecision.YEAR,
        certainty: 0.7,
        targetUniverseId: AUTHORITY as never,
        targetKeyframeId: 'gospels--publication',
        targetKeyframeType: KeyframeType.PUBLICATION,
      },
      {
        id: 'tng--drawn-position',
        timestamp: ns(2364),
        significance: 0.6,
        tags: ['correction', 'drawn_position'],
        description:
          'Star Trek: The Next Generation: drawn at ~500 years forward; 2364 is ~377 years after the 1987 première. The vertical offset is inflated, probably for label room.',
        type: KeyframeType.MILESTONE,
        precision: TimePrecision.YEAR,
        certainty: 0.9,
        targetUniverseId: AUTHORITY as never,
        targetKeyframeId: 'star-trek-the-next-generation--setting',
        targetKeyframeType: KeyframeType.MILESTONE,
      },
      {
        id: 'star-wars--disputed-magnitude',
        timestamp: ns(-4e8),
        significance: 0.5,
        tags: ['correction', 'disputed_quantity'],
        description:
          'The three Star Wars rows are printed as 1 billion years in the past. A bounded correction: the setting is "a long time ago" in a galaxy ~13 Gyr old, and the oldest known galaxy formed within ~380 Myr, so ~400 Myr is the ceiling a galaxy in this universe allows. The comic\'s own listing notes the discrepancy.',
        type: KeyframeType.MILESTONE,
        precision: TimePrecision.MILLION_YEARS,
        certainty: 0.5,
        targetUniverseId: AUTHORITY as never,
        targetKeyframeId: 'star-wars-iv-vi--setting',
        targetKeyframeType: KeyframeType.MILESTONE,
      },
      {
        id: 'rip-van-winkel--spelling',
        timestamp: ns(1819),
        significance: 0.2,
        tags: ['correction', 'spelling'],
        description:
          'Printed "Rip Van Winkel"; the story is "Rip Van Winkle". No date changes.',
        type: KeyframeType.PUBLICATION,
        precision: TimePrecision.YEAR,
        certainty: 1,
        targetUniverseId: AUTHORITY as never,
        targetKeyframeId: 'rip-van-winkel--publication',
        targetKeyframeType: KeyframeType.PUBLICATION,
      },
      {
        id: 'les-miserables--spelling',
        timestamp: ns(1862),
        significance: 0.2,
        tags: ['correction', 'spelling'],
        description:
          'Printed "Les Miserábles"; the novel is "Les Misérables". French has no "á" in the title. No date changes.',
        type: KeyframeType.PUBLICATION,
        precision: TimePrecision.YEAR,
        certainty: 1,
        targetUniverseId: AUTHORITY as never,
        targetKeyframeId: 'les-miserables--publication',
        targetKeyframeType: KeyframeType.PUBLICATION,
      },
      {
        id: 'the-flintstones--unresolved-setting',
        timestamp: ns(-4e6),
        significance: 0.3,
        tags: ['correction', 'unresolved'],
        description:
          'The Flintstones is set in "the Stone Age", a period rather than a date. Left unresolved deliberately: assigning it a year would be an invention wearing a correction\'s clothes. The authority\'s 2.5-million-year offset stands as the chart\'s approximation.',
        type: KeyframeType.MILESTONE,
        precision: TimePrecision.MILLION_YEARS,
        certainty: 0.2,
        targetUniverseId: AUTHORITY as never,
        targetKeyframeId: 'the-flintstones--setting',
        targetKeyframeType: KeyframeType.MILESTONE,
      },
      {
        id: 'moby-dick--unresolved-setting',
        timestamp: ns(1846),
        significance: 0.3,
        tags: ['correction', 'unresolved'],
        description:
          'Moby-Dick is set "before 1846" per the comic\'s own note, and the novel opens "Some years ago—never mind how long precisely". The bound is real and open: the authority keeps its 5+ marker, and nothing here narrows it further.',
        type: KeyframeType.MILESTONE,
        precision: TimePrecision.YEAR,
        certainty: 0.4,
        targetUniverseId: AUTHORITY as never,
        targetKeyframeId: 'moby-dick--setting',
        targetKeyframeType: KeyframeType.MILESTONE,
      },
      {
        id: 'this-chart--map-origin',
        timestamp: ns(2015.15),
        significance: 0.4,
        tags: ['correction', 'map_origin'],
        description:
          'The "This chart" entry is the source\'s own apex: 2015-02-25, the instant every verdict in it was computed from. Recorded here so the apex has an address; it is a dated fact about the source and must never be used as a default viewer origin.',
        type: KeyframeType.PUBLICATION,
        precision: TimePrecision.DAY,
        certainty: 1,
        targetUniverseId: AUTHORITY as never,
        targetKeyframeId: 'this-chart--publication',
        targetKeyframeType: KeyframeType.PUBLICATION,
      },
    ],
    windows: { strategy: 'time_based', avgWindowSize: ns(1) },
  },
};
