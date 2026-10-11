import { Universe, UniverseType, ReferenceType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import {
  createFilmStudioUniverseId,
  FilmStudioSpan,
  FilmStudioUniverseId,
} from '../../../core/universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Film distributors as institutions in their own right.
 *
 * james-gibson/local-time#44.
 *
 * A film universe ID names its distributor in the first segment
 * (`20th_century_fox:idiocracy:2006`), but a distributor is a legal entity with a
 * founding, renames, acquisitions, absorptions and a shutdown — so a film's
 * distributor is a fact *as of its release*, never a permanent fact about the
 * film. Touchstone Pictures distributed Dead Poets Society in 1989 and was
 * retired a decade later; that later event does not change 1989.
 *
 * So each studio gets a `film_studio:` universe whose keyframes are its
 * corporate events, and the change is recorded there — never as an edit to a
 * film's record.
 *
 * The data-driven shape is deliberate: every studio is the same record with the
 * same provenance fields, so the classic set is a table of facts rather than
 * hundreds of lines of near-identical boilerplate.
 */

/** ISO-8601 -> nanoseconds since the Unix epoch, via the shared helper. */
const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/**
 * A corporate date. A bare ISO date is firm; a `[earliest, latest]` pair is a
 * date the record only supports as a range.
 */
export type CorporateDate = string | [earliest: string, latest: string];

/** A corporate event in a studio's life, modelled as a keyframe. */
export interface StudioEventSpec {
  id: string;
  date: CorporateDate;
  /** 0-1. */
  significance: number;
  /** 0-1. Corporate history is often only recoverable to a year or a season. */
  certainty: number;
  tags: readonly string[];
  description: string;
}

/** A typed edge to another studio universe, for renames and takeovers. */
export interface StudioLineageSpec {
  /** The *other* studio's slug. */
  toSlug: string;
  type: ReferenceType;
  date: CorporateDate;
  /** 0-1. */
  confidence: number;
  description: string;
}

export interface FilmStudioSpec {
  /** Film-ID token(s) that resolve to this studio. */
  tokens: readonly string[];
  slug: string;
  displayName: string;
  /** Founding year — firm for every studio modelled here. */
  foundingYear: number;
  /** Final operating year, or `null` while still operating. */
  endedYear: number | null;
  description: string;
  /** Why this studio matters. */
  significance: string;
  tags: readonly string[];
  founders?: readonly string[];
  events: readonly StudioEventSpec[];
  lineage?: readonly StudioLineageSpec[];
}

const yearsOf = (spec: FilmStudioSpec): FilmStudioSpan =>
  spec.endedYear === null
    ? `${spec.foundingYear}-present`
    : `${spec.foundingYear}-${spec.endedYear}`;

const keyframesFor = (spec: FilmStudioSpec) =>
  spec.events.map((event) => {
    const [nominal, range] = Array.isArray(event.date)
      ? [event.date[0], { earliest: ns(event.date[0]), latest: ns(event.date[1]) }]
      : [event.date, undefined];

    return {
      id: event.id,
      timestamp: ns(nominal),
      significance: event.significance,
      tags: [...event.tags],
      certainty: event.certainty,
      ...(range ? { dateRange: range } : {}),
    };
  });

/** Segments split a studio's life at its corporate events. */
const segmentsFor = (spec: FilmStudioSpec) => {
  const dated = spec.events
    .filter((event) => !Array.isArray(event.date))
    .map((event) => ({ id: event.id, iso: event.date as string }))
    .sort((a, b) => a.iso.localeCompare(b.iso));

  const start = `${spec.foundingYear}-01-01T00:00:00Z`;
  const segments: Array<{
    id: string;
    start: bigint;
    end: bigint;
    type: string;
    description: string;
  }> = [];

  for (let i = 0; i < dated.length; i++) {
    const from = i === 0 ? start : dated[i - 1].iso;
    segments.push({
      id: `${spec.slug}-era-${i + 1}`,
      start: ns(from),
      end: ns(dated[i].iso),
      type: 'phase',
      description: `Corporate era ending with ${dated[i].id.replace(/_/g, ' ')} (${spec.displayName}).`,
    });
  }

  if (spec.endedYear !== null) {
    segments.push({
      id: `${spec.slug}-final-era`,
      start: ns(dated.length ? dated[dated.length - 1].iso : start),
      end: ns(`${spec.endedYear}-12-31T23:59:59Z`),
      type: 'phase',
      description: `Final corporate era of ${spec.displayName}.`,
    });
  } else {
    segments.push({
      id: `${spec.slug}-current-era`,
      start: ns(dated.length ? dated[dated.length - 1].iso : start),
      end: ns('2026-01-01T00:00:00Z'),
      type: 'phase',
      description: `Current corporate era of ${spec.displayName}.`,
    });
  }

  return segments;
};

function buildFilmStudioUniverse(
  spec: FilmStudioSpec,
  studioIdFor: (slug: string) => FilmStudioUniverseId,
): Universe {
  const universeId = studioIdFor(spec.slug);

  return {
    universeId,
    type: UniverseType.INSTITUTIONAL_PERIOD,
    identifiers: {
      primary: universeId,
      aliases: [spec.displayName, ...spec.tokens],
    },
    realityRelation: {
      type: 'documentary',
      fictionalizationDegree: 0.0,
      realityAnchors: [
        {
          realEventId: universeId,
          relationshipType: 'documents',
          confidence: 1.0,
          evidence: [
            `${spec.displayName} corporate history`,
            `Founding year ${spec.foundingYear}`,
          ],
        },
      ],
    },
    attribution: {
      copyright: {
        holders: [spec.displayName],
        year: spec.foundingYear,
        status: spec.endedYear === null ? 'active' : 'expired',
      },
      citations_required: true,
      usage_restrictions: [
        `Company marks and corporate history are the property of ${spec.displayName} or its successors.`,
      ],
      sources: [
        `${spec.displayName} — corporate history`,
        `Wikipedia — ${spec.displayName}`,
      ],
    },
    layers: [
      {
        layerId: 'primary',
        type: 'primary',
        epochs: {
          corporate: {
            epochId: `${spec.slug}:corporate`,
            startTime: ns(`${spec.foundingYear}-01-01T00:00:00Z`),
            endTime: ns(
              spec.endedYear === null
                ? '2026-01-01T00:00:00Z'
                : `${spec.endedYear}-12-31T23:59:59Z`,
            ),
            description: `Corporate history of ${spec.displayName}.`,
          },
        },
      },
    ],
    epochs: {},
    temporalStructure: {
      segments: segmentsFor(spec),
      keyframes: keyframesFor(spec),
      windows: { strategy: 'phase_based' },
    },
    metadata: {
      canonicalName: spec.displayName,
      description: spec.description,
      ...(spec.founders ? { creators: [...spec.founders] } : {}),
      released: new Date(`${spec.foundingYear}-01-01T00:00:00Z`),
      cultural_significance: 0.7,
      tags: [...spec.tags, 'film_studio', 'distributor', 'hollywood'],
      significance: spec.significance,
    },
    connections: {
      natural: {
        parentUniverses: [
          CommonUniverseIds.HOLLYWOOD_SYSTEM,
          CommonUniverseIds.US_HISTORY,
          CommonUniverseIds.WORLD_HISTORY,
        ],
      },
      references: (spec.lineage ?? []).map((edge) => ({
        type: edge.type,
        targetUniverseId: studioIdFor(edge.toSlug),
        description:
          `${edge.description} (effective ${Array.isArray(edge.date) ? edge.date[0] : edge.date}).`,
      })),
    },
  } as unknown as Universe;
}

/**
 * The classic Hollywood studios and the distributors named in
 * james-gibson/local-time#26.
 *
 * `certainty` is honest: a studio's founding year is firm, and its corporate
 * events range from day-precise (a signed acquisition) to year-precise (a label
 * quietly retired). Where the record only supports a range, the keyframe carries
 * a `dateRange` and a lowered `certainty` rather than a fabricated date.
 */
export const FILM_STUDIO_SPECS: readonly FilmStudioSpec[] = [
  {
    tokens: ['columbia', 'sony'],
    slug: 'columbia_pictures',
    displayName: 'Columbia Pictures Corporation',
    foundingYear: 1918,
    endedYear: null,
    description:
      'The oldest surviving American film studio, founded as the Cohn-Brandt-Cohn Film Sales Corporation in 1918 and renamed Columbia Pictures in 1924.',
    significance:
      'A film distributor under five successive parents, and the reason the token `columbia` names a different legal entity in 1939 than in 2004.',
    tags: ['major', 'columbia', 'sony'],
    founders: ['Harry Cohn', 'Jack Cohn', 'Joe Brandt'],
    events: [
      {
        id: 'cbc_founded',
        date: '1918-01-01T00:00:00Z',
        significance: 1,
        certainty: 0.75,
        tags: ['zero-point', 'founding'],
        description:
          'The Cohn-Brandt-Cohn Film Sales Corporation is founded. Recorded to the year only.',
      },
      {
        id: 'renamed_columbia_pictures',
        date: '1924-01-01T00:00:00Z',
        significance: 0.8,
        certainty: 0.8,
        tags: ['renaming', 'corporate'],
        description: 'The company is renamed Columbia Pictures.',
      },
      {
        id: 'coca_cola_acquisition',
        date: '1982-06-16T00:00:00Z',
        significance: 0.9,
        certainty: 0.9,
        tags: ['acquisition', 'corporate'],
        description:
          'The Coca-Cola Company acquires Columbia Pictures, beginning a decade of conglomerate ownership.',
      },
      {
        id: 'sony_acquisition',
        date: '1989-11-08T00:00:00Z',
        significance: 1,
        certainty: 0.95,
        tags: ['acquisition', 'sony', 'zero-point-era'],
        description:
          'Sony Corporation acquires Columbia Pictures Entertainment, folding it into what becomes Sony Pictures Entertainment.',
      },
      {
        id: 'sony_pictures_entertainment',
        date: '1991-08-07T00:00:00Z',
        significance: 0.7,
        certainty: 0.7,
        tags: ['renaming', 'corporate'],
        description: 'The studio group is renamed Sony Pictures Entertainment.',
      },
    ],
    lineage: [
      {
        toSlug: 'sony_pictures_entertainment',
        type: ReferenceType.ACQUIRED_BY,
        date: '1989-11-08T00:00:00Z',
        confidence: 0.95,
        description:
          'Acquired by Sony, which renamed the group Sony Pictures Entertainment in 1991.',
      },
    ],
  },
  {
    tokens: ['mgm', 'metro_goldwyn_mayer'],
    slug: 'mgm',
    displayName: 'Metro-Goldwyn-Mayer',
    foundingYear: 1924,
    endedYear: null,
    description:
      'Formed in 1924 by the merger of Metro Pictures, Goldwyn Pictures and Louis B. Mayer Productions, and the largest and most glamorous of the classic Hollywood studios.',
    significance:
      'The canonical case of a studio whose identity survives merger, takeover, bankruptcy and sale, and which absorbed United Artists along the way.',
    tags: ['major', 'mgm', 'classic'],
    founders: ['Marcus Loew', 'Louis B. Mayer'],
    events: [
      {
        id: 'merger',
        date: ['1924-03-01T00:00:00Z', '1924-05-31T00:00:00Z'],
        significance: 1,
        certainty: 0.85,
        tags: ['zero-point', 'merger'],
        description:
          'Metro Pictures, Goldwyn Pictures and Louis B. Mayer Productions are merged into Metro-Goldwyn-Mayer.',
      },
      {
        id: 'kirkorian_control',
        date: ['1967-01-01T00:00:00Z', '1969-12-31T00:00:00Z'],
        significance: 0.85,
        certainty: 0.7,
        tags: ['takeover', 'corporate'],
        description:
          'Kirk Kerkorian takes control of MGM and begins dismantling its back lot.',
      },
      {
        id: 'united_artists_acquired',
        date: '1981-01-01T00:00:00Z',
        significance: 0.9,
        certainty: 0.8,
        tags: ['acquisition'],
        description: 'MGM acquires United Artists from Transamerica, forming MGM/UA.',
      },
      {
        id: 'bankruptcy',
        date: ['2010-11-01T00:00:00Z', '2010-12-31T00:00:00Z'],
        significance: 1,
        certainty: 0.9,
        tags: ['bankruptcy'],
        description:
          'MGM files for Chapter 11 bankruptcy and emerges months later under creditor ownership.',
      },
      {
        id: 'amazon_acquisition',
        date: '2022-03-17T00:00:00Z',
        significance: 0.9,
        certainty: 0.95,
        tags: ['acquisition', 'corporate'],
        description: 'Amazon completes its acquisition of MGM.',
      },
    ],
    lineage: [
      {
        toSlug: 'amazon_mgm_studios',
        type: ReferenceType.ACQUIRED_BY,
        date: '2022-03-17T00:00:00Z',
        confidence: 0.95,
        description: 'Acquired by Amazon.',
      },
    ],
  },
  {
    tokens: ['warner', 'warner_bros'],
    slug: 'warner_bros',
    displayName: 'Warner Bros.',
    foundingYear: 1923,
    endedYear: null,
    description:
      'Founded in 1923 by the four Warner brothers, the studio that pioneered synchronised sound with The Jazz Singer.',
    significance:
      'A studio absorbed into a succession of conglomerates — Kinney, Time Warner, WarnerMedia, and finally Warner Bros. Discovery — without losing its own name.',
    tags: ['major', 'warner', 'classic'],
    founders: ['Harry Warner', 'Albert Warner', 'Sam Warner', 'Jack L. Warner'],
    events: [
      {
        id: 'founded',
        date: '1923-04-04T00:00:00Z',
        significance: 1,
        certainty: 0.85,
        tags: ['zero-point', 'founding'],
        description: 'Warner Bros. is formally incorporated.',
      },
      {
        id: 'kinney_acquisition',
        date: '1969-01-01T00:00:00Z',
        significance: 0.8,
        certainty: 0.75,
        tags: ['acquisition'],
        description: 'Kinney National Company acquires Warner Bros.-Seven Arts.',
      },
      {
        id: 'time_warner_merger',
        date: '1990-01-10T00:00:00Z',
        significance: 1,
        certainty: 0.9,
        tags: ['merger', 'corporate'],
        description: 'Warner Communications merges with Time Inc. to form Time Warner.',
      },
      {
        id: 'discovery_merger',
        date: '2022-04-08T00:00:00Z',
        significance: 0.9,
        certainty: 0.9,
        tags: ['merger', 'corporate'],
        description:
          'WarnerMedia, spun out of AT&T, merges with Discovery to form Warner Bros. Discovery.',
      },
    ],
    lineage: [
      {
        toSlug: 'warner_bros_discovery',
        type: ReferenceType.MERGED_INTO,
        date: '2022-04-08T00:00:00Z',
        confidence: 0.9,
        description:
          'Merged with Discovery into Warner Bros. Discovery, with Warner Bros. surviving as the film label.',
      },
    ],
  },
  {
    tokens: ['disney'],
    slug: 'walt_disney_pictures',
    displayName: 'Walt Disney Pictures',
    foundingYear: 1923,
    endedYear: null,
    description:
      'The Disney Brothers Cartoon Studio, founded in 1923, which grew into the largest media conglomerate in the world and acquired most of its own distributors.',
    significance:
      'The distributor that absorbed Touchstone, Pixar, Marvel Studios, Lucasfilm and 20th Century Fox — the centre of gravity of modern Hollywood consolidation.',
    tags: ['major', 'disney', 'classic'],
    founders: ['Walt Disney', 'Roy O. Disney'],
    events: [
      {
        id: 'founded',
        date: '1923-10-16T00:00:00Z',
        significance: 1,
        certainty: 0.85,
        tags: ['zero-point', 'founding'],
        description: 'The Disney Brothers Cartoon Studio is founded.',
      },
      {
        id: 'buena_vista_distribution',
        date: '1953-01-01T00:00:00Z',
        significance: 0.9,
        certainty: 0.7,
        tags: ['distribution'],
        description:
          'Buena Vista Film Distribution Company is founded, giving Disney its own distribution arm.',
      },
      {
        id: 'walt_disney_company',
        date: '1986-02-06T00:00:00Z',
        significance: 0.8,
        certainty: 0.85,
        tags: ['renaming', 'corporate'],
        description: 'Walt Disney Productions is renamed The Walt Disney Company.',
      },
      {
        id: 'pixar_acquisition',
        date: '2006-05-05T00:00:00Z',
        significance: 0.95,
        certainty: 0.95,
        tags: ['acquisition'],
        description: 'The Walt Disney Company completes its acquisition of Pixar.',
      },
      {
        id: 'marvel_entertainment_acquisition',
        date: '2009-12-31T00:00:00Z',
        significance: 0.95,
        certainty: 0.95,
        tags: ['acquisition'],
        description: 'Disney acquires Marvel Entertainment, gaining Marvel Studios.',
      },
      {
        id: 'lucasfilm_acquisition',
        date: '2012-12-21T00:00:00Z',
        significance: 0.9,
        certainty: 0.95,
        tags: ['acquisition'],
        description: 'Disney acquires Lucasfilm.',
      },
      {
        id: 'twentieth_century_fox_acquisition',
        date: '2019-03-20T00:00:00Z',
        significance: 1,
        certainty: 0.95,
        tags: ['acquisition'],
        description:
          'Disney completes its acquisition of 21st Century Fox, including 20th Century Fox.',
      },
    ],
    lineage: [
      {
        toSlug: 'pixar',
        type: ReferenceType.ACQUIRED_BY,
        date: '2006-05-05T00:00:00Z',
        confidence: 0.95,
        description: 'Acquired Pixar.',
      },
      {
        toSlug: 'marvel_studios',
        type: ReferenceType.ACQUIRED_BY,
        date: '2009-12-31T00:00:00Z',
        confidence: 0.95,
        description: 'Acquired Marvel Entertainment and with it Marvel Studios.',
      },
      {
        toSlug: 'lucasfilm',
        type: ReferenceType.ACQUIRED_BY,
        date: '2012-12-21T00:00:00Z',
        confidence: 0.95,
        description: 'Acquired Lucasfilm.',
      },
      {
        toSlug: '20th_century_fox',
        type: ReferenceType.ACQUIRED_BY,
        date: '2019-03-20T00:00:00Z',
        confidence: 0.95,
        description: 'Acquired 20th Century Fox.',
      },
    ],
  },
  {
    tokens: ['paramount', 'paramount_pictures'],
    slug: 'paramount_pictures',
    displayName: 'Paramount Pictures Corporation',
    foundingYear: 1912,
    endedYear: null,
    description:
      'Tracing to Famous Players Film Company in 1912 and the Paramount Pictures distributor founded in 1914, the oldest continuously operating studio in Hollywood.',
    significance:
      'A distributor that has passed through Gulf+Western, Paramount Communications, Viacom and Paramount Global while keeping the mountain on its logo.',
    tags: ['major', 'paramount', 'classic'],
    founders: ['Adolph Zukor'],
    events: [
      {
        id: 'famous_players_founded',
        date: '1912-05-08T00:00:00Z',
        significance: 1,
        certainty: 0.8,
        tags: ['zero-point', 'founding'],
        description: 'Adolph Zukor founds Famous Players Film Company.',
      },
      {
        id: 'famous_players_lasky',
        date: '1916-06-28T00:00:00Z',
        significance: 0.8,
        certainty: 0.8,
        tags: ['merger', 'corporate'],
        description:
          'Famous Players merges with the Jesse L. Lasky Feature Play Company, forming the nucleus of Paramount.',
      },
      {
        id: 'gulf_western_acquisition',
        date: '1966-10-20T00:00:00Z',
        significance: 0.85,
        certainty: 0.85,
        tags: ['acquisition'],
        description: 'Gulf and Western Industries acquires Paramount.',
      },
      {
        id: 'viacom_acquisition',
        date: ['1994-03-11T00:00:00Z', '1994-04-30T00:00:00Z'],
        significance: 0.9,
        certainty: 0.85,
        tags: ['acquisition'],
        description: 'Viacom acquires Paramount Communications.',
      },
    ],
  },
  {
    tokens: ['universal'],
    slug: 'universal_pictures',
    displayName: 'Universal Pictures',
    foundingYear: 1912,
    endedYear: null,
    description:
      'Founded by Carl Laemmle in 1912 as the Universal Film Manufacturing Company, the oldest continuously operating film studio in the United States.',
    significance:
      'A studio that survived the transition from silent to sound, decades under conglomerates, and remains a top-six distributor.',
    tags: ['major', 'universal', 'classic'],
    founders: ['Carl Laemmle'],
    events: [
      {
        id: 'founded',
        date: '1912-04-30T00:00:00Z',
        significance: 1,
        certainty: 0.8,
        tags: ['zero-point', 'founding'],
        description:
          'The Universal Film Manufacturing Company is founded by merging Laemmle\'s Independent Moving Pictures with several smaller distributors.',
      },
      {
        id: 'mca_acquisition',
        date: ['1962-01-01T00:00:00Z', '1962-12-31T00:00:00Z'],
        significance: 0.9,
        certainty: 0.8,
        tags: ['acquisition'],
        description: 'MCA acquires Universal Studios.',
      },
      {
        id: 'comcast_nbcuniversal',
        date: ['2011-01-01T00:00:00Z', '2011-03-31T00:00:00Z'],
        significance: 0.9,
        certainty: 0.85,
        tags: ['acquisition', 'corporate'],
        description: 'Comcast takes full control of NBCUniversal, including Universal Pictures.',
      },
    ],
  },
  {
    tokens: ['20th_century_fox'],
    slug: '20th_century_fox',
    displayName: 'Twentieth Century-Fox Film Corporation',
    foundingYear: 1935,
    endedYear: 2020,
    description:
      'Formed in 1935 by the merger of Fox Film Corporation and Twentieth Century Pictures, renamed 20th Century Studios in 2020 after Disney acquired it.',
    significance:
      'The clearest case of a distributor whose *name* is a renamable fact: films distributed in 2006 name Fox, films distributed in 2021 name 20th Century Studios, and both are correct.',
    tags: ['major', 'fox', 'renamed'],
    founders: ['William Fox', 'Joseph Schenck', 'Darryl F. Zanuck'],
    events: [
      {
        id: 'merger',
        date: '1935-05-31T00:00:00Z',
        significance: 1,
        certainty: 0.9,
        tags: ['zero-point', 'merger'],
        description:
          'Fox Film Corporation and Twentieth Century Pictures merge to form Twentieth Century-Fox.',
      },
      {
        id: 'murdoch_acquisition',
        date: '1985-03-06T00:00:00Z',
        significance: 0.9,
        certainty: 0.9,
        tags: ['acquisition'],
        description: 'Rupert Murdoch\'s News Corporation acquires Twentieth Century-Fox.',
      },
      {
        id: 'new_corporation',
        date: '2013-06-28T00:00:00Z',
        significance: 0.7,
        certainty: 0.85,
        tags: ['renaming', 'corporate'],
        description: 'News Corporation splits, and the film and television assets become 21st Century Fox.',
      },
      {
        id: 'disney_acquisition',
        date: '2019-03-20T00:00:00Z',
        significance: 1,
        certainty: 0.95,
        tags: ['acquisition'],
        description: 'The Walt Disney Company completes its acquisition of 21st Century Fox.',
      },
      {
        id: 'renamed_twentieth_century_studios',
        date: '2020-01-17T00:00:00Z',
        significance: 1,
        certainty: 0.9,
        tags: ['renaming'],
        description:
          'The studio is renamed 20th Century Studios, dropping the Fox name.',
      },
    ],
    lineage: [
      {
        toSlug: '20th_century_studios',
        type: ReferenceType.RENAMED_TO,
        date: '2020-01-17T00:00:00Z',
        confidence: 0.9,
        description:
          'The same legal entity, renamed 20th Century Studios after the Disney acquisition.',
      },
    ],
  },
  {
    tokens: ['20th_century_studios'],
    slug: '20th_century_studios',
    displayName: '20th Century Studios',
    foundingYear: 1935,
    endedYear: null,
    description:
      'The current name of the studio founded in 1935 as Twentieth Century-Fox, adopted in 2020 following Disney\'s acquisition.',
    significance:
      'The successor identity of a studio whose pre-2020 films still correctly name Fox, which is why the two tokens resolve to one continuous legal entity.',
    tags: ['major', 'fox', 'renamed'],
    events: [
      {
        id: 'renamed',
        date: '2020-01-17T00:00:00Z',
        significance: 1,
        certainty: 0.9,
        tags: ['zero-point', 'renaming'],
        description:
          'Twentieth Century-Fox is renamed 20th Century Studios. The legal entity is continuous with the 1935 founding.',
      },
    ],
  },
  {
    tokens: ['united_artists', 'united_artists_releasing'],
    slug: 'united_artists',
    displayName: 'United Artists Corporation',
    foundingYear: 1919,
    endedYear: 1981,
    description:
      'Founded in 1919 by Charlie Chaplin, Mary Pickford, Douglas Fairbanks and D. W. Griffith so that artists could distribute their own films, and dissolved into MGM in 1981.',
    significance:
      'The studio created explicitly as an answer to distributor power, absorbed by the conglomerate form it was founded to resist.',
    tags: ['classic', 'united_artists'],
    founders: ['Charlie Chaplin', 'Mary Pickford', 'Douglas Fairbanks', 'D. W. Griffith'],
    events: [
      {
        id: 'founded',
        date: '1919-02-05T00:00:00Z',
        significance: 1,
        certainty: 0.9,
        tags: ['zero-point', 'founding'],
        description:
          'United Artists is founded as a distributor owned by the artists who made the films.',
      },
      {
        id: 'transamerica_acquisition',
        date: '1967-01-01T00:00:00Z',
        significance: 0.9,
        certainty: 0.85,
        tags: ['acquisition'],
        description:
          'Transamerica Corporation acquires United Artists, ending artist ownership.',
      },
      {
        id: 'mgm_acquisition',
        date: ['1981-05-01T00:00:00Z', '1981-12-31T00:00:00Z'],
        significance: 1,
        certainty: 0.85,
        tags: ['acquisition', 'dissolution'],
        description:
          'United Artists is merged into Metro-Goldwyn-Mayer, forming MGM/UA.',
      },
    ],
    lineage: [
      {
        toSlug: 'mgm',
        type: ReferenceType.ABSORBED_BY,
        date: ['1981-05-01T00:00:00Z', '1981-12-31T00:00:00Z'],
        confidence: 0.85,
        description:
          'Absorbed into Metro-Goldwyn-Mayer in 1981; the name was later revived as a distribution label.',
      },
    ],
  },
  {
    tokens: ['touchstone', 'touchstone_pictures'],
    slug: 'touchstone_pictures',
    displayName: 'Touchstone Pictures',
    foundingYear: 1984,
    endedYear: 2016,
    description:
      'The adult-oriented label Walt Disney Studios created in 1984 to release films that did not fit the family Disney brand, and which carried much of Robin Williams\' career.',
    significance:
      'A brand that was founded, retired, revived and retired again, so the token carries four distinct periods rather than one continuous run.',
    tags: ['disney', 'label', 'touchstone'],
    events: [
      {
        id: 'founded',
        date: '1984-02-15T00:00:00Z',
        significance: 1,
        certainty: 0.85,
        tags: ['zero-point', 'founding'],
        description:
          'Touchstone Pictures is launched as Disney\'s first adult-oriented label, with Splash as its first release.',
      },
      {
        id: 'retired',
        date: ['1988-01-01T00:00:00Z', '1990-12-31T00:00:00Z'],
        significance: 0.8,
        certainty: 0.35,
        tags: ['retirement'],
        description:
          'The Touchstone label is phased out in favour of the new Hollywood Pictures label. The date is not well documented; recorded as a range with low confidence.',
      },
      {
        id: 'hollywood_pictures_launched',
        date: '1989-02-03T00:00:00Z',
        significance: 0.75,
        certainty: 0.75,
        tags: ['corporate'],
        description:
          'Disney launches Hollywood Pictures as its second label, taking over the adult-oriented slate.',
      },
      {
        id: 'revived',
        date: '2011-01-01T00:00:00Z',
        significance: 0.7,
        certainty: 0.5,
        tags: ['revival'],
        description:
          'The Touchstone brand is revived as a distribution label; the revival marks are uncertain and recorded to the year.',
      },
      {
        id: 'closed',
        date: ['2016-01-01T00:00:00Z', '2016-12-31T00:00:00Z'],
        significance: 0.9,
        certainty: 0.5,
        tags: ['closure'],
        description:
          'Touchstone is shut down, with its titles moved to other Disney labels.',
      },
    ],
    lineage: [
      {
        toSlug: 'hollywood_pictures',
        type: ReferenceType.ABSORBED_BY,
        date: '1989-02-03T00:00:00Z',
        confidence: 0.6,
        description:
          'First superseded as Disney\'s adult label by Hollywood Pictures; the Touchstone name was later revived as a label before final closure.',
      },
    ],
  },
  {
    tokens: ['hollywood_pictures'],
    slug: 'hollywood_pictures',
    displayName: 'Hollywood Pictures',
    foundingYear: 1989,
    endedYear: 2007,
    description:
      'The second Walt Disney Studios label, founded in 1989 for adult-oriented films and shut down in 2007.',
    significance:
      'The label that displaced Touchstone, and whose own shutdown closed the loop of Disney\'s experiment with multiple brands.',
    tags: ['disney', 'label'],
    events: [
      {
        id: 'founded',
        date: '1989-02-03T00:00:00Z',
        significance: 1,
        certainty: 0.8,
        tags: ['zero-point', 'founding'],
        description: 'Hollywood Pictures is launched.',
      },
      {
        id: 'closed',
        date: ['2007-01-01T00:00:00Z', '2007-12-31T00:00:00Z'],
        significance: 0.9,
        certainty: 0.5,
        tags: ['closure'],
        description: 'Hollywood Pictures is shut down and its slate absorbed into Touchstone.',
      },
    ],
  },
  {
    tokens: ['miramax'],
    slug: 'miramax',
    displayName: 'Miramax Films',
    foundingYear: 1979,
    endedYear: null,
    description:
      'Founded by Bob and Harvey Weinstein in 1979 as a distributor of international and independent films that the majors would not touch.',
    significance:
      'The distributor of the 1990s independent boom, and a case where a change of owner left the name intact while the company changed hands four times.',
    tags: ['independent', 'miramax'],
    founders: ['Bob Weinstein', 'Harvey Weinstein'],
    events: [
      {
        id: 'founded',
        date: '1979-01-01T00:00:00Z',
        significance: 1,
        certainty: 0.8,
        tags: ['zero-point', 'founding'],
        description: 'Miramax is founded; the year is recorded without a firm day.',
      },
      {
        id: 'disney_acquisition',
        date: '1993-06-30T00:00:00Z',
        significance: 1,
        certainty: 0.9,
        tags: ['acquisition'],
        description: 'The Walt Disney Company acquires Miramax.',
      },
      {
        id: 'filmyard_acquisition',
        date: '2010-12-03T00:00:00Z',
        significance: 0.85,
        certainty: 0.8,
        tags: ['acquisition'],
        description:
          'Disney sells Miramax to Filmyard Holdings, an investor group.',
      },
      {
        id: 'bein_acquisition',
        date: '2016-03-02T00:00:00Z',
        significance: 0.8,
        certainty: 0.8,
        tags: ['acquisition'],
        description: 'beIN Media Group acquires Miramax.',
      },
    ],
    lineage: [
      {
        toSlug: 'walt_disney_pictures',
        type: ReferenceType.ACQUIRED_BY,
        date: '1993-06-30T00:00:00Z',
        confidence: 0.9,
        description:
          'Acquired by Disney in 1993 and sold on twice since, ending as an independent label.',
      },
    ],
  },
  {
    tokens: ['orion', 'orion_pictures'],
    slug: 'orion_pictures',
    displayName: 'Orion Pictures Corporation',
    foundingYear: 1978,
    endedYear: null,
    description:
      'Founded in 1978 by five former United Artists executives, and the distributor of the early-1980s independent wave until its 1991 bankruptcy.',
    significance:
      'A studio that went bankrupt, was absorbed by MGM, and had its name revived as a label — three identities in one token.',
    tags: ['independent', 'orion'],
    founders: ['Arthur B. Krim', 'Eric Pleskow'],
    events: [
      {
        id: 'founded',
        date: '1978-01-01T00:00:00Z',
        significance: 1,
        certainty: 0.85,
        tags: ['zero-point', 'founding'],
        description:
          'Orion Pictures is founded by former United Artists executives; recorded to the year.',
      },
      {
        id: 'bankruptcy',
        date: ['1991-11-01T00:00:00Z', '1992-04-30T00:00:00Z'],
        significance: 1,
        certainty: 0.85,
        tags: ['bankruptcy'],
        description:
          'Orion files for Chapter 11 bankruptcy after a run of box-office failures.',
      },
      {
        id: 'mgm_acquisition',
        date: '1997-07-10T00:00:00Z',
        significance: 0.95,
        certainty: 0.8,
        tags: ['acquisition'],
        description:
          'Metro-Goldwyn-Mayer acquires Orion, which continues as a specialty label.',
      },
    ],
    lineage: [
      {
        toSlug: 'mgm',
        type: ReferenceType.ABSORBED_BY,
        date: '1997-07-10T00:00:00Z',
        confidence: 0.8,
        description:
          'Absorbed into Metro-Goldwyn-Mayer after bankruptcy, with the name surviving as a label.',
      },
    ],
  },
  {
    tokens: ['tristar', 'tristar_pictures'],
    slug: 'tristar_pictures',
    displayName: 'TriStar Pictures',
    foundingYear: 1982,
    endedYear: null,
    description:
      'Founded in 1982 as a joint venture between Columbia Pictures, CBS and HBO, and absorbed into the Sony studio group.',
    significance:
      'A distributor created as a consortium and quietly disassembled by its own owners, with the name surviving as a Sony label.',
    tags: ['sony', 'tristar'],
    events: [
      {
        id: 'founded',
        date: '1982-11-01T00:00:00Z',
        significance: 1,
        certainty: 0.8,
        tags: ['zero-point', 'founding'],
        description:
          'Tri-Star Pictures is launched as a joint venture of Columbia Pictures, CBS and HBO.',
      },
      {
        id: 'hbo_cbs_exit',
        date: ['1985-01-01T00:00:00Z', '1985-12-31T00:00:00Z'],
        significance: 0.85,
        certainty: 0.7,
        tags: ['corporate'],
        description: 'HBO and CBS exit the venture, leaving Columbia as the controlling partner.',
      },
      {
        id: 'coca_cola_transfer',
        date: '1987-01-01T00:00:00Z',
        significance: 0.8,
        certainty: 0.7,
        tags: ['acquisition'],
        description:
          'Coca-Cola, which had acquired Columbia, consolidates TriStar under the same owner.',
      },
    ],
    lineage: [
      {
        toSlug: 'columbia_pictures',
        type: ReferenceType.ABSORBED_BY,
        date: '1987-01-01T00:00:00Z',
        confidence: 0.7,
        description:
          'Absorbed into the Columbia/Sony studio group, surviving as a label.',
      },
    ],
  },
  {
    tokens: ['new_line', 'new_line_cinema'],
    slug: 'new_line_cinema',
    displayName: 'New Line Cinema',
    foundingYear: 1967,
    endedYear: 2008,
    description:
      'Founded in 1967 by Robert Shaye as a distributor of exploitation and independent films, home of The Lord of the Rings trilogy.',
    significance:
      'The last major independent of the 1990s, absorbed into Warner Bros. in 2008 after two decades of distributing films the majors considered unbankable.',
    tags: ['independent', 'new_line'],
    founders: ['Robert Shaye'],
    events: [
      {
        id: 'founded',
        date: '1967-06-18T00:00:00Z',
        significance: 1,
        certainty: 0.75,
        tags: ['zero-point', 'founding'],
        description: 'New Line Cinema is founded; recorded to the year only.',
      },
      {
        id: 'turner_acquisition',
        date: '1994-01-28T00:00:00Z',
        significance: 0.8,
        certainty: 0.8,
        tags: ['acquisition'],
        description:
          'Turner Broadcasting acquires New Line, which passes with it to Time Warner in 1996.',
      },
      {
        id: 'absorbed_into_warner_bros',
        date: '2008-02-28T00:00:00Z',
        significance: 1,
        certainty: 0.9,
        tags: ['absorption', 'closure'],
        description:
          'New Line is absorbed into Warner Bros. and ceases to exist as a separate studio.',
      },
    ],
    lineage: [
      {
        toSlug: 'warner_bros',
        type: ReferenceType.ABSORBED_BY,
        date: '2008-02-28T00:00:00Z',
        confidence: 0.9,
        description:
          'Absorbed into Warner Bros. in 2008; the name survives as a Warners label.',
      },
    ],
  },
  {
    tokens: ['lionsgate'],
    slug: 'lionsgate',
    displayName: 'Lions Gate Films',
    foundingYear: 1997,
    endedYear: null,
    description:
      'The film label of Lions Gate Entertainment, created in 1997 on the acquisition of the Canadian distributor Cinépix.',
    significance:
      'The mini-major that proved a mid-budget distributor could survive the studio collapse of the 1990s.',
    tags: ['independent', 'lionsgate', 'mini_major'],
    founders: ['Frank Giustra'],
    events: [
      {
        id: 'founded',
        date: '1997-01-01T00:00:00Z',
        significance: 1,
        certainty: 0.7,
        tags: ['zero-point', 'founding'],
        description:
          'Lions Gate Entertainment is founded around the acquisition of Cinépix Film Properties; recorded to the year.',
      },
      {
        id: 'cinepix_acquired',
        date: ['1997-01-01T00:00:00Z', '1998-12-31T00:00:00Z'],
        significance: 0.8,
        certainty: 0.5,
        tags: ['acquisition'],
        description:
          'Cinépix Film Properties is acquired and its business renamed Lions Gate Films.',
      },
    ],
  },
  {
    tokens: ['a24'],
    slug: 'a24',
    displayName: 'A24',
    foundingYear: 2012,
    endedYear: null,
    description:
      'Founded in 2012 by Daniel Katz, David Fenkel and John Hodges, and the defining independent distributor of the 2010s and 2020s.',
    significance:
      'A distributor whose brand is itself the signal — the label a film carries has become part of what the film means.',
    tags: ['independent', 'a24'],
    founders: ['Daniel Katz', 'David Fenkel', 'John Hodges'],
    events: [
      {
        id: 'founded',
        date: '2012-08-20T00:00:00Z',
        significance: 1,
        certainty: 0.8,
        tags: ['zero-point', 'founding'],
        description:
          'A24 is founded, taking its name from the Italian motorway A24; recorded to the year.',
      },
    ],
  },
  {
    tokens: ['lucasfilm'],
    slug: 'lucasfilm',
    displayName: 'Lucasfilm Ltd.',
    foundingYear: 1971,
    endedYear: null,
    description:
      'Founded by George Lucas in 1971 as the production company behind Star Wars, and now the corporate home of the Indiana Jones and Star Wars franchises.',
    significance:
      'A production company turned distributor-adjacent franchise owner, acquired by Disney in 2012.',
    tags: ['production', 'lucasfilm', 'franchise'],
    founders: ['George Lucas'],
    events: [
      {
        id: 'founded',
        date: '1971-01-01T00:00:00Z',
        significance: 1,
        certainty: 0.75,
        tags: ['zero-point', 'founding'],
        description: 'Lucasfilm is founded; recorded to the year.',
      },
      {
        id: 'disney_acquisition',
        date: '2012-12-21T00:00:00Z',
        significance: 1,
        certainty: 0.95,
        tags: ['acquisition'],
        description: 'The Walt Disney Company acquires Lucasfilm.',
      },
    ],
    lineage: [
      {
        toSlug: 'walt_disney_pictures',
        type: ReferenceType.ACQUIRED_BY,
        date: '2012-12-21T00:00:00Z',
        confidence: 0.95,
        description: 'Acquired by Disney.',
      },
    ],
  },
  {
    tokens: ['marvel_studios'],
    slug: 'marvel_studios',
    displayName: 'Marvel Studios',
    foundingYear: 1993,
    endedYear: null,
    description:
      'Founded as Marvel Films in 1993 to license Marvel characters to film, and the architect of the shared-universe era.',
    significance:
      'The distributor that built a decade-long interconnected film slate, and changed what a film studio could be.',
    tags: ['production', 'marvel', 'franchise'],
    events: [
      {
        id: 'founded',
        date: '1993-01-01T00:00:00Z',
        significance: 1,
        certainty: 0.7,
        tags: ['zero-point', 'founding'],
        description:
          'Marvel Films is founded as the in-house film arm of Marvel Entertainment; recorded to the year.',
      },
      {
        id: 'renamed_marvel_studios',
        date: ['2007-01-01T00:00:00Z', '2008-12-31T00:00:00Z'],
        significance: 0.85,
        certainty: 0.6,
        tags: ['renaming'],
        description:
          'Marvel Films is restructured and renamed Marvel Studios as it begins self-financing its own films.',
      },
      {
        id: 'disney_acquisition',
        date: '2009-12-31T00:00:00Z',
        significance: 1,
        certainty: 0.95,
        tags: ['acquisition'],
        description:
          'Marvel Entertainment, and with it Marvel Studios, is acquired by Disney.',
      },
    ],
    lineage: [
      {
        toSlug: 'walt_disney_pictures',
        type: ReferenceType.ACQUIRED_BY,
        date: '2009-12-31T00:00:00Z',
        confidence: 0.95,
        description: 'Acquired by Disney via Marvel Entertainment.',
      },
    ],
  },
  {
    tokens: ['pixar'],
    slug: 'pixar',
    displayName: 'Pixar Animation Studios',
    foundingYear: 1986,
    endedYear: null,
    description:
      'Spun out of Lucasfilm in 1986 as a hardware company that became the defining computer-animation studio.',
    significance:
      'A studio whose films were distributed by Buena Vista and then Disney, making it the clearest case of a producer whose distributor is not itself.',
    tags: ['production', 'pixar', 'animation'],
    founders: ['Ed Catmull', 'Steve Jobs'],
    events: [
      {
        id: 'founded',
        date: '1986-02-03T00:00:00Z',
        significance: 1,
        certainty: 0.85,
        tags: ['zero-point', 'founding'],
        description:
          'Pixar is spun out of Lucasfilm as an independent company after Steve Jobs acquires the graphics group.',
      },
      {
        id: 'disney_acquisition',
        date: '2006-05-05T00:00:00Z',
        significance: 1,
        certainty: 0.95,
        tags: ['acquisition'],
        description:
          'Disney completes its acquisition of Pixar, whose films had already been distributed by Buena Vista since 1995.',
      },
    ],
    lineage: [
      {
        toSlug: 'walt_disney_pictures',
        type: ReferenceType.ACQUIRED_BY,
        date: '2006-05-05T00:00:00Z',
        confidence: 0.95,
        description:
          'Acquired by Disney, which had already been distributing Pixar films for a decade.',
      },
    ],
  },
  {
    tokens: ['saturn', 'saturn_international'],
    slug: 'saturn_international',
    displayName: 'Saturn International Pictures',
    foundingYear: 1982,
    endedYear: 1984,
    description:
      'A short-lived American distributor, recorded here because it is the distributor the local-time corpus names for Piranha II: The Spawning (1982).',
    significance:
      'A distributor that exists in this corpus only as a film credit; the low `certainty` on this universe reflects how thin the public record of it is.',
    tags: ['obscure', 'saturn'],
    events: [
      {
        id: 'founded',
        date: ['1981-01-01T00:00:00Z', '1982-12-31T00:00:00Z'],
        significance: 0.6,
        certainty: 0.25,
        tags: ['zero-point', 'founding'],
        description:
          'Recorded as operating in the early 1980s. The founding date is not established by the public record, so this keyframe carries a wide `dateRange` and low confidence.',
      },
      {
        id: 'piranha_ii_released',
        date: ['1981-12-01T00:00:00Z', '1982-12-31T00:00:00Z'],
        significance: 0.7,
        certainty: 0.5,
        tags: ['release'],
        description:
          'Saturn International is the distributor recorded in this corpus for Piranha II: The Spawning, released in Italy in 1981 and the United States in 1982.',
      },
      {
        id: 'ceased',
        date: ['1983-01-01T00:00:00Z', '1984-12-31T00:00:00Z'],
        significance: 0.6,
        certainty: 0.2,
        tags: ['closure'],
        description:
          'No releases are recorded after 1984; the closure date is conjectural.',
      },
    ],
  },
  {
    tokens: ['sony_pictures_entertainment'],
    slug: 'sony_pictures_entertainment',
    displayName: 'Sony Pictures Entertainment',
    foundingYear: 1987,
    endedYear: null,
    description:
      'The Sony-owned studio group formed after Sony\'s 1989 acquisition of Columbia, renamed in 1991.',
    significance:
      'The corporate layer above Columbia and TriStar, and the reason both of those studio universes resolve to a shared parent.',
    tags: ['group', 'sony'],
    events: [
      {
        id: 'founded',
        date: '1987-11-01T00:00:00Z',
        significance: 0.85,
        certainty: 0.85,
        tags: ['zero-point', 'founding'],
        description:
          'Sony establishes the studio group after acquiring CBS Records\' visual operations in 1988; the group is renamed Sony Pictures Entertainment in 1991.',
      },
      {
        id: 'renamed',
        date: '1991-08-07T00:00:00Z',
        significance: 0.9,
        certainty: 0.85,
        tags: ['renaming'],
        description: 'The Sony studio group is renamed Sony Pictures Entertainment.',
      },
    ],
  },
  {
    tokens: ['warner_bros_discovery'],
    slug: 'warner_bros_discovery',
    displayName: 'Warner Bros. Discovery',
    foundingYear: 2022,
    endedYear: null,
    description:
      'The conglomerate formed in 2022 by the merger of WarnerMedia and Discovery, Inc.',
    significance:
      'The corporate parent that now contains both Warner Bros. and New Line Cinema.',
    tags: ['group', 'warner'],
    events: [
      {
        id: 'merger',
        date: '2022-04-08T00:00:00Z',
        significance: 1,
        certainty: 0.95,
        tags: ['zero-point', 'merger'],
        description:
          'WarnerMedia, spun out of AT&T, merges with Discovery, Inc. to form Warner Bros. Discovery.',
      },
    ],
  },
  {
    tokens: ['amazon_mgm_studios'],
    slug: 'amazon_mgm_studios',
    displayName: 'Amazon MGM Studios',
    foundingYear: 2010,
    endedYear: null,
    description:
      'Amazon\'s film and television studio arm, founded in 2010 as Amazon Studios and renamed after Amazon\'s 2022 acquisition of MGM.',
    significance:
      'The current owner of the MGM library, and the case of a studio name adopted by a company with no film history.',
    tags: ['group', 'amazon'],
    events: [
      {
        id: 'founded',
        date: '2010-11-16T00:00:00Z',
        significance: 0.8,
        certainty: 0.8,
        tags: ['zero-point', 'founding'],
        description: 'Amazon Studios is launched as Amazon\'s studio arm.',
      },
      {
        id: 'mgm_acquisition',
        date: '2022-03-17T00:00:00Z',
        significance: 1,
        certainty: 0.95,
        tags: ['acquisition', 'renaming'],
        description:
          'Amazon completes its acquisition of MGM and renames the combined studio Amazon MGM Studios.',
      },
    ],
  },
];

const SPEC_BY_SLUG = new Map(FILM_STUDIO_SPECS.map((spec) => [spec.slug, spec]));

/** Resolve a studio slug to its universe ID. Throws for an unregistered slug. */
export const studioIdFor = (slug: string): FilmStudioUniverseId => {
  const spec = SPEC_BY_SLUG.get(slug);
  if (!spec) {
    throw new Error(
      `Unknown film studio slug '${slug}'. Add it to FILM_STUDIO_SPECS in ` +
        'src/config/universes/studios/studios.ts.',
    );
  }
  return createFilmStudioUniverseId(spec.slug, yearsOf(spec));
};

/** Every film-studio universe, in declaration order. */
export const filmStudioUniverses: Universe[] = FILM_STUDIO_SPECS.map((spec) =>
  buildFilmStudioUniverse(spec, studioIdFor),
);
