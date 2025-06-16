import Solver from './solve';

const input = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

describe('2023/12/14', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(136);
  });

  test.only('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(64);
  });
});
