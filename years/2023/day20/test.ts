import Solver from './solve';

const input1 = `
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const input2 = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

describe('2023/12/20', () => {
  test('Part 1', () => {
    expect(new Solver(input1).part1()).toEqual(32000000);
    expect(new Solver(input2).part1()).toEqual(11687500);
  });
});
