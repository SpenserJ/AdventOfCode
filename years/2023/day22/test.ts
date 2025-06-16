import Solver from './solve';

const input = `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`;

describe('2023/12/22', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(5);
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(7);
  });
});
