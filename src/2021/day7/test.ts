import { part1, part2 } from './solve';

const input = '16,1,2,0,4,2,7,1,2,14';

describe('2020/12/08', () => {
  test('Part 1', () => {
    expect(part1(input)).toEqual(37);
  });

  test('Part 2', () => {
    expect(part2(input)).toEqual(168);
  });
});
