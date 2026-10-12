import { UniverseNetwork } from '../../../core/types';
import {
  createFilmUniverseId,
  createHistoricalUniverseId,
  createMissionUniverseId,
} from '../../../core/universe-ids';

/**
 * The `nasa` universe network — `registry.getNetwork('nasa')`.
 *
 * james-gibson/local-time#57. Before this, `registry.getNetwork('nasa')` returned
 * `undefined` and had always done so: the only registered networks were `disney` and
 * `marvel`. The Apollo and NASA material was modelled as individual mission universes with
 * no network above them, which is a coherent design that `tests/jfk.test.ts` simply did not
 * assume.
 *
 * ## Two eras, and why these two
 *
 * `tests/jfk.test.ts` looks for `disaster_investigations` and `cultural_impact`. Both are
 * modelled because both carry real cross-universe claims worth asserting:
 *
 * - **`disaster_investigations`** spans Challenger to the return to flight, 1986-01-28 to
 *   1986-09-29. It exists because the gap between the accident and the Rogers Commission's
 *   report is a temporal relationship, not just a list of dates.
 * - **`cultural_impact`** spans the Apollo programme into the films made from it. It exists
 *   because the lag between a mission and its dramatisation is the thing the test is
 *   really about.
 *
 * ## `sharedEpochs` is deliberately omitted
 *
 * The `UniverseNetwork` type makes it optional, and `disneyNetwork` populates it with
 * `corporate` and `cultural` epochs. A single NASA epoch would have to span 1958 to the
 * present and mean nothing in particular, so it is left out rather than filled with a
 * placeholder. `eras` carries the structure instead.
 *
 * ## `universes` membership
 *
 * Populated with the ids that actually exist. The disney network ships with an empty `Set`
 * and entirely commented-out era membership, which is why `getUniverse` on a network
 * member is not something this codebase currently relies on — so membership here is a
 * claim, and is asserted against the registry in `nasa-network.test.ts`.
 */
export const nasaNetwork: UniverseNetwork = {
  networkId: 'nasa',
  universes: new Set([
    createMissionUniverseId('nasa', 'challenger', 1986),
    createMissionUniverseId('nasa', 'apollo13', 1970),
    createHistoricalUniverseId('rogers_commission', 1986),
    createFilmUniverseId('movie', 'apollo13', 1995),
  ]),
  eras: [
    {
      eraId: 'disaster_investigations',
      name: 'Disaster and Investigation',
      start: BigInt(Date.UTC(1986, 0, 28)) * 1000000n, // Challenger breakup
      end: BigInt(Date.UTC(1986, 8, 29)) * 1000000n, // STS-26 return to flight
      universes: [
        createMissionUniverseId('nasa', 'challenger', 1986),
        createHistoricalUniverseId('rogers_commission', 1986),
      ],
    },
    {
      eraId: 'cultural_impact',
      name: 'Cultural Impact',
      // Apollo 11 landing through the films dramatising the programme.
      start: BigInt(Date.UTC(1969, 6, 20)) * 1000000n, // 20:17 UTC, first lunar landing
      end: BigInt(Date.UTC(2000, 0, 1)) * 1000000n,
      universes: [
        createMissionUniverseId('nasa', 'apollo13', 1970),
        createFilmUniverseId('movie', 'apollo13', 1995),
      ],
    },
  ],
};
