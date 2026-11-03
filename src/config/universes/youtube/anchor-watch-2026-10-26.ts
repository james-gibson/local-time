import {
  KeyframeType,
  RealityAnchor,
  TimePrecision,
  UniverseReference,
  UniverseType,
} from '../../../core/types';
import { createSeriesUniverseId } from '../../../core/universe-ids';
import { IRAN_WAR_2026_ID } from '../global-politics/iran-war';
import { ISRAELI_ELECTION_2026_ID } from '../global-politics/israeli-election-2026';
import { RUSSIA_UKRAINE_WAR_2022_ID } from '../global-politics/russia-ukraine-war';
import { FORTRESS_PROGRAM_2026_ID } from '../us-politics/fortress';
import { ANCHOR_WATCH_SERIES_ID } from './anchor-watch';

/**
 * Anchor Watch with Bobby Jones — "Bobby Jones ERUPTS Over Hegseth: 'It's Personal.'"
 *
 * The 2026-10-26 episode: a 55:52 single continuous two-host rundown, streamed live at
 * 8 PM ET. Its shape is a personal statement about Hegseth, a morale survey, a
 * slide-driven conflict timeline, then a forecast segment. Its received subject is
 * Hegseth and the state of the US military; its actual content is a run of factual
 * claims about the war fronts, each of which is recorded in the discussion-point
 * ledger and scored separately from the host's framing.
 *
 * THE WORK IS THE UNIT. This models the episode, not the events it discusses. Every
 * keyframe is addressed on the episode's own clock (air instant + offset), and every
 * description is what the show says at that point. The four events it reports on —
 * the Iran war, the Israeli election, FORTRESS, the Russia–Ukraine war — are now
 * landed as their own historical universes (james-gibson/local-time#212 Phase 2), so
 * the episode links to them via resolved `realityAnchors` and `connections.references`
 * (including a `contradicts` anchor and `CONTRADICTS` reference on FORTRESS for D19).
 *
 * ID. `series:bobby_jones_erupts_over_hegseth:2026`, produced by
 * `createSeriesUniverseId('series', SLUG, 2026)`. The ticket proposed
 * `series:anchor_watch:bobby_jones_erupts_over_hegseth:2026` — four segments, which only
 * the `ANY_YEAR_TERMINATED` catch-all accepts (#57). The hierarchy is expressed with
 * more ids, not more segments: the program is `series:anchor_watch:2026` and this
 * episode is a member of it (`parentUniverses`).
 *
 * TIME BASE. Air instant 2026-10-26 (Q1: exact upload_timestamp still needs yt-dlp; the
 * date rests on three cues — "eight days out from the midterms", "tomorrow's the
 * election", "after next Tuesday"). Runtime 3352 s (55:52, last caption line "See you
 * next"). Keyframes are absolute instants inside that epoch.
 *
 * LEDGER. The 25 discussion points below carry the pass-1/pass-2 hydration status.
 * Predictions (D22, D23) are `excluded`, never laundered into facts. The six deltas from
 * the hydration pass are applied: the two corrected keyframe timestamps, D09 downgraded
 * to contested, D12 and D14 split (recorded in their notes), and D19 recorded as an
 * interpretation with a `contradicts` anchor and `CONTRADICTS` reference against
 * `history:fortress:2026`.
 */

export const ANCHOR_WATCH_EPISODE_ID = createSeriesUniverseId(
  'series',
  'bobby_jones_erupts_over_hegseth',
  2026,
);

/** Air instant. Q1: refine against `upload_timestamp` with yt-dlp before claiming 0.95. */
export const AIR_START_UTC_NS = BigInt(Date.UTC(2026, 9, 26, 0, 0)) * 1_000_000n;

/** 55:52 — the last caption line ("See you next"). */
export const RUNTIME_SECONDS = 3352;

const NS_PER_SECOND = 1_000_000_000n;

/** A runtime offset on the episode's own clock: air instant + mm:ss. */
const at = (mmss: string): bigint => {
  const [m, s] = mmss.split(':').map(Number);
  return AIR_START_UTC_NS + BigInt(m * 60 + s) * NS_PER_SECOND;
};

/* ------------------------------------------------------------------ *
 * Reality anchors & references — hydrated in Phase 2 (#212)
 * ------------------------------------------------------------------ */

/**
 * A reality anchor whose target is an address, not yet a universe (#431). All four
 * Phase-2 targets (`history:iran_war:2026`, `history:israeli_legislative_election:2026`,
 * `history:fortress:2026`, `history:russia_ukraine_war:2022`) are now authored and
 * registered, so the presumed queue is empty and `anchorWatchRealityAnchors` holds the
 * resolved links.
 */
export type PresumedAnchor = RealityAnchor & { hydration: 'presumed' };

export const anchorWatchPresumedAnchors: PresumedAnchor[] = [];

export const anchorWatchRealityAnchors: RealityAnchor[] = [
  {
    realEventId: IRAN_WAR_2026_ID,
    relationshipType: 'documents',
    confidence: 0.95,
    evidence: [
      'Episode conflict-timeline segment 14:31–19:19',
      'Wikipedia: 2026 Iran war (start 28 Feb 2026)',
    ],
  },
  {
    realEventId: ISRAELI_ELECTION_2026_ID,
    relationshipType: 'documents',
    confidence: 0.9,
    evidence: [
      'Episode 19:19 "tomorrow\'s the election"',
      'Reuters election-day guide, 26 Oct 2026',
    ],
  },
  {
    realEventId: FORTRESS_PROGRAM_2026_ID,
    relationshipType: 'contradicts',
    confidence: 0.85,
    evidence: [
      'Episode 44:09 reading of FORTRESS as an admission that US bases can be isolated and the US is no longer a superpower',
      'DoD FORTRESS fact sheet, 30 Sep 2026 (scope is US homeland installations operating 90 days off-grid)',
    ],
  },
  {
    realEventId: RUSSIA_UKRAINE_WAR_2022_ID,
    relationshipType: 'documents',
    confidence: 0.9,
    evidence: [
      'Episode 16:05 drone-strike account',
      'Ukrainian Air Force daily bulletins',
    ],
  },
];

export const anchorWatchReferences: UniverseReference[] = [
  {
    type: 'DOCUMENTS',
    targetUniverseId: IRAN_WAR_2026_ID,
    description:
      'Conflict-timeline briefing (14:31–19:19), Strait of Hormuz / East–West pipeline coverage (23:08–34:00), and Mecca Joint Defence Agreement discussion (36:39).',
  },
  {
    type: 'DOCUMENTS',
    targetUniverseId: ISRAELI_ELECTION_2026_ID,
    description:
      'Eve-of-election analysis (19:19–23:08) covering the 27 October 2026 26th Knesset election and the reported Netanyahu–Zamir confrontation.',
  },
  {
    type: 'CONTRADICTS',
    targetUniverseId: FORTRESS_PROGRAM_2026_ID,
    description:
      'D19 (44:09): reads the Department of War FORTRESS domestic off-grid installation-resilience directive as evidence of lost overseas superpower reach.',
  },
  {
    type: 'DOCUMENTS',
    targetUniverseId: RUSSIA_UKRAINE_WAR_2022_ID,
    description:
      'Reports the overnight 24–25 October 2026 153-drone barrage (16:05) and the November 2026 Abu Dhabi trilateral talks (23:29).',
  },
];

/* ------------------------------------------------------------------ *
 * The discussion-point ledger (the deliverable)
 * ------------------------------------------------------------------ */

/**
 * One claim as heard, scored independently of the host's framing. `verification.status`
 * is the pass-1 hydration state; `instrument` names what settled it (kagi.md #434).
 */
export const anchorWatchDiscussionPoints = [
  { id: 'D01', at: '—', claimKind: 'derived', certainty: 0.9, text: 'Episode aired 2026-10-26.',
    verification: { status: 'derived', instrument: 'three cues: "eight days out from the midterms", "tomorrow we\'ll see what happens in Israel", "after next Tuesday"', note: 'needs yt-dlp upload_timestamp for 0.95' } },
  { id: 'D02', at: '1:05', claimKind: 'testimony', certainty: 0.7, text: 'USNA class of 2001, 25th reunion.',
    verification: { status: 'self_report', instrument: 'Substack bio "USNA \'01"; captions', note: 'self-report, capped at 0.7' } },
  { id: 'D03', at: '11:27', claimKind: 'characterization', certainty: null, text: 'Hegseth "did not meet milestones… they booted him".',
    verification: { status: 'contested', instrument: 'AP/CBS/Newsweek: removed from the 2021 inauguration detail over tattoos/extremism', note: '"milestones" framing is not in the record' } },
  { id: 'D04', at: '11:41', claimKind: 'fact', certainty: 0.6, text: 'Hegseth attended Princeton and Harvard.',
    verification: { status: 'confirmed_low_risk', instrument: 'captions', note: 'university/alumni record would settle' } },
  { id: 'D05', at: '42:15', claimKind: 'fact', certainty: null, text: '15 US bases "not even operational".',
    verification: { status: 'attributed_unresolved', instrument: 'McCaffrey: "probably permanently lost 15 Persian Gulf bases"; DoD watchdog: hundreds of buildings damaged', note: 'count is a retired general\'s figure; damage is documented' } },
  { id: 'D06', at: '6:45', claimKind: 'reported_fact', certainty: null, text: 'Abraham Lincoln crew ran out of food, told to use last rations.',
    verification: { status: 'reported_and_denied', instrument: 'Navy mess-deck photos (denial); continuing reporting', note: 'show\'s own hedge: "we don\'t even know that\'s the right number"' } },
  { id: 'D07', at: '9:00', claimKind: 'fact', certainty: 0.85, text: 'Family housing funding ends 30 Nov.',
    verification: { status: 'confirmed', instrument: 'DoD "Termination of Ordered Departure – Bahrain" memo; payments stop Nov 30' } },
  { id: 'D08', at: '16:05', claimKind: 'fact', certainty: 0.9, text: '153 drones, 119 downed, night of 24–25 Oct.',
    verification: { status: 'confirmed', instrument: 'Ukrainian Air Force / Ukrinform: 119 of 153 neutralized' } },
  { id: 'D09', at: '21:51', claimKind: 'fact', certainty: 0.3, text: 'four killed, 22 injured.',
    verification: { status: 'contested', instrument: 'wire reporting for that night', note: 'wire copy reports one death (Kharkiv); caption truncated at "22 in the region"' } },
  { id: 'D10', at: '16:16', claimKind: 'fact', certainty: 0.85, text: 'Houthis attacking Riyadh.',
    verification: { status: 'confirmed', instrument: 'Reuters 26 Oct: Houthis claim attacks on Riyadh airport and East–West pumping stations' } },
  { id: 'D11', at: '16:30', claimKind: 'reported_fact', certainty: 0.85, text: 'US strike plan "ready within 96 hours".',
    verification: { status: 'confirmed_reported', instrument: 'CNN (two US officials): ready within 96 hours of a Trump order' } },
  { id: 'D12', at: '17:14', claimKind: 'reported_fact', certainty: null, text: 'IDF chief refused and the leak was deliberate.',
    verification: { status: 'partially_confirmed', instrument: 'Channel 12 report of Zamir resisting a Netanyahu order; Netanyahu and defense minister denied a rift', note: 'split: idf_confrontation_reported (confirmed) vs leak_was_deliberate (unverified)' } },
  { id: 'D13', at: '23:29', claimKind: 'fact', certainty: 0.85, text: 'Trilateral talks in November; Witkoff and Kushner leading.',
    verification: { status: 'confirmed_scheduled', instrument: 'Reuters/Axios: Abu Dhabi Russia–US–Ukraine talks Nov 10-11, Witkoff and Kushner to lead' } },
  { id: 'D14', at: '26:53', claimKind: 'fact', certainty: 0.45, text: '"$118 for crude, $101 regular".',
    verification: { status: 'approximate_contradicted', instrument: 'Brent settled $115.81 on 23 Oct, $115.22–115.41 on 26 Oct; WTI ~$101–103', note: 'split: Brent overstated ~$2; "$101" consistent with WTI' } },
  { id: 'D15', at: '28:07', claimKind: 'fact', certainty: 0.8, text: 'East–West pipeline already shut, now a target.',
    verification: { status: 'confirmed', instrument: 'Saudi shut pipeline 11 Sep, halted again 5 Oct', note: 'Oct 26 pumping-station strikes are Houthi-claimed' } },
  { id: 'D16', at: '31:04', claimKind: 'quote', certainty: 0.9, text: 'Iran: "never back to pre-war conditions".',
    verification: { status: 'confirmed', instrument: 'IRGC Navy and Speaker Ghalibaf statements' } },
  { id: 'D17', at: '38:32', claimKind: 'fact', certainty: 0.9, text: 'War began 27/28 February.',
    verification: { status: 'confirmed', instrument: 'Initiated 28 Feb 2026 by US and Israel', note: 'show\'s "February 27th" is the eve; treat as one date, 28 Feb' } },
  { id: 'D18', at: '36:39', claimKind: 'fact_framing', certainty: 0.85, text: 'Saudi–Turkey–Pakistan "limited NATO".',
    verification: { status: 'confirmed_pact_contested_framing', instrument: 'Mecca Joint Defence Agreement, signed 7 Aug 2026', note: '"limited NATO" is the speaker\'s analogy, not the text' } },
  { id: 'D19', at: '44:09', claimKind: 'interpretation', certainty: 0.5, text: 'FORTRESS = bases survive 90 days unsupported → US no longer a superpower.',
    verification: { status: 'program_confirmed_reading_contested', instrument: 'DoD FORTRESS fact sheet, 30 Sep 2026', note: 'scope is US installations off-grid; the inference is the speaker\'s — contradicts candidate against history:fortress:2026' } },
  { id: 'D20', at: '9:37', claimKind: 'fact', certainty: 0.9, text: 'Pentagon wants "Department of War" written into law.',
    verification: { status: 'confirmed', instrument: 'Pentagon pressing Congress to codify in FY27 NDAA' } },
  { id: 'D21', at: '52:26', claimKind: 'anecdote', certainty: 0.85, text: 'Eisenhower\'s WWII globe was dropped and smashed.',
    verification: { status: 'confirmed', instrument: 'WaPo 22 Oct (photos of the gash); NBC; Snopes' } },
  { id: 'D22', at: '35:52', claimKind: 'prediction', certainty: null, text: 'Major escalation after the midterms.',
    verification: { status: 'excluded', instrument: null, note: 'prediction, not a claim about the world' } },
  { id: 'D23', at: '37:04', claimKind: 'prediction', certainty: null, text: 'Hormuz transit toll from Feb 2027 ("Trump tax").',
    verification: { status: 'excluded', instrument: null, note: 'prediction, not a claim about the world' } },
  { id: 'D24', at: '54:44', claimKind: 'fact', certainty: 0.85, text: 'Veterans running in unusually high numbers.',
    verification: { status: 'confirmed', instrument: 'With Honor Action: 752 veterans, all 50 states, +47% vs 2024' } },
  { id: 'D25', at: '0:11', claimKind: 'asr_artifact', certainty: 0.9, text: 'Co-host "Sam Alerhalt".',
    verification: { status: 'probable_asr_error', instrument: 'Sam Osterhout, executive producer and co-host', note: 'caption re-pass would confirm' } },
];

export const anchorWatchSegments = [
  { id: 'cold_open_checkin',            start: '0:00',  end: '0:56' },
  { id: 'reunion_statement',            start: '0:56',  end: '5:47' },
  { id: 'morale_survey',                start: '5:47',  end: '9:35' },
  { id: 'dow_rename_and_bases',         start: '9:35',  end: '14:31' },
  { id: 'conflict_timeline_briefing',   start: '14:31', end: '19:19' },
  { id: 'israel_election_analysis',     start: '19:19', end: '23:08' },
  { id: 'ukraine_and_hormuz_fronts',    start: '23:08', end: '29:59' },
  { id: 'release_valve',                start: '29:59', end: '34:00' },
  { id: 'post_midterm_prediction',      start: '34:00', end: '39:35' },
  { id: 'divided_government',           start: '39:35', end: '44:00' },
  { id: 'fortress_and_threat_picture',  start: '44:00', end: '50:36' },
  { id: 'closing_hope',                 start: '50:36', end: '55:52' },
];

interface AnchorKeyframe {
  id: string;
  timestamp: string;
  significance: number;
  type?: KeyframeType;
  tags: string[];
  description: string;
}

export const anchorWatchKeyframes: AnchorKeyframe[] = [
  { id: 'show_open', timestamp: '0:56', significance: 0.30, type: KeyframeType.ANNOUNCEMENT, tags: ['show_open', 'rundown'], description: 'The show opens with Jones checking in and setting the week\'s rundown.' },
  { id: 'reunion_25th_usna', timestamp: '1:05', significance: 0.60, type: KeyframeType.PUBLIC_STATEMENT, tags: ['personal_testimony', 'usna', 'class_2001'], description: 'Jones recounts his USNA class of 2001, 25th reunion.' },
  { id: 'its_personal', timestamp: '3:06', significance: 0.75, type: KeyframeType.PUBLIC_STATEMENT, tags: ['hegseth', 'military_personnel', 'advocacy'], description: 'Jones converts a personal reunion grievance into an on-air demand that Hegseth be removed.' },
  { id: 'impeach_call_to_action', timestamp: '5:54', significance: 0.65, type: KeyframeType.PUBLIC_STATEMENT, tags: ['call_to_action', 'impeachment'], description: 'Jones calls for Hegseth\'s impeachment on air.' },
  { id: 'morale_low_across_chain', timestamp: '6:32', significance: 0.60, tags: ['morale', 'readiness'], description: 'Jones describes low morale reported across the chain of command.' },
  { id: 'lincoln_supply_account', timestamp: '6:45', significance: 0.70, tags: ['uss_abraham_lincoln', 'logistics'], description: 'The Abraham Lincoln crew reportedly ran out of food and were told to use last rations.' },
  { id: 'family_housing_funding_nov30', timestamp: '9:00', significance: 0.65, tags: ['families', 'evacuation', 'deadline'], description: 'Jones states family housing funding ends 30 November.' },
  { id: 'dow_rename_demand', timestamp: '9:37', significance: 0.50, type: KeyframeType.PUBLIC_STATEMENT, tags: ['department_of_war', 'legislation'], description: 'Jones says the Pentagon wants "Department of War" written into law.' },
  { id: 'four_timelines', timestamp: '15:02', significance: 0.60, tags: ['timeline', 'midterms', 'israel'], description: 'Jones lays out four timelines: the midterms, Israel, Ukraine and Iran.' },
  { id: 'russia_153_drones', timestamp: '16:05', significance: 0.70, type: KeyframeType.MILESTONE, tags: ['ukraine', 'drones', '24-25_oct'], description: 'Overnight 24–25 October strike of 153 drones across Ukraine, 119 reported downed.' },
  { id: 'netanyahu_war_for_power', timestamp: '16:41', significance: 0.70, tags: ['israel', 'analysis'], description: 'Jones frames Netanyahu as waging a war for power.' },
  { id: 'idf_leak_claim', timestamp: '17:14', significance: 0.65, tags: ['idf', 'claim', 'leak'], description: 'Jones claims the IDF chief refused an order and the leak was deliberate.' },
  { id: 'suspend_election_warning', timestamp: '19:22', significance: 0.60, tags: ['prediction', 'israel'], description: 'Jones warns of an election-suspension risk in Israel.' },
  { id: 'oil_price_claim', timestamp: '26:53', significance: 0.50, tags: ['oil', 'hormuz', 'economy'], description: 'Jones cites crude at $118 and regular at $101 a barrel.' },
  { id: 'east_west_pipeline_target', timestamp: '28:07', significance: 0.60, tags: ['pipeline', 'iran', 'infrastructure'], description: 'Jones says the East–West pipeline is already shut and now a target.' },
  { id: 'post_midterm_escalation_forecast', timestamp: '35:50', significance: 0.55, tags: ['prediction', 'iran_war'], description: 'Jones forecasts a major escalation after the midterms.' },
  { id: 'fortress_90_day_reading', timestamp: '44:09', significance: 0.70, tags: ['fortress', 'readiness', 'interpretation'], description: 'Jones reads FORTRESS as an admission that US bases can be isolated — a contested interpretation of a domestic-resilience program.' },
  { id: 'eisenhower_globe', timestamp: '52:26', significance: 0.55, tags: ['anecdote', 'pentagon'], description: 'Jones closes with the anecdote of Eisenhower\'s WWII globe being dropped and smashed.' },
];

const asrNormalizations = {
  'Hex|Hexath|Hegsath|Hex Seth': 'Hegseth',
  'Zalinsky|Zalinski': 'Zelensky',
  'straight of our moves|straight of her moves': 'Strait of Hormuz',
  'bambal straight': 'Bab al-Mandab',
  Whitoff: 'Witkoff',
  Bessant: 'Bessent',
  Riad: 'Riyadh',
  'MS Now': 'MSNBC',
  Alerhalt: 'Osterhout (probable)',
};

export const anchorWatchHegseth20261026Universe = {
  universeId: ANCHOR_WATCH_EPISODE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: ANCHOR_WATCH_EPISODE_ID,
    aliases: [
      'anchor_watch_2026_10_26',
      'Bobby Jones ERUPTS Over Hegseth: "It\'s Personal."',
      'youtube:c8P8mP-v9Hc',
    ],
  },

  realityRelation: {
    type: 'documentary' as const,
    fictionalizationDegree: 0.0,
    realityAnchors: anchorWatchRealityAnchors,
  },

  attribution: {
    copyright: { holders: ['Lincoln Square Productions'], year: 2026, status: 'active' as const },
    public_domain: false,
    citations_required: true,
    usage_restrictions: [
      'Quote with timestamp; do not re-host audio.',
      'Opinion and prediction must not be re-published as fact.',
    ],
    sources: [
      'Episode transcript (auto-generated captions), timestamped 0:00–55:52',
      'Anchor Watch with Bobby Jones, show/playlist page (host, cadence, producer)',
      'Ukrainian Air Force / Ukrainska Pravda release, 25 Oct 2026 (153 drones, 119 downed)',
      'Wikipedia, "2026 Iran war" (start 28 Feb 2026; Strait of Hormuz closure)',
      'Newsweek / Snopes, 26 Oct 2026 (FORTRESS, 90-day self-sufficiency)',
    ],
  },

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary' as const,
      epochs: {
        episode_air: {
          epochId: 'anchor_watch:2026-10-26:air',
          startTime: AIR_START_UTC_NS,
          endTime: at('55:52'),
          precision: TimePrecision.SECOND,
          description: 'Single continuous live stream, 55:52.',
        },
      },
    },
  ],
  epochs: {
    episode_air: {
      epochId: 'anchor_watch:2026-10-26:air',
      startTime: AIR_START_UTC_NS,
      endTime: at('55:52'),
      precision: TimePrecision.SECOND,
      description: 'Single continuous live stream, 55:52.',
    },
  },

  temporalStructure: {
    segments: anchorWatchSegments.map((segment) => ({
      id: segment.id,
      start: at(segment.start),
      end: at(segment.end),
      type: 'sequence' as const,
      status: 'active' as const,
    })),
    keyframes: anchorWatchKeyframes.map((keyframe) => ({
      id: keyframe.id,
      timestamp: at(keyframe.timestamp),
      significance: keyframe.significance,
      type: keyframe.type,
      tags: [...keyframe.tags],
      description: keyframe.description,
    })),
    windows: { strategy: 'time_based' as const, avgWindowSize: 300n },
  },

  connections: {
    natural: {
      parentUniverses: [ANCHOR_WATCH_SERIES_ID],
    },
    references: anchorWatchReferences,
  },

  metadata: {
    canonicalName: 'Bobby Jones ERUPTS Over Hegseth: "It\'s Personal."',
    creators: ['Bobby Jones', 'Sam Osterhout'],
    released: new Date(Date.UTC(2026, 9, 26)),
    cultural_significance: 0.35,
    runtimeSeconds: RUNTIME_SECONDS,
    recordingType: 'live_stream',
    asrNormalizations,
    threadSiblings: [] as string[],
    presumed: anchorWatchPresumedAnchors.map((anchor) => ({
      realEventId: anchor.realEventId,
      hydration: anchor.hydration,
      note: 'Author the universe, then remove this entry — the suite fails while a presumed id is registered.',
    })),
    discussionPoints: anchorWatchDiscussionPoints,
  },
};
