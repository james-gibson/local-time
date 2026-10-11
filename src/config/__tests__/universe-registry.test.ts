import { UniverseRegistry } from '../universe-registry';
import { UniverseBuilder } from '../../core/universe-builder';
import { Universe } from '../../core/types';

/**
 * A registry that loads no external configuration, so `initialize()` only
 * registers the built-in universes. Mirrors the reproduction in
 * james-gibson/local-time#19.
 */
const emptyRegistry = (): UniverseRegistry =>
  new UniverseRegistry({ loadConfigurations: async () => [] } as any);

describe('UniverseRegistry epoch flattening (#19)', () => {
  test('the builder stamps epochId on epochs added via the 3-arg addEpoch', () => {
    const universe = new UniverseBuilder()
      .film('pixar', 'epoch_stamp_test', 2023)
      .withRuntime(100)
      .withRealityRelation('pure_fiction', 1.0)
      .withPublicDomain(['Test'])
      .build();

    const runtimeLayer = universe.layers.find((layer) => layer.layerId === 'runtime');
    expect(runtimeLayer).toBeDefined();
    expect(runtimeLayer!.epochs.main).toBeDefined();
    expect(runtimeLayer!.epochs.main.epochId).toBe('main');
  });

  test('registerUniverse keeps a universe whose layer epoch has no epochId', () => {
    const registry = emptyRegistry();
    const universe = {
      universeId: 'history:registry_test:1963',
      identifiers: { primary: 'history:registry_test:1963', aliases: [] },
      type: 'historical_event',
      layers: [
        {
          layerId: 'primary',
          type: 'primary',
          epochs: {
            // Deliberately malformed: the epoch object has no `epochId`.
            date_epoch: { startTime: 0n, endTime: 0n, precision: 'day' },
          },
        },
      ],
      epochs: {},
      realityRelation: { type: 'documentary', realityAnchors: [], fictionalizationDegree: 0 },
      attribution: { public_domain: true },
      metadata: {},
    } as unknown as Universe;

    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    registry.registerUniverse(universe.universeId, universe);

    // The universe is stored (previously it was silently dropped) ...
    expect(registry.getUniverse('history:registry_test:1963')).toBeDefined();
    // ... and the malformed epoch survives under its layer key.
    expect((universe.epochs as Record<string, unknown>).date_epoch).toBeDefined();
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });
});
