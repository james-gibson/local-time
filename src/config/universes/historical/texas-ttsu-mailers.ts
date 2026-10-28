import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../core/universe-ids';

/**
 * "Texas Transgender Student Union" mailers — a contested-authorship mail campaign,
 * Texas, September–October 2026.
 *
 * THE EVENT. Pamphlets styled as a resource guide from a "Texas Transgender Student
 * Union" were mailed to families across Texas in the opening days of early voting for
 * the 3 November midterm. Every resource in them pointed at the Transgender Education
 * Network of Texas (TENT), which denies involvement and says its name, materials,
 * photographs and branding were used without consent. A Wyoming LLC of the mailer's
 * name was formed in early September. TENT has filed a Rule 202 petition in Travis
 * County, USPS has identified the bulk-mail permit holder, and a West Texas district
 * attorney has opened a forgery probe. No source in this record establishes who paid
 * for the mailing. (`LT-2026-1026-TTSU`, james-gibson/local-time#207.)
 *
 * ID RECONCILIATION, DECIDED HERE. The ticket proposed
 * `history:texas_transgender_student_union_mailers:2026`. Three landed modules already
 * reference `history:texas_trans_student_mailer_controversy:2026` as a reality anchor
 * (`youtube/beck-pamphlet-transcript.ts`, `historical/texas-mailer/…-solo-limit.ts`,
 * `…-discovery-reach.ts`), so registering the ticket's id would leave three anchors
 * dangling and create a second address for one event. The referenced id is registered;
 * the ticket's slug is kept as an alias. This is the #92 rule applied at authoring time:
 * a dangling id is not neutral, it reads as a module that exists.
 *
 * TASK 0 GATE, AND WHAT IT COST. The ticket's inventory proposed person and organization
 * universes (`person:jon_bonck`, `organization:three_z_printing`, …). `UniverseType` has
 * no `PERSON` or `ORGANIZATION` member and `universe-ids.ts` has no creator for either,
 * so `createPersonUniverseId` is not a thing that exists. Per the ticket's own gate they
 * are demoted: every entity lives in `metadata.entities` with its proposed id, role and
 * certainty, and the ones the record actually dates carry keyframes here. The follow-up
 * is james-gibson/local-time#209, which owns the type question for all of them at once.
 *
 * THE VIDEO IS RECONCILED, NOT TRUSTED. `series:texas_paul_ttsu_mailers:2026` is the
 * commentary work. Three of its claims needed handling, recorded in `metadata.claims`:
 * "SNL Works" is SnailWorks (a Maryland tracking firm, not a printer); "3Z Printing,
 * Two Toplas" is Three Z Printing of Teutopolis, Illinois (a permit holder, which does
 * not establish who printed or sent the mail); and the Zarusen family / Newman Ministries
 * material is single-source, so it carries `certainty: 0.3` and `significance: 0.2` and
 * never enters a keyframe at or above 0.5. The video's "It's you. It's always you." is
 * the work's opinion and is recorded as content, never as an event assertion.
 *
 * COMPOSITION, NOT DUPLICATION (#74, #75). The pamphlet asserts a world in which TENT
 * authored and sent this material; the petition asserts the opposite. Neither side is
 * edited and no second universe is registered under TENT's name. The assertion is a
 * `recreation` layer with `reality_correspondence.deviations`, so the pair surfaces
 * together: `tent_denial` is a keyframe here, and the losing assertion survives in the
 * layer rather than being resolved away. The ticket placed the `contradicts` edge on the
 * mailer artefact universe; that universe is demoted by the Task 0 gate, and an edge to
 * an unregistered target is a dangling edge, so the pair is carried by the layer plus
 * the denial keyframe and the anchor, not by a reference that resolves to nothing.
 *
 * Derived, not hand-set: the charge is `+1` from `realityRelation.type: 'documentary'`
 * and is not stored on this object (#90). The `as_asserted_by_mailer` plane is the only
 * place the opposite sign belongs, and it takes it from its own fictionality.
 *
 * Research Sources:
 * - Texas Tribune, "False pamphlets causing backlash and confusion…" (2026-10-20)
 * - Texas Tribune, "West Texas DA opens forgery probe…" (2026-10-23)
 * - CBS News Texas, "Fight over transgender mystery mailers heads to court"
 * - Click2Houston (2026-10-20); Chron; LGBTQ Nation
 * - The commentary video itself, read as a source of claims — its channel, title,
 *   publication instant and duration were verified through YouTube's public metadata on
 *   2026-10-26 (see `metadata.verification`); its transcript is taken from the ticket and
 *   has not been re-transcribed against audio.
 *
 * Hierarchical Context: US_HISTORY -> US_ELECTION_CYCLE (midterm disinformation). The
 * organization and person rows are entities of this event, not universes — see the gate
 * above.
 */

const UNIVERSE_ID = createHistoricalUniverseId(
  'texas_trans_student_mailer_controversy',
  '2026',
);

/** The commentary work that reported the identification. Verified 2026-10-26. */
const COMMENTARY_ID = 'series:texas_paul_ttsu_mailers:2026';

/** The transcription record for the on-air reading of the same pamphlet. */
const TRANSCRIPT_ID = 'series:beck_pamphlet_transcript:2026';

/** Calendar date (UTC midnight) to nanoseconds. `m` is 1-based; `Date.UTC` is 0-based. */
const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

/** Exact instant to nanoseconds — used where a second-precision fact was measured. */
const at = (y: number, m: number, d: number, hh = 0, mm = 0, ss = 0): bigint =>
  BigInt(Date.UTC(y, m - 1, d, hh, mm, ss)) * 1_000_000n;

const CAMPAIGN_START = D(2026, 9, 1);
const CAMPAIGN_END = D(2026, 10, 26);

/** Measured from the video's own metadata: uploadDate 2026-10-24T07:40:22-07:00. */
const COMMENTARY_PUBLISHED = at(2026, 10, 24, 14, 40, 22);

export const texasTtsuMailersUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: UNIVERSE_ID,
    aliases: [
      'history:texas_transgender_student_union_mailers:2026',
      'Texas Transgender Student Union mailers',
      'fake transgender pamphlet mailers Texas',
      'TENT mailer impersonation',
    ],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: UNIVERSE_ID,
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Texas Tribune, 2026-10-20: mailers, return address, TENT denial, early-voting timing',
          'CBS News Texas: Rule 202 petition, USPS permit holder, Wyoming registration',
          'Texas Tribune, 2026-10-23: West Texas DA forgery probe',
        ],
      },
      {
        realEventId: 'entity:transgender_education_network_of_texas',
        relationshipType: 'contradicts',
        confidence: 0.95,
        evidence: [
          'TENT statement: the mailers were not authorized, authored, approved or distributed by TENT',
          'TENT describes its name and branding as co-opted without knowledge or consent',
        ],
      },
      {
        realEventId: COMMENTARY_ID,
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'Texas Paul, "We now know some of the people involved in mailing children fake transgender pamphlets in Texas."',
          'Published 2026-10-24T14:40:22Z, 175 s, per the video\'s own metadata read on 2026-10-26',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: [
      'Texas Tribune, "False pamphlets causing backlash and confusion…" (2026-10-20)',
      'Texas Tribune, "West Texas DA opens forgery probe…" (2026-10-23)',
      'CBS News Texas, "Fight over transgender mystery mailers heads to court"',
      'Click2Houston (2026-10-20)',
      'Chron, "Mystery mailers cause Texas LGBTQ+ nonprofit to close over backlash"',
      'LGBTQ Nation, "Mystery mailers impersonating trans org provoke conservative outrage"',
      'YouTube siS5HR_tjtU — Texas Paul, as a source of claims and of its own metadata',
    ],
    citations_required: true,
    usage_restrictions: [
      'Named private individuals are named only in a single commentary video. They are allegations, not findings, and must not be re-published as established fact.',
      'A bulk-mail permit holder is not necessarily the printer or the sender; the record says permit holder and nothing more.',
      'The commentary transcript is taken from the ticket, not re-transcribed from audio. Wording is indicative, not verbatim.',
      'The DA probe is recorded as a phase. This module does not assert that any crime occurred or that any person committed one.',
      'Do not infer the payer. No source reviewed establishes who paid for the mailing or the permit use.',
    ],
  },

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        mailer_campaign: {
          epochId: 'history:ttsu_mailers:2026',
          startTime: CAMPAIGN_START,
          endTime: CAMPAIGN_END,
          precision: TimePrecision.DAY,
          description:
            'Formation of the Wyoming LLC through public identification of the permit holder and the opening of criminal and civil proceedings.',
        },
      },
    },
    {
      layerId: 'as_asserted_by_mailer',
      type: 'recreation',
      reality_correspondence: {
        to: 'entity:transgender_education_network_of_texas',
        accuracy: 0.05,
        deviations: [
          'Mailer presents TENT as author and sponsor; TENT denies any involvement and states its materials were used without consent.',
          'Mailer advises students that parental involvement is unnecessary and discusses emancipation; TENT states its published resources do not offer emancipation guidance.',
          'Mailer return address is a Houston post office box for a Wyoming-registered LLC, not a TENT address.',
        ],
      },
      epochs: {
        asserted_campaign: {
          epochId: 'history:ttsu_mailers:asserted',
          startTime: D(2026, 10, 13),
          endTime: D(2026, 10, 24),
          precision: TimePrecision.DAY,
          description:
            'The world the pamphlet asserts: a named student union with a Texas programme, soliciting students directly. It is not the record, and it is not TENT\'s account.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: [
      {
        id: 'formation',
        start: CAMPAIGN_START,
        end: D(2026, 10, 13),
        type: 'phase',
        status: 'inactive',
        description:
          'LLC registered in Wyoming with a Sheridan registered agent; no public mail activity yet.',
      },
      {
        id: 'text_campaign',
        start: D(2026, 10, 13),
        end: D(2026, 10, 19),
        type: 'phase',
        status: 'inactive',
        description:
          'Text messages impersonating TENT; cease-and-desist letters to two messaging vendors.',
      },
      {
        id: 'mailer_surfaces',
        start: D(2026, 10, 19),
        end: D(2026, 10, 20),
        type: 'phase',
        status: 'inactive',
        description:
          'Mailers circulate on social media as early voting opens for the 3 November midterm.',
      },
      {
        id: 'identification',
        start: D(2026, 10, 20),
        end: CAMPAIGN_END,
        type: 'phase',
        status: 'active',
        description:
          'Press publication, the Rule 202 petition, the USPS permit-holder identification and the DA forgery probe.',
      },
    ],

    keyframes: [
      {
        id: 'wyoming_llc_formed',
        timestamp: D(2026, 9, 5),
        significance: 0.85,
        certainty: 0.7,
        precision: TimePrecision.DAY,
        dateRange: { earliest: D(2026, 9, 1), latest: D(2026, 9, 10) },
        tags: ['shell_entity', 'formation', 'wyoming'],
        type: KeyframeType.INCORPORATION,
        description:
          'A "Texas Transgender Student Union" LLC was registered in Wyoming; the actual date is reported only as "early September" / "a month ago".',
      },
      {
        id: 'tent_cease_and_desist',
        timestamp: D(2026, 10, 14),
        significance: 0.7,
        certainty: 0.95,
        tags: ['legal_notice', 'texts'],
        type: KeyframeType.MILESTONE,
        description:
          'TENT demanded two digital messaging companies stop sending texts that offered gender-affirming-care guidance under its name.',
      },
      {
        id: 'mailers_circulate',
        timestamp: D(2026, 10, 19),
        significance: 0.9,
        certainty: 0.95,
        tags: ['publication', 'early_voting'],
        type: KeyframeType.PUBLICATION,
        description:
          'Images of the pamphlet spread on social media on the first days of early voting.',
      },
      {
        id: 'tribune_publication',
        timestamp: D(2026, 10, 20),
        significance: 0.95,
        certainty: 1.0,
        tags: ['investigation', 'press'],
        type: KeyframeType.PUBLICATION,
        description:
          "The Texas Tribune reported the mailers' return address resolved to a Wyoming LLC and that their links pointed to TENT, which denied involvement.",
      },
      {
        id: 'tent_denial',
        timestamp: D(2026, 10, 20),
        significance: 0.9,
        certainty: 0.95,
        tags: ['denial', 'co-option', 'key_quote', 'contradicts'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'TENT: the mailers "were not authorized, authored, approved, or distributed by TENT and are not affiliated with our organization." This is the paired claim to the layer `as_asserted_by_mailer`; the two must stay retrievable together.',
      },
      {
        id: 'form_202_filed',
        timestamp: D(2026, 10, 22),
        significance: 0.9,
        certainty: 1.0,
        tags: ['filing', 'court'],
        type: KeyframeType.MILESTONE,
        description:
          'TENT petitioned a Travis County judge for pre-suit discovery to identify unknown defendants.',
      },
      {
        id: 'permit_holder_named',
        timestamp: D(2026, 10, 22),
        significance: 0.9,
        certainty: 1.0,
        tags: ['usps', 'permit'],
        type: KeyframeType.ANNOUNCEMENT,
        description:
          'USPS identified the bulk-mail permit holder as Three Z Printing of Teutopolis, Illinois; permit ownership does not establish who printed or sent the mail.',
      },
      {
        id: 'registered_agent_resigns',
        timestamp: D(2026, 10, 22),
        significance: 0.75,
        certainty: 0.95,
        tags: ['withdrawal'],
        type: KeyframeType.MILESTONE,
        description:
          'Northwest Registered Agent cut ties with the LLC hours after a news crew visited its Sheridan office.',
      },
      {
        id: 'forgery_probe_opened',
        timestamp: D(2026, 10, 22),
        significance: 0.95,
        certainty: 0.9,
        precision: TimePrecision.DAY,
        dateRange: { earliest: D(2026, 10, 22), latest: D(2026, 10, 23) },
        tags: ['criminal_investigation'],
        type: KeyframeType.MILESTONE,
        description:
          'A Republican district attorney in West Texas opened a forgery investigation into the mailers.',
      },
      {
        id: 'short_published',
        timestamp: COMMENTARY_PUBLISHED,
        significance: 0.4,
        certainty: 0.95,
        precision: TimePrecision.SECOND,
        tags: ['commentary', 'verified_metadata'],
        type: KeyframeType.RELEASE,
        description:
          'Texas Paul published "We now know some of the people involved in mailing children fake transgender pamphlets in Texas." (175 s). The ticket carried this as "on or about 2026-10-24" at certainty 0.5; the upload instant is now measured, so the certainty rises and the date is exact.',
      },
      {
        id: 'zarusen_ministry_claim',
        timestamp: COMMENTARY_PUBLISHED,
        significance: 0.2,
        certainty: 0.3,
        precision: TimePrecision.SECOND,
        tags: ['unverified', 'single_source'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Presenter alleged the permit-holding family is affiliated with a Catholic ministry and financed the mailing; uncorroborated.',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: '"Texas Transgender Student Union" mailers (2026)',
    description:
      'A bulk-mail and text campaign impersonating a Texas transgender student resource guide and the Transgender Education Network of Texas, mailed as early voting opened for the 3 November 2026 midterm. The return address resolved to a Wyoming LLC, USPS named a bulk-mail permit holder, TENT filed for pre-suit discovery, and a West Texas DA opened a forgery probe. Authorship and funding remain unresolved.',
    creators: ['Compiled from Texas Tribune, CBS News Texas and contemporaneous reporting'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.82,
    tags: [
      'texas',
      'midterms-2026',
      'disinformation',
      'direct-mail',
      'transgender',
      'tent',
      'contested-authorship',
    ],
    significance:
      'State-level election disinformation with a criminal probe, national conservative amplification and a nonprofit forced to close its public web presence. Significant within its domain, short of a defining cultural moment — hence 0.82, under the 0.9 justification threshold.',
    platform: 'Texas statewide (bulk mail, SMS, social media)',
    externalId: UNIVERSE_ID,
    contentType: 'event record / contested-authorship mailer',

    /**
     * Task 0 demotion. These ids are the ticket's proposed universe ids, kept verbatim
     * so a follow-up can promote them without a second naming pass. They are *not*
     * registered universes: `UniverseType` has no PERSON or ORGANIZATION member and
     * `universe-ids.ts` has no creator for either (james-gibson/local-time#209).
     */
    entities: [
      {
        id: 'organization:transgender_education_network_of_texas',
        kind: 'organization',
        name: 'Transgender Education Network of Texas (TENT)',
        role: 'impersonated; denies authorship and states its branding was co-opted',
        certainty: 0.95,
        registered: false,
      },
      {
        id: 'organization:texas_transgender_student_union_llc',
        kind: 'organization',
        name: '"Texas Transgender Student Union" LLC (Wyoming)',
        role: 'entity named on the return address; registered agent resigned 2026-10-22',
        certainty: 0.8,
        registered: false,
      },
      {
        id: 'organization:three_z_printing',
        kind: 'organization',
        name: 'Three Z Printing, Teutopolis, Illinois',
        role: 'bulk-mail permit holder; permit ≠ printer and ≠ sender',
        certainty: 0.9,
        registered: false,
      },
      {
        id: 'organization:snailworks',
        kind: 'organization',
        name: 'SnailWorks (Maryland)',
        role: 'mail-tracking intermediary; declined to identify its client',
        certainty: 0.9,
        registered: false,
      },
      {
        id: 'organization:northwest_registered_agent',
        kind: 'organization',
        name: 'Northwest Registered Agent (Sheridan, Wyoming)',
        role: 'registered agent; resigned 2026-10-22',
        certainty: 0.9,
        registered: false,
      },
      {
        id: 'organization:national_republican_congressional_committee',
        kind: 'organization',
        name: 'National Republican Congressional Committee',
        role: 'named in the commentary; no independent corroboration in this record',
        certainty: 0.3,
        registered: false,
      },
      {
        id: 'organization:preservation_austin',
        kind: 'organization',
        name: 'Preservation Austin',
        role: 'named in the commentary; no independent corroboration in this record',
        certainty: 0.3,
        registered: false,
      },
      {
        id: 'person:jon_bonck',
        kind: 'person',
        name: 'Jon Bonck',
        role: 'named in coverage as connected to the entity; not re-verified here',
        certainty: 0.5,
        registered: false,
      },
      {
        id: 'person:jeff_leach',
        kind: 'person',
        name: 'Jeff Leach',
        role: 'named in coverage; public officeholder',
        certainty: 0.5,
        registered: false,
      },
      {
        id: 'person:steven_monacelli',
        kind: 'person',
        name: 'Steven Monacelli',
        role: 'named in coverage as a reporter on the mailers',
        certainty: 0.5,
        registered: false,
      },
      {
        id: 'person:ayden_runnels',
        kind: 'person',
        name: 'Ayden Runnels',
        role: 'named in coverage as a reporter on the mailers',
        certainty: 0.5,
        registered: false,
      },
      {
        id: 'organization:newman_ministries',
        kind: 'organization',
        name: 'Newman Ministries (as described: a Catholic ministry)',
        role: 'HELD — single-source claim in the commentary; no corroboration',
        certainty: 0.3,
        registered: false,
        held: true,
      },
      {
        id: 'person:bill_zarusen',
        kind: 'person',
        name: 'Bill Zarusen',
        role: 'HELD — single-source claim in the commentary; no corroboration',
        certainty: 0.3,
        registered: false,
        held: true,
      },
      {
        id: 'person:matt_zarusen',
        kind: 'person',
        name: 'Matt Zarusen',
        role: 'HELD — single-source claim in the commentary; no corroboration',
        certainty: 0.3,
        registered: false,
        held: true,
      },
    ],

    /**
     * The video against the record, per the ticket's reconciliation table. Kept as data
     * because each row is a correction the next reader would otherwise re-make.
     */
    claims: [
      {
        video: '"SNL Works", tracking deliveries, refused to say who its customer was',
        record: 'SnailWorks, a Maryland mail-tracking company; provides scan visibility, does not print, send or rent lists; declined to identify customers',
        handling: 'name corrected; "declined to identify client" retained, attributed',
        status: 'corrected',
      },
      {
        video: '"3Z Printing … Two Toplas, Illinois"',
        record: 'Three Z Printing, Teutopolis, Illinois — holds the bulk-mail permit; holding a permit does not establish printing or sending',
        handling: 'name and place corrected; "printed the pamphlets" is not encoded as fact',
        status: 'corrected',
      },
      {
        video: '"Bill Zarusen and his two sons, including Matt Zarusen"; "Newman ministries, a Catholic ministry"; MAGA-themed wedding cake',
        record: 'single-source, video only; no corroboration located',
        handling: 'certainty 0.3, tagged unverified, held out of any keyframe at significance ≥ 0.5',
        status: 'held',
      },
    ],

    openQuestions: [
      {
        question: 'Who is the presenter of siS5HR_tjtU?',
        status: 'resolved 2026-10-26',
        answer:
          'Texas Paul (@TheRealTexasPaul). Verified from the video\'s own metadata (oEmbed author_name and watch-page ownerChannelName), which the ticket allowed as the only acceptable route.',
      },
      {
        question: 'Founding dates and legal form for TENT, Three Z Printing, SnailWorks and the NRCC',
        status: 'open — blocking for any period universe',
        note: 'Left as entities with no epochs rather than inventing a founding year.',
      },
      {
        question: 'Corroboration of the Zarusen family and Newman Ministries claims',
        status: 'open — held at certainty 0.3',
        note: 'Two independent sources required before promotion; see #209.',
      },
      {
        question: 'Exact timestamps for LLC formation, Form 202 filing, USPS identification and the Short publish time',
        status: 'partly resolved',
        note: 'The Short is now exact (2026-10-24T14:40:22Z). The LLC formation stays a date range ("early September"), and the filing and USPS dates are carried at day precision from reporting.',
      },
      {
        question: 'Who paid for the mailing or the permit use?',
        status: 'open — unanswered in every source reviewed',
        note: 'The question is recorded as a keyframe; the answer is not asserted.',
      },
    ],

    verification: {
      performed: '2026-10-26',
      instruments: [
        'YouTube oEmbed endpoint — title, author_name, author_url',
        'YouTube watch-page metadata — uploadDate, lengthSeconds, viewCount, ownerChannelName',
        'Ticket sources [^1]-[^7] as compiled; no re-fetch of those articles in this pass',
      ],
      resolved: [
        'Channel is Texas Paul (@TheRealTexasPaul); the presenter is no longer unattributed',
        'Title, publication instant (2026-10-24T14:40:22Z) and duration (175 s) are measured, not inferred',
        'The proposed spine id was reconciled against three existing anchors',
      ],
      limits: [
        'The commentary transcript was not re-transcribed from audio; the claim wording is the ticket\'s.',
        'No court docket, USPS statement or filing was read directly; those dates are day-precision from reporting.',
        'The articles themselves were not re-fetched in this pass.',
      ],
    },

    uncertaintyNotes: [
      'Authorship is contested, not unknown. TENT denies involvement; the LLC and permit holder are identified; the payer is not.',
      'The permit holder is an intermediary position in the mail chain, not an author. Do not collapse "holds the permit" into "sent the mail".',
      'The named family and ministry in the commentary are held at certainty 0.3 and must not be restated as findings.',
      'Early-voting timing is from reporting, not from a secretary-of-state record read here.',
      'The reconstruction layer is the pamphlet\'s claim, at accuracy 0.05. It is not a second account of the event.',
      'The DA probe is a phase, not a verdict; the forgery question is open.',
    ],

    sourcing: {
      recorded: [
        'Mailer timing, return address and TENT denial: Texas Tribune, 2026-10-20',
        'Petition, permit holder and Wyoming registration: CBS News Texas',
        'Forgery probe: Texas Tribune, 2026-10-23',
        'Commentary metadata: YouTube public metadata, read 2026-10-26',
      ],
      notRecorded: [
        'The court docket entry for the Rule 202 petition',
        'The USPS statement in its own words',
        'The pamphlet itself as an artefact; every quoted line is from reporting, not from the piece',
        'Any payment record or vendor invoice',
      ],
    },
  },

  connections: {
    natural: {
      parentUniverses: [
        CommonUniverseIds.US_HISTORY,
        CommonUniverseIds.US_ELECTION_CYCLE,
      ],
    },
    references: [
      {
        type: 'DOCUMENTS',
        targetUniverseId: TRANSCRIPT_ID,
        confidence: 0.95,
        description:
          'The chapter in which the pamphlet is read aloud on air, with the addressee field and the return address transcribed at clip resolution.',
        evidence: ['ten audited utterances at clip 01:07-01:36 in the transcript record'],
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: COMMENTARY_ID,
        confidence: 0.9,
        description:
          'The commentary work that reported the identification and made the uncorroborated family claim.',
        evidence: ['verified channel, title and publication instant'],
      },
    ],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#207. */
export const texasTtsuMailersUniverses: Universe[] = [texasTtsuMailersUniverse];
