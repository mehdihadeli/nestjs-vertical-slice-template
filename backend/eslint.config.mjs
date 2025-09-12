import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import unicorn from 'eslint-plugin-unicorn';

const eslintPluginVitest = await import('eslint-plugin-vitest');

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/coverage/',
      '**/*.json',
      '**/*.md',
      'eslint.config.mjs',
      'prettier.config.js',
      'lint-staged.config.mjs',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  // https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#configuration-new-eslintconfigjs
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      unicorn,
    },
  },
  {
    rules: {
      // Import rules
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/member-ordering': 'warn',
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/parameter-properties': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/triple-slash-reference': [
        'error',
        {
          path: 'always',
          types: 'prefer-import',
          lib: 'always',
        },
      ],
      '@typescript-eslint/unified-signatures': 'error',

      // Naming conventions
      '@typescript-eslint/naming-convention': [
        'error',
        // Interfaces and types must be PascalCase
        {
          selector: ['typeLike'],
          format: ['PascalCase'],
        },
        // Constants in .products.tokens.ts files must be SCREAMING_SNAKE_CASE
        {
          selector: 'variable',
          modifiers: ['const', 'exported'],
          types: ['boolean', 'string', 'number', 'array'],
          format: ['UPPER_CASE'],
          filter: {
            regex: '^[A-Z0-9_]+$',
            match: true,
          },
        },
        // Allow other const variables to use any format
        {
          selector: 'variable',
          modifiers: ['const'],
          format: null,
        },
      ],

      // File naming rules (kebab-case)
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: ['\\.d\\.ts$', '\\.spec\\.ts$', '\\.test\\.ts$', '\\.config\\.(js|ts)$'],
        },
      ],

      'unicorn/better-regex': 'error',

      // General best practices
      'arrow-body-style': ['error', 'as-needed'],
      'guard-for-in': 'error',
      'max-len': [
        'error',
        {
          code: 120,
          ignoreUrls: true,
          ignoreComments: false,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'new-parens': 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-cond-assign': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-eval': 'error',

      'no-new-wrappers': 'error',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'error',
      'no-undef-init': 'error',

      'no-unsafe-finally': 'error',
      'no-unused-labels': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['test/**'],
    plugins: {
      vitest: eslintPluginVitest.default,
    },
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',

      'vitest/expect-expect': 'off',
      'vitest/no-standalone-expect': 'off',

      'no-console': 'off',
    },
  },
  {
    // Extra strict rules for constant files
    files: ['**/*.products.tokens.ts', '**/*.constant.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['UPPER_CASE'],
        },
      ],
    },
  },
);
