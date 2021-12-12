import { part1, part2 } from './solve';

const examples = [
  `
start-A
start-b
A-c
A-b
b-d
A-end
b-end`,
  `
dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`,
  `
fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`,
];

describe('2020/12/12', () => {
  describe('Part 1', () => {
    test('Example 1', () => expect(part1(examples[0])).toEqual(10));

    test('Example 2', () => expect(part1(examples[1])).toEqual(19));

    test('Example 3', () => expect(part1(examples[2])).toEqual(226));
  });

  describe('Part 2', () => {
    test('Example 1', () => expect(part2(examples[0])).toEqual(36));

    test('Example 2', () => expect(part2(examples[1])).toEqual(103));

    test('Example 3', () => expect(part2(examples[2])).toEqual(3509));
  });
});
