import Solver from './solve';

const input = `
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const input2 = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

describe('2023/12/08', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(2);
    expect(new Solver(input2).part1()).toEqual(6);
  });

  test('Part 2', () => {
    const part2Input = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;
    expect(new Solver(part2Input).part2()).toEqual(6);
  });
});
