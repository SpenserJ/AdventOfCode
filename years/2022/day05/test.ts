import Solver from './solve';

const input = `
-
    [D]
[N] [C]
[Z] [M] [P]
 1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;

describe('2022/12/05', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual('CMZ');
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual('MCD');
  });
});
