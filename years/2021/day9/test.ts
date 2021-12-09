import { part1, part2 } from './solve';

const input = `
2199943210
3987894921
9856789892
8767896789
9899965678`;

describe('2020/12/08', () => {
  test('Part 1', () => {
    expect(part1(input)).toEqual(15);
  });

  test('Part 2', () => {
    expect(part2(input)).toEqual(1134);
  });
});
