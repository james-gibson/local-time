import { Universe, UniverseType, TimePrecision } from '../../../core/types';
import { ElectionIssueData, RecurringIssue } from './election-types';

/**
 * The issues half of local-time#6.
 *
 * The issue supplies two CSVs. The first describes seven elections (1860, 1932, 1968,
 * 1980, 2000, 2008, 2016) with their dominant issues and an interpretation of how the
 * losing campaigns handled them. The second tracks issues that recur across elections
 * and how each is reframed over time.
 *
 * Before this module neither CSV had anywhere to live: `createElectionUniverse` had no
 * notion of an issue, and no recurring-issue entity existed. The split between the two
 * CSVs is preserved — {@link RECURRING_ISSUES} is the second, {@link ELECTION_ISSUE_DATA}
 * the first — because an issue that is prominent in 1860 and again in 1968 is one
 * entity seen twice, not two issues.
 *
 * ## What was corrected, and why
 *
 * **The 2016 issue list is wrong, and the issue cites Pew in support of it.** The issue
 * lists "The Economy (job loss in manufacturing), Immigration, Healthcare (Affordable
 * Care Act), Candidate Trustworthiness". Pew's July 2016 survey of registered voters
 * (Pew Research Center, "2016 Campaign: Strong Interest, Widespread Dissatisfaction",
 * section 4) ranks: economy 84%, terrorism 80%, foreign policy 75%, health care 74%,
 * gun policy 72%, immigration 70%. So:
 *
 * - **Terrorism is missing entirely.** It ranked *second* at 80% — above health care
 *   and well above immigration — and Pew headlines it as one of the top two.
 * - **"Candidate Trustworthiness" is not a voting issue at all.** Pew measures it in a
 *   different section entirely, "Candidate traits and perceptions". It is a property of
 *   a candidate, not an issue the electorate ranks, and listing it as one conflates the
 *   question "what should the government do?" with "can I trust this person?". It is
 *   recorded below as a note on the 2016 analysis, not as an issue.
 * - **Immigration ranks sixth, not second** — a real distinction, because the issue's
 *   analysis argues immigration was a decisive 2016 concern.
 *
 * The corrected 2016 list is used, with `provenance: 'survey'` and `certainty: 0.9`.
 *
 * **The issue's own two files disagree.** Its File 2 lists "The Economy" as prominent
 * in 1932, 1980, 2008 and 2016 — omitting 2000, whose File 1 row is dominated by the
 * budget surplus and tax cuts. The two rows are reconciled here by deriving
 * {@link RecurringIssue.years} from {@link ELECTION_ISSUE_DATA}, so the files cannot
 * drift apart again. File 2's economy years become 1932, 1980, 2000, 2008, 2016.
 *
 * **Terrorism is a seventh recurring issue, not in the issue.** Pew ranks it second in
 * 2016 (80%) and reports it at 68% in 2008, close behind the economy's 87%. It recurs
 * across the series and cannot be represented without it.
 *
 * Everything not covered by a named survey keeps the issue's own framing at
 * `provenance: 'issue-csv'` and `certainty: 0.5`. The issue's header asserts
 * "Confidence Level: High" while naming no source for the per-election issue lists —
 * the same defect the Hillary Clinton data in issue #8 had.
 */
export const RECURRING_ISSUES: RecurringIssue[] = [
    {
        slug: 'economy',
        name: 'The Economy',
        years: [1932, 1980, 2000, 2008, 2016],
        evolution:
            'Moved from survival during the Great Depression (1932), through stagflation — ' +
            'high inflation with high unemployment (1980) — to a budget-surplus and ' +
            'tax-cut frame (2000), then to the financial crisis and middle-class wage ' +
            'stagnation (2008, 2016). The argument shifts from direct relief to tax ' +
            'policy, deregulation and trade.',
    },
    {
        slug: 'states_rights',
        name: "States' Rights vs. Federal Power",
        years: [1860, 1968],
        evolution:
            'In 1860 this was the legal argument used to defend slavery against federal ' +
            'containment. By 1968 the same vocabulary was used to oppose federally ' +
            'mandated desegregation. The tension over the scope of the federal ' +
            'government has never left the series; only the protected class changed.',
    },
    {
        slug: 'civil_rights',
        name: 'Civil Rights & Racial Equality',
        years: [1860, 1968],
        evolution:
            'In 1860 the question was slavery itself. A century later it was ending ' +
            'segregation, securing the vote, and confronting systemic discrimination. ' +
            'The modern continuations are criminal justice, affirmative action and ' +
            'representation.',
    },
    {
        slug: 'foreign_policy_war',
        name: 'Foreign Policy & War',
        years: [1968, 1980, 2008],
        evolution:
            'Vietnam dominated 1968. In 1980 the frame was Cold War posture and ' +
            'projected strength, with the Iran hostage crisis as its emblem. By 2008 ' +
            'it was the long tail of Iraq and Afghanistan plus terrorism.',
    },
    {
        slug: 'healthcare',
        name: 'Healthcare',
        years: [2008, 2016],
        evolution:
            'A background issue for decades, it reached top-tier salience in 2008 around ' +
            'universal coverage. By 2016 the debate had become a referendum on the ' +
            'Affordable Care Act — repeal on one side, defence and repair on the other. ' +
            'Pew put it at 74% "very important" in 2016.',
    },
    {
        slug: 'immigration',
        name: 'Immigration',
        years: [2016],
        evolution:
            'Present in earlier cycles, it became central and polarising in 2016, ' +
            'shifting from pathway-to-citizenship detail to border security, national ' +
            'identity and economic competition. Pew recorded 70% in 2016, up from 41% ' +
            'in September 2012 and 54% in May 2008.',
    },
    {
        // Not in issue #6's File 2. Added here because it cannot be represented without it.
        slug: 'terrorism',
        name: 'Terrorism & National Security',
        years: [2008, 2016],
        evolution:
            'Terrorism appears in every modern cycle but breaks into the top tier only in ' +
            'the two most recent. Pew recorded it at 68% in 2008, just behind the ' +
            'economy\'s 87%, and at 80% in 2016, second only to the economy at 84%.',
    },
];

/**
 * Per-election issues data from issue #6's first CSV.
 *
 * Keyed by election year. Only the seven elections the issue covers appear; the other
 * 53 have no issues data and carry none, which is different from asserting they had no
 * salient issues.
 */
export const ELECTION_ISSUE_DATA: Record<string, ElectionIssueData> = {
    '1860': {
        issues: [{ slug: 'civil_rights', rank: 1 }, { slug: 'states_rights', rank: 2 }],
        analysis:
            "The Democratic party fatally split over slavery. Stephen Douglas (Northern) " +
            "tried a middle ground with popular sovereignty, letting territories decide " +
            "for themselves; the position satisfied neither wing. John Breckinridge " +
            "(Southern) backed expansion outright, which cut him off in the North. John " +
            "Bell (Constitutional Union) campaigned on preserving the Union alone, which " +
            "was untenable in a country already fracturing over the central question.",
        provenance: 'issue-csv',
        certainty: 0.5,
    },
    '1932': {
        issues: [{ slug: 'economy', rank: 1 }],
        analysis:
            "Incumbent Herbert Hoover bore the blame for the crash. He argued for " +
            "voluntary cooperation and limited federal intervention, and insisted the " +
            "economy would correct itself. His budget-balance emphasis read as detached " +
            "from unemployment at a scale with no precedent, and he offered no promise " +
            "of direct relief to match Roosevelt's.",
        provenance: 'issue-csv',
        certainty: 0.5,
    },
    '1968': {
        issues: [
            { slug: 'foreign_policy_war', rank: 1 },
            { slug: 'civil_rights', rank: 2 },
            { slug: 'states_rights', rank: 3 },
        ],
        analysis:
            "Hubert Humphrey was the vice president under the administration that owned " +
            "the Vietnam policy, and broke with Johnson only late. That left him without " +
            "the anti-war vote or the pro-war vote. George Wallace ran on law and order " +
            "and states' rights — a coded appeal to voters resisting desegregation — and " +
            "won several Southern states, but the platform was too narrow to travel.",
        provenance: 'issue-csv',
        certainty: 0.5,
    },
    '1980': {
        issues: [{ slug: 'economy', rank: 1 }, { slug: 'foreign_policy_war', rank: 2 }],
        analysis:
            "Jimmy Carter governed through the Iran hostage crisis into visible " +
            "impotence, and his crisis-of-confidence address asked the country for " +
            "sacrifice. Voters read the diagnosis without the prescription. Reagan's " +
            "counter was legible and optimistic — tax cuts, deregulation, a stronger " +
            "military — and John Anderson's moderation was squeezed between them.",
        provenance: 'issue-csv',
        certainty: 0.5,
    },
    '2000': {
        issues: [{ slug: 'economy', rank: 1 }],
        analysis:
            "Al Gore governed in peace and prosperity yet had no vocabulary of his own " +
            "outside the Clinton presidency. His Social Security lockbox was precise and " +
            "uninspiring, and he did not convert a strong economy into an argument. " +
            "Ralph Nader's Green campaign took votes in the narrow states that decided " +
            "the result. NOTE: the issue's File 2 omits 2000 from its economy years " +
            "while its own File 1 describes 2000 in economic terms; reconciled here.",
        provenance: 'issue-csv',
        certainty: 0.5,
    },
    '2008': {
        issues: [
            { slug: 'economy', rank: 1 },
            { slug: 'foreign_policy_war', rank: 2 },
            { slug: 'healthcare', rank: 3 },
            { slug: 'terrorism', rank: 4 },
        ],
        analysis:
            "John McCain campaigned through the collapse of an economy that began under " +
            "a Republican president, and suspending the campaign read as unsettled. His " +
            "national-security record was strong precisely where voters' attention had " +
            "left. Sarah Palin energised the base and cost him the moderates. Pew put the " +
            "economy at 87% and terrorism at 68% in 2008, the latter reported in that " +
            "survey's 2016 retrospective comparison rather than a 2008 release. NOTE: " +
            "the issue cites Pew for this row but reproduces no figures, so its own " +
            "framing keeps provenance 'issue-csv' even where these rankings do not.",
        provenance: 'issue-csv',
        certainty: 0.5,
    },
    '2016': {
        issues: [
            { slug: 'economy', rank: 1 },
            { slug: 'terrorism', rank: 2 },
            { slug: 'healthcare', rank: 3 },
            { slug: 'immigration', rank: 4 },
        ],
        analysis:
            "Hillary Clinton's campaign ran on experience, detailed plans, and criticism " +
            "of Trump's temperament, and did not reach voters in the Rust Belt who felt " +
            "left behind. The private email server sustained an untrustworthiness " +
            "narrative the campaign could not close — note that Pew treats " +
            "trustworthiness under candidate traits, not as a voting issue, so it is " +
            "described here rather than listed above. Continuing the Obama legacy did " +
            "not lift turnout, while Trump's message on trade and immigration mobilised " +
            "a segment that voting more heavily. Pew, July 2016: economy 84%, terrorism " +
            "80%, foreign policy 75%, health care 74%, gun policy 72%, immigration 70%.",
        provenance: 'survey',
        certainty: 0.9,
    },
};

/**
 * One universe per recurring issue, spanning the elections in which it was prominent.
 *
 * The id is `history:election_issue_<slug>:<firstYear>-<lastYear>`. Two decisions here:
 *
 * - **A year *range*, not a single year.** The issue is one thing seen across separate
 *   elections, and a point-in-time universe could not hold both ends of it. Hence
 *   `INSTITUTIONAL_PERIOD` rather than `HISTORICAL_EVENT`.
 * - **The slug is flattened into one segment.** `UNIVERSE_ID_PATTERNS.HISTORICAL` is
 *   `history:<slug>:<span>` — exactly three colon-separated parts. The natural-looking
 *   `history:us_election_issue:<slug>:<span>` is *four*, and does not validate. Same
 *   trap as the `system:` namespace: what the pattern constrains is the segment count,
 *   not the semantics.
 */
const createIssueUniverse = (issue: RecurringIssue): Universe => {
    const first = issue.years[0];
    const last = issue.years[issue.years.length - 1];
    const span = first === last ? String(first) : `${first}-${last}`;
    const id = `history:election_issue_${issue.slug}:${span}`;
    const ms = Date.UTC(first, 0, 1);
    const msLast = Date.UTC(last, 0, 1);

    return {
        universeId: id,
        type: UniverseType.INSTITUTIONAL_PERIOD,
        identifiers: {
            primary: id,
            aliases: [issue.name, `us_election_issue_${issue.slug}`],
        },
        realityRelation: {
            type: 'documentary',
            fictionalizationDegree: 0.0,
            realityAnchors: [],
        },
        attribution: {
            public_domain: true,
            sources: [
                "Local Time Issue #6 — Recurring Presidential Election Issues",
                "Pew Research Center — 2016 Campaign: Strong Interest, Widespread Dissatisfaction",
            ],
            citations_required: true,
        },
        layers: [
            {
                layerId: "issue_span",
                type: 'primary',
                epochs: {
                    prominence: {
                        epochId: `${issue.slug}_prominence`,
                        startTime: BigInt(ms) * 1_000_000n,
                        endTime: BigInt(msLast + 24 * 3600 * 1000) * 1_000_000n,
                        precision: TimePrecision.YEAR,
                        description: `${issue.name} as a recurring election issue, ${span}`,
                    },
                },
            },
        ],
        temporalStructure: {
            segments: [],
            keyframes: issue.years.map(year => ({
                id: `${issue.slug}_${year}`,
                timestamp: BigInt(Date.UTC(year, 10, 1)) * 1_000_000n,
                significance: 0.7,
                tags: ['us_election', 'election_issue', issue.slug, `year_${year}`],
                certainty: 1.0,
            })),
            windows: { strategy: 'phase_based' },
        },
        metadata: {
            canonicalName: issue.name,
            cultural_significance: 0.7,
            issueSlug: issue.slug,
            prominentInYears: issue.years,
            evolution: issue.evolution,
            sourceIssue: 6,
        },
        connections: {
            natural: {
                parentUniverses: ['US_ELECTION_CYCLE'],
            },
            references: issue.years.map(year => ({
                targetUniverseId: `history:us_election:${year === 1788 ? '1788-1789' : year}`,
                type: 'THEMATICALLY_LINKED',
            })),
        },
    } as unknown as Universe;
};

/** One universe per recurring issue, cross-linked to the elections it was prominent in. */
export const recurringElectionIssueUniverses: Universe[] =
    RECURRING_ISSUES.map(createIssueUniverse);
