import { loadRawInput } from '@spenserj-aoc/utilities';
import { part1 } from './solve';

const input = loadRawInput(__dirname);
console.time('Part 1');
console.log('Part 1:', part1(input));
console.timeEnd('Part 1');
