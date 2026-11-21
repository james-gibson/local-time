import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Two Lawyer Oyer shorts, on their own clocks (james-gibson/local-time#208).
 *
 * S1 "DOJ charges Louise Lucas with racketeering" — 2:52 (172 s), published
 *    2026-10-22T21:53:26Z. Oyer opens on the morning's indictment, gives Lucas's
 *    biography, then argues the charge is hypocritical: an $18,000 senate salary set
 *    against the family wealth Trump accumulated in office, and charges announced
 *    twelve days before an election.
 * S2 "DOJ revisits Watergate" — 2:26 (146 s), published 2026-10-02T21:37:21Z. Oyer
 *    reports the Journal's story that DOJ is reviewing whether the Watergate special
 *    prosecutor's office committed misconduct, and reads it as an attempt to recast
 *    Nixon as the victim.
 *
 * THE WORK IS THE UNIT. Every keyframe is publication + a cue start on the short's own
 * auto-caption track, and every description is what the short says at that point. The
 * commentary is the work's argument (`metadata.interpretations`), not this corpus's
 * finding: `realityRelation.type` is `interpretation` and the anchors carry per-claim
 * confidence.
 *
 * TIME BASE. `videoDetails.lengthSeconds` is 172 and 146. The published transcript ends
 * (2:48 and 2:24) are where the last spoken cue sits, not the runtime — the #208 ticket
 * used them as proxies and asked for the metadata value before merge; these are it.
 * Both tracks are ASR only (`en-orig`), so `metadata.verification.confidence` is 0.80 and
 * the second-attempt verdict is "recommended, single track" rather than "not needed".
 *
 * IDS. `series:` is the namespace video works use — `UniverseType` has no short-form
 * video member, and the #208 draft's `media:` namespace does not exist and is not
 * declared in `UNIVERSE_ID_PATTERNS`. Titles become slugs, as with the other works in
 * this directory; each id is produced by `createSeriesUniverseId` in the test rather
 * than asserted here.
 *
 * S2's "Nixon was framed" theory is a LAYER, not a second Watergate: a `recreation`
 * layer whose reality correspondence points at `history:watergate_scandal:1972-1974`
 * with a low accuracy and the two deviations that make it what it is. The ground-truth
 * timeline stays retrievable next to the counterfactual (#75), and the record notes the
 * collision instead of resolving it.
 *
 * Sources: the shorts' own metadata and auto-caption tracks (`youtube:8K1VuVnkU4c`,
 * `youtube:2DKoTV4EFsc`), read from the queue artifacts captured 2026-10-26; the DOJ
 * press release 26-1246 (22 Oct 2026); WSJ reporting as summarised by Verity (2 Oct
 * 2026). See `metadata.verification` for the instruments and their limits.
 */

/** Runtime position of a cue start on a short's clock. */
const at = (published: bigint, seconds: number): bigint =>
  published + BigInt(Math.round(seconds * 1000)) * 1_000_000n;

/* ------------------------------------------------------------------ *
 * S1 — DOJ charges Louise Lucas with racketeering
 * ------------------------------------------------------------------ */

export const LIZ_OYER_LUCAS_UNIVERSE_ID =
  'series:doj_charges_louise_lucas_with_racketeering:2026';

/** 2026-10-22T21:53:26Z. */
export const LIZ_OYER_LUCAS_PUBLISHED = dateToNanoseconds(new Date('2026-10-22T21:53:26Z'));

/** YouTube `videoDetails.lengthSeconds`. 172 s = 2:52. */
export const LIZ_OYER_LUCAS_RUNTIME_SECONDS = 172;

const lucasAt = (seconds: number) => at(LIZ_OYER_LUCAS_PUBLISHED, seconds);

export const lizOyerLucasUniverse = {
  universeId: LIZ_OYER_LUCAS_UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: LIZ_OYER_LUCAS_UNIVERSE_ID,
    aliases: [
      'DOJ charges Louise Lucas with racketeering',
      'Lawyer Oyer Lucas short',
      'youtube:8K1VuVnkU4c',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'history:louise_lucas_indictment:2026',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'DOJ press release 26-1246, 22 Oct 2026 — eight counts, seven defendants, Lillie Louise Lucas, 82, of Portsmouth',
          'NBC News, 23 Oct 2026',
          'Virginia Mercury, 22 Oct 2026',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    copyright: {
      holders: ['Liz Oyer (Lawyer Oyer, YouTube channel)'],
      year: 2026,
      status: 'active',
    },
    sources: [
      'YouTube 8K1VuVnkU4c — public metadata and auto-caption track (en-orig), captured 2026-10-26',
      'DOJ Office of Public Affairs press release 26-1246, 22 Oct 2026 (eight-count indictment, seven defendants)',
      'The short\'s own biographical claims: Portsmouth council, Norfolk Navy Yard, senate tenure',
    ],
    citations_required: true,
    usage_restrictions: [
      'embed_only',
      'no_republication',
      'third_party_video',
      'Quotations are caption renderings from a single ASR track, not a checked transcript.',
    ],
  },

  layers: [
    {
      layerId: 'runtime',
      type: 'primary',
      epochs: {
        runtime: {
          epochId: 'youtube:doj_charges_louise_lucas_with_racketeering:runtime',
          startTime: lucasAt(0),
          endTime: lucasAt(LIZ_OYER_LUCAS_RUNTIME_SECONDS),
          precision: TimePrecision.SECOND,
          description:
            'The 172 s runtime from the measured upload instant. Offsets are cue starts ' +
            'on the en-orig track; the last spoken cue is at 168.1 s and the file ends at 172 s.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: [
      {
        id: 'charges_and_biography',
        start: lucasAt(0),
        end: lucasAt(44.6),
        type: 'scene' as const,
        status: 'active' as const,
        description: 'The morning announcement, who Oyer is, and who Lucas is.',
      },
      {
        id: 'the_charges_in_detail',
        start: lucasAt(44.6),
        end: lucasAt(122.6),
        type: 'scene' as const,
        status: 'active' as const,
        description: 'The six co-defendants, the licence allegation, and the hypocrisy argument.',
      },
      {
        id: 'blanche_and_the_timing',
        start: lucasAt(122.6),
        end: lucasAt(172),
        type: 'scene' as const,
        status: 'active' as const,
        description: 'Blanche\'s press conference, the twelve-day timing claim, and the close.',
      },
    ],

    keyframes: [
      {
        id: 'charges_announced',
        timestamp: lucasAt(0),
        significance: 1.0,
        certainty: 0.95,
        precision: TimePrecision.SECOND,
        tags: ['doj', 'indictment', 'virginia', 'release'],
        type: KeyframeType.RELEASE,
        description:
          'The opening: "this morning the Justice Department announced criminal racketeering ' +
          'charges against Virginia State Senator Louise Lucas." The DOJ release is dated the ' +
          'same day (22 Oct 2026), so "this morning" is the short\'s framing of a same-day event.',
      },
      {
        id: 'presenter_self_description',
        timestamp: lucasAt(16.3),
        significance: 0.6,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['speaker', 'claim', 'biography'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"I\'m Liz Oyer, the former pardon attorney for the Department of Justice." Recorded ' +
          'as a claim about the speaker, not as a verified credential: it is the short\'s own ' +
          'description and no independent source for it is in this record.',
      },
      {
        id: 'lucas_biography',
        timestamp: lucasAt(20.3),
        significance: 0.7,
        certainty: 0.85,
        precision: TimePrecision.SECOND,
        tags: ['biography', 'context'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The biography block: "an 82-year-old black woman who has worked in public service ' +
          'since 1967", a shipfitter at the Norfolk Navy Yard, the first Black woman elected to ' +
          'the Portsmouth City Council, "a state senator for nearly 35 years." The DOJ release ' +
          'corroborates the age, the city and the senate service (elected 1991); the council ' +
          'and shipyard claims are the short\'s.',
      },
      {
        id: 'seven_defendants',
        timestamp: lucasAt(44.6),
        significance: 0.9,
        certainty: 0.95,
        precision: TimePrecision.SECOND,
        tags: ['indictment', 'defendants'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"DOJ charged Lucas and six others, including her daughters and her grandson, with ' +
          'running a criminal racketeering enterprise." The release says the same: an ' +
          'eight-count indictment, seven defendants, including her two daughters and her grandson.',
      },
      {
        id: 'cannabis_licence_allegation',
        timestamp: lucasAt(53.3),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['indictment', 'allegation', 'cannabis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The alleged object: "the charges relate to her efforts to get a licence to sell ' +
          'recreational marijuana", and that she "took advantage of her public office to enrich ' +
          'herself and her family." The release describes the same enterprise and a ' +
          'five-year scheme the FBI estimated at $4.5 million.',
      },
      {
        id: 'hypocrisy_frame',
        timestamp: lucasAt(106.4),
        significance: 1.0,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['argument', 'thesis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The thesis of the short, stated with its own hedge: "I don\'t know if there\'s any ' +
          'truth to this, but what I do know is that even if it is 100% true, it is off the ' +
          'charts hypocrisy." The argument does not depend on the charges being false.',
      },
      {
        id: 'generational_wealth_claim',
        timestamp: lucasAt(76.7),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['indictment', 'motive'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Oyer reads the indictment\'s motive allegation as if it were a confession of greed: ' +
          'that Lucas "was hoping the cannabis business would give her the opportunity to earn ' +
          'generational wealth for her family before she dies."',
      },
      {
        id: 'salary_contrast',
        timestamp: lucasAt(87.7),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['argument', 'compensation'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Lucas\'s salary as a state senator is $18,000 per year ... she wasn\'t exactly ' +
          'stashing away millions," set against Trump family income from the presidency. The ' +
          'salary figure is the one the #208 ticket asked to have independently sourced; it is ' +
          'reported here as the short states it.',
      },
      {
        id: 'blanche_presser',
        timestamp: lucasAt(122.6),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['doj', 'statement'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Blanche\'s press conference: he "accused Lucas of putting her own financial interests ' +
          'before the people she was elected to serve." The release carries the same line in ' +
          'his quoted statement.',
      },
      {
        id: 'election_timing',
        timestamp: lucasAt(153.9),
        significance: 0.95,
        certainty: 0.85,
        precision: TimePrecision.SECOND,
        tags: ['argument', 'contested', 'election'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The contested claim: the charges were announced "12 days before an election, which ' +
          'violates DOJ policy." Recorded at 0.85 because it is Oyer\'s characterisation of the ' +
          'policy; the corpus does not assert the violation. It is also the claim the #208 ' +
          'ticket flagged as needing the election date resolved — the short says "an election" ' +
          'without naming it.',
      },
      {
        id: 'double_standards_close',
        timestamp: lucasAt(165.3),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['argument', 'close'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The close: inequality "is not new ... but this is the first DOJ to openly and ' +
          'shamelessly embrace double standards." The comparison to Trump is the short\'s ' +
          'framing, recorded as the work\'s argument.',
      },
    ],

    windows: { strategy: 'scene_based' },
  },

  metadata: {
    canonicalName: 'DOJ charges Louise Lucas with racketeering (Lawyer Oyer)',
    description:
      'A 2:52 short on the DOJ\'s 22 Oct 2026 eight-count racketeering indictment of Virginia ' +
      'State Senator Louise Lucas: the charges, her biography, and an argument that the ' +
      'prosecution is hypocritical given the salary at stake.',
    creators: ['Liz Oyer'],
    released: new Date('2026-10-22T21:53:26Z'),
    cultural_significance: 0.35,
    platform: 'YouTube',
    externalId: '8K1VuVnkU4c',
    externalIds: { youtubeVideoId: '8K1VuVnkU4c' },
    durationSeconds: LIZ_OYER_LUCAS_RUNTIME_SECONDS,
    contentType: 'short-form political commentary',
    metricsAsOf: '2026-10-26',

    interpretations: [
      {
        id: 'I-1',
        claim: 'Even if every allegation is true, prosecuting Lucas is hypocrisy of the first order.',
        statedAtSeconds: 106.4,
        standing:
          'The short\'s thesis. It is an argument about comparative treatment, and it concedes ' +
          'the allegations may be true; it does not assert the charges are false.',
      },
      {
        id: 'I-2',
        claim: 'The charges were timed to an election, which violates DOJ policy.',
        statedAtSeconds: 153.9,
        standing:
          'Contested. The short does not name the election or cite the policy text; recorded as ' +
          'the work\'s claim at certainty 0.85, not as a finding.',
      },
    ],

    verification: {
      performed: '2026-11-21',
      instruments: ['YouTube metadata (info.json)', 'auto-caption track en-orig (json3)'],
      measured: [
        'Publication instant 2026-10-22T21:53:26Z; runtime 172 s',
        '75 cues, 477 words, 100% coverage of the runtime; last spoken cue 168.1 s',
      ],
      scope: { start: 0, end: 172 },
      confidence: 0.8,
      secondAttempt: {
        recommended: true,
        why: 'single caption track — no cross-check',
        what: 'acquire the secondary English track (en); if none exists, ASR the quoted span',
        attempted: null,
      },
      limits: [
        'Offsets are cue starts from one ASR track; wording is the ASR\'s, not the speaker\'s.',
        'The biographical and salary figures are the short\'s until sourced elsewhere.',
      ],
    },
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
  },
} as unknown as Universe;

/* ------------------------------------------------------------------ *
 * S2 — DOJ revisits Watergate
 * ------------------------------------------------------------------ */

export const LIZ_OYER_WATERGATE_UNIVERSE_ID = 'series:doj_revisits_watergate:2026';

/** 2026-10-02T21:37:21Z. */
export const LIZ_OYER_WATERGATE_PUBLISHED = dateToNanoseconds(new Date('2026-10-02T21:37:21Z'));

/** YouTube `videoDetails.lengthSeconds`. 146 s = 2:26. */
export const LIZ_OYER_WATERGATE_RUNTIME_SECONDS = 146;

const watergateAt = (seconds: number) => at(LIZ_OYER_WATERGATE_PUBLISHED, seconds);

export const lizOyerWatergateUniverse = {
  universeId: LIZ_OYER_WATERGATE_UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: LIZ_OYER_WATERGATE_UNIVERSE_ID,
    aliases: ['DOJ revisits Watergate', 'Lawyer Oyer Watergate short', 'youtube:2DKoTV4EFsc'],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'history:doj_watergate_review:2026',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'The Wall Street Journal report that DOJ is reviewing the special prosecutor\'s conduct',
          'Verity summary of the reporting, dated 2 Oct 2026',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    copyright: {
      holders: ['Liz Oyer (Lawyer Oyer, YouTube channel)'],
      year: 2026,
      status: 'active',
    },
    sources: [
      'YouTube 2DKoTV4EFsc — public metadata and auto-caption track (en-orig), captured 2026-10-26',
      'The Wall Street Journal, "Decades After Watergate, Justice Department Reviews Whether Nixon Got a Raw Deal", reported 1-2 Oct 2026',
      'Verity summary of the same reporting, 2 Oct 2026 (Shepard\'s two-hour presentation, the DOJ statement, the 2022 refusal)',
    ],
    citations_required: true,
    usage_restrictions: [
      'embed_only',
      'no_republication',
      'third_party_video',
      'Quotations are caption renderings from a single ASR track, not a checked transcript.',
    ],
  },

  layers: [
    {
      layerId: 'runtime',
      type: 'primary',
      epochs: {
        runtime: {
          epochId: 'youtube:doj_revisits_watergate:runtime',
          startTime: watergateAt(0),
          endTime: watergateAt(LIZ_OYER_WATERGATE_RUNTIME_SECONDS),
          precision: TimePrecision.SECOND,
          description:
            'The 146 s runtime from the measured upload instant. The last spoken cue is at ' +
            '144.8 s and the file ends at 146 s.',
        },
      },
    },
    {
      /**
       * The theory the short is reporting on, held as a recreation rather than as a second
       * Watergate. It is a timeline about 1972-74 that the short narrates in 2026; its
       * correspondence to the record is low, and the deviations are the whole point.
       */
      layerId: 'nixon_was_framed',
      type: 'recreation',
      epochs: {
        theory_timeline: {
          epochId: 'doj_revisits_watergate:nixon_was_framed',
          startTime: dateToNanoseconds(new Date('1972-06-17T00:00:00Z')),
          endTime: dateToNanoseconds(new Date('1974-08-09T00:00:00Z')),
          precision: TimePrecision.DAY,
          description:
            'The re-told 1972-1974 span, as the theory frames it: the prosecutors are the ' +
            'actors and Nixon is the victim.',
        },
      },
      reality_correspondence: {
        to: 'history:watergate_scandal:1972-1974',
        accuracy: 0.15,
        deviations: [
          'Claims the special prosecutor\'s office committed misconduct rather than the Nixon administration.',
          'Recasts Nixon as victim; no evidentiary basis asserted here.',
        ],
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: [
      {
        id: 'the_review',
        start: watergateAt(0),
        end: watergateAt(44.4),
        type: 'scene' as const,
        status: 'active' as const,
        description: 'The review, the recap of the scandal, and the pardon.',
      },
      {
        id: 'the_reporting_and_the_theory',
        start: watergateAt(44.4),
        end: watergateAt(99.1),
        type: 'scene' as const,
        status: 'active' as const,
        description: 'The Journal report, Shepard\'s presentation, Vance, and the January 6 parallel.',
      },
      {
        id: 'the_unit_and_the_close',
        start: watergateAt(99.1),
        end: watergateAt(146),
        type: 'scene' as const,
        status: 'active' as const,
        description: 'The Office of Professional Responsibility, the fired director, and the close.',
      },
    ],

    keyframes: [
      {
        id: 'review_opened',
        timestamp: watergateAt(5.3),
        significance: 1.0,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['doj', 'watergate', 'release'],
        type: KeyframeType.RELEASE,
        description:
          '"They are reopening the Watergate investigation. They are trying to prove that ' +
          'Richard Nixon was actually the victim and the prosecutors were the bad guys." The ' +
          'Journal\'s report is that DOJ is *reviewing* the prosecutors\' conduct; "reopening" ' +
          'is the short\'s word.',
      },
      {
        id: 'watergate_recap',
        timestamp: watergateAt(19.9),
        significance: 0.6,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['context', 'history'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The recap: the 1972 break-in, "the biggest presidential scandal of all time" until ' +
          'Trump, Nixon forced to resign, top aides prosecuted "including his former attorney ' +
          'general", and "Nixon was not prosecuted only because Gerald Ford gave him a pardon."',
      },
      {
        id: 'wsj_report',
        timestamp: watergateAt(44.4),
        significance: 0.95,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['reporting', 'wsj'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The Wall Street Journal is reporting that they\'re looking at whether the special ' +
          'prosecutor\'s office that investigated the Watergate break-in committed prosecutorial ' +
          'misconduct." The attributed source of the short\'s central claim.',
      },
      {
        id: 'two_hour_presentation',
        timestamp: watergateAt(58.3),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['reporting', 'shepard', 'theory'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"DOJ staff recently heard a two-hour presentation from a former Nixon aide, now a ' +
          'conspiracy theorist who believes Nixon was framed by the deep state." Verity: the ' +
          'aide is Geoff Shepard, the deck was titled "Watergate As Lawfare", and DOJ says the ' +
          'presentation does not constitute an investigation.',
      },
      {
        id: 'vance_comparison',
        timestamp: watergateAt(74.8),
        significance: 0.8,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['reporting', 'vance'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"J.D. Vance recently compared how the deep state took down Richard Nixon to how ' +
          'Donald Trump has been treated." Verity places the remark at the Nixon Library in ' +
          'June 2026 — the short does not date it.',
      },
      {
        id: 'january_6_parallel',
        timestamp: watergateAt(84.0),
        significance: 0.7,
        certainty: 0.7,
        precision: TimePrecision.SECOND,
        tags: ['argument', 'parallel'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The parallel the short draws: this is "exactly what the Trump administration is ' +
          'trying to do with January 6th — treating the criminals like heroes, police and ' +
          'prosecutors like villains", with Jack Smith\'s Senate testimony as the example. The ' +
          'short\'s framing; recorded at 0.7.',
      },
      {
        id: 'opr_unit',
        timestamp: watergateAt(99.1),
        significance: 0.95,
        certainty: 0.95,
        precision: TimePrecision.SECOND,
        tags: ['doj', 'opr', 'key_finding'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The kicker: "the unit running this clown show is DOJ\'s Office of Professional ' +
          'Responsibility — the office responsible for policing misconduct by DOJ lawyers." ' +
          'Verity names the office as the venue of Shepard\'s presentation.',
      },
      {
        id: 'director_fired',
        timestamp: watergateAt(110.4),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['doj', 'contested', 'opr'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The career director of the office was fired last spring. Since then, the office has ' +
          'done absolutely nothing to rein in misconduct." A contested claim about DOJ personnel ' +
          'and inaction; the corpus records it as the short\'s, at 0.8.',
      },
      {
        id: 'closing_vote',
        timestamp: watergateAt(144.8),
        significance: 0.4,
        certainty: 0.95,
        precision: TimePrecision.SECOND,
        tags: ['close', 'appeal'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description: 'The close: "All I can say is don\'t forget to vote."',
      },
    ],

    windows: { strategy: 'scene_based' },
  },

  metadata: {
    canonicalName: 'DOJ revisits Watergate (Lawyer Oyer)',
    description:
      'A 2:26 short reporting that DOJ is reviewing whether the Watergate special prosecutor\'s ' +
      'office committed misconduct, and arguing that the review recasts Nixon as the victim.',
    creators: ['Liz Oyer'],
    released: new Date('2026-10-02T21:37:21Z'),
    cultural_significance: 0.35,
    platform: 'YouTube',
    externalId: '2DKoTV4EFsc',
    externalIds: { youtubeVideoId: '2DKoTV4EFsc' },
    durationSeconds: LIZ_OYER_WATERGATE_RUNTIME_SECONDS,
    contentType: 'short-form political commentary',
    metricsAsOf: '2026-10-26',

    interpretations: [
      {
        id: 'I-1',
        claim: 'The review is an attempt to rewrite history by casting Nixon as the victim.',
        statedAtSeconds: 5.3,
        standing:
          'The short\'s reading of a reported review. The reporting establishes the review and ' +
          'the presentation; that its purpose is historical revision is the work\'s argument.',
      },
      {
        id: 'I-2',
        claim: 'The office running the review has stopped policing misconduct by DOJ lawyers.',
        statedAtSeconds: 110.4,
        standing:
          'Contested. No source for the director\'s firing or the office\'s inaction is cited in ' +
          'the short; recorded at certainty 0.8.',
      },
    ],

    verification: {
      performed: '2026-11-21',
      instruments: ['YouTube metadata (info.json)', 'auto-caption track en-orig (json3)'],
      measured: [
        'Publication instant 2026-10-02T21:37:21Z; runtime 146 s',
        '67 cues, 417 words, 100% coverage of the runtime; last spoken cue 144.8 s',
      ],
      scope: { start: 0, end: 146 },
      confidence: 0.8,
      secondAttempt: {
        recommended: true,
        why: 'single caption track — no cross-check',
        what: 'acquire the secondary English track (en); if none exists, ASR the quoted span',
        attempted: null,
      },
      limits: [
        'Offsets are cue starts from one ASR track; wording is the ASR\'s.',
        'The review is described as the Journal reported it; the newspaper story itself is not in this record.',
      ],
    },
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'DOCUMENTS',
        targetUniverseId: 'history:doj_watergate_review:2026',
        confidence: 0.9,
        description: 'The reported review this short is about.',
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: 'history:watergate_scandal:1972-1974',
        confidence: 0.9,
        description: 'The scandal the review revisits; the `nixon_was_framed` layer reads it.',
      },
    ],
  },
} as unknown as Universe;

/** Both shorts, for the namespace barrel. */
export const lizOyerShortsUniverses: Universe[] = [
  lizOyerLucasUniverse,
  lizOyerWatergateUniverse,
];
