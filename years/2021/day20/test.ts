/* eslint-disable object-curly-newline */
import { loadRawInput } from '@spenserj-aoc/utilities';
import {
  getCurrentPixelState,
  getNewPixelValue,
  parseInput,
  part1,
  part2,
  renderState,
  State,
  step,
} from './solve';

const algorithm = '..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#';

const input = `
${algorithm}

#..#.
#....
##..#
..#..
..###`;

const realInput = loadRawInput(__dirname);

describe('2020/12/20', () => {
  const withRenderedState = (state: State): Omit<State, 'data'> & { data: string } => ({
    ...state,
    data: renderState(state),
  });

  test('parseInput', () => {
    expect(withRenderedState(parseInput(input))).toEqual({
      step: 0,
      algorithm,
      minX: 0,
      maxX: 4,
      minY: 0,
      maxY: 4,
      data: `
#..#.
#....
##..#
..#..
..###`.trim(),
    });
  });

  test('getCurrentPixelState / getNewPixelValue', () => {
    const state = parseInput(input);

    expect(getCurrentPixelState(state, 0, 0)).toEqual(0b000_010_010);
    expect(getNewPixelValue(state, 0, 0)).toEqual(false);
    expect(getCurrentPixelState(state, 1, 1)).toEqual(0b100_100_110);
    expect(getNewPixelValue(state, 1, 1)).toEqual(false);
    expect(getCurrentPixelState(state, 2, 2)).toEqual(0b000_100_010);
    expect(getNewPixelValue(state, 2, 2)).toEqual(true);
    expect(getCurrentPixelState(state, 3, 3)).toEqual(0b001_100_111);
    expect(getNewPixelValue(state, 3, 3)).toEqual(true);
  });

  test('step', () => {
    let state = parseInput(input); // eslint-disable-line prefer-const

    state = step(state);
    expect(withRenderedState(state)).toEqual({
      step: 1,
      algorithm,
      minX: -1,
      maxX: 5,
      minY: -1,
      maxY: 5,
      data: `
.##.##.
#..#.#.
##.#..#
####..#
.#..##.
..##..#
...#.#.`.trim(),
    });

    state = step(state);
    expect(withRenderedState(state)).toEqual({
      step: 2,
      algorithm,
      minX: -2,
      maxX: 6,
      minY: -2,
      maxY: 6,
      data: `
.......#.
.#..#.#..
#.#...###
#...##.#.
#.....#.#
.#.#####.
..#.#####
...##.##.
....###..`.trim(),
    });
  });

  test('part 1', () => {
    expect(part1(input)).toEqual(35);
    expect(part1(realInput)).toEqual(5065);
  });

  test('Part 2', () => {
    expect(part2(input)).toEqual(3351);
  });
});
