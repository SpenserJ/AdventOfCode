import Solver from './solve';

const input = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

describe('2023/12/03', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(4361);
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(467835);
  });
});
