import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * History of PageRank — the citation-ranking algorithm and the birth of Google.
 *
 * james-gibson/local-time#93.
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
 * ## Documentary, not fiction
 *
 * This is a record of a real algorithm and a real corporate history. Nothing
 * about it is invented, so `realityRelation` is `documentary` with
 * `fictionalizationDegree: 0.0`. The anchors below tie it to the Web and, in
 * principle, to Google's founding and the patent — see "Deferred anchors".
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
 * Hierarchical Context: SOFTWARE_ENGINEERING -> WORLD_HISTORY
 */

/** ISO-8601 -> nanoseconds since the Unix epoch, via the shared conversion helper. */
const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/** The universe's own present: the day this record was authored. */
const PRESENT = ns('2026-10-17T00:00:00Z');

export const pagerankHistoryUniverse: Universe = {
  universeId: 'history:pagerank:1996',
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: {
    // `identifiers.primary` is the universeId, not a second id grammar: a primary
    // that disagrees with `universeId` is a defect (see the global-politics
    // namespaces, james-gibson/local-time#102 BUG-4).
    primary: 'history:pagerank:1996',
    aliases: ['PageRank', 'PageRank history', 'history_of_pagerank', 'BackRub'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    claimsHistoricalAccuracy: true,
    realityAnchors: [
      {
        realEventId: 'technology:world_wide_web:1989',
        relationshipType: 'depicts',
        confidence: 0.9,
        evidence: [
          'PageRank operates on the hyperlink structure of the World Wide Web',
          'Page et al., "The PageRank Citation Ranking" (Stanford, 1998)',
        ],
      },
    ],
  },
  attribution: {
    public_domain: false,
    citations_required: true,
    usage_restrictions: [],
    sources: [
      'Page, Brin, Motwani, Winograd. "The PageRank Citation Ranking: Bringing Order to the Web." Stanford CS Technical Report, January 1998.',
      'Brin, Page. "The Anatomy of a Large-Scale Hypertextual Web Search Engine." Proc. WWW7, April 1998.',
      'IEEE/ETHW Milestone: "PageRank and the Birth of Google, 1996-1998".',
      'US Patent 6,285,999 (filed 1998-01-09; issued 2001-09-04).',
      'Haveliwala. "Topic-Sensitive PageRank." Proc. WWW 2002.',
    ],
  },
  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        // Every epoch carries an explicit `epochId`: a missing one is silently
        // renamed to the layer key by the registry, which changes what every
        // reference to that epoch means (james-gibson/local-time#19).
        inception: {
          epochId: 'pagerank:1996:inception',
          startTime: ns('1996-01-01T00:00:00Z'),
          endTime: ns('1998-01-29T00:00:00Z'),
          precision: TimePrecision.DAY,
          description:
            'BackRub crawler built at Stanford; PageRank conceived and provisionally patented.',
        },
        publication: {
          epochId: 'pagerank:1998:publication',
          startTime: ns('1998-01-29T00:00:00Z'),
          endTime: ns('1998-09-04T00:00:00Z'),
          precision: TimePrecision.DAY,
          description:
            'The two defining 1998 publications, and the founding of Google Inc.',
        },
        commercialization: {
          epochId: 'pagerank:1998:commercialization',
          startTime: ns('1998-09-04T00:00:00Z'),
          endTime: ns('2001-09-04T00:00:00Z'),
          precision: TimePrecision.DAY,
          description:
            'PageRank powers Google search while the patent application is pending.',
        },
        patent_era: {
          epochId: 'pagerank:2001:patent_era',
          startTime: ns('2001-09-04T00:00:00Z'),
          endTime: ns('2019-06-05T00:00:00Z'),
          precision: TimePrecision.DAY,
          description:
            'Patent protection; personalization variants; anti-manipulation measures; toolbar display and retirement.',
        },
        post_patent: {
          epochId: 'pagerank:2019:post_patent',
          startTime: ns('2019-06-05T00:00:00Z'),
          endTime: PRESENT,
          precision: TimePrecision.DAY,
          description:
            'Post-expiry legacy: PageRank as one signal among many in ranking systems.',
        },
      },
    },
  ],
  epochs: {},
  temporalStructure: {
    // Gapless, non-overlapping, and in the same five spans as the epochs above.
    segments: [
      {
        id: 'genesis',
        start: ns('1996-01-01T00:00:00Z'),
        end: ns('1998-01-29T00:00:00Z'),
        type: 'phase',
        status: 'active',
        description: 'BackRub is built at Stanford and PageRank is conceived.',
      },
      {
        id: 'publication',
        start: ns('1998-01-29T00:00:00Z'),
        end: ns('1998-09-04T00:00:00Z'),
        type: 'phase',
        status: 'active',
        description: 'The two defining 1998 publications and the founding of Google Inc.',
      },
      {
        id: 'commercialization',
        start: ns('1998-09-04T00:00:00Z'),
        end: ns('2001-09-04T00:00:00Z'),
        type: 'phase',
        status: 'active',
        description: 'PageRank powers Google search while the patent application is pending.',
      },
      {
        id: 'patent_protection',
        start: ns('2001-09-04T00:00:00Z'),
        end: ns('2019-06-05T00:00:00Z'),
        type: 'legal_period',
        status: 'active',
        description: 'The patent is granted, then exercised, personalized and retired from public view.',
      },
      {
        id: 'legacy',
        start: ns('2019-06-05T00:00:00Z'),
        end: PRESENT,
        type: 'phase',
        status: 'active',
        description: 'Post-expiry: PageRank as one signal among many.',
      },
    ],
    keyframes: [
      {
        id: 'backrub_begins',
        timestamp: ns('1996-01-01T00:00:00Z'),
        significance: 0.8,
        tags: ['origin', 'stanford', 'research_project'],
        type: KeyframeType.MILESTONE,
        // The year is established; the exact start date is not.
        certainty: 0.6,
        dateRange: {
          earliest: ns('1996-01-01T00:00:00Z'),
          latest: ns('1996-12-31T00:00:00Z'),
        },
        description:
          'Page and Brin begin the BackRub crawler at Stanford; PageRank is the ranking idea at its core.',
      },
      {
        id: 'provisional_patent_filed',
        timestamp: ns('1997-01-10T00:00:00Z'),
        significance: 0.7,
        tags: ['patent', 'legal'],
        type: KeyframeType.MILESTONE,
        certainty: 1.0,
        description: 'Provisional patent application serial 60/035,205 is filed.',
      },
      {
        id: 'patent_application_filed',
        timestamp: ns('1998-01-09T00:00:00Z'),
        significance: 0.8,
        tags: ['patent', 'legal', 'us6285999'],
        type: KeyframeType.MILESTONE,
        certainty: 1.0,
        description:
          'The full US patent application that becomes US 6,285,999 is filed.',
      },
      {
        id: 'pagerank_paper_published',
        timestamp: ns('1998-01-29T00:00:00Z'),
        significance: 1.0,
        tags: ['defining_moment', 'publication', 'algorithm'],
        type: KeyframeType.PUBLICATION,
        certainty: 1.0,
        description:
          '"The PageRank Citation Ranking: Bringing Order to the Web" — the defining statement of the algorithm.',
      },
      {
        id: 'anatomy_paper_published',
        timestamp: ns('1998-04-14T00:00:00Z'),
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
        timestamp: ns('1998-09-04T00:00:00Z'),
        significance: 1.0,
        tags: ['defining_moment', 'founding', 'google'],
        type: KeyframeType.FOUNDING,
        certainty: 0.9,
        description:
          'Google Inc. is incorporated, commercialising the search engine PageRank was built for.',
      },
      {
        id: 'patent_granted',
        timestamp: ns('2001-09-04T00:00:00Z'),
        significance: 0.8,
        tags: ['patent', 'legal', 'us6285999'],
        type: KeyframeType.MILESTONE,
        certainty: 1.0,
        description: 'US Patent 6,285,999, "Method for Node Ranking in a Linked Database", is granted.',
      },
      {
        id: 'topic_sensitive_pagerank',
        timestamp: ns('2002-05-07T00:00:00Z'),
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
        timestamp: ns('2005-01-18T00:00:00Z'),
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
        timestamp: ns('2016-04-15T00:00:00Z'),
        significance: 0.6,
        tags: ['google_toolbar', 'transparency', 'public_score'],
        type: KeyframeType.MILESTONE,
        certainty: 1.0,
        description:
          'Google stops displaying PageRank in the Google Toolbar, ending the public score.',
      },
      {
        id: 'patent_expired',
        timestamp: ns('2019-06-04T00:00:00Z'),
        significance: 0.75,
        tags: ['patent', 'legal', 'expiry'],
        type: KeyframeType.MILESTONE,
        certainty: 0.9,
        description: 'US Patent 6,285,999 expires, ending the patent era.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'History of PageRank',
    description:
      'The citation-ranking algorithm Page and Brin built at Stanford from 1996, and the search engine it became: hyperlinks reinterpreted as referrals, ranked recursively, and turned into the founding technology of Google.',
    creators: ['Lawrence Page', 'Sergey Brin', 'Rajeev Motwani', 'Terry Winograd'],
    released: new Date('1998-01-29T00:00:00Z'),
    cultural_significance: 0.95,
    cultural_description:
      'The founding algorithm of the modern web-search industry and one of the most widely imitated ranking techniques in computing; it reshaped how the web is organized, monetized and gamed.',
    tags: ['technology', 'algorithm', 'web_search', 'google', 'patent', 'hypertext'],
  },
  connections: {
    natural: {
      parentUniverses: [
        CommonUniverseIds.SOFTWARE_ENGINEERING,
        CommonUniverseIds.WORLD_HISTORY,
      ],
    },
    references: [],
  },
} as unknown as Universe;
