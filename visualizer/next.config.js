const withTM = require('next-transpile-modules')([
  '@spenserj-aoc/utilities',
  '@spenserj-aoc/2021',
]);

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
});
