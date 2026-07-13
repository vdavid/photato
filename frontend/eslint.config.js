/**
 * ESLint flat config for the Photato frontend (Svelte 5 runes + TypeScript strict).
 *
 * Enforces strict, type-aware TypeScript rules plus Svelte-specific parsing.
 * Formatting is handled by oxfmt (.ts/.js/.json) and prettier (.svelte), not
 * ESLint. eslint-config-prettier disables any rule that would fight the formatter.
 *
 * Type-aware rules need TypeScript's project service, so the linted files must be
 * covered by tsconfig.json's `include` (src/**\/*.{ts,svelte}, vite.config.ts).
 */
import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import svelte from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'
import globals from 'globals'

// Underscore-prefixed names are an intentional "deliberately unused" marker.
const unusedVarsRule = ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }]

const sharedNonTypeAwareRules = {
  '@typescript-eslint/no-unused-vars': unusedVarsRule,
  '@typescript-eslint/no-explicit-any': 'error',
  'no-console': 'warn',
  complexity: ['error', { max: 15 }],
}

const sharedTypeAwareRules = {
  '@typescript-eslint/no-unsafe-assignment': 'error',
  '@typescript-eslint/no-unsafe-call': 'error',
  '@typescript-eslint/no-unsafe-member-access': 'error',
  '@typescript-eslint/no-unsafe-return': 'error',
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/no-misused-promises': 'error',
  '@typescript-eslint/require-await': 'error',
}

const projectServiceConfig = { projectService: true, tsconfigRootDir: import.meta.dirname }

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'public'] },
  js.configs.recommended,
  prettierConfig,
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,svelte.ts,svelte}'],
  })),
  ...svelte.configs['flat/recommended'],
  {
    files: ['**/*.ts'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: projectServiceConfig,
    },
    rules: { ...sharedNonTypeAwareRules, ...sharedTypeAwareRules },
  },
  {
    // Svelte 5 runes modules: plain TypeScript, so force the TS parser (this
    // block runs after the svelte config, which would otherwise claim them).
    files: ['**/*.svelte.ts'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: projectServiceConfig,
    },
    rules: { ...sharedNonTypeAwareRules, ...sharedTypeAwareRules },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        ...projectServiceConfig,
        extraFileExtensions: ['.svelte'],
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': unusedVarsRule,
      'no-console': 'warn',
      complexity: ['error', { max: 15 }],
    },
  },
  {
    // JS config files: no type-aware linting (they're outside tsconfig), Node globals.
    files: ['**/*.{js,cjs,mjs}'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: { ...globals.node } },
  },
)
