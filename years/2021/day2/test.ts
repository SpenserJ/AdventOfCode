import { part1, part2 } from './solve';

const input = `
forward 5
down 5
forward 8
up 3
down 8
forward 2`;

describe('2020/12/08', () => {
  test('Part 1', () => {
    expect(part1(input)).toEqual(150);
  });

  test('Part 2', () => {
    expect(part2(input)).toEqual(900);
  });
});
