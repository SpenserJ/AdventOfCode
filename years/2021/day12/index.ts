import { loadRawInput } from '@spenserj-aoc/utilities';
import { part1, part2 } from './solve';

const input = loadRawInput(__dirname);
console.time('Part 1');
// console.log('Part 1:', part1(input));
console.timeEnd('Part 1');
console.time('Part 2');
console.log('Part 2:', part2(input));
console.timeEnd('Part 2');
