import Solver from './solve';

const input = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

describe('2023/12/11', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(374);
  });

  test('Part 2', () => {
    const solver = new Solver(input);
    expect(solver.calculateDistances(solver.expandGalaxy(10))).toEqual(1030);
    expect(solver.calculateDistances(solver.expandGalaxy(100))).toEqual(8410);
  });
});
