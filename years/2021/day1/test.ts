import { part1, part2 } from './solve';

const input = `
199
200
208
210
200
207
240
269
260
263`;

describe('2020/12/08', () => {
  test('Part 1', () => {
    expect(part1(input)).toEqual(7);
  });

  test('Part 2', () => {
    expect(part2(input)).toEqual(5);
  });
});
