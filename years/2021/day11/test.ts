import {
  parseInput,
  step,
  part1,
  part2,
} from './solve';

const input = `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

describe('2020/12/08', () => {
  test('step(grid)', () => {
    const grid = parseInput(`
11111
19991
19191
19991
11111`);
    step(grid);
    expect(grid.flatten()).toEqual(`
34543
40004
50005
40004
34543`.trim());
  });

  test('Part 1', () => {
    expect(part1(input)).toEqual(1656);
  });

  test('Part 2', () => {
    expect(part2(input)).toEqual(195);
  });
});
