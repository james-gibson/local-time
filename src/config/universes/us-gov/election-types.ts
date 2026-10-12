/**
 * Shared vocabulary for the U.S. presidential election series (local-time#6).
 *
 * This module exists to break an import cycle. `elections-data.ts` needs the
 * `PoliticalParty` enum as a *value* at module-evaluation time, and
 * `presidential.ts` needs `elections-data.ts` as a value too, so declaring the enum
 * in `presidential.ts` made that file read an enum still in its temporal dead zone —
 * `TypeError: Cannot read properties of undefined (reading 'INDEPENDENT')`. Types and
 * enums with no imports of their own live here; both data modules import from here,
 * and only `presidential.ts` imports both.
 */

/**
 * Political party affiliations appearing on U.S. presidential ballots.
 *
 * The nine members marked "added for #6" have no counterpart in the 1976-2024 span the
 * enum was originally written against. They are all nineteenth-century parties that
 * folded or renamed before the modern two-party system: the Free Soil Party
 * (1848-1856), the American Party of 1856, the Nullifier Party of 1832, the
 * Anti-Masonic Party of 1832, the Liberal Republican Party of 1872, the short-lived
 * National Union Party of 1864, and the Northern and Southern wings of the Democrats
 * after the 1860 split.
 */
export enum PoliticalParty {
    // Early Republic
    FEDERALIST = "Federalist",
    DEMOCRATIC_REPUBLICAN = "Democratic-Republican",
    // Jacksonian Era
    DEMOCRATIC = "Democratic",
    WHIG = "Whig",
    NATIONAL_REPUBLICAN = "National Republican",
    // Civil War Era
    REPUBLICAN = "Republican",
    CONSTITUTIONAL_UNION = "Constitutional Union",
    NATIONAL_UNION = "National Union",              // added for #6 — 1864 only
    NORTHERN_DEMOCRATIC = "Northern Democratic",    // added for #6 — 1860
    SOUTHERN_DEMOCRATIC = "Southern Democratic",    // added for #6 — 1860
    FREE_SOIL = "Free Soil",                         // added for #6 — 1848-1856
    LIBERAL_REPUBLICAN = "Liberal Republican",       // added for #6 — 1872
    // Minor parties of the 1820s-1830s
    NULLIFIER = "Nullifier",                         // added for #6 — 1832
    ANTI_MASONIC = "Anti-Masonic",                   // added for #6 — 1832
    // Gilded Age & Progressive Era
    PROGRESSIVE = "Progressive",
    AMERICAN = "American",                           // added for #6 — 1856
    POPULIST = "Populist",                           // added for #6 — 1892
    // Modern Era
    INDEPENDENT = "Independent",
    // Third Parties
    LIBERTARIAN = "Libertarian",
    GREEN = "Green",
    REFORM = "Reform",
    AMERICAN_INDEPENDENT = "American Independent",
    STATES_RIGHTS_DEMOCRATIC = "States' Rights Democratic", // Dixiecrats
    SOCIALIST = "Socialist",
}

/**
 * One candidate on a presidential or vice-presidential ticket.
 *
 * `status` includes 'Incumbent', which no record in the series uses; it is kept so
 * existing call sites still typecheck.
 */
export interface Candidate {
    name: string;
    party: PoliticalParty | null; // null for unaffiliated nominees (Washington, 1788-89)
    role: 'Presidential' | 'Vice Presidential';
    status: 'Winner' | 'Loser' | 'Incumbent';
}

/** One election, with the span over which voting actually took place. */
export interface ElectionRecord {
    /** The year the result belongs to. 1788 for the 1788-89 election. */
    year: number;
    /**
     * The span in the universe id. Only 1788 differs from `year`: that election ran
     * across a calendar-year boundary, so its id is `history:us_election:1788-1789`.
     */
    idYear: string;
    /** ISO date voting opened. */
    votingOpens: string;
    /** ISO date voting closed — the day the outcome was decided. */
    votingCloses: string;
    candidates: Candidate[];
}

/** A recurring issue, and the elections in this series where it was prominent. */
export interface RecurringIssue {
    slug: string;
    name: string;
    /** Election years where the issue was a top-tier concern. */
    years: number[];
    /** How the issue was reframed across those years. */
    evolution: string;
}

/**
 * How one election's issues data was sourced — drives `certainty`.
 *
 * The distinction exists because the issue's own header asserts "Confidence Level:
 * High" while naming no source for its per-election issue lists.
 */
export type IssueProvenance =
    /** Backed by a named, dated survey or primary document. */
    | 'survey'
    /** Read from the issue's own CSV, which names no source. */
    | 'issue-csv'
    /** Compiled from party platforms and contemporary accounts, per the issue. */
    | 'platforms';

/**
 * Issues data for a single election, as issue #6's first CSV proposes it.
 *
 * `analysis` is *interpretation*, not fact — a claim about why a losing campaign did
 * what it did. It is kept separate from `issues` so the two are never confused, and
 * carries its own `certainty` because a survey can establish which issues voters
 * ranked highly but not why a campaign lost.
 */
export interface ElectionIssueData {
    /** Prominent issues, most prominent first. Slugs resolve to {@link RecurringIssue}. */
    issues: { slug: string; rank: number }[];
    analysis: string;
    provenance: IssueProvenance;
    /** 0.0-1.0. `survey` supports 0.9; `issue-csv` alone supports 0.5. */
    certainty: number;
}