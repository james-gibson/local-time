import { cybersecurityUniverses, heartbleedCVEUniverse } from './heartbleed';
import { tlsUniverses, tlsVersionsUniverse } from './tls-versions';
import { webServerUniverses, webServersUniverse } from './web-servers';
// `access-control.ts` was the fourth module in this namespace and the only one this
// barrel never mentioned, so its four `system:secure_ledger:*` universes were built,
// validated and discarded (james-gibson/local-time#153).
import { secureLedgerSystemUniverses } from './access-control';

export const allCybersecurityUniverses = [
  ...cybersecurityUniverses,
  ...secureLedgerSystemUniverses,
  ...tlsUniverses,
  ...webServerUniverses
];

export {
  cybersecurityUniverses,
  secureLedgerSystemUniverses,
  tlsUniverses,
  webServerUniverses,
  heartbleedCVEUniverse,
  tlsVersionsUniverse,
  webServersUniverse
};
