/**
 * ESLint flat config for the Photato E2E suite (Playwright + TypeScript strict).
 *
 * Same strict, type-aware TypeScript ruleset as the frontend, minus Svelte.
 * Formatting is oxfmt (.ts); eslint-config-prettier disables formatter-conflicting
 * rules. Type-aware rules need tsconfig.json coverage (include: **\/*.ts).
 */
import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import globals from 'globals'

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

export default tseslint.config(
  { ignores: ['node_modules', 'test-results', 'playwright-report'] },
  js.configs.recommended,
  prettierConfig,
  ...tseslint.configs.strictTypeChecked.map((config) => ({ ...config, files: ['**/*.ts'] })),
  {
    files: ['**/*.ts'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Node runner code plus browser globals used inside page.evaluate() callbacks.
      globals: { ...globals.node, ...globals.browser },
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: { ...sharedNonTypeAwareRules, ...sharedTypeAwareRules },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: { ...globals.node } },
  },
)
