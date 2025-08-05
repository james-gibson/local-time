import { UniverseNetwork } from '../../core/types.js';

export const disneyNetwork: UniverseNetwork = {
  networkId: "disney",
  universes: new Set([
    "disney:mary_poppins:1964"
  ]),
  eras: [
    {
      eraId: "golden_age",
      name: "Golden Age",
      start: BigInt(Date.UTC(1937, 0, 1)) * 1000000n,
      end: BigInt(Date.UTC(1942, 0, 1)) * 1000000n,
      universes: []
    },
    {
      eraId: "renaissance",
      name: "Disney Renaissance",
      start: BigInt(Date.UTC(1989, 0, 1)) * 1000000n,
      end: BigInt(Date.UTC(1999, 0, 1)) * 1000000n,
      universes: []
    }
  ]
};

export const universeNetworks = [
  disneyNetwork
];
