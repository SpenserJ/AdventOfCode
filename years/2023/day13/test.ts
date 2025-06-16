import Solver from './solve';

const input = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

describe('2023/12/13', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(405);
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(400);
  });
});
