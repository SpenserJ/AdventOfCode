import Solver from './solve';

const input = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`;

describe('2022/12/07', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(95437);
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(24933642);
  });
});
