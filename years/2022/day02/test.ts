import Solver from './solve';

const input = `
A Y
B X
C Z`;

describe('2022/12/02', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(15);
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(12);
  });
});
