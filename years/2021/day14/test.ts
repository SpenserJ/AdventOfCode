import { part1, part2 } from './solve';

const input = `
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

describe('2020/12/13', () => {
  test('Part 1', () => {
    expect(part1(input)).toEqual(1588);
  });

  test('Part 2', () => {
    expect(part2(input)).toEqual(2188189693529);
  });
});
