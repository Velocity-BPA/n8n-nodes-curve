/**
 * @type {import('@types/eslint').Linter.Config}
 */
module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'n8n-nodes-base'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:n8n-nodes-base/community',
    'prettier',
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '*.js',
    'gulpfile.js',
    'jest.config.js',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'n8n-nodes-base/node-param-description-missing-final-period': 'off',
    'n8n-nodes-base/node-param-description-wrong-for-dynamic-options': 'off',
    'n8n-nodes-base/node-param-description-excess-final-period': 'off',
  },
};
