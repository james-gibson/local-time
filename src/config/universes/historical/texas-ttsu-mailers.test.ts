import { KeyframeType, Universe, UniverseType } from '../../../core/types';
import { isValidUniverseId } from '../../../core/universe-ids';
import { allUniverses } from '../index';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import {
  texasTtsuMailersUniverse,
  texasTtsuMailersUniverses,
} from './texas-ttsu-mailers';
import { texasPaulTtsuMailersUniverse } from '../youtube/texas-paul-ttsu-mailers';

/**
 * james-gibson/local-time#207 — the TTSU / "student union" mailer controversy.
 *
 * The ticket's acceptance criteria, asserted rather than reviewed: registered, one
 * epochId, four contiguous phases, phase-based windows, enum-valid keyframe types,
 * descriptions on every keyframe, the composition layer with its deviations, and the
 * certainty caps that keep single-source allegations out of the record's findings.
 *
 * Two invariants are house rules rather than ticket items, and both are the reason this
 * file exists rather than a checklist: every `references` target resolves (a dangling
 * edge reads as a module that is not there), and every demoted entity is *not* a
 * universe, so landing an ORGANIZATION/PERSON type later converts the table into
 * universes deliberately rather than by accident (#208).
 */

const universe = texasTtsuMailersUniverse as unknown as Universe;
const commentary = texasPaulTtsuMailersUniverse as unknown as Universe;

const meta = (u: Universe): Record<string, any> => (u.metadata ?? {}) as Record<string, any>;
const keyframes = (u: Universe): any[] => ((u.temporalStructure as any)?.keyframes ?? []) as any[];
const segments = (u: Universe): any[] => ((u.temporalStructure as any)?.segments ?? []) as any[];
const layers = (u: Universe): any[] => (u.layers ?? []) as any[];
const connections = (u: Universe): any => (u as any).connections;
const references = (u: Universe): Array<{ type: string; targetUniverseId: string }> =>
  (connections(u)?.references ?? []) as Array<{ type: string; targetUniverseId: string }>;
const parents = (u: Universe): string[] =>
  (connections(u)?.natural?.parentUniverses ?? []) as string[];

const registered = new Set((allUniverses as unknown as Universe[]).map((u) => String(u.universeId)));

describe('the TTSU mailer controversy is a registered event (#207)', () => {
  test('is in allUniverses and survives a real registry lookup', () => {
    expect(texasTtsuMailersUniverses).toEqual([universe]);
    expect(registered.has(String(universe.universeId))).toBe(true);

    const registry = new UniverseRegistry(new ConfigLoader());
    registry.registerUniverse(String(universe.universeId), universe as never);
    expect(registry.getUniverse(String(universe.universeId))).toBeDefined();
  });

  test('registers the id the corpus already references, not a second address', () => {
    expect(String(universe.universeId)).toBe('history:texas_trans_student_mailer_controversy:2026');
    expect(isValidUniverseId(String(universe.universeId))).toBe(true);
    expect(universe.identifiers.primary).toBe(universe.universeId);
    // The ticket's proposed slug survives as an alias rather than as a rival id.
    expect(universe.identifiers.aliases).toContain(
      'history:texas_transgender_student_union_mailers:2026',
    );
  });

  test('is a documentary event at the ticket\'s stated weight', () => {
    expect(universe.type).toBe(UniverseType.HISTORICAL_EVENT);
    expect(universe.realityRelation.type).toBe('documentary');
    expect(universe.realityRelation.fictionalizationDegree).toBe(0);
    expect(meta(universe).cultural_significance).toBe(0.82);
  });
});

describe('temporal structure (#19, #207 acceptance)', () => {
  test('every epoch carries an epochId and the campaign is one day-precision span', () => {
    const epochs = Object.values(layers(universe)[0].epochs) as any[];
    expect(epochs).toHaveLength(1);
    expect(epochs[0].epochId).toBe('history:ttsu_mailers:2026');
    expect(typeof epochs[0].startTime).toBe('bigint');
    expect(typeof epochs[0].endTime).toBe('bigint');
  });

  test('four phase segments, contiguous and gap-free across the epoch', () => {
    const s = segments(universe);
    expect(s.map((x) => x.id)).toEqual([
      'formation',
      'text_campaign',
      'mailer_surfaces',
      'identification',
    ]);
    for (const segment of s) expect(segment.type).toBe('phase');

    for (let i = 1; i < s.length; i += 1) {
      expect(s[i].start).toBe(s[i - 1].end);
    }

    const epoch = Object.values(layers(universe)[0].epochs)[0] as any;
    expect(s[0].start).toBe(epoch.startTime);
    expect(s[s.length - 1].end).toBe(epoch.endTime);
    // The live phase is the last one; the rest are closed.
    expect(s.filter((x) => x.status === 'active')).toHaveLength(1);
    expect(s[s.length - 1].status).toBe('active');
  });

  test('windows are phase-based and carry no meaningless size', () => {
    const windows = (universe.temporalStructure as any).windows;
    expect(windows.strategy).toBe('phase_based');
    expect(windows.avgWindowSize).toBeUndefined();
  });

  test('keyframes are ordered, unique, described, and enum-typed (#77, #207)', () => {
    const kfs = keyframes(universe);
    const ids = kfs.map((kf) => kf.id);
    expect(new Set(ids).size).toBe(ids.length);

    const members = new Set<unknown>(Object.values(KeyframeType));
    for (const kf of kfs) {
      expect(typeof kf.description).toBe('string');
      expect(kf.description.length).toBeGreaterThan(20);
      expect(members.has(kf.type)).toBe(true);
    }

    for (let i = 1; i < kfs.length; i += 1) {
      expect(kfs[i].timestamp >= kfs[i - 1].timestamp).toBe(true);
    }
  });

  test('the date-range keyframes carry both bounds', () => {
    const llc = keyframes(universe).find((kf) => kf.id === 'wyoming_llc_formed');
    expect(llc.dateRange.earliest).toBeLessThan(llc.dateRange.latest);
    expect(llc.timestamp >= llc.dateRange.earliest).toBe(true);
    expect(llc.timestamp <= llc.dateRange.latest).toBe(true);
  });
});

describe('certainty caps keep single-source allegations out of the findings', () => {
  test('every unverified keyframe is low-certainty and low-significance', () => {
    const unverified = keyframes(universe).filter((kf) => (kf.tags as string[]).includes('unverified'));
    expect(unverified.map((kf) => kf.id)).toEqual(['zarusen_ministry_claim']);
    for (const kf of unverified) {
      expect(kf.certainty).toBeLessThanOrEqual(0.3);
      expect(kf.significance).toBeLessThan(0.5);
    }
  });

  test('no keyframe at significance >= 0.5 is tagged unverified or single_source', () => {
    const offenders = keyframes(universe)
      .filter((kf) => kf.significance >= 0.5)
      .filter((kf) => (kf.tags as string[]).some((t) => t === 'unverified' || t === 'single_source'));
    expect(offenders).toEqual([]);
  });
});

describe('composition is a layer, not a duplicate universe (#74, #75)', () => {
  test('the asserted world is a recreation layer with recorded deviations', () => {
    const asserted = layers(universe).find((l) => l.layerId === 'as_asserted_by_mailer');
    expect(asserted.type).toBe('recreation');
    expect(asserted.reality_correspondence.accuracy).toBe(0.05);
    expect(asserted.reality_correspondence.deviations.length).toBeGreaterThanOrEqual(3);
    expect(asserted.reality_correspondence.deviations.join(' ')).toContain('TENT');
  });

  test('the denial the layer contradicts is retrievable as a keyframe', () => {
    const denial = keyframes(universe).find((kf) => kf.id === 'tent_denial');
    expect(denial.tags).toContain('contradicts');
    expect(denial.description).toContain('not authorized');
  });
});

describe('demoted entities stay entities (#207 Task 0, #208)', () => {
  test('the entity table carries every proposed row and none is registered', () => {
    const entities = meta(universe).entities as any[];
    expect(entities.length).toBeGreaterThanOrEqual(14);
    for (const entity of entities) {
      expect(entity.registered).toBe(false);
      expect(registered.has(entity.id)).toBe(false);
    }
  });

  test('held claims are capped at 0.3 and flagged', () => {
    const held = (meta(universe).entities as any[]).filter((e) => e.held);
    expect(held.map((e) => e.id).sort()).toEqual([
      'organization:newman_ministries',
      'person:bill_zarusen',
      'person:matt_zarusen',
    ]);
    for (const entity of held) expect(entity.certainty).toBeLessThanOrEqual(0.3);
  });

  test('the video\'s three corrections are recorded, not silently applied', () => {
    const claims = meta(universe).claims as any[];
    expect(claims.map((c) => c.status)).toEqual(['corrected', 'corrected', 'held']);
    expect(claims[0].record).toContain('SnailWorks');
    expect(claims[1].record).toContain('Teutopolis');
  });
});

describe('the graph resolves (#92)', () => {
  test('every reference points at a registered universe', () => {
    const dangling: string[] = [];
    for (const u of [universe, commentary]) {
      for (const ref of references(u)) {
        if (!registered.has(ref.targetUniverseId)) {
          dangling.push(`${u.universeId} -[${ref.type}]-> ${ref.targetUniverseId}`);
        }
      }
    }
    expect(dangling).toEqual([]);
  });

  test('no reference smuggles in a demoted entity id', () => {
    const entityIds = new Set((meta(universe).entities as any[]).map((e) => e.id));
    const targets = [universe, commentary].flatMap((u) => references(u).map((r) => r.targetUniverseId));
    expect(targets.filter((t) => entityIds.has(t))).toEqual([]);
  });

  test('the spine sits under US history and the midterm cycle', () => {
    const parents = (connections(universe)?.natural?.parentUniverses ?? []) as string[];
    expect(parents).toEqual(
      expect.arrayContaining([
        'history:united_states:founded',
        'history:us_election_cycle:*',
      ]),
    );
  });
});

describe('the commentary work is verified and registered (#207 row 3)', () => {
  test('is a series work with the measured duration and external id', () => {
    expect(commentary.type).toBe(UniverseType.SERIES);
    expect(String(commentary.universeId)).toBe('series:texas_paul_ttsu_mailers:2026');
    expect(registered.has(String(commentary.universeId))).toBe(true);
    expect(meta(commentary).externalId).toBe('siS5HR_tjtU');
    expect(meta(commentary).durationSeconds).toBe(175);
  });

  test('the presenter is attributed from the video\'s own metadata', () => {
    expect(meta(commentary).creators).toContain('Texas Paul');
    expect(meta(commentary).verification.measured.channel).toBe('Texas Paul');
    expect(meta(commentary).verification.measured.published).toBe('2026-10-24T14:40:22Z');
  });

  test('the spine and the work agree on the publication instant', () => {
    const published = meta(commentary).released as Date;
    const kf = keyframes(universe).find((k) => k.id === 'short_published');
    expect(BigInt(published.getTime()) * 1_000_000n).toBe(kf.timestamp);
  });

  test('it interprets the event rather than owning it', () => {
    expect(references(commentary)).toEqual([
      expect.objectContaining({
        type: 'INTERPRETS',
        targetUniverseId: 'history:texas_trans_student_mailer_controversy:2026',
      }),
    ]);
    expect(parents(commentary)).toEqual(['history:united_states:founded']);
  });
});
