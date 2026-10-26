import { allUniverses } from '../../src/config/universes';
import { ConfigLoader } from '../../src/config/config-loader';
import { UniverseRegistry } from '../../src/config/universe-registry';
import { CommonUniverseIds } from '../../src/core/common-universe-ids';
import {
  createSeriesUniverseId,
  isFilmUniverseId,
  isSeriesUniverseId,
  isValidUniverseId,
} from '../../src/core/universe-ids';
import { KeyframeType, TimePrecision, Universe } from '../../src/core/types';
import {
  DREY_THERANOS_PUBLISHED,
  DREY_THERANOS_RUNTIME_SECONDS,
  DREY_THERANOS_UNIVERSE_ID,
  THESIS_CLAIM_CERTAINTY,
  dreyTheranosPeople,
  dreyTheranosUniverse,
  thesisSignificance,
} from '../../src/config/universes/youtube';

/**
 * The content guard for the Drey Dossier essay (james-gibson/local-time#203).
 *
 * Registration itself is proved repo-wide by
 * `src/config/__tests__/defined-vs-registered.test.ts` — every module under
 * `src/config/universes` is imported and every id must survive a real registry
 * lookup. What that guard cannot see is whether the universe says anything
 * coherent, so this suite pins the four things the ticket got wrong and the four
 * it got right: one publication-anchored clock of 2795 s, twelve gapless
 * segments, 34 keyframes inside the epoch, a 21-person roster, and a thesis that
 * cannot outrank its own certainty.
 */

const universe = dreyTheranosUniverse as unknown as Universe & {
  temporalStructure: {
    segments: Array<{ id: string; start: bigint; end: bigint; type: string }>;
    keyframes: Array<{
      id: string;
      timestamp: bigint;
      significance: number;
      tags: string[];
      description?: string;
      certainty?: number;
      type?: KeyframeType;
    }>;
    windows: { strategy: string; avgWindowSize?: bigint };
  };
  metadata: Record<string, unknown>;
};

const NS_PER_SECOND = 1_000_000_000n;
const SECONDS = (value: number): bigint => BigInt(value) * NS_PER_SECOND;

const publicationLayer = universe.layers.find(
  (layer) => (layer as { layerId?: string }).layerId === 'primary_layer',
) as unknown as {
  epochs: Record<
    string,
    { epochId?: string; startTime?: bigint; endTime?: bigint; precision?: TimePrecision }
  >;
};

const epoch = publicationLayer.epochs.publication;
const segments = universe.temporalStructure.segments;
const keyframes = universe.temporalStructure.keyframes;

const keys = (id: string): string => String(id);

describe('the Drey Dossier essay — identity (#203)', () => {
  test('the id is a series id, produced by the factory, and not a film id', () => {
    // `isValidUniverseId` is not proof: ANY_YEAR_TERMINATED accepts nearly any
    // year-terminated shape, including ones no declared namespace owns (#50, #57).
    expect(
      createSeriesUniverseId(
        'series',
        'theranos_isnt_about_elizabeth_holmes',
        2026,
      ),
    ).toBe(DREY_THERANOS_UNIVERSE_ID);
    expect(isSeriesUniverseId(DREY_THERANOS_UNIVERSE_ID)).toBe(true);
    expect(isValidUniverseId(DREY_THERANOS_UNIVERSE_ID)).toBe(true);
    expect(isFilmUniverseId(DREY_THERANOS_UNIVERSE_ID)).toBe(false);
  });

  test('it is in allUniverses and survives a real registry lookup', async () => {
    expect(allUniverses.map((entry) => keys(entry.universeId))).toContain(
      DREY_THERANOS_UNIVERSE_ID,
    );

    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();
    expect(registry.getUniverse(DREY_THERANOS_UNIVERSE_ID)).toBeDefined();
  });

  test('the work is credited to its maker alone, and the roster is not a credit list', () => {
    expect(universe.attribution.copyright).toEqual({
      holders: ['The Drey Dossier'],
      year: 2026,
      status: 'active',
    });
    expect(universe.attribution.citations_required).toBe(true);
    expect(universe.attribution.public_domain).toBe(false);
    expect(universe.attribution.sources?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(universe.attribution.usage_restrictions?.length ?? 0).toBeGreaterThan(0);

    const creators = universe.attribution.creators ?? [];
    expect(creators.map((creator) => creator.name)).toEqual(['The Drey Dossier']);
    expect(creators[0].roles).toEqual(['writer', 'producer', 'researcher']);

    // Subjects are carried separately: a director or an AG is not a participant
    // in the making of the essay (#148).
    expect(universe.metadata.people).toBe(dreyTheranosPeople);
  });
});

describe('the Drey Dossier essay — one clock, 46:35', () => {
  test('the publication epoch carries an explicit epochId and is 2795 s long', () => {
    expect(epoch.epochId).toBe(`${DREY_THERANOS_UNIVERSE_ID}:publication`);
    expect(epoch.startTime).toBe(DREY_THERANOS_PUBLISHED);
    expect(epoch.endTime! - epoch.startTime!).toBe(
      SECONDS(DREY_THERANOS_RUNTIME_SECONDS),
    );
    expect(epoch.precision).toBe(TimePrecision.SECOND);
    // 2795 s = 46:35. The ticket's 46:31 is the last caption cue, not the runtime.
    expect(DREY_THERANOS_RUNTIME_SECONDS).toBe(46 * 60 + 35);
  });

  test('every keyframe sits inside the publication epoch', () => {
    const outside = keyframes
      .filter(
        (keyframe) =>
          keyframe.timestamp < epoch.startTime! ||
          keyframe.timestamp > epoch.endTime!,
      )
      .map((keyframe) => keyframe.id);
    expect(outside).toEqual([]);
  });

  test('twelve segments are contiguous from 0:00 to the runtime', () => {
    expect(segments).toHaveLength(12);
    // Segments are absolute instants on the publication clock, not offsets from zero.
    expect(segments[0].start).toBe(DREY_THERANOS_PUBLISHED);
    expect(segments[segments.length - 1].end).toBe(
      DREY_THERANOS_PUBLISHED + SECONDS(DREY_THERANOS_RUNTIME_SECONDS),
    );

    const gaps: string[] = [];
    for (let index = 1; index < segments.length; index += 1) {
      if (segments[index].start !== segments[index - 1].end) {
        gaps.push(`${segments[index - 1].id} -> ${segments[index].id}`);
      }
    }
    expect(gaps).toEqual([]);

    const allowed = new Set([
      'sequence',
      'act',
      'scene',
      'phase',
      'countdown',
      'mission_phase',
      'life_period',
      'education',
      'career',
      'public_service',
      'legal_period',
      'legislation_active',
      'court_jurisdiction',
    ]);
    expect(segments.filter((segment) => !allowed.has(segment.type))).toEqual([]);
  });

  test('windowing is scene_based, with no average window size', () => {
    expect(universe.temporalStructure.windows.strategy).toBe('scene_based');
    expect(universe.temporalStructure.windows.avgWindowSize).toBeUndefined();
  });
});

describe('the Drey Dossier essay — keyframes are corpus, not decoration', () => {
  test('there are 34, with unique ids, a real type and a one-sentence description', () => {
    expect(keyframes).toHaveLength(34);
    expect(new Set(keyframes.map((keyframe) => keyframe.id)).size).toBe(34);

    const types = new Set(Object.values(KeyframeType) as string[]);
    const offenders = keyframes
      .filter(
        (keyframe) =>
          !keyframe.type ||
          !types.has(keyframe.type) ||
          !keyframe.description ||
          keyframe.description.trim() === '',
      )
      .map((keyframe) => keyframe.id);
    expect(offenders).toEqual([]);
  });

  test('significance and certainty stay in range', () => {
    const offenders = keyframes
      .filter(
        (keyframe) =>
          keyframe.significance < 0 ||
          keyframe.significance > 1 ||
          (keyframe.certainty !== undefined &&
            (keyframe.certainty < 0 || keyframe.certainty > 1)),
      )
      .map((keyframe) => keyframe.id);
    expect(offenders).toEqual([]);
  });

  test('the thesis is scored from its inputs and capped at its own certainty', () => {
    const thesisFrames = keyframes.filter((keyframe) =>
      keyframe.tags.includes('thesis'),
    );
    expect(thesisFrames).toHaveLength(2);

    for (const frame of thesisFrames) {
      expect(frame.certainty).toBe(THESIS_CLAIM_CERTAINTY);
      // C-12: the less-documented claim must not carry documentary weight.
      expect(frame.significance).toBeLessThan(0.9);
      expect(frame.significance).toBeLessThanOrEqual(THESIS_CLAIM_CERTAINTY);
      expect(frame.significance).toBe(THESIS_CLAIM_CERTAINTY);
    }

    // The helper is the input, and the cap is what keeps the two axes apart.
    expect(thesisSignificance(0.95, 0.95, 0.95)).toBe(THESIS_CLAIM_CERTAINTY);
    expect(thesisSignificance(0.2)).toBe(0.2);
    expect(thesisSignificance()).toBe(0);
  });
});

describe('the Drey Dossier essay — roster and edges', () => {
  test('21 named subjects, ordered by first mention inside the runtime', () => {
    expect(dreyTheranosPeople).toHaveLength(21);
    expect(new Set(dreyTheranosPeople.map((person) => person.name)).size).toBe(21);

    const mentions = dreyTheranosPeople.map((person) => person.firstMentionSeconds);
    expect(mentions).toEqual([...mentions].sort((a, b) => a - b));
    expect(mentions[0]).toBeGreaterThanOrEqual(0);
    expect(mentions[mentions.length - 1]).toBeLessThan(DREY_THERANOS_RUNTIME_SECONDS);
  });

  test('every declared parent resolves to a container or a registered universe', () => {
    const registered = new Set(allUniverses.map((entry) => keys(entry.universeId)));
    const containers = new Set(
      Object.values(CommonUniverseIds as unknown as Record<string, unknown>).filter(
        (value): value is string => typeof value === 'string',
      ),
    );

    const parents = universe.connections?.natural?.parentUniverses ?? [];
    expect(parents).toEqual(
      expect.arrayContaining([CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT]),
    );
    expect(
      parents.filter(
        (parent) => !registered.has(keys(parent)) && !containers.has(keys(parent)),
      ),
    ).toEqual([]);
  });

  test('reality anchors are visible, well-formed and marked presumed, not declared', () => {
    const registered = new Set(allUniverses.map((entry) => keys(entry.universeId)));
    const anchors = universe.realityRelation.realityAnchors as Array<{
      realEventId: string;
      hydration?: string;
      evidence?: string[];
    }>;

    // The six subjects of the work. Referenced on purpose — dropping them would make
    // the graph look complete; declaring them without a universe would be invention.
    expect(anchors).toHaveLength(6);
    expect(anchors.map((anchor) => anchor.realEventId)).toEqual([
      'history:theranos_founded:2003',
      'history:us_v_holmes:2018-2022',
      'history:cia_stargate_program:1972-1995',
      'history:stargate_llc_announcement:2025',
      'history:anthrax_letters:2001',
      'history:biowatch:2003',
    ]);

    for (const anchor of anchors) {
      expect(isValidUniverseId(anchor.realEventId)).toBe(true);
      expect(anchor.evidence?.length ?? 0).toBeGreaterThan(0);

      // A presumed id must still be unhydrated; a declared one must resolve. The day
      // one of these universes lands, this fails until the marker is flipped.
      if (anchor.hydration === 'presumed') {
        expect(registered.has(anchor.realEventId)).toBe(false);
      } else if (anchor.hydration === 'declared') {
        expect(registered.has(anchor.realEventId)).toBe(true);
      } else {
        throw new Error(`anchor ${anchor.realEventId} has no hydration marker`);
      }
    }
  });

  test('the presumption ledger lists exactly the anchored ids and claims no charge', () => {
    const anchors = universe.realityRelation.realityAnchors.map((anchor) =>
      keys(anchor.realEventId),
    );
    const ledger = universe.metadata.presumed as Array<{
      universeId: string;
      hydration: string;
      contributesCharge: boolean;
    }>;

    expect(ledger.map((entry) => entry.universeId)).toEqual(anchors);
    expect(ledger.every((entry) => entry.contributesCharge === false)).toBe(true);
    expect(ledger.every((entry) => entry.hydration === 'presumed')).toBe(true);
  });

  test('the non-fiction claim is documentary at zero fictionalization', () => {
    expect(universe.realityRelation.type).toBe('documentary');
    expect(universe.realityRelation.fictionalizationDegree).toBe(0);
    expect(universe.metadata.cultural_significance).toBe(0.75);
    expect((universe.metadata.deviations as string[]).length).toBeGreaterThan(0);
  });
});
