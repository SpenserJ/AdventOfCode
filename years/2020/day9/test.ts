import { part1, part2 } from './solve';

const input = `
35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;

describe('2020/12/08', () => {
  test('Part 1', () => {
    expect(part1(input, 5)).toEqual(127);
  });

  test('Part 2', () => {
    expect(part2(input, 5)).toEqual(62);
  });
});
