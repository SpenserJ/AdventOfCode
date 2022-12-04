import Solver from './solve';

const input = `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

describe('2022/12/03', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(2);
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(4);
  });
});
