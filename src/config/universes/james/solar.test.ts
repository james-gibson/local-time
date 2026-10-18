import { allUniverses } from '../index';
import { homeEnergyLogSept2025Universe, type HomeEnergyMetadata } from './solar';
import { UsageRestriction } from '../../../core/types';

/**
 * james-gibson/local-time#153.
 *
 * This universe is one of the system owner's private notes, published as an exemplar. Two
 * things about it were recorded wrongly on the way in, and both were the same mistake: the
 * privacy rule was read as being about the **person** rather than the **data**.
 *
 * The rule (`src/config/mcp-prompts/personal-prompt.ts`) is that personal information is
 * removed from personal data unless that data is explicitly public. It anonymises the data; it
 * never says the holder is unknown.
 *
 * Pinned here because both mistakes are prose-shaped — they typecheck and lint cleanly, and the
 * previous version survived a full suite before anyone read it. A future reader who assumes
 * "anonymised" means "anonymous" should fail here rather than in a review.
 */

const metadata = (homeEnergyLogSept2025Universe as unknown as { metadata: HomeEnergyMetadata })
    .metadata;

const anchors = homeEnergyLogSept2025Universe.realityRelation.realityAnchors ?? [];

describe('the home energy log: the data is anonymised, the work is not (#153)', () => {
    test('the universe is registered, so these assertions are about live corpus data', () => {
        const ids = (allUniverses as unknown as { universeId?: unknown }[]).map((u) =>
            String(u?.universeId),
        );
        expect(ids).toContain('home_energy_monitoring:user_redacted_202509:2026');
    });

    test('the copyright holder is the person, not an anonymous placeholder', () => {
        const holders = homeEnergyLogSept2025Universe.attribution.copyright?.holders ?? [];

        expect(holders).toContain('James Gibson');
        expect(holders).not.toContain('Anonymous User');
    });

    test('the scrub is recorded as the application of a usage term to the data', () => {
        expect(metadata.scrubbing.applied).toBe(true);
        // The usage term it discharges, named rather than described, so the record and the
        // terms cannot drift apart.
        expect(metadata.scrubbing.enforcedBy).toBe(UsageRestriction.ANONYMIZATION_REQUIRED);
        expect(
            homeEnergyLogSept2025Universe.attribution.usage_restrictions,
        ).toContain(UsageRestriction.ANONYMIZATION_REQUIRED);
        // And what it acts on. The one value this must never take is the attribution.
        expect(metadata.scrubbing.appliesTo).toBe('data');
    });

    test('the scrub is recorded on the universe, in the declared anchor shape', () => {
        // One anchor, and it is in the shape `RealityAnchor` declares. The previous pair used
        // `{ anchorId, description }`, which the interface does not have, so nothing read them.
        expect(anchors).toHaveLength(1);
        expect(anchors[0].realEventId).toBe(
            'home_energy_monitoring:user_redacted_202509:2026',
        );
        expect(anchors[0].relationshipType).toBe('documents');
        expect(anchors[0].confidence).toBe(1);
        // The scrubbing is named where it can be read, and it is the data that loses its name.
        expect(anchors[0].evidence?.join(' ')).toMatch(/metadata\.scrubbing/);
    });
});
