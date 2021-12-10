import { part1, part2 } from './solve';

const input = `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

describe('2020/12/08', () => {
  test('Part 1', () => {
    expect(part1(input)).toEqual(198);
  });

  test('Part 2', () => {
    expect(part2(input)).toEqual(230);
  });
});
