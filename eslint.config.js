/**
 * ESLint flat config for local-time — james-gibson/local-time#166.
 *
 * History, because the shape of this file is a decision trail:
 *
 * - #135 gave the repo its first config at all: `npm run lint` advertised a
 *   check that could not pass, because there was no config anywhere and
 *   ESLint fell back to `eslint:recommended` for plain JavaScript while the
 *   `--ext .ts` flag handed it TypeScript it cannot parse. Against a stock
 *   `eslint:recommended` + `plugin:@typescript-eslint/recommended` baseline
 *   this tree reported 206 errors across 58 of 208 linted files, and 197 of
 *   those came from two rules whose strict reading does not match how this
 *   codebase is written.
 * - #140 bumped `@typescript-eslint` v6 -> v8 and turned `no-unused-vars` into
 *   an `error` after sweeping every unused import in the tree.
 * - #166 (this file) moved ESLint 8 -> 10. ESLint 9 dropped the `.eslintrc`
 *   format entirely, so `.eslintrc.cjs` became `eslint.config.js`. Nothing
 *   about the *rules* changed: this is the same decision set, expressed in the
 *   format the current major accepts. Every deviation below is a decision
 *   rather than an omission, and each names the number it was measured
 *   against so the next reader can re-measure instead of guessing.
 *
 * Format notes that are not obvious from the rules:
 *
 * - `--ext` no longer exists under flat config. Which files are linted is
 *   decided by the `files` globs below, so `npm run lint` is now `eslint src`
 *   and TypeScript is selected by config rather than by a CLI flag.
 * - `@eslint/js` is how `eslint:recommended` is reached in this format; it is
 *   declared as a devDependency rather than borrowed from eslint's own
 *   dependency tree.
 * - `@typescript-eslint/eslint-plugin` exports `flat/recommended`, which is
 *   the exact equivalent of the old `plugin:@typescript-eslint/recommended`
 *   plus the `eslint-recommended` rule overrides. Its first entry registers
 *   the parser with no `files` key, so we scope every entry to TypeScript
 *   files (the `TS_FILES` glob below).
 * - `env: { node, es2022, jest }` has no direct flat-config equivalent. It
 *   only ever fed `no-undef`, and `typescript-eslint`'s `eslint-recommended`
 *   override turns `no-undef` off for TypeScript — tsc is the real guard
 *   against an undefined identifier here. Rather than add a `globals`
 *   dependency to reinstate a rule that is off, the env is dropped and the
 *   fact is recorded here. `ecmaVersion: 2022` is kept, because that one does
 *   affect parsing.
 */
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const TS_FILES = ['**/*.ts'];

/**
 * The plugin's flat configs are unscoped (no `files` key), so applied verbatim
 * they would hand the TypeScript parser every file ESLint sees. They only make
 * sense over TypeScript, so each entry is pinned to TS globs.
 */
const scopeToTypeScript = (config) =>
  config.files ? config : { ...config, files: TS_FILES };

export default [
  {
    /**
     * Written by `scripts/sync-lore.sh` and git-ignored (.gitignore:25): the
     * compendia are private, this repo is public. Linting generated output
     * would mean `npm run lint` depends on whether a contributor happens to
     * have a pipeline state on disk — red locally, green in CI, and unfixable
     * here either way, because the source of those files lives in the KB. The
     * tree is guarded where it *can* be committed: see
     * src/config/__tests__/generated-registration.test.ts.
     */
    ignores: ['src/config/universes/imported/'],
  },
  {
    files: TS_FILES,
    ...js.configs.recommended,
  },
  ...tsPlugin.configs['flat/recommended'].map(scopeToTypeScript),
  {
    files: TS_FILES,
    languageOptions: {
      ecmaVersion: 2022,
    },
    rules: {
      /**
       * 123 of the original 206-error baseline.
       *
       * `any` is load-bearing here: the registry and the id factories narrow
       * untyped KB input through `as unknown as T` at every boundary, and the
       * plugin's rule cannot distinguish a deliberate narrowing from a
       * careless one. Turning the rule on as an error would mean rewriting the
       * casting idiom across 58 files, which is not this ticket. Left off
       * deliberately, with the debt named, rather than left implied by a
       * config that never ran.
       */
      '@typescript-eslint/no-explicit-any': 'off',

      /**
       * 74 of the original baseline's errors, across 43 files — and the split
       * is what matters. Almost all of them were unused *type* imports
       * (`CommonUniverseIds` x14, `TimePrecision` x9,
       * `createHistoricalUniverseId` x6, ...), which are erased at compile
       * time and change no behaviour; the rest were value-level leftovers the
       * rule can actually catch.
       *
       * #140 proposed `ignoreTypeImports: true` here — it does not exist.
       * Empirically: 0 occurrences in `@typescript-eslint`'s dist, and the
       * schema rejects it outright. The typescript-eslint docs list only the
       * base rule's options plus `enableAutofixRemoval`; the option people
       * reach for lives in `eslint-plugin-unused-imports`, a third-party
       * plugin. Rather than adopt a dependency to emulate it, the unused
       * imports were swept (they were genuinely unused — typecheck proves
       * it), so the rule runs at `error` with nothing suppressed.
       */
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    /**
     * 5 of the original baseline's errors. `require()` here is deliberate CJS
     * loading — `src/index.ts` resolves its runtime entry points lazily, and
     * the id-factory test compares the CommonJS and ESM copies of the same
     * module, which cannot be done with `import`. Scoped to these two files so
     * the rule stays live everywhere else. (#140 renamed the rule this
     * override disables: v8's `no-var-requires` is now `no-require-imports`.)
     */
    files: ['src/index.ts', 'src/core/__tests__/id-factory-consolidation.test.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
