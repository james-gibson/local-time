import { CommonUniverseIds } from '../../../core/common-universe-ids';
import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../core/types';
import { UniverseBuilder } from '../../../core/universe-builder';
import { createUniverseId } from '../../../core/universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * History of PageRank — the citation-ranking algorithm and the birth of Google.
 *
 * james-gibson/local-time#93, decomposed under james-gibson/local-time#103.
 *
 * PageRank was developed by Larry Page and Sergey Brin at Stanford from 1996 as
 * part of a new search-engine research project whose crawler was called
 * "BackRub". It reinterpreted hyperlinks as referrals — a high-quality page
 * should have high-quality pages referring to it — and produced a recursive
 * ranking score for every indexed page. The name plays on both "Larry Page" and
 * "web page". The algorithm became the basis of the search engine that launched
 * Google's founding in 1998, and its recursive quality-evaluation technique was
 * later adopted by other search engines, social networks and peer-to-peer
 * systems.
 *
 * ## One container, five eras (#103)
 *
 * This was a single 352-line literal: one universe spanning 1996-2026 with five
 * inline epochs, five segments and eleven keyframes. It could only be queried as
 * a whole — the eras were not things, so "the patent era" could not be fetched,
 * composed, or given its own sources and significance. The decomposition uses the
 * container model that #74/#106/#168 settled:
 *
 * - **`history:pagerank:1996`** is the container (`CommonUniverseIds.PAGERANK_HISTORY`).
 *   It keeps the id the literal already owned, so existing references still
 *   resolve, and it holds what is genuinely shared: the research sources, the
 *   reality relation, the Web anchor, the cultural rating, and the five-phase
 *   partition of the run.
 * - **Five era universes** are its members, each declaring exactly one
 *   membership (`addParent(PAGERANK_HISTORY)`) and inheriting the container's
 *   `SOFTWARE_ENGINEERING` / `WORLD_HISTORY` ancestors transitively. One owner,
 *   many memberships (#74).
 *
 * The eras are disjoint, so there is no shared epoch to inherit here (contrast
 * `usStatehoodHistory`'s shared Civil War epoch, #168); what they share is the
 * container's partition, sources and anchor, which is exactly what a container is
 * for.
 *
 * | Era | id | span |
 * | --- | --- | --- |
 * | inception | `history:pagerank:inception:1996` | 1996-01-01 → 1998-01-29 |
 * | publication | `history:pagerank:publication:1998` | 1998-01-29 → 1998-09-04 |
 * | commercialization | `history:pagerank:commercialization:1998` | 1998-09-04 → 2001-09-04 |
 * | patent era | `history:pagerank:patent_era:2001` | 2001-09-04 → 2019-06-04 |
 * | post-patent | `history:pagerank:post_patent:2019` | 2019-06-04 → present |
 *
 * ## The era table is the single source of the partition
 *
 * Each era's epoch, its segment, its container segment and its id all come from
 * one row of `ERAS`, so they cannot disagree — the same reason the film shim
 * derives the act partition from cut points (#142). Keyframes are authored once,
 * in one list, and assigned to an era by timestamp against the same rows; a
 * keyframe that fell outside every era would land in none and the test would say
 * so, rather than silently sitting in a segment it does not belong to.
 *
 * That assignment corrected one inconsistency the literal carried: the patent
 * keyframe (`patent_expired`, 2019-06-04) sat one day *before* the `post_patent`
 * epoch, which started 2019-06-05. The patent era now ends where the patent ends.
 *
 * ## Documentary, not fiction
 *
 * This is a record of a real algorithm and a real corporate history. Nothing
 * about it is invented, so `realityRelation` is `documentary` with
 * `fictionalizationDegree: 0.0`. The anchor below ties it to the Web — see
 * "Deferred anchors".
 *
 * ## Certainty is doing real work
 *
 * Only some facts are established to the day. BackRub's start is known to the
 * year (1996); the *Anatomy* paper is known to the conference (WWW7, April
 * 1998) not the day; `rel="nofollow"` is known to the month. Those keyframes
 * carry a reduced `certainty` and, where useful, a `dateRange`. The two 1998
 * papers, the patent dates and the toolbar retirement are exact.
 *
 * ## Deferred anchors
 *
 * The ticket proposed anchors to `history:world_wide_web:1989`,
 * `history:google_founded:1998` and `history:us_patent_6285999:1998`. Two of the
 * three do not exist and would be dangling references (the #129 lesson): the
 * World Wide Web's universe is registered as `technology:world_wide_web:1989`,
 * and no Google-corporate or US-patent universe is registered at all. Only the
 * first anchor is asserted; the other two are deferred until their universes
 * exist.
 *
 * Research Sources:
 * - Lawrence Page, Sergey Brin, Rajeev Motwani, Terry Winograd. "The PageRank
 *   Citation Ranking: Bringing Order to the Web." Stanford CS Technical Report,
 *   January 1998.
 * - Sergey Brin, Lawrence Page. "The Anatomy of a Large-Scale Hypertextual Web
 *   Search Engine." Proc. 7th International WWW Conference (WWW7), April 1998.
 * - IEEE / ETHW Milestone: "PageRank and the Birth of Google, 1996-1998"
 *   (https://ethw.org/Milestones:PageRank_and_the_Birth_of_Google,_1996-1998)
 * - US Patent 6,285,999, "Method for Node Ranking in a Linked Database" (filed
 *   1998-01-09, issued 2001-09-04).
 * - Taher H. Haveliwala. "Topic-Sensitive PageRank." Proc. WWW 2002.
 *
 * Key Facts Verified:
 * - 1996: BackRub crawler begun by Page and Brin as Stanford PhD students
 * - 1997-01-10: provisional patent application serial 60/035,205 filed
 * - 1998-01-09: US patent application for US 6,285,999 filed
 * - 1998-01-29: "The PageRank Citation Ranking" Stanford technical report
 * - 1998-04: "The Anatomy of a Large-Scale Hypertextual Web Search Engine," WWW7
 * - 1998-09-04: Google Inc. incorporated
 * - 2001-09-04: US Patent 6,285,999 granted
 * - 2002-05: Topic-Sensitive PageRank published (personalization variant)
 * - 2005-01: Google, Yahoo and MSN introduce rel="nofollow" to neutralise link votes
 * - 2016-04-15: Google stops displaying PageRank in the Google Toolbar
 * - 2019-06-04: US Patent 6,285,999 expires
 *
 * Hierarchical Context: PAGERANK_HISTORY (the container) → SOFTWARE_ENGINEERING
 * and WORLD_HISTORY; each era is a member of PAGERANK_HISTORY.
 */

/** ISO-8601 -> nanoseconds since the Unix epoch, via the shared conversion helper. */
const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/** The universe's own present: the day this record was authored. */
const PRESENT_ISO = '2026-10-17T00:00:00Z';
const PRESENT = ns(PRESENT_ISO);

/** The container id, shared with every child's `parentUniverses` edge. */
export const PAGERANK_CONTAINER_ID = CommonUniverseIds.PAGERANK_HISTORY;

const SOURCES: readonly string[] = [
  'Page, Brin, Motwani, Winograd. "The PageRank Citation Ranking: Bringing Order to the Web." Stanford CS Technical Report, January 1998.',
  'Brin, Page. "The Anatomy of a Large-Scale Hypertextual Web Search Engine." Proc. WWW7, April 1998.',
  'IEEE/ETHW Milestone: "PageRank and the Birth of Google, 1996-1998".',
  'US Patent 6,285,999 (filed 1998-01-09; issued 2001-09-04).',
  'Haveliwala. "Topic-Sensitive PageRank." Proc. WWW 2002.',
];

/** One era of the PageRank timeline. Every derived value comes from this row. */
interface PagerankEra {
  slug: string;
  name: string;
  /** ISO date, inclusive. */
  start: string;
  /** ISO date, exclusive. */
  end: string;
  /** e.g. `pagerank:1996:inception` — explicit, never inferred from the layer key (#19). */
  epochId: string;
  segmentType: 'phase' | 'legal_period';
  /** Prose for the era's segment (and the container's copy of it). */
  description: string;
  /** Prose for the epoch: what the span measures. */
  epochDescription: string;
  significance: number;
  culturalNote: string;
  tags: readonly string[];
  aliases: readonly string[];
}

/**
 * The five eras.
 *
 * The boundaries are the events themselves (publication, incorporation, grant,
 * expiry), which is why they are shared between the adjacent rows rather than
 * invented mid-period.
 */
const ERAS: readonly PagerankEra[] = [
  {
    slug: 'inception',
    name: 'Inception',
    start: '1996-01-01T00:00:00Z',
    end: '1998-01-29T00:00:00Z',
    epochId: 'pagerank:1996:inception',
    segmentType: 'phase',
    description: 'BackRub is built at Stanford and PageRank is conceived.',
    epochDescription:
      'BackRub crawler built at Stanford; PageRank conceived and provisionally patented.',
    significance: 0.85,
    culturalNote:
      'The research period that produced the algorithm, rated below the publication era because the idea was not yet public or named as a product.',
    tags: ['inception', 'stanford', 'backrub'],
    aliases: ['PageRank inception', 'BackRub', 'PageRank research'],
  },
  {
    slug: 'publication',
    name: 'Publication',
    start: '1998-01-29T00:00:00Z',
    end: '1998-09-04T00:00:00Z',
    epochId: 'pagerank:1998:publication',
    segmentType: 'phase',
    description: 'The two defining 1998 publications and the founding of Google Inc.',
    epochDescription:
      'The two defining 1998 publications, and the founding of Google Inc.',
    significance: 0.95,
    culturalNote:
      'Above 0.9 because this is the era that made PageRank a public, citable algorithm and the basis of a company — the defining statement of the technique rather than an implementation detail of it.',
    tags: ['publication', 'www7', 'google'],
    aliases: ['PageRank publications', 'PageRank papers'],
  },
  {
    slug: 'commercialization',
    name: 'Commercialization',
    start: '1998-09-04T00:00:00Z',
    end: '2001-09-04T00:00:00Z',
    epochId: 'pagerank:1998:commercialization',
    segmentType: 'phase',
    description: 'PageRank powers Google search while the patent application is pending.',
    epochDescription:
      'PageRank powers Google search while the patent application is pending.',
    significance: 0.85,
    culturalNote:
      'The period in which the algorithm became a product and a business, rated below the publication era because the technical claim was already public.',
    tags: ['google', 'commercialization', 'search_engine'],
    aliases: ['PageRank at Google', 'Google search 1998-2001'],
  },
  {
    slug: 'patent_era',
    name: 'Patent Era',
    start: '2001-09-04T00:00:00Z',
    end: '2019-06-04T00:00:00Z',
    epochId: 'pagerank:2001:patent_era',
    segmentType: 'legal_period',
    description:
      'The patent is granted, then exercised, personalized and retired from public view.',
    epochDescription:
      'Patent protection; personalization variants; anti-manipulation measures; toolbar display and retirement.',
    significance: 0.8,
    culturalNote:
      'A long legal-and-technical era whose significance is spread across several smaller events rather than concentrated in one defining moment.',
    tags: ['patent', 'legal', 'personalization', 'seo'],
    aliases: ['PageRank patent era', 'US 6,285,999'],
  },
  {
    slug: 'post_patent',
    name: 'Post-Patent',
    start: '2019-06-04T00:00:00Z',
    end: PRESENT_ISO,
    epochId: 'pagerank:2019:post_patent',
    segmentType: 'phase',
    description: 'Post-expiry: PageRank as one signal among many.',
    epochDescription:
      'Post-expiry legacy: PageRank as one signal among many in ranking systems.',
    significance: 0.7,
    culturalNote:
      'The legacy period: the technique is no longer a distinct, published score, so the era is significant as context rather than as an event.',
    tags: ['legacy', 'expiry', 'ranking_systems'],
    aliases: ['PageRank after the patent', 'PageRank legacy'],
  },
];

/** A keyframe, authored once and assigned to an era by its timestamp. */
interface KeyframeSpec {
  id: string;
  iso: string;
  significance: number;
  tags: readonly string[];
  type: KeyframeType;
  certainty: number;
  /** ISO bounds when the source supports only a range. */
  range?: readonly [string, string];
  description: string;
}

const KEYFRAMES: readonly KeyframeSpec[] = [
  {
    id: 'backrub_begins',
    iso: '1996-01-01T00:00:00Z',
    significance: 0.8,
    tags: ['origin', 'stanford', 'research_project'],
    type: KeyframeType.MILESTONE,
    // The year is established; the exact start date is not.
    certainty: 0.6,
    range: ['1996-01-01T00:00:00Z', '1996-12-31T00:00:00Z'],
    description:
      'Page and Brin begin the BackRub crawler at Stanford; PageRank is the ranking idea at its core.',
  },
  {
    id: 'provisional_patent_filed',
    iso: '1997-01-10T00:00:00Z',
    significance: 0.7,
    tags: ['patent', 'legal'],
    type: KeyframeType.MILESTONE,
    certainty: 1.0,
    description: 'Provisional patent application serial 60/035,205 is filed.',
  },
  {
    id: 'patent_application_filed',
    iso: '1998-01-09T00:00:00Z',
    significance: 0.8,
    tags: ['patent', 'legal', 'us6285999'],
    type: KeyframeType.MILESTONE,
    certainty: 1.0,
    description: 'The full US patent application that becomes US 6,285,999 is filed.',
  },
  {
    id: 'pagerank_paper_published',
    iso: '1998-01-29T00:00:00Z',
    significance: 1.0,
    tags: ['defining_moment', 'publication', 'algorithm'],
    type: KeyframeType.PUBLICATION,
    certainty: 1.0,
    description:
      '"The PageRank Citation Ranking: Bringing Order to the Web" — the defining statement of the algorithm.',
  },
  {
    id: 'anatomy_paper_published',
    iso: '1998-04-14T00:00:00Z',
    significance: 0.95,
    tags: ['publication', 'google', 'www7'],
    type: KeyframeType.PUBLICATION,
    // The conference is known (WWW7, April 1998); the presentation day is not.
    certainty: 0.8,
    description:
      '"The Anatomy of a Large-Scale Hypertextual Web Search Engine" describes the Google prototype built on PageRank.',
  },
  {
    id: 'google_founded',
    iso: '1998-09-04T00:00:00Z',
    significance: 1.0,
    tags: ['defining_moment', 'founding', 'google'],
    type: KeyframeType.FOUNDING,
    certainty: 0.9,
    description:
      'Google Inc. is incorporated, commercialising the search engine PageRank was built for.',
  },
  {
    id: 'patent_granted',
    iso: '2001-09-04T00:00:00Z',
    significance: 0.8,
    tags: ['patent', 'legal', 'us6285999'],
    type: KeyframeType.MILESTONE,
    certainty: 1.0,
    description: 'US Patent 6,285,999, "Method for Node Ranking in a Linked Database", is granted.',
  },
  {
    id: 'topic_sensitive_pagerank',
    iso: '2002-05-07T00:00:00Z',
    significance: 0.7,
    tags: ['personalization', 'research', 'successor'],
    type: KeyframeType.PUBLICATION,
    // WWW 2002, May 2002; the day is approximate.
    certainty: 0.6,
    description:
      "Haveliwala's Topic-Sensitive PageRank extends the 1998 formulation to topic-specific rankings.",
  },
  {
    id: 'nofollow_introduced',
    iso: '2005-01-18T00:00:00Z',
    significance: 0.7,
    tags: ['manipulation', 'seo', 'link_vote'],
    type: KeyframeType.ANNOUNCEMENT,
    // "January 2005"; the announcement day is approximate.
    certainty: 0.7,
    description:
      'Google, Yahoo and MSN introduce rel="nofollow" to neutralise paid links as PageRank votes.',
  },
  {
    id: 'toolbar_pagerank_retired',
    iso: '2016-04-15T00:00:00Z',
    significance: 0.6,
    tags: ['google_toolbar', 'transparency', 'public_score'],
    type: KeyframeType.MILESTONE,
    certainty: 1.0,
    description:
      'Google stops displaying PageRank in the Google Toolbar, ending the public score.',
  },
  {
    id: 'patent_expired',
    iso: '2019-06-04T00:00:00Z',
    significance: 0.75,
    tags: ['patent', 'legal', 'expiry'],
    type: KeyframeType.MILESTONE,
    certainty: 0.9,
    description: 'US Patent 6,285,999 expires, ending the patent era.',
  },
];

/** The era an instant belongs to: half-open `[start, end)`, so boundaries are unambiguous. */
const eraFor = (timestamp: bigint): PagerankEra | undefined =>
  ERAS.find((era) => timestamp >= ns(era.start) && timestamp < ns(era.end));

const keyframesOf = (era: PagerankEra): KeyframeSpec[] =>
  KEYFRAMES.filter((keyframe) => eraFor(ns(keyframe.iso)) === era);

/**
 * The era's universe id: `history:pagerank:<era>:<start year>`.
 *
 * The trailing segment is the shared temporal index (#122's general form), so
 * `cal:1996` gathers the inception era without a lookup. `createUniverseId`
 * validates it; `createHistoricalUniverseId` cannot express the middle segment
 * (#121 tracks that surface).
 */
const eraUniverseId = (era: PagerankEra): string =>
  createUniverseId(`history:pagerank:${era.slug}:${era.start.slice(0, 4)}`);

/** Add one authored keyframe to a builder. */
const addKeyframeTo = (builder: UniverseBuilder, keyframe: KeyframeSpec): UniverseBuilder =>
  builder.addDateKeyframe(keyframe.iso, keyframe.id, keyframe.significance, [...keyframe.tags], {
    type: keyframe.type,
    certainty: keyframe.certainty,
    ...(keyframe.range
      ? { dateRange: { earliest: ns(keyframe.range[0]), latest: ns(keyframe.range[1]) } }
      : {}),
    description: keyframe.description,
  });

/** One era universe: its own epoch, segment and keyframes, one membership. */
const buildEra = (era: PagerankEra): Universe => {
  const start = ns(era.start);
  const end = ns(era.end);

  const builder = new UniverseBuilder(eraUniverseId(era), UniverseType.HISTORICAL_EVENT)
    .withCanonicalName(`History of PageRank — ${era.name}`)
    .withAliases([...era.aliases])
    .withDescription(
      `${era.description} An era of the PageRank history, contained by ${PAGERANK_CONTAINER_ID}.`,
    )
    // Documentary at degree 0.0: real algorithm, real publications, real patent.
    .withRealityRelation('documentary', 0.0, [])
    .withSources([...SOURCES])
    .withReleased(era.start)
    .withCulturalSignificance(era.significance, era.culturalNote)
    .withTags(['technology', 'algorithm', 'web_search', 'google', 'pagerank', ...era.tags])
    // One membership; SOFTWARE_ENGINEERING and WORLD_HISTORY are inherited
    // transitively through the container (#74, #168).
    .addParent(PAGERANK_CONTAINER_ID)
    .addEpoch('primary_layer', era.epochId, {
      epochId: era.epochId,
      startTime: start,
      endTime: end,
      precision: TimePrecision.DAY,
      description: era.epochDescription,
    })
    .addSegment(era.slug, start, end, era.segmentType, era.description)
    .withWindowing('phase_based');

  for (const keyframe of keyframesOf(era)) addKeyframeTo(builder, keyframe);

  return builder.build();
};

/**
 * The container: the shared record and the five-phase partition.
 *
 * It carries no keyframes. A keyframe is a moment in one era, and duplicating it
 * here would embed the same fact twice (#76). What the container owns is what is
 * true of the whole run: the sources, the reality relation, the Web anchor, the
 * cultural rating, and the partition itself.
 */
const containerBuilder = new UniverseBuilder(PAGERANK_CONTAINER_ID, UniverseType.HISTORICAL_EVENT)
  .withCanonicalName('History of PageRank')
  .withAliases(['PageRank', 'PageRank history', 'history_of_pagerank', 'BackRub history'])
  .withDescription(
    'The citation-ranking algorithm Page and Brin built at Stanford from 1996, and the search engine it became: ' +
      'hyperlinks reinterpreted as referrals, ranked recursively, and turned into the founding technology of Google. ' +
      'A container for the five era universes of the PageRank timeline.',
  )
  .withRealityRelation('documentary', 0.0, [
    {
      realEventId: 'technology:world_wide_web:1989',
      relationshipType: 'depicts',
      confidence: 0.9,
      evidence: [
        'PageRank operates on the hyperlink structure of the World Wide Web',
        'Page et al., "The PageRank Citation Ranking" (Stanford, 1998)',
      ],
    },
  ])
  .withSources([...SOURCES])
  .withReleased('1998-01-29')
  .withCulturalSignificance(
    0.95,
    'The founding algorithm of the modern web-search industry and one of the most widely imitated ranking techniques in computing; it reshaped how the web is organized, monetized and gamed.',
  )
  .withTags(['technology', 'algorithm', 'web_search', 'google', 'patent', 'hypertext', 'container'])
  // The container is where the run's ancestors live, so each era inherits them
  // without repeating the pair (compare US_STATEHOOD, #103/#168).
  .addParent(CommonUniverseIds.SOFTWARE_ENGINEERING)
  .addParent(CommonUniverseIds.WORLD_HISTORY)
  .addEpoch('primary_layer', 'pagerank:1996:2026', {
    epochId: 'pagerank:1996:2026',
    startTime: ns(ERAS[0].start),
    endTime: PRESENT,
    precision: TimePrecision.DAY,
    description:
      'The PageRank timeline, from the BackRub crawler to the post-patent present.',
  })
  .withWindowing('phase_based');

for (const era of ERAS) {
  // Same rows, same bounds as the era's own epoch and segment — the partition is
  // stated once, so the container cannot drift from its members.
  containerBuilder.addSegment(
    era.slug,
    ns(era.start),
    ns(era.end),
    era.segmentType,
    era.description,
  );
}

const builtContainer = containerBuilder.build();

// The paper's authors are a creator credit, not a role on a work, and the builder
// has no setter for `metadata.creators` (the statehood factory assigns it the same
// way). Typed assignment, no literal and no cast.
builtContainer.metadata = {
  ...builtContainer.metadata,
  creators: ['Lawrence Page', 'Sergey Brin', 'Rajeev Motwani', 'Terry Winograd'],
};

/** The container universe. */
export const pagerankHistoryContainerUniverse: Universe = builtContainer;

/** The five era universes, in order. */
export const pagerankEraUniverses: readonly Universe[] = ERAS.map(buildEra);

/** Everything this module registers: the container first, then its members. */
export const pagerankHistoryUniverses: Universe[] = [
  pagerankHistoryContainerUniverse,
  ...pagerankEraUniverses,
];

/**
 * The container, under the name it had before the decomposition.
 *
 * The id is unchanged, so this is the same universe a previous reference meant;
 * what changed is that it is now a container rather than the sole owner of every
 * keyframe.
 */
export const pagerankHistoryUniverse = pagerankHistoryContainerUniverse;
