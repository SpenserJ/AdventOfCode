import { loadRawInput } from '../../utils';

const parsed = loadRawInput(__dirname)
  .split('\n\n') // Groups
  .map((group) => {
    const combined = group.split('').sort().join('').trim();
    // Replace any repeated characters with a single reference
    return combined.replace(/([a-z])\1+/g, '$1');
  });

console.log('Part 1:', parsed.join('').length);
