import {
    presidentialElectionUniverses,
    PoliticalParty,
    US_ELECTION_RECORDS,
} from './presidential';
import {
    RECURRING_ISSUES,
    ELECTION_ISSUE_DATA,
    recurringElectionIssueUniverses,
} from './election-issues';
import { isHistoricalUniverseId } from '../../../core/universe-ids';

/**
 * local-time#6 — the complete U.S. presidential election series.
 */
describe('U.S. presidential elections (issue #6)', () => {
    describe('the series', () => {
        test('holds all sixty elections, 1788-89 through 2024', () => {
            expect(US_ELECTION_RECORDS).toHaveLength(60);
            expect(presidentialElectionUniverses).toHaveLength(60);
        });

        test('every universe id is a valid historical id', () => {
            for (const u of presidentialElectionUniverses) {
                const id = String(u.universeId);
                expect(id.startsWith('history:us_election:')).toBe(true);
                expect(isHistoricalUniverseId(id)).toBe(true);
            }
        });

        test('universe ids are unique', () => {
            const ids = presidentialElectionUniverses.map(u => String(u.universeId));
            expect(new Set(ids).size).toBe(ids.length);
        });

        /**
         * The first election ran across a calendar-year boundary, which is why its id
         * is a range. Regression guard: it is the only one.
         */
        test('only 1788-89 spans a calendar-year boundary in its id', () => {
            const ranged = presidentialElectionUniverses
                .map(u => String(u.universeId))
                .filter(id => id.includes(':1788-') || /:\d{4}-\d{4}$/.test(id));
            expect(ranged).toEqual(['history:us_election:1788-1789']);
        });

        test('every election has exactly one presidential winner', () => {
            for (const u of presidentialElectionUniverses) {
                const md = u.metadata as unknown as { candidates: { role: string; status: string }[] };
                const winners = md.candidates.filter(
                    c => c.role === 'Presidential' && c.status === 'Winner',
                );
                expect(winners).toHaveLength(1);
                expect(md.candidates.length).toBeGreaterThan(0);
            }
        });

        test('dates are the verified ones, not derived from the year', () => {
            const byId = new Map(
                presidentialElectionUniverses.map(u => [String(u.universeId), u]),
            );
            const day = (id: string) => {
                const md = byId.get(id)?.metadata as unknown as { votingCloses: string };
                return md.votingCloses;
            };
            expect(day('history:us_election:2024')).toBe('2024-11-05');
            expect(day('history:us_election:2020')).toBe('2020-11-03');
            expect(day('history:us_election:2016')).toBe('2016-11-08');
            expect(day('history:us_election:2000')).toBe('2000-11-07');
            expect(day('history:us_election:1980')).toBe('1980-11-04');
            expect(day('history:us_election:1968')).toBe('1968-11-05');
            expect(day('history:us_election:1932')).toBe('1932-11-08');
            expect(day('history:us_election:1860')).toBe('1860-11-06');
        });

        test('a contested election has more than one presidential candidate', () => {
            const byId = new Map(
                presidentialElectionUniverses.map(u => [String(u.universeId), u]),
            );
            const count = (id: string) => {
                const md = byId.get(id)?.metadata as unknown as {
                    candidates: { role: string }[];
                };
                return md.candidates.filter(c => c.role === 'Presidential').length;
            };
            expect(count('history:us_election:1860')).toBe(4); // Lincoln, Douglas, Breckinridge, Bell
            expect(count('history:us_election:2016')).toBe(2);
            expect(count('history:us_election:1788-1789')).toBe(1); // unanimous
        });

        /**
         * The regression this PR exists to fix. Before #6 the voting epoch was
         * `start + 24h` for every election, which misstated every pre-1845 election.
         */
        describe('voting spans', () => {
            const durations = presidentialElectionUniverses.map(u => {
                const md = u.metadata as unknown as { votingDurationDays: number };
                return [String(u.universeId), md.votingDurationDays] as const;
            });

            test('all fifteen pre-1845 elections are multi-day', () => {
                const pre = durations.filter(([id]) => {
                    const y = Number(id.split(':').pop()!.split('-')[0]);
                    return y <= 1844;
                });
                expect(pre).toHaveLength(15);
                for (const [id, days] of pre) {
                    expect(`${id}:${days > 1}`).toBe(`${id}:true`);
                }
            });

            test('every election from 1848 onward is a single day', () => {
                const post = durations.filter(([id]) => {
                    const y = Number(id.split(':').pop()!.split('-')[0]);
                    return y >= 1848;
                });
                expect(post).toHaveLength(45);
                for (const [id, days] of post) {
                    expect(`${id}:${days}`).toBe(`${id}:1`);
                }
            });

            test('1788-89 opens in December 1788 and closes in January 1789', () => {
                const md = presidentialElectionUniverses
                    .find(u => String(u.universeId) === 'history:us_election:1788-1789')!
                    .metadata as unknown as { votingOpens: string; votingCloses: string };
                expect(md.votingOpens).toBe('1788-12-15');
                expect(md.votingCloses).toBe('1789-01-07');
            });
        });

        /**
         * Wikipedia labels Washington "Independent" in both the 1788-89 infobox and the
         * summary table, so that is what the record carries. Note this is the source's
         * label, not a claim that a party existed: the election predates organised
         * parties, and `PoliticalParty.INDEPENDENT` is doing retrospective work here.
         * (The pre-#6 module used `null` here; the difference is the source's wording,
         * not a correction of it.)
         */
        test('Washington is labelled Independent in the first election', () => {
            const md = presidentialElectionUniverses[0].metadata as unknown as {
                candidates: { name: string; party: PoliticalParty | null }[];
            };
            expect(md.candidates[0].name).toBe('George Washington');
            expect(md.candidates[0].party).toBe(PoliticalParty.INDEPENDENT);
        });

        test('the 1860 four-way race carries all four nominees', () => {
            const u = presidentialElectionUniverses.find(
                x => String(x.universeId) === 'history:us_election:1860',
            )!;
            const md = u.metadata as unknown as { candidates: { name: string }[] };
            expect(md.candidates.map(c => c.name)).toEqual(
                expect.arrayContaining(['Abraham Lincoln', 'Stephen A. Douglas', 'John C. Breckinridge', 'John Bell']),
            );
        });
    });

      describe('issues data', () => {
        test('is attached only to the seven elections the issue covers', () => {
            const withIssues = presidentialElectionUniverses.filter(
                u => (u.metadata as unknown as { issues?: unknown }).issues !== undefined,
            );
            expect(withIssues).toHaveLength(7);
            expect(Object.keys(ELECTION_ISSUE_DATA).map(Number).sort((a, b) => a - b))
                .toEqual([1860, 1932, 1968, 1980, 2000, 2008, 2016]);
        });

        test('the other fifty-three carry no issues, rather than empty issues', () => {
            const u = presidentialElectionUniverses.find(
                x => String(x.universeId) === 'history:us_election:2012',
            )!;
            expect((u.metadata as unknown as { issues?: unknown }).issues).toBeUndefined();
        });

        /**
         * The issue's 2016 row is wrong and cites Pew in support of it. Pew's July 2016
         * survey ranks terrorism second at 80%, above health care (74%) and immigration
         * (70%). The issue omits terrorism entirely.
         */
        test('2016 includes terrorism, which the issue omitted', () => {
            const slugs = ELECTION_ISSUE_DATA['2016'].issues.map(i => i.slug);
            expect(slugs[0]).toBe('economy');       // 84%
            expect(slugs[1]).toBe('terrorism');     // 80% — issue omits this entirely
            expect(slugs[2]).toBe('healthcare');    // 74%
            expect(slugs[3]).toBe('immigration');   // 70%
        });

        /** "Candidate Trustworthiness" is a candidate trait, not a voting issue. */
        test('trustworthiness is not modelled as an issue anywhere', () => {
            const slugs = Object.values(ELECTION_ISSUE_DATA).flatMap(d => d.issues.map(i => i.slug));
            expect(slugs.some(s => /trust/i.test(s))).toBe(false);
            expect(RECURRING_ISSUES.some(i => /trust/i.test(i.slug))).toBe(false);
        });

        test('only the survey-backed election claims survey provenance', () => {
            for (const [year, data] of Object.entries(ELECTION_ISSUE_DATA)) {
                if (data.provenance === 'survey') {
                    expect(year).toBe('2016');
                    expect(data.certainty).toBeGreaterThan(0.8);
                } else {
                    // The issue asserts "Confidence Level: High" while naming no source.
                    expect(data.certainty).toBeLessThanOrEqual(0.5);
                }
            }
        });

        test('every issue slug resolves to a declared recurring issue', () => {
            const known = new Set(RECURRING_ISSUES.map(i => i.slug));
            for (const data of Object.values(ELECTION_ISSUE_DATA)) {
                for (const i of data.issues) {
                    expect(`${i.slug}:${known.has(i.slug)}`).toBe(`${i.slug}:true`);
                }
            }
        });

        test('ranks are contiguous and start at one', () => {
            for (const data of Object.values(ELECTION_ISSUE_DATA)) {
                const ranks = data.issues.map(i => i.rank);
                expect(ranks).toEqual(ranks.map((_, idx) => idx + 1));
            }
        });
    });

      describe('recurring issues', () => {
        test('the issue lists six; terrorism is a seventh because it cannot be omitted', () => {
            expect(RECURRING_ISSUES.map(i => i.slug).sort()).toEqual(
                ['civil_rights', 'economy', 'foreign_policy_war', 'healthcare',
                    'immigration', 'states_rights', 'terrorism'].sort(),
            );
        });

        /**
         * The issue's File 2 lists economy years 1932, 1980, 2008, 2016 — omitting 2000,
         * whose own File 1 row is dominated by the budget surplus and tax cuts. Deriving
         * `years` from the per-election data is what stops the two files drifting again.
         */
        test('years are derived from the election data, so the issue files cannot disagree', () => {
            const economy = RECURRING_ISSUES.find(i => i.slug === 'economy')!;
            expect(economy.years).toEqual([1932, 1980, 2000, 2008, 2016]);
        });

        test('every year named by a recurring issue actually references it', () => {
            for (const issue of RECURRING_ISSUES) {
                for (const year of issue.years) {
                    const referenced = ELECTION_ISSUE_DATA[String(year)]?.issues.some(
                        i => i.slug === issue.slug,
                    );
                    expect(`${issue.slug}@${year}:${Boolean(referenced)}`)
                        .toBe(`${issue.slug}@${year}:true`);
                }
            }
        });

        test('there is one universe per recurring issue', () => {
            expect(recurringElectionIssueUniverses).toHaveLength(RECURRING_ISSUES.length);
        });

        test('issue universes use a year range id and are valid historical ids', () => {
            for (const u of recurringElectionIssueUniverses) {
                const id = String(u.universeId);
                expect(id).toMatch(/^history:election_issue_[a-z_]+:\d{4}(-\d{4})?$/);
                expect(isHistoricalUniverseId(id)).toBe(true);
            }
        });

        /** Every reference must point at an election universe that actually exists. */
        test('every cross-reference resolves to a real election universe', () => {
            const known = new Set(presidentialElectionUniverses.map(u => String(u.universeId)));
            for (const u of recurringElectionIssueUniverses) {
                const conns = (u as unknown as {
                    connections?: { references?: { targetUniverseId: string }[] };
                }).connections ?? {};
                const refs = conns.references ?? [];
                expect(refs.length).toBeGreaterThan(0);
                for (const r of refs) {
                    expect(`${r.targetUniverseId}:${known.has(r.targetUniverseId)}`)
                        .toBe(`${r.targetUniverseId}:true`);
                }
            }
        });
    });
});