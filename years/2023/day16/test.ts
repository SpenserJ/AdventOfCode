import Solver from './solve';

const input = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

describe('2023/12/16', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(46);
  });

  test.only('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(51);
  });
});
