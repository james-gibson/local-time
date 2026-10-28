import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createSeriesUniverseId } from '../../../core/universe-ids';

/**
 * "We now know some of the people involved in mailing children fake transgender
 * pamphlets in Texas." — Texas Paul, 2026-10-24.
 *
 * THE WORK. A 175-second commentary video reporting that some of the people behind the
 * Texas mailers impersonating a transgender student resource guide have been identified.
 * It credits the Texas Tribune and CBS, names a printing family and a ministry, and
 * closes on an opinion. It is the trigger for james-gibson/local-time#207 and the media
 * work that universe documents.
 *
 * VERIFIED METADATA, NOT INFERRED. The ticket recorded the video as an unattributed
 * Short and its publish time as "on or about 2026-10-24" at certainty 0.5, with the
 * presenter unidentified. Read from the video's own public metadata on 2026-10-26:
 *
 *   channel      Texas Paul (@TheRealTexasPaul)     — oEmbed `author_name` / `author_url`
 *   title        as above                           — oEmbed `title`
 *   published    2026-10-24T14:40:22Z               — watch page `uploadDate` (UTC)
 *   duration     175 s                              — watch page `lengthSeconds`
 *   views        239,832 at read time               — watch page `viewCount`
 *
 * Open question 1 in the ticket is therefore closed by the route the ticket allowed.
 * The "Short" label is kept only as a colloquialism: the file is 2:55, not a ≤60 s
 * Short, and `durationSeconds` records the measurement rather than the label.
 *
 * WHAT THIS MODULE DOES NOT DO. It does not re-transcribe the video. The claim wording
 * is the ticket's transcript, not audio re-verified here, so no runtime offsets are
 * recorded and every keyframe sits at the publication instant. It does not repeat the
 * reconciliations — SnailWorks, Three Z Printing, the held family claim — because those
 * belong to the event's record and are asserted once, in
 * `history:texas_trans_student_mailer_controversy:2026` (`metadata.claims`).
 *
 * Reality Relation: interpretation with 0.0 fictionalization — commentary about a real
 * event, asserting no invented facts of its own. The opinions in it are content, not
 * event assertions.
 *
 * Research Sources:
 * - YouTube siS5HR_tjtU, public metadata read 2026-10-26 (oEmbed + watch page)
 * - The ticket's transcript of the video (not audio-verified)
 * - The event record: `history:texas_trans_student_mailer_controversy:2026`
 *
 * Hierarchical Context: US_HISTORY. It interprets the mailer controversy; it is not a
 * member of it (one owner, many memberships — #74).
 */

const UNIVERSE_ID = createSeriesUniverseId('series', 'texas_paul_ttsu_mailers', 2026);

/** The event this work comments on. Registered; the reference resolves. */
const CONTROVERSY_ID = 'history:texas_trans_student_mailer_controversy:2026';

const ns = (ms: bigint): bigint => ms * 1_000_000n;

/** Measured: uploadDate 2026-10-24T07:40:22-07:00. */
const PUBLISHED = ns(BigInt(Date.UTC(2026, 9, 24, 14, 40, 22)));
const DURATION_SECONDS = 175;
const ENDED = PUBLISHED + BigInt(DURATION_SECONDS) * 1_000_000_000n;

export const texasPaulTtsuMailersUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: UNIVERSE_ID,
    aliases: [
      'We now know some of the people involved in mailing children fake transgender pamphlets in Texas',
      'Texas Paul mailer identification video',
      'youtube:siS5HR_tjtU',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: CONTROVERSY_ID,
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'Reports the mailer controversy and the identification of a permit holder',
          'Credits Texas Tribune and CBS reporting as its sources',
        ],
      },
      {
        realEventId: 'channel:the_real_texas_paul',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'oEmbed author_name "Texas Paul" and author_url https://www.youtube.com/@TheRealTexasPaul',
          'watch-page ownerChannelName "Texas Paul"',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    copyright: {
      holders: ['Texas Paul (YouTube channel)'],
      year: 2026,
      status: 'active',
    },
    sources: [
      'YouTube siS5HR_tjtU — public metadata read 2026-10-26',
      'Ticket transcript of the video (not audio-verified)',
      'history:texas_trans_student_mailer_controversy:2026 — the event record',
    ],
    citations_required: true,
    usage_restrictions: [
      'Do not reproduce the audio or video. The work is copyrighted and this module stores metadata, not media.',
      'The transcript is the ticket\'s rendering, not a re-transcription. Quotes are indicative, not verbatim.',
      'The presenter is identified only by channel. No real name is asserted.',
      'Its claims are claims: the family and ministry allegation is held at certainty 0.3 in the event record and must not be read back as a finding here.',
    ],
  },

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        runtime: {
          epochId: 'youtube:texas_paul_ttsu_mailers:runtime',
          startTime: PUBLISHED,
          endTime: ENDED,
          precision: TimePrecision.SECOND,
          description:
            'The 175 s runtime, from the measured upload instant. No internal offsets are recorded: the transcript has no timings, so placing keyframes inside the runtime would be invention.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: [
      {
        id: 'whole_work',
        start: PUBLISHED,
        end: ENDED,
        type: 'sequence',
        status: 'active',
        description:
          'The entire video. One segment because nothing distinguishes its parts in the material held: no chapter list and no timed transcript.',
      },
    ],

    keyframes: [
      {
        id: 'published',
        timestamp: PUBLISHED,
        significance: 1.0,
        certainty: 0.95,
        precision: TimePrecision.SECOND,
        tags: ['publication', 'verified_metadata', 'zero_reference'],
        type: KeyframeType.RELEASE,
        description:
          'Upload instant measured from the video\'s own metadata: 2026-10-24T14:40:22Z. The ticket had this as "on or about 2026-10-24", certainty 0.5.',
      },
      {
        id: 'identification_claimed',
        timestamp: PUBLISHED,
        significance: 0.5,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['commentary', 'identification', 'corroborated'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Presenter: some of the people involved in mailing the pamphlets "have been identified". Corroborated in substance by the record — the LLC, registered agent and permit holder are identified — but the video names people the record does not name. Offset within the runtime not recorded.',
      },
      {
        id: 'uncorroborated_family_claim',
        timestamp: PUBLISHED,
        significance: 0.2,
        certainty: 0.3,
        precision: TimePrecision.SECOND,
        tags: ['unverified', 'single_source', 'held'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Presenter names a permit-holding family, two sons, a Catholic ministry and a MAGA-themed wedding cake, and attributes the funding to them. No second source; held in the event record at certainty 0.3 and excluded from any keyframe of significance ≥ 0.5. Offset within the runtime not recorded.',
      },
    ],

    windows: { strategy: 'time_based' },
  },

  metadata: {
    canonicalName:
      'We now know some of the people involved in mailing children fake transgender pamphlets in Texas.',
    description:
      'A 175-second commentary video by Texas Paul, reporting that some of the people behind the Texas mailer campaign have been identified, crediting Texas Tribune and CBS reporting, and naming a printing family and a ministry without corroboration in this record.',
    creators: ['Texas Paul'],
    released: new Date(Number(PUBLISHED / 1_000_000n)),
    cultural_significance: 0.2,
    tags: ['youtube', 'commentary', 'texas', 'mailers', 'texas-paul'],
    significance:
      'A short commentary video that amplified an ongoing reporting story. Recorded for its claims and its role as the trigger for the event record, not as a work of lasting influence.',
    platform: 'YouTube',
    externalId: 'siS5HR_tjtU',
    durationSeconds: DURATION_SECONDS,
    contentType: 'commentary video',

    verification: {
      performed: '2026-10-26',
      instruments: [
        'YouTube oEmbed endpoint (title, author_name, author_url)',
        'YouTube watch page (uploadDate, lengthSeconds, viewCount, ownerChannelName)',
      ],
      measured: {
        title:
          'We now know some of the people involved in mailing children fake transgender pamphlets in Texas.',
        channel: 'Texas Paul',
        handle: '@TheRealTexasPaul',
        published: '2026-10-24T14:40:22Z',
        durationSeconds: DURATION_SECONDS,
        viewCountAtVerification: 239832,
      },
      limits: [
        'The transcript is the ticket\'s, not a re-transcription. Speaker wording and order are indicative.',
        'No runtime offsets, so keyframes sit at the publication instant.',
        'View count is a point-in-time read, not a property of the work.',
      ],
    },

    uncertaintyNotes: [
      'The presenter is known by channel only. No real name is asserted, and none is inferred from the channel.',
      'The identification claim is corroborated in substance (entities were identified) but not in its named persons.',
      'The family-and-ministry allegation is single-source and is not carried as a finding in either universe.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY],
    },
    references: [
      {
        type: 'INTERPRETS',
        targetUniverseId: CONTROVERSY_ID,
        confidence: 0.9,
        description:
          'Commentary on the mailer controversy; its claims are reconciled in that universe\'s `metadata.claims`, not duplicated here.',
        evidence: ['credits Texas Tribune and CBS reporting'],
      },
    ],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#207. */
export const texasPaulTtsuMailersUniverses: Universe[] = [texasPaulTtsuMailersUniverse];
