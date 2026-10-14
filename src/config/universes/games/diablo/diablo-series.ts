import { Universe } from '../../../../core/types';
import { diabloFranchiseUniverse } from './diablo-franchise';
import { diabloHellfireUniverse, diabloIUniverse } from './diablo-i';
import { diabloIILordOfDestructionUniverse, diabloIIUniverse } from './diablo-ii';
import { diabloIIResurrectedUniverse } from './diablo-ii-resurrected';
import {
  diabloIIIReaperOfSoulsUniverse,
  diabloIIIRiseOfTheNecromancerUniverse,
  diabloIIIUniverse,
} from './diablo-iii';
import {
  diabloIVLordOfHatredUniverse,
  diabloIVUniverse,
  diabloIVVesselOfHatredUniverse,
} from './diablo-iv';

/**
 * The Diablo collection — the franchise container plus every mainline game,
 * expansion and the 2021 remaster (twelve universes).
 *
 * Containment is declared on each child (`connections.natural.parentUniverses`),
 * never by restating an id here: the four base games are members of the franchise
 * container, each expansion is a member of its base game, and Resurrected is a
 * member of Diablo II. One owner per id, many memberships
 * (james-gibson/local-time#74).
 *
 * A `games/index.ts` barrel spreads this array (not nests it) into `allUniverses`,
 * and `diablo-registration.test.ts` pins that every id here is both present in
 * `allUniverses` and retrievable from a fresh registry (james-gibson/local-time#112 §7).
 */
export const diabloUniverses: Universe[] = [
  diabloFranchiseUniverse,
  diabloIUniverse,
  diabloHellfireUniverse,
  diabloIIUniverse,
  diabloIILordOfDestructionUniverse,
  diabloIIResurrectedUniverse,
  diabloIIIUniverse,
  diabloIIIReaperOfSoulsUniverse,
  diabloIIIRiseOfTheNecromancerUniverse,
  diabloIVUniverse,
  diabloIVVesselOfHatredUniverse,
  diabloIVLordOfHatredUniverse,
];

export {
  diabloFranchiseUniverse,
  diabloIUniverse,
  diabloHellfireUniverse,
  diabloIIUniverse,
  diabloIILordOfDestructionUniverse,
  diabloIIResurrectedUniverse,
  diabloIIIUniverse,
  diabloIIIReaperOfSoulsUniverse,
  diabloIIIRiseOfTheNecromancerUniverse,
  diabloIVUniverse,
  diabloIVVesselOfHatredUniverse,
  diabloIVLordOfHatredUniverse,
};
