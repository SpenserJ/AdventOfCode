const path = require('path');

module.exports = {
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    'no-console': 'off',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      path.resolve(__dirname, './tsconfig.eslint.json'),
      path.resolve(__dirname, './tsconfig.json'),
    ],
  },
  plugins: ['@typescript-eslint'],
};
