import Solver from './solve';

const input = `
Time:      7  15   30
Distance:  9  40  200`;

describe('2023/12/06', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(288);
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(71503);
  });
});
