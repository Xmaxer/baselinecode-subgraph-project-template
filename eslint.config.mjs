import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    files: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'mts', 'cts'].map(
      (ext) => `**/*.${ext}`,
    ),
  },
  {
    ignores: ['**/dist', '**/build', '**/node_modules', 'src/generated'],
  },
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      'prettier/prettier': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^\\.\\.?/',
              message: 'Relative imports are not allowed.',
            },
          ],
        },
      ],
      'no-console': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    files: ['src/**/*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^\\.\\.?/',
              message: 'Relative imports are not allowed.',
            },
            {
              regex: '~database/repositories/*',
              message: 'Should only import repositories from services',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/services/**/*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^\\.\\.?/',
              message: 'Relative imports are not allowed.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/database/**/*', 'src/services/**/*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^\\.\\.?/',
              message: 'Relative imports are not allowed.',
            },
            {
              regex: '~src/generated/schema*',
              message:
                'Cannot import from schema in database or services. Build mappers instead.',
            },
          ],
        },
      ],
    },
  },
];
