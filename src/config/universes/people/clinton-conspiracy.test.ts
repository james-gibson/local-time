import {
    hillaryClintonConspiracyTheoriesUniverse,
} from './clinton-conspiracy-theories';
import {
    hillaryClintonConspiracyRebuttalsUniverse,
} from './clinton-conspiracy-rebuttals';
import { isHistoricalUniverseId, isValidUniverseId } from '../../../core/universe-ids';

type Keyframe = {
    id: string;
    timestamp: bigint;
    significance: number;
    certainty?: number;
    tags?: string[];
    targetUniverseId?: string;
    targetKeyframeId?: string;
    dateRange?: { earliest: bigint; latest: bigint };
};

type UniverseShape = {
    universeId: string;
    identifiers: { primary: string; aliases: string[] };
    temporalStructure: { segments: { id: string; start: bigint; end: bigint }[]; keyframes: Keyframe[] };
    metadata: Record<string, any>;
};

const theories = hillaryClintonConspiracyTheoriesUniverse as unknown as UniverseShape;
const rebuttals = hillaryClintonConspiracyRebuttalsUniverse as unknown as UniverseShape;
const theoryKf = theories.temporalStructure.keyframes;
const rebuttalKf = rebuttals.temporalStructure.keyframes;
const isoOf = (ns: bigint) => new Date(Number(ns / 1_000_000n)).toISOString().slice(0, 10);

const THEORIES_ID = 'history:hillary_clinton_conspiracy_theories:1993-2016';
const REBUTTALS_ID = 'history:hillary_clinton_conspiracy_rebuttals:1993-2017';

/**
 * local-time#8 part 2 — the conspiracy-theory and rebuttal universe pair.
 *
 * These tests exist because #8's proposed data was wrong in a way that typechecks. Every
 * timestamp in the issue's comment was in *seconds* while the repository is nanoseconds;
 * the values were bigints and would have compiled straight into a universe where every
 * event landed in 1970. The guards below are written so that mistake cannot recur.
 */
describe('Clinton conspiracy theories (issue #8 part 2)', () => {
    describe('identity', () => {
        test('both ids are valid historical universe ids', () => {
            expect(theories.universeId).toBe(THEORIES_ID);
            expect(rebuttals.universeId).toBe(REBUTTALS_ID);
            expect(isHistoricalUniverseId(theories.universeId)).toBe(true);
            expect(isHistoricalUniverseId(rebuttals.universeId)).toBe(true);
            expect(isValidUniverseId(rebuttals.universeId)).toBe(true);
        });

        test('identifiers agree with the universe ids', () => {
            expect(theories.identifiers.primary).toBe(theories.universeId);
            expect(rebuttals.identifiers.primary).toBe(rebuttals.universeId);
        });

        test('the ids are distinct — the quarantine depends on it', () => {
            expect(theories.universeId).not.toBe(rebuttals.universeId);
        });
    });

    /**
     * THE load-bearing guard. Every timestamp in the issue's proposed code was a *seconds*
     * value. A seconds value is ~1.5e9; a nanosecond value for these dates is ~1.5e18.
     * Both are bigints and both typecheck, so only an explicit magnitude assertion
     * distinguishes them. 1e17 ns is 1973-03-03, so this cannot reject any legitimate date
     * in the span and cannot admit any seconds value for it.
     */
    describe('timestamp units', () => {
        const MIN_LEGITIMATE_NS = 100_000_000_000_000_000n; // 1973-03-03T00:00:00Z

        test('every keyframe timestamp is nanoseconds, not seconds', () => {
            for (const kf of [...theoryKf, ...rebuttalKf]) {
                expect(`${kf.id}:${kf.timestamp > MIN_LEGITIMATE_NS}`).toBe(`${kf.id}:true`);
            }
        });

        test('the earliest keyframe is still after 1990 in ns', () => {
            const min = [...theoryKf, ...rebuttalKf].reduce((a, b) => (a.timestamp < b.timestamp ? a : b));
            expect(min.timestamp).toBeGreaterThan(BigInt(Date.UTC(1990, 0, 1)) * 1_000_000n);
            expect(isoOf(min.timestamp)).toBe('1993-07-04');
        });

        test('dateRange bounds are nanoseconds too', () => {
            for (const kf of theoryKf) {
                if (!kf.dateRange) continue;
                expect(kf.dateRange.earliest > MIN_LEGITIMATE_NS).toBe(true);
                expect(kf.dateRange.latest > MIN_LEGITIMATE_NS).toBe(true);
            }
        });
    });

    describe('date corrections against the issue proposal', () => {
        const theoryById = new Map(theoryKf.map(k => [k.id, k]));

        /**
         * The issue gave 1994-01-01. Anchored instead to the Congressional Record entry
         * of 1994-08-12, which is a primary source with an exact date.
         */
        test('the body count is anchored to the Congressional Record, not a year placeholder', () => {
            expect(isoOf(theoryById.get('clinton-body-count')!.timestamp)).toBe('1994-08-12');
        });

        /** The issue gave 2016-10-31. Genesis is the archived tweet of 2016-10-30. */
        test('Pizzagate genesis is 2016-10-30, not the 31st', () => {
            expect(isoOf(theoryById.get('pizzagate-and-frazzledrip')!.timestamp)).toBe('2016-10-30');
        });

        /**
         * The clot was diagnosed in September *2012*. The 2016 date is when the
         * fainting spell re-ignited it. If these ever converge, the four-year
         * correction has been lost.
         */
        test('the health keyframe is distinct from the 2012 diagnosis it turns on', () => {
            const kf = theoryById.get('health-and-concealment')!;
            expect(isoOf(kf.timestamp)).toBe('2016-09-11');
            const clotDiagnosed = BigInt(Date.UTC(2012, 8, 16)) * 1_000_000n;
            expect(Number((kf.timestamp - clotDiagnosed) / 86_400_000_000_000n)).toBeGreaterThan(1400);
        });
    });

    /**
     * The category errors. #8 filed VRWC as a theory *about* Clinton when the evidence
     * runs the other way, and filed Pizzagate — which originated against Huma Abedin and
     * later shifted away from Clinton — as one. Both are kept, as agreed, but the
     * relationship is recorded so it is filterable.
     */
    describe('relationship corrections', () => {
        const theoriesMeta = theories.metadata.theories as {
            keyframeId: string;
            relationshipToClinton: string;
            distinctOffshoot?: { name: string; claimSummary: string };
        }[];

        test('every theory records its relationship to Clinton', () => {
            expect(theoriesMeta).toHaveLength(theoryKf.length);
            for (const t of theoriesMeta) {
                expect(`${t.keyframeId}:${['target', 'phrased_by', 'peripheral'].includes(t.relationshipToClinton)}`)
                    .toBe(`${t.keyframeId}:true`);
            }
        });

        test('VRWC is marked phrased_by, because she is the claimant', () => {
            const vrwc = theoriesMeta.find(t => t.keyframeId === 'vast-right-wing-conspiracy')!;
            expect(vrwc.relationshipToClinton).toBe('phrased_by');
        });

        test('Pizzagate is marked peripheral, and Frazzledrip is recorded separately', () => {
            const pg = theoriesMeta.find(t => t.keyframeId === 'pizzagate-and-frazzledrip')!;
            expect(pg.relationshipToClinton).toBe('peripheral');
            expect(pg.distinctOffshoot?.name).toBe('Frazzledrip');
        });

        test('the theories actually targeted at her are marked target', () => {
            const targeted = theoriesMeta.filter(t => t.relationshipToClinton === 'target').map(t => t.keyframeId);
            expect(targeted).toEqual([
                'vince-foster-suspicion',
                'clinton-body-count',
                'campaign-era-allegations',
                'benghazi-stand-down',
                'health-and-concealment',
            ]);
        });
    });

    /**
     * The one entry with no sourced claim has no rebuttal, and says so. A fabricated
     * refutation here would be the single worst thing this universe could contain.
     */
    describe('honest uncertainty', () => {
        const theoryMetaByKf = new Map(
            (theories.metadata.theories as { keyframeId: string; provenance: string }[]).map(t => [t.keyframeId, t]),
        );

        test('the unsourced campaign-era keyframe is flagged as having no located source', () => {
            expect(theoryMetaByKf.get('campaign-era-allegations')!.provenance).toMatch(/NO SINGLE SOURCE LOCATED/);
            expect(theoryKf.find(k => k.id === 'campaign-era-allegations')!.certainty).toBe(0.4);
            expect(theoryKf.find(k => k.id === 'campaign-era-allegations')!.dateRange).toBeDefined();
        });

        test('the gap is stated in the rebuttal universe too, with finding left null', () => {
            const gap = (rebuttals.metadata.rebuttals as any[]).find(r => r.keyframeId === 'rebuttal-campaign-era-gap');
            expect(gap.finding).toBeNull();
            expect(gap.source).toBeNull();
            expect(gap.provenance).toMatch(/NO REFUTATION RECORDED/);
        });

        test('every other rebuttal carries a finding and a named source', () => {
            for (const r of rebuttals.metadata.rebuttals as any[]) {
                if (r.keyframeId === 'rebuttal-campaign-era-gap') continue;
                expect(`${r.keyframeId}:${Boolean(r.finding && r.source)}`).toBe(`${r.keyframeId}:true`);
            }
        });
    });

    describe('the quarantine holds', () => {
        test('the theories universe declares its claim status and points at the rebuttals', () => {
            const s = theories.metadata.safetyPolicy;
            expect(s.claimsStatus).toBe('unsubstantiated');
            expect(s.rebuttalsUniverseId).toBe(REBUTTALS_ID);
            expect(s.mitigation).toBeTruthy();
        });

        /**
         * Structural, not textual. A first attempt asserted on a regex over the whole
         * theories metadata and failed on a *legitimate* quote: the body-count provenance
         * cites the Congressional Record recording that the list's compiler admitted she
         * had "no direct evidence". That is the theory's own provenance, not a verdict.
         *
         * The quarantine property is about shape — the theories universe must not carry
         * verdicts — so this asserts on the fields that encode a verdict.
         */
        test('the theories universe carries no verdict-shaped fields', () => {
            const VERDICT_KEYS = ['finding', 'refutesKeyframeId', 'verdict', 'isSubstantiated'];
            for (const t of theories.metadata.theories as Record<string, unknown>[]) {
                const found = VERDICT_KEYS.filter(k => k in t);
                expect(`${t.keyframeId}:${found.join(',')}`).toBe(`${t.keyframeId}:`);
            }
        });

        test('no theory keyframe claims the theories universe rebuts', () => {
            for (const kf of theoryKf) expect(kf.targetKeyframeId).toBeUndefined();
        });

        /** The MPD verdict language lives in the rebuttals universe only. */
        test('the Pizzagate MPD verdict quote is absent from the theories universe', () => {
            expect(JSON.stringify(theories.metadata.theories)).not.toMatch(/fictitious conspiracy/i);
            expect(JSON.stringify(rebuttals.metadata.rebuttals)).toMatch(/fictitious conspiracy/i);
        });
    });

    describe('one-to-one pairing', () => {
        test('every theory keyframe has exactly one rebuttal', () => {
            const refuted = (rebuttals.metadata.rebuttals as { refutesKeyframeId: string }[]).map(r => r.refutesKeyframeId);
            expect([...refuted].sort()).toEqual(theoryKf.map(k => k.id).sort());
        });

        test('every rebuttal keyframe resolves its target to a real theory keyframe', () => {
            const ids = new Set(theoryKf.map(k => k.id));
            for (const kf of rebuttalKf) {
                expect(`${kf.id}:${kf.targetKeyframeId !== undefined && ids.has(kf.targetKeyframeId!)}`)
                    .toBe(`${kf.id}:true`);
                expect(`${kf.id}:${kf.targetUniverseId}`).toBe(`${kf.id}:${THEORIES_ID}`);
            }
        });

        test('the two universes reference each other symmetrically', () => {
            const parents = theories.metadata.safetyPolicy.rebuttalsUniverseId as string;
            expect(rebuttals.metadata.rebutsUniverseId).toBe(theories.universeId);
            expect(parents).toBe(rebuttals.universeId);
        });
    });

    describe('internal consistency', () => {
        test('each universe has seven keyframes in chronological order', () => {
            for (const u of [theories, rebuttals]) {
                expect(u.temporalStructure.keyframes).toHaveLength(7);
                const stamps = u.temporalStructure.keyframes.map(k => k.timestamp);
                expect(stamps).toEqual([...stamps].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
            }
        });

        test('segments are ordered and do not overlap within a universe', () => {
            for (const u of [theories, rebuttals]) {
                const segs = u.temporalStructure.segments;
                for (let i = 1; i < segs.length; i++) {
                    expect(`${segs[i].id}:${segs[i].start >= segs[i - 1].end}`).toBe(`${segs[i].id}:true`);
                }
            }
        });

        test('every keyframe falls inside its own universe span', () => {
            for (const u of [theories, rebuttals]) {
                const years = u.universeId.split(':')[2].split('-').map(Number);
                for (const kf of u.temporalStructure.keyframes) {
                    const y = new Date(Number(kf.timestamp / 1_000_000n)).getUTCFullYear();
                    expect(`${kf.id}:${y >= years[0] && y <= years[1]}`).toBe(`${kf.id}:true`);
                }
            }
        });
    });
});
