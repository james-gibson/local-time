import { cybersecurityUniverses, heartbleedCVEUniverse } from './heartbleed';
import { tlsUniverses, tlsVersionsUniverse } from './tls-versions';
import { webServerUniverses, webServersUniverse } from './web-servers';

export const allCybersecurityUniverses = [
  ...cybersecurityUniverses,
  ...tlsUniverses,
  ...webServerUniverses
];

export {
  cybersecurityUniverses,
  tlsUniverses,
  webServerUniverses,
  heartbleedCVEUniverse,
  tlsVersionsUniverse,
  webServersUniverse
};
