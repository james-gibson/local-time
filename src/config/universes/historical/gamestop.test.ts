import { Universe, UniverseType } from '../../../core/types';
import { isValidUniverseId } from '../../../core/universe-ids';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { gamestopSqueezeUniverse, gamestopUniverses } from './gamestop';

const references = (u: Universe): Array<{ type: string; targetUniverseId: string }> =>
  ((u as any).connections?.references ?? []) as Array<{ type: string; targetUniverseId: string }>;

const parentUniverses = (u: Universe): string[] =>
  ((u as any).connections?.natural?.parentUniverses ?? []) as string[];

const keyframeIds = (u: Universe): string[] =>
  ((u.temporalStructure as any).keyframes ?? []).map((k: any) => k.id as string);

const segmentIds = (u: Universe): string[] =>
  ((u.temporalStructure as any).segments ?? []).map((s: any) => s.id as string);

const metadata = (u: Universe): any => u.metadata as any;

const temporalStructure = (u: Universe): any => u.temporalStructure as any;

describe('GameStop short squeeze universe (james-gibson/local-time#4)', () => {
  test('exposes a single timeline universe with the canonical id', () => {
    expect(gamestopUniverses).toHaveLength(1);
    expect(gamestopSqueezeUniverse.universeId).toBe('history:gamestop_squeeze:2021');
  });

  test('uses a valid historical universe id', () => {
    expect(isValidUniverseId(gamestopSqueezeUniverse.universeId as string)).toBe(true);
  });

  test('marks the event as a documentary HISTORICAL_EVENT universe', () => {
    expect(gamestopSqueezeUniverse.type).toBe(UniverseType.HISTORICAL_EVENT);
    expect(gamestopSqueezeUniverse.realityRelation.type).toBe('documentary');
    expect(gamestopSqueezeUniverse.realityRelation.fictionalizationDegree).toBe(0.0);
  });

  test('records the researched timeline keyframes in order', () => {
    expect(keyframeIds(gamestopSqueezeUniverse)).toEqual([
      'board_announcement',
      'initial_surge',
      'musk_tweet',
      'melvin_closes_position',
      'trading_restrictions',
      'sec_statement',
      'house_hearing',
    ]);
  });

  test('records the four phases of the episode', () => {
    expect(segmentIds(gamestopSqueezeUniverse)).toEqual([
      'catalyst',
      'squeeze',
      'intervention',
      'aftermath',
    ]);
  });

  test('carries the issue research tables as metadata', () => {
    expect(metadata(gamestopSqueezeUniverse).culturalDrivers.map((d: any) => d.reason)).toEqual([
      'Anti-Establishment Sentiment',
      'Meme Culture',
      'Potential for High Returns',
      'Accessibility of Trading',
      'Community and Entertainment',
    ]);
    expect(metadata(gamestopSqueezeUniverse).controversies.map((c: any) => c.controversy)).toEqual([
      'Market Manipulation',
      'Trading Halts',
      'Volatility and Risk',
      'Hedge Fund Practices',
      'Regulatory Scrutiny',
    ]);
  });

  /**
   * The issue's File 1 has three columns — Date, Event, Significance. The first two
   * were carried as the keyframe `timestamp` and `description`; the third, a textual
   * rationale for why each event mattered, was dropped. The owner's proposed
   * implementation carried it as `metadata.significance_note`, so both the source and
   * the design called for it.
   *
   * A numeric `significance` is not a substitute: it ranks the keyframe, the note says
   * why it mattered. This asserts the note exists on every keyframe, so the column
   * cannot go missing again unnoticed.
   */
  test("every keyframe carries the issue's textual Significance column", () => {
    const keyframes = temporalStructure(gamestopSqueezeUniverse).keyframes as {
      id: string;
      significance: number;
      metadata?: { significance_note?: string };
    }[];

    expect(keyframes).toHaveLength(7);
    for (const kf of keyframes) {
      const note = kf.metadata?.significance_note;
      expect(`${kf.id}:${typeof note === 'string' && note.trim().length > 0}`)
        .toBe(`${kf.id}:true`);
    }
  });

  test('the significance note is not just the numeric ranking restated', () => {
    const keyframes = temporalStructure(gamestopSqueezeUniverse).keyframes as {
      id: string;
      significance: number;
      metadata?: { significance_note?: string };
    }[];
    for (const kf of keyframes) {
      expect(kf.metadata!.significance_note).not.toBe(String(kf.significance));
    }
    expect(keyframes.map(k => k.id)).toEqual([
      'board_announcement',
      'initial_surge',
      'musk_tweet',
      'melvin_closes_position',
      'trading_restrictions',
      'sec_statement',
      'house_hearing',
    ]);
  });

  test('names the context universes the event sits inside', () => {
    const parents = parentUniverses(gamestopSqueezeUniverse);
    for (const id of [
      'history:global_economic_systems:*',
      'history:new_york_financial_district:*',
      'cybersecurity:internet:infrastructure_evolution',
      'history:united_states:founded',
      'history:world:*',
    ]) {
      expect(parents).toContain(id);
    }
  });

  test('links the trade to its economic backdrop and technological enabler', () => {
    expect(references(gamestopSqueezeUniverse)).toContainEqual(
      expect.objectContaining({
        type: 'CONTEMPORARY_OF',
        targetUniverseId: 'history:us_economy:2008-2022',
      }),
    );
    expect(references(gamestopSqueezeUniverse)).toContainEqual(
      expect.objectContaining({
        type: 'INFLUENCED',
        targetUniverseId: 'cybersecurity:internet:infrastructure_evolution',
      }),
    );
  });

  test('registers the universe without throwing', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    const id = gamestopSqueezeUniverse.universeId as string;
    expect(() => registry.registerUniverse(id, gamestopSqueezeUniverse)).not.toThrow();
    expect(registry.getUniverse(id)).toBeDefined();
  });
});
