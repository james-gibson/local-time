import { NamedBoundaryEpoch } from '../../core/named-boundary';
import { POST_NINE_ELEVEN, PRE_NINE_ELEVEN } from './historical/911';
import { POST_ENRON, PRE_ENRON } from './historical/enron';

/**
 * Common named epochs — the dividing events many universes locate themselves
 * against (james-gibson/local-time#175).
 *
 * Each pair is derived from **one** boundary instant declared in the event's own
 * universe (`historical/911.ts`, `historical/enron.ts`), so no consumer re-types
 * the date and no two universes can disagree about when "post-9/11" began. The
 * epochs are half-open (`pre` has only an end, `post` only a start), because the
 * boundary is the only instant the pair claims.
 *
 * A consumer adds them by label:
 *
 * ```ts
 * .addEpoch('primary', POST_NINE_ELEVEN.epochId, { ...POST_NINE_ELEVEN })
 * ```
 *
 * This is deliberately not `UniverseNetwork.sharedEpochs`: a network is one
 * collection (Disney, Marvel), while pre/post-9/11 crosses collections — a
 * building-code universe, a war-powers statute and a film can all sit in it.
 */
export { PRE_NINE_ELEVEN, POST_NINE_ELEVEN, PRE_ENRON, POST_ENRON };

/** Every named epoch, so a test can assert the whole set without naming each. */
export const COMMON_NAMED_EPOCHS: NamedBoundaryEpoch[] = [
  PRE_NINE_ELEVEN,
  POST_NINE_ELEVEN,
  PRE_ENRON,
  POST_ENRON,
];
