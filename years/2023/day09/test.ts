import Solver from './solve';

const input = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

describe('2023/12/09', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(114);
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(2);
  });
});
