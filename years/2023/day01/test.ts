import Solver from './solve';

describe('2023/12/01', () => {
  test('Part 1', () => {
    const input = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;
    expect(new Solver(input).part1()).toEqual(142);
  });

  test('Part 2', () => {
    const input = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;
    expect(new Solver(input).part2()).toEqual(281);
  });
});
