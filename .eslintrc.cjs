module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-param-reassign': [2, { props: false }],
    'no-console': 'off',
    'max-len': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-underscore-dangle': 'off',
    'linebreak-style': 'off',
    'no-use-before-define': 'off', // Allow function hoisting
  },
  ignorePatterns: ['blocks/**/*.md'],
};