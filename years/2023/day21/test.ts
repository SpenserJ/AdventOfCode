import Solver from './solve';

const input = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

describe('2023/12/21', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1(6)).toEqual(16);
  });

  // Test is disabled because the step values don't align with a full grid
  test.skip('Part 2', () => {});
});
