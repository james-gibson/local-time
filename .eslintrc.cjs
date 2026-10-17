/**
 * ESLint config for local-time — james-gibson/local-time#135.
 *
 * Until now `npm run lint` advertised a check that could not pass: there was no
 * config anywhere in the repo, so ESLint fell back to `eslint:recommended` for
 * plain JavaScript and the `--ext .ts` flag handed it TypeScript it cannot
 * parse. Against a stock `eslint:recommended` +
 * `plugin:@typescript-eslint/recommended` baseline this tree reports 206 errors
 * across 58 of 208 linted files, and 197 of those come from two rules whose
 * strict reading does not match how this codebase is written.
 *
 * Every deviation below is a decision rather than an omission, and each names
 * the number it was measured against so the next reader can re-measure instead
 * of guessing.
 */
module.exports = {
  root: true,
  env: { node: true, es2022: true, jest: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: [
    /**
     * Written by `scripts/sync-lore.sh` and git-ignored (.gitignore:25): the
     * compendia are private, this repo is public. Linting generated output would
     * mean `npm run lint` depends on whether a contributor happens to have a
     * pipeline state on disk — red locally, green in CI, and unfixable here
     * either way, because the source of those files lives in the KB. The tree is
     * guarded where it *can* be committed: see
     * src/config/__tests__/generated-registration.test.ts.
     */
    'src/config/universes/imported/',
  ],
  rules: {
    /**
     * 123 of the baseline's 206 errors.
     *
     * `any` is load-bearing here: the registry and the id factories narrow
     * untyped KB input through `as unknown as T` at every boundary, and the
     * plugin's rule cannot distinguish a deliberate narrowing from a careless
     * one. Turning the rule on as an error would mean rewriting the casting
     * idiom across 58 files, which is not this ticket. Left off deliberately,
     * with the debt named, rather than left implied by a config that never ran.
     */
    '@typescript-eslint/no-explicit-any': 'off',

    /**
     * 74 of the baseline's 206 errors, across 43 files — and the split is what
     * matters. Almost all of them are unused *type* imports (`CommonUniverseIds`
     * x14, `TimePrecision` x9, `createHistoricalUniverseId` x6, ...), which are
     * erased at compile time and change no behaviour; the rest are interface
     * members that exist to satisfy an implementer. `warn` is the honest setting
     * here rather than `off`: the rule stays live and the debt stays visible,
     * but a tree-wide import sweep is its own change, not this one.
     *
     * The obvious fix — `ignoreTypeImports`, which would silence only the
     * type-only half — is unavailable: it is a v7+ option, and this repo pins
     * `@typescript-eslint` v6, whose `no-unused-vars` delegates to the base
     * ESLint rule and rejects the option outright. Bumping the plugin to gain it
     * is worth doing; doing it here would fold a dependency upgrade into a PR
     * about CI.
     */
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      /**
       * 5 of the baseline's 206 errors. `require()` here is deliberate CJS
       * loading — `src/index.ts` resolves its runtime entry points lazily, and
       * the id-factory test compares the CommonJS and ESM copies of the same
       * module, which cannot be done with `import`. Scoped to these two files
       * so the rule stays live everywhere else.
       */
      files: ['src/index.ts', 'src/core/__tests__/id-factory-consolidation.test.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
