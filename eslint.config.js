import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierRecommendedPlugin from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  js.configs.recommended,
  prettierRecommendedPlugin,
  {
    name: 'base',
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.es6,
        ...globals.node,
        ...globals.browser,
        ...globals.commonjs,
        TAny: true,
        window: true,
        process: true,
        TObject: true,
        TFunction: true,
      },
    },
    files: ['**/*.ts'],
    ignores: ['**/*.d.ts'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs['eslint-recommended'].rules,
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/semi': ['error', 'always'],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            match: true,
            regex: '^I[A-Za-z]',
          },
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'comma-dangle': ['error', 'always-multiline'],
      'linebreak-style': ['error', 'unix'],
      'max-len': 'off',
      'new-cap': 'off',
      'no-console': 'warn',
      'object-curly-spacing': 'off',
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
    },
  },
);
