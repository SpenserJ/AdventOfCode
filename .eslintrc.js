const path = require('path');

module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  rules: {
    'no-console': 'off',
    'no-continue': 'off',
    'no-cond-assign': 'off',
    'no-bitwise': 'off',
    'no-underscore-dangle': ['error', {
      allowAfterThis: true,
    }],
  },
  parserOptions: {
    project: [
      path.resolve(__dirname, './tsconfig.eslint.json'),
      path.resolve(__dirname, './tsconfig.json'),
    ],
  },
  plugins: ['@typescript-eslint'],
};
