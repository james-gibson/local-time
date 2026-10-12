/**
 * Jest runs the suite as CommonJS, deliberately, while the package itself is ESM.
 *
 * The package declares `"type": "module"` and `tsconfig` emits `module: ESNext`, so 22
 * relative imports in `src` carry an explicit `.js` suffix — Node's ESM resolver requires
 * an extension, and `./config-loader` with no suffix fails at runtime. The build is
 * correct: `tsc` emits `dist/config/index.js` containing
 * `export { ConfigLoader } from './config-loader.js';`, which resolves to the emitted
 * sibling.
 *
 * The previous config did not work, for two compounding reasons:
 *
 *   1. It used `ts-jest/presets/default-esm` *and* an explicit
 *      `transform: { '\\.ts$': ['ts-jest', {}] }`. That empty inline config **overrode**
 *      the preset's ESM-aware transform, so ts-jest fell back to emitting CommonJS.
 *   2. It declared `extensionsToTreatAsEsm: ['.ts']`, telling Jest the files were ESM,
 *      while `package.json`'s `"test": "jest"` never passed
 *      `--experimental-vm-modules`, which Jest's ESM mode requires.
 *
 * So Jest announced "these are ESM modules" and then handed them CommonJS output. Under
 * Jest's CommonJS resolver the `.js` specifiers could not be resolved at all — only
 * `.ts` exists on disk — and six suites died with
 * `Cannot find module './config-loader.js'` before running a single test. Adding
 * `--experimental-vm-modules` fixed resolution but exposed the mismatch as
 * `ReferenceError: exports is not defined`.
 *
 * The fix keeps Jest on CommonJS and teaches the resolver the one mapping it was
 * missing. ts-jest transpiles in memory, so the module *system* Jest uses is independent
 * of the module *format* the shipped package uses; nothing about production behaviour is
 * affected.
 *
 * The alternative is to commit fully to ESM: drop `transform` so the preset's own ESM
 * config applies, remove `extensionsToTreatAsEsm`, and set
 * `NODE_OPTIONS=--experimental-vm-modules` on the test script. That is closer to the
 * package's real format, but it depends on an experimental Node feature and was not
 * verified here.
 */
export default {
  // CommonJS preset: ts-jest transpiles ESNext syntax down, which is all this suite needs.
  preset: 'ts-jest/presets/default',

  /**
   * Map a relative `.js` specifier back to its TypeScript source. Jest's CommonJS
   * resolver looks for a literal `.js` file and does not perform the `.js` -> `.ts`
   * remap that `tsc` does, so without this every ESM-style relative import fails to
   * resolve.
   *
   * Scoped to relative paths (`./`, `../`) on purpose: a bare package specifier must not
   * be rewritten, and this repo has no genuine `.js` sources for it to break.
   */
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ]
};