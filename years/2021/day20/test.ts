/* eslint-disable object-curly-newline */
import { loadRawInput } from '@spenserj-aoc/utilities';
import Solution, {
  getCurrentPixelState,
  getNewPixelValue,
  renderState,
  State,
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
    expect(withRenderedState(new Solution(input).state)).toEqual({
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
    const { state } = new Solution(input);

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
    const solution = new Solution(input);

    solution.trackStep();
    expect(withRenderedState(solution.state)).toEqual({
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

    solution.trackStep();
    expect(withRenderedState(solution.state)).toEqual({
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

  describe('Solution', () => {
    describe('Example Input', () => {
      const exampleSolution = new Solution(input);
      test('Part 1', () => expect(exampleSolution.part1()).toEqual(35));
      test('Part 2', () => expect(exampleSolution.part2()).toEqual(3351));
    });

    describe('Real Input', () => {
      const realSolution = new Solution(realInput);
      test('Part 1', () => expect(realSolution.part1()).toEqual(5065));
      test('Part 2', () => expect(realSolution.part2()).toEqual(14790));
    });
  });
});
