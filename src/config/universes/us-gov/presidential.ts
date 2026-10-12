import { Universe, UniverseType, TimePrecision } from '../../../core/types';
import { PoliticalParty, ElectionRecord, ElectionIssueData } from './election-types';
import { US_ELECTION_RECORDS } from './elections-data';
import { ELECTION_ISSUE_DATA } from './election-issues';

/**
 * Every U.S. presidential election, as Universes.
 *
 * local-time#6. The issue asked for seven elections (1860, 1932, 1968, 1980, 2000,
 * 2008, 2016) plus a longitudinal list of recurring issues. This module previously
 * held only six elections (1789, 1792, 1796, 1800, 2020, 2024) and carried no notion
 * of issues at all; the series is now complete at sixty.
 *
 * See `elections-data.ts` for how the dates and candidates were obtained, and
 * `election-issues.ts` for the issues half of the issue.
 */

const NS_PER_MS = 1_000_000n;
const DAY_NS = 86_400_000n * 1_000_000n;
const isoToMs = (iso: string): number => {
    const [y, m, d] = iso.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
};

/**
 * Build a Universe for one U.S. presidential election.
 *
 * The epoch spans the **voting period**, not a single day. Fifteen of the sixty
 * elections in the series — every one up to and including 1844 — ran for weeks, and
 * the first ran across a calendar-year boundary. A fixed 24-hour window, which is what
 * this function used before #6, misstates a quarter of the series.
 */
export const createElectionUniverse = (
    record: ElectionRecord,
    culturalSignificance: number = 0.7
): Universe => {
    const year = record.year;
    const yearString = String(year);
    const opensMs = isoToMs(record.votingOpens);
    const closesMs = isoToMs(record.votingCloses);
    const startTime = BigInt(opensMs) * NS_PER_MS;
    const endTime = BigInt(closesMs + 24 * 60 * 60 * 1000) * NS_PER_MS;

    const winner = record.candidates.find(
        c => c.role === 'Presidential' && c.status === 'Winner',
    );
    const politicalLandscape = [
        ...new Set(record.candidates.map(c => c.party).filter((p): p is PoliticalParty => p !== null)),
    ];

    const issueData = ELECTION_ISSUE_DATA[String(year)];

    return {
        universeId: `history:us_election:${record.idYear}`,
        type: UniverseType.HISTORICAL_EVENT,
        epochs: undefined,
        identifiers: {
            // Previously `event:us_election:<year>`, which disagreed with the universeId
            // namespace. `event:` is not a domain in UNIVERSE_ID_PATTERNS; it only ever
            // validated through ANY_YEAR_TERMINATED.
            primary: `history:us_election:${record.idYear}`,
            aliases: [`us_presidential_election_${yearString}`],
        },
        realityRelation: {
            type: 'documentary',
            fictionalizationDegree: 0.0,
            realityAnchors: [],
        },
        attribution: {
            public_domain: true,
            sources: [
                "Wikipedia — <year> United States presidential election (infobox)",
                "US National Archives",
                "Federal Election Commission",
                "Britannica",
                "270toWin",
            ],
            citations_required: false,
        },
        layers: [
            {
                layerId: "election_event",
                type: 'primary',
                epochs: {
                    election_period: {
                        epochId: `election:${yearString}:voting_period`,
                        startTime,
                        endTime,
                        precision: TimePrecision.DAY,
                        description: `US Presidential Election of ${yearString}`,
                    },
                },
            },
        ],
        temporalStructure: {
            segments: [],
            keyframes: [
                {
                    id: `election_day_${yearString}`,
                    // The outcome is decided when voting closes, so the keyframe sits at
                    // the end of the span rather than the start.
                    timestamp: BigInt(closesMs) * NS_PER_MS,
                    significance: 1.0,
                    tags: [
                        "election",
                        "us_history",
                        "politics",
                        `year_${yearString}`,
                        ...(closesMs > opensMs ? ["multi_day_voting"] : []),
                    ],
                    certainty: 1.0,
                },
            ],
            windows: {
                strategy: 'point_in_time',
            },
        },
        metadata: {
            canonicalName: `US Presidential Election of ${yearString}`,
            creators: ["American Electorate"],
            released: new Date(opensMs),
            cultural_significance: culturalSignificance,
            winner: winner ? winner.name : 'Unknown',
            candidates: record.candidates,
            politicalLandscape: politicalLandscape,
            // The span is metadata as well as structure: a consumer reading the JSON
            // export has no other way to learn that 1792 voting lasted 34 days.
            votingOpens: record.votingOpens,
            votingCloses: record.votingCloses,
            votingDurationDays: Math.round((closesMs - opensMs) / 86_400_000) + 1,
            ...(issueData
                ? {
                    issues: issueData.issues,
                    losingPartyAnalysis: issueData.analysis,
                    issueProvenance: issueData.provenance,
                    issueCertainty: issueData.certainty,
                }
                : {}),
        },
    } as unknown as Universe;
};

/**
 * Cultural significance by election. Heavier where the result reshaped the party
 * system, lighter for uncontested or foregone conclusions.
 */
const CULTURAL_SIGNIFICANCE: Record<number, number> = {
    1788: 1.0, 1800: 1.0, 1824: 0.9, 1860: 1.0, 1864: 1.0, 1876: 0.9,
    1896: 0.9, 1912: 0.9, 1932: 1.0, 1960: 1.0, 1968: 0.9, 1980: 1.0,
    2000: 1.0, 2008: 1.0, 2016: 1.0, 2020: 1.0, 2024: 1.0,
};

/** All sixty U.S. presidential elections, 1788-89 through 2024. */
export const presidentialElectionUniverses: Universe[] = US_ELECTION_RECORDS.map(record =>
    createElectionUniverse(record, CULTURAL_SIGNIFICANCE[record.year] ?? 0.7),
);

export { US_ELECTION_RECORDS };
export { DAY_NS };

// Re-exported so `us-gov/index.ts`'s `export * from './presidential'` keeps resolving
// the enum and the shapes to their historical import path.
export { PoliticalParty };
export type {
    Candidate,
    ElectionRecord,
    RecurringIssue,
    ElectionIssueData,
    IssueProvenance,
} from './election-types';