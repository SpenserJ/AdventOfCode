import { part1, part2 } from './solve';

const input = '3,4,3,1,2';

describe('2020/12/08', () => {
  test('Part 1', () => {
    expect(part1(input)).toEqual(5934);
  });

  test('Part 2', () => {
    expect(part2(input)).toEqual(26984457539);
  });
});
