import Solver from './solve';

const input = `
30373
25512
65332
33549
35390
`;

describe('2022/12/08', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(21);
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(8);
  });
});
