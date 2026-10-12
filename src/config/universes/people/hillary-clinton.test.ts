import { hillaryClintonUniverse, hillaryClintonUniverses } from './hillary-clinton';
import { isPersonalUniverseId } from '../../../core/universe-ids';
import { UniverseType } from '../../../core/types';

/**
 * local-time#8 — `personal:hillary_clinton:1947`.
 *
 * The keyframes were ported mechanically from the lore KB record
 * `characters/hillary-clinton.md`. These tests pin the port, because a transcription slip
 * between the two repositories would be invisible: a wrong year is still a well-formed
 * bigint timestamp.
 */
describe('Hillary Rodham Clinton (issue #8)', () => {
    const universe = hillaryClintonUniverse as unknown as {
        universeId: string;
        type: UniverseType;
        identifiers: { primary: string; aliases: string[] };
        temporalStructure: {
            segments: { id: string; start: bigint; end: bigint; status: string }[];
            keyframes: { id: string; timestamp: bigint; significance: number; certainty?: number; dateRange?: { earliest: bigint; latest: bigint } }[];
        };
        metadata: Record<string, unknown>;
    };
    const NS_PER_DAY = 86_400_000n * 1_000_000n;
    const isoOf = (ms: bigint) => new Date(Number(ms / 1_000_000n)).toISOString().slice(0, 10);

    describe('identity', () => {
        test('the id is a valid personal universe id', () => {
            expect(universe.universeId).toBe('personal:hillary_clinton:1947');
            expect(isPersonalUniverseId(universe.universeId)).toBe(true);
        });

        test('identifiers agree with the universe id', () => {
            expect(universe.identifiers.primary).toBe(universe.universeId);
        });

        test('it is a biography, not a fictional or institutional entity', () => {
            expect(universe.type).toBe(UniverseType.BIOGRAPHY);
        });

        test('one universe is exported', () => {
            expect(hillaryClintonUniverses).toHaveLength(1);
            expect(hillaryClintonUniverses[0]).toBe(hillaryClintonUniverse);
        });
    });

    describe('keyframes', () => {
        const byId = new Map(universe.temporalStructure.keyframes.map(k => [k.id, k]));
        const dateOf = (id: string) => isoOf(byId.get(id)!.timestamp);

        test('there are twenty-one, with unique ids', () => {
            const kfs = universe.temporalStructure.keyframes;
            expect(kfs).toHaveLength(21);
            expect(new Set(kfs.map(k => k.id)).size).toBe(21);
        });

        /** Every one of these was checked against an ingested source when the KB record was written. */
        test('day-precision dates match the KB record', () => {
            const expected: Record<string, string> = {
                born: '1947-10-26',
                'marries-bill-clinton': '1975-10-11',
                'first-lady-of-arkansas': '1979-01-09',
                'chelsea-born': '1980-02-27',
                'becomes-first-lady-of-the-united-states': '1993-01-20',
                'husband-impeached-by-house': '1998-12-19',
                'articles-referred-to-senate': '1999-01-07',
                'senate-acquits-bill-clinton': '1999-02-12',
                'elected-us-senate': '2000-11-07',
                'sworn-us-senate': '2001-01-03',
                'sworn-secretary-of-state': '2009-01-21',
                'benghazi-attack': '2012-09-11',
                'resignation-as-secretary-of-state-effective': '2013-02-01',
            };
            for (const [id, iso] of Object.entries(expected)) {
                expect(`${id}:${dateOf(id)}`).toBe(`${id}:${iso}`);
            }
        });

        /**
         * The issue's CSV said Clinton resigned "at the end of President Obama's first
         * term". That is wrong by twelve days: the term ended 2013-01-20 and the
         * resignation took effect when Kerry was sworn in on 2013-02-01. Pinned so the
         * issue's error cannot be reintroduced.
         */
        test('the 2013 resignation is not conflated with the end of Obama\'s first term', () => {
            const resignation = dateOf('resignation-as-secretary-of-state-effective');
            expect(resignation).toBe('2013-02-01');
            const firstTermEnd = new Date('2013-01-20T00:00:00Z').getTime() / 1000;
            const resignationSec = Number(byId.get('resignation-as-secretary-of-state-effective')!.timestamp / 1_000_000n) / 1000;
            expect(resignationSec - firstTermEnd).toBeGreaterThan(11 * 24 * 3600);
        });

        /** Month-precision events keep a dateRange instead of a falsely precise day. */
        test('month-precision keyframes carry a dateRange', () => {
            for (const id of ['health-care-plan-abandoned', 'beijing-womens-rights-speech']) {
                const dr = byId.get(id)!.dateRange;
                expect(`${id}:${Boolean(dr)}`).toBe(`${id}:true`);
                const spanDays = Number((dr!.latest - dr!.earliest) / NS_PER_DAY);
                expect(spanDays).toBeGreaterThan(20);
            }
        });

        /**
         * The certainty spread is the record's provenance, not decoration: six keyframes
         * rest on local-time#8's CSV, which names no source. That must stay visible.
         */
        test('the six issue-CSV keyframes stay at reduced certainty', () => {
            const fromIssue = [
                'announces-2008-candidacy',
                'suspends-2008-campaign',
                'email-controversy-begins',
                'announces-2016-candidacy',
                'first-female-major-party-nominee',
                'loses-2016-election',
            ];
            expect(fromIssue).toHaveLength(6);
            for (const id of fromIssue) {
                expect(`${id}:${byId.get(id)!.certainty}`).toBe(`${id}:0.5`);
            }
        });

        test('sourced keyframes keep their higher certainty', () => {
            expect(byId.get('born')!.certainty).toBe(0.95);
            expect(byId.get('husband-impeached-by-house')!.certainty).toBe(0.95);
            expect(byId.get('health-care-plan-abandoned')!.certainty).toBe(0.6);
            expect(byId.get('beijing-womens-rights-speech')!.certainty).toBe(0.85);
        });

        /** Certainty must never imply more precision than the underlying claim. */
        test('keyframes are chronologically ordered and all precede the present', () => {
            const stamps = universe.temporalStructure.keyframes.map(k => k.timestamp);
            const sorted = [...stamps].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
            expect(stamps).toEqual(sorted);
            const nowNs = BigInt(Date.now()) * 1_000_000n;
            for (const s of stamps) expect(s <= nowNs).toBe(true);
        });
    });

    describe('segments', () => {
        test('the five phases are in chronological order', () => {
            const segs = universe.temporalStructure.segments;
            expect(segs.map(s => s.id)).toEqual([
                'arkansas-and-family',
                'first-lady-of-the-united-states',
                'us-senate-new-york',
                'secretary-of-state',
                'post-office',
            ]);
            for (let i = 1; i < segs.length; i++) {
                expect(`${segs[i].id}:${segs[i].start > segs[i - 1].start}`)
                    .toBe(`${segs[i].id}:true`);
            }
        });

        /**
         * These phases are deliberately NOT contiguous, because the overlap is the
         * point: she was sworn into the Senate on 2001-01-03 and Bill Clinton left
         * office on 2001-01-20, making those seventeen days the only period in U.S.
         * history in which one person was simultaneously First Lady and a sitting
         * senator. A "no overlapping phases" assertion would have been wrong, and would
         * have quietly deleted the precedent this record exists to capture.
         */
        test('the first-lady and Senate phases overlap by exactly 17 days', () => {
            const segs = new Map(universe.temporalStructure.segments.map(s => [s.id, s]));
            const overlap = Number(
                (segs.get('first-lady-of-the-united-states')!.end -
                    segs.get('us-senate-new-york')!.start) / NS_PER_DAY,
            );
            expect(overlap).toBe(17);
        });

        test('exactly one phase is still open', () => {
            const active = universe.temporalStructure.segments.filter(s => s.status === 'active');
            expect(active.map(s => s.id)).toEqual(['post-office']);
        });
    });

    /**
     * `personal:tolkien:wwi_experience:1916` exists already, so this asserts the new id
     * does not collide with it — the two differ only in the third segment's meaning.
     */
    test('does not collide with the existing tolkien personal universe', () => {
        const other = 'personal:tolkien:wwi_experience:1916';
        expect(universe.universeId).not.toBe(other);
    });
});