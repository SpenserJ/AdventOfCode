import Solver from './solve';

const input = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

describe('2022/12/03', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(157);
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(70);
  });
});
