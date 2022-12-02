import Solver from './solve';

const input = `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

describe('2022/12/01', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(24000);
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(45000);
  });
});
