import { loadRawInput } from '../../utils';

const input = loadRawInput(__dirname).split('\n\n'); // Split into groups

const part1 = input.map((group) => {
  const combined = group.split('').sort().join('').trim();
  // Replace any repeated characters with a single reference
  return combined.replace(/([a-z])\1+/g, '$1');
}).join('').length;

const part2 = input.map((group) => {
  const people = group.split('\n').length;
  const combined = group.split('').sort().join('').trim();
  // Replace any characters that have been repeated once for each person with
  // a single `.`, and remove any characters that haven't
  return combined
    .replace(new RegExp(`([a-z])\\1{${people - 1}}`, 'g'), '.')
    .replace(/[a-z]/g, '');
}).join('').length;

console.log('Part 1:', part1);
console.log('Part 2:', part2);
