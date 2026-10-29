import { KeyframeType, Universe, UniverseType } from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { isValidUniverseId } from '../../../../core/universe-ids';
import { allUniverses } from '../../index';
import {
  texasMailerUniverses,
  texasMailerDiscoveryReachUniverse,
  texasMailerSoloLimitUniverse,
  texasMailerPreferenceVectorUniverse,
  texasMailerDominatedChoiceUniverse,
  texasMailerProductionValueUniverse,
  texasMailerAmbiguityTolerantFormUniverse,
  texasMailerPayerLedgerUniverse,
  texasMailerOperatorProfileUniverse,
  texasMailerStationarityDomicileUniverse,
  texasMailerFivePostulatesUniverse,
} from './index';
import { beckDoublespeakUniverse } from '../../youtube/beck-doublespeak';

/**
 * james-gibson/local-time#200 — the 2026 Texas mailer analysis family.
 *
 * The family is landed as a set, so the invariants that make it a set are pinned here:
 * no dangling reference, no duplicated owner, and the correction chain the six modules
 * claim to form actually pointing where they say it points. The unlanded siblings named
 * in `metadata.threadSiblings` are asserted to be *unregistered* — if one is landed
 * later, this test fails and the note has to become a real edge.
 */

const universes = texasMailerUniverses as unknown as Universe[];

const metadata = (u: Universe): Record<string, any> => (u.metadata ?? {}) as Record<string, any>;

const keyframes = (u: Universe): any[] =>
  ((u.temporalStructure as any)?.keyframes ?? []) as any[];

const connections = (u: Universe): any => (u as any).connections;

const references = (u: Universe): Array<{ type: string; targetUniverseId: string }> =>
  (connections(u)?.references ?? []) as Array<{ type: string; targetUniverseId: string }>;

const parents = (u: Universe): string[] =>
  (connections(u)?.natural?.parentUniverses ?? []) as string[];

const idOf = (u: Universe): string => String(u.universeId);

const registered = new Set((allUniverses as unknown as Universe[]).map(idOf));

const EXPECTED_IDS = [
  'history:texas_mailer_ambiguity_tolerant_form:2026',
  'history:texas_mailer_discovery_reach:2026',
  'history:texas_mailer_dominated_choice:2026',
  'history:texas_mailer_preference_vector:2026',
  'history:texas_mailer_production_value:2026',
  'history:texas_mailer_solo_limit:2026',
  'history:texas_mailer_payer_ledger:2026',
  'history:texas_mailer_operator_profile:2026',
  'history:texas_mailer_stationarity_domicile:2026',
  'history:texas_mailer_five_postulates:2026',
];

describe('the Texas mailer analysis family (#200)', () => {
  test('lands ten history universes, each owned exactly once', () => {
    expect(universes).toHaveLength(EXPECTED_IDS.length);
    expect(universes.map(idOf).sort()).toEqual([...EXPECTED_IDS].sort());
    for (const id of EXPECTED_IDS) {
      expect(registered.has(id)).toBe(true);
    }
  });

  test('every id is a valid historical universe id', () => {
    for (const u of universes) {
      expect(isValidUniverseId(idOf(u))).toBe(true);
    }
  });

  test('every module is an interpretation, not a documentary claim', () => {
    for (const u of universes) {
      expect(u.type).toBe(UniverseType.HISTORICAL_EVENT);
      expect(u.realityRelation.type).toBe('interpretation');
      expect(u.realityRelation.fictionalizationDegree).toBeLessThan(1);
    }
  });

  test('connections use the literal object form, not the issue draft\'s array', () => {
    for (const u of universes) {
      expect(Array.isArray(connections(u))).toBe(false);
      expect(Array.isArray(connections(u)?.natural?.parentUniverses)).toBe(true);
    }
  });

  test('every declared parent resolves to a container', () => {
    const unresolved: string[] = [];
    for (const u of universes) {
      for (const parent of parents(u)) {
        if (!CommonUniverseIds.resolveDeclaredName(parent)) {
          unresolved.push(`${idOf(u)} -> ${parent}`);
        }
      }
    }
    expect(unresolved).toEqual([]);
  });

  test('every reference resolves — a dangling edge is not landed, it is withheld', () => {
    const dangling: string[] = [];
    for (const u of universes) {
      for (const ref of references(u)) {
        const target = ref.targetUniverseId;
        const isContainer = Boolean(CommonUniverseIds.resolveDeclaredName(target));
        if (!isContainer && !registered.has(target)) {
          dangling.push(`${idOf(u)} -[${ref.type}]-> ${target}`);
        }
      }
    }
    expect(dangling).toEqual([]);
  });

  test('the modules the thread proposed but nobody landed stay notes, not edges', () => {
    const noted = new Set<string>();
    for (const u of universes) {
      for (const sibling of metadata(u).threadSiblings ?? []) {
        noted.add(sibling.id);
      }
    }

    // Every unlanded sibling is named, is a valid id, and is not a registered universe.
    expect(noted.size).toBeGreaterThan(0);
    for (const id of noted) {
      expect(isValidUniverseId(id)).toBe(true);
      expect(registered.has(id)).toBe(false);
    }

    // And no module smuggles one in as a reference anyway.
    const referenced = new Set(universes.flatMap((u) => references(u).map((r) => r.targetUniverseId)));
    expect([...noted].filter((id) => referenced.has(id))).toEqual([]);
  });

  test('the correction chain points where the modules say it points', () => {
    const edges = (u: Universe): string[] =>
      references(u).map((r) => `${r.type}:${r.targetUniverseId}`);

    expect(edges(texasMailerDiscoveryReachUniverse)).toContain(
      'DOCUMENTS:series:beck_pamphlet_transcript:2026',
    );

    expect(edges(texasMailerSoloLimitUniverse)).toEqual(
      expect.arrayContaining(['SUPERSEDES:history:texas_mailer_discovery_reach:2026']),
    );

    expect(edges(texasMailerPreferenceVectorUniverse)).toEqual(
      expect.arrayContaining([
        'SUPERSEDES:history:texas_mailer_solo_limit:2026',
        'SUPERSEDES:history:texas_mailer_discovery_reach:2026',
      ]),
    );

    expect(edges(texasMailerDominatedChoiceUniverse)).toEqual(
      expect.arrayContaining([
        'CORRECTS:history:texas_mailer_preference_vector:2026',
        'SUPERSEDES:history:texas_mailer_discovery_reach:2026',
      ]),
    );

    expect(edges(texasMailerProductionValueUniverse)).toEqual(
      expect.arrayContaining([
        'CORRECTS:history:texas_mailer_dominated_choice:2026',
        'CORRECTS:history:texas_mailer_preference_vector:2026',
        'SUPERSEDES:history:texas_mailer_solo_limit:2026',
      ]),
    );

    expect(edges(texasMailerAmbiguityTolerantFormUniverse)).toEqual(
      expect.arrayContaining([
        'CORRECTS:history:texas_mailer_production_value:2026',
        'CORRECTS:history:texas_mailer_dominated_choice:2026',
        'DOCUMENTS:history:texas_mailer_preference_vector:2026',
        'SUPERSEDES:history:texas_mailer_solo_limit:2026',
      ]),
    );
  });

  test('every keyframe type is a member of the enum the draft invented values for', () => {
    const members = new Set<unknown>(Object.values(KeyframeType));
    const offenders: string[] = [];
    for (const u of universes) {
      for (const kf of keyframes(u)) {
        if (kf.type !== undefined && !members.has(kf.type)) {
          offenders.push(`${idOf(u)}#${kf.id}: ${String(kf.type)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  test('the family keeps the thread\'s credences rather than a summary of them', () => {
    // One representative per module: the value the thread revised most often.
    expect(metadata(texasMailerProductionValueUniverse).credences.segment_establishes_perceived_expense)
      .toBe(0.9);
    expect(metadata(texasMailerDominatedChoiceUniverse).credences.that_rejection_discriminates_expert_from_novice_or_agent)
      .toBe(0.1);
    expect(metadata(texasMailerPreferenceVectorUniverse).credences.agent_signature_is_modal_not_absent)
      .toBe(0.8);
    expect(metadata(texasMailerAmbiguityTolerantFormUniverse).credences.beck_is_not_speaking_honestly_as_stated)
      .toBe(0.25);
  });

  test('the ambiguity module keeps the verification failure it declares', () => {
    const note = (metadata(texasMailerAmbiguityTolerantFormUniverse).uncertaintyNotes ?? []).join(' ');
    expect(note).toContain('could not be re-verified');
    expect(idOf(texasMailerAmbiguityTolerantFormUniverse)).toBe(
      'history:texas_mailer_ambiguity_tolerant_form:2026',
    );
  });

  test('the four modules that landed with #221 cover their clocks gaplessly', () => {
    const tranche = [
      texasMailerPayerLedgerUniverse,
      texasMailerOperatorProfileUniverse,
      texasMailerStationarityDomicileUniverse,
      texasMailerFivePostulatesUniverse,
    ];

    for (const u of tranche) {
      const segments = ((u.temporalStructure as any)?.segments ?? []) as Array<{
        id: string;
        start: bigint;
        end: bigint;
      }>;

      expect(segments.length).toBeGreaterThan(1);
      for (let i = 1; i < segments.length; i += 1) {
        expect(segments[i].start).toBe(segments[i - 1].end);
        expect(segments[i].end).toBeGreaterThanOrEqual(segments[i].start);
      }

      // A keyframe before the first segment is outside the timeline it is supposed to
      // explain; the operator profile's base-rate precedents were exactly that until the
      // partition was extended back to them.
      const first = segments[0].start;
      const last = segments[segments.length - 1].end;
      for (const kf of keyframes(u)) {
        expect(kf.timestamp).toBeGreaterThanOrEqual(first);
        expect(kf.timestamp).toBeLessThanOrEqual(last);
      }
    }
  });

  test('the #221 tranche keeps the verdicts the thread reached', () => {
    expect(metadata(texasMailerPayerLedgerUniverse).payerStatus).toBe(
      'unidentified as of 2026-10-26',
    );
    expect(metadata(texasMailerPayerLedgerUniverse).motives.H4_political_deniability.prior)
      .toBe(0.5);

    expect(
      metadata(texasMailerOperatorProfileUniverse).hypothesisLedger.H6_the_prop_hypothesis.status,
    ).toBe('SURVIVES');
    expect(
      metadata(texasMailerOperatorProfileUniverse).hypothesisLedger
        .H4_activity_predates_the_retention_change.status,
    ).toContain('REFUTED');

    expect(metadata(texasMailerStationarityDomicileUniverse).doseLedger.months_no_domestic_obligation)
      .toBe(17);
    expect(metadata(texasMailerStationarityDomicileUniverse).doseLedger.marginal_effect_of_final_rule_on_capability)
      .toBe('zero');

    expect(
      metadata(texasMailerFivePostulatesUniverse).postulateLedger.P5_campaign_was_managed.status,
    ).toContain('CONFIRMED');
    expect(
      metadata(texasMailerFivePostulatesUniverse).postulateLedger.P4_printer_cleans_money.status,
    ).toBe('REFUTED');
  });

  test('the stationarity revision names the keyframe it withdraws, and it exists', () => {
    const supersede = references(texasMailerStationarityDomicileUniverse).find(
      (ref) => ref.type === 'SUPERSEDES' && (ref as any).targetKeyframeId,
    ) as { targetUniverseId: string; targetKeyframeId: string } | undefined;

    expect(supersede).toBeDefined();
    expect(supersede!.targetUniverseId).toBe(
      'history:texas_mailer_operator_profile:2026',
    );

    const target = keyframes(texasMailerOperatorProfileUniverse).find(
      (kf) => kf.id === supersede!.targetKeyframeId,
    );
    expect(target).toBeDefined();
  });

  test('every reality anchor in the #221 tranche uses a relationship type the type defines', () => {
    const allowed = new Set([
      'depicts',
      'inspired_by',
      'reinterprets',
      'contradicts',
      'reimagines',
      'documents',
      'experienced',
    ]);

    // Scoped to the modules ported here. The same guard over the whole family fails on
    // two pre-existing values in `discovery_reach` (`interprets`, `derives_from`); those
    // are instances of james-gibson/local-time#143 and are recorded there rather than
    // fixed in a porting PR.
    const tranche = [
      texasMailerPayerLedgerUniverse,
      texasMailerOperatorProfileUniverse,
      texasMailerStationarityDomicileUniverse,
      texasMailerFivePostulatesUniverse,
    ];

    const offenders: string[] = [];
    for (const u of tranche) {
      for (const anchor of u.realityRelation.realityAnchors ?? []) {
        const kind = (anchor as { relationshipType?: string }).relationshipType;
        if (!kind || !allowed.has(kind)) {
          offenders.push(`${idOf(u)}#${anchor.realEventId}: ${String(kind)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('the doublespeak pass (#200)', () => {
  test('is a series work cut from the transcription record, not a history event', () => {
    expect(beckDoublespeakUniverse.type).toBe(UniverseType.SERIES);
    expect(idOf(beckDoublespeakUniverse)).toBe('series:beck_pamphlet_doublespeak:2026');
    expect(registered.has('series:beck_pamphlet_doublespeak:2026')).toBe(true);
  });

  test('keeps the fragment address as an alias rather than as the id', () => {
    const aliases = (beckDoublespeakUniverse.identifiers.aliases ?? []).join(' ');
    expect(aliases).toContain('youtube:7g2IoTMGfPs#doublespeak@44:52-59:04');
  });

  test('derives from the transcript and the response it is cut from', () => {
    expect(references(beckDoublespeakUniverse)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'DERIVES_FROM',
          targetUniverseId: 'series:beck_pamphlet_transcript:2026',
        }),
        expect.objectContaining({
          type: 'DERIVES_FROM',
          targetUniverseId:
            'series:tim_whitaker_why_christians_lie_about_transgender_kids:2026',
        }),
      ]),
    );
  });

  test('records nineteen devices, each one a public statement', () => {
    const kfs = keyframes(beckDoublespeakUniverse);
    expect(kfs).toHaveLength(19);
    expect(kfs.filter((kf) => kf.type === KeyframeType.PUBLIC_STATEMENT)).toHaveLength(13);
  });
});
