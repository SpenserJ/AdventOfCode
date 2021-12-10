import { part1, part2 } from './solve';

const input = `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;

describe('2020/12/08', () => {
  test('Part 1', () => {
    expect(part1(input)).toEqual(5);
  });

  test('Part 2', () => {
    expect(part2(input)).toEqual(8);
  });
});
