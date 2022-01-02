/* eslint-disable object-curly-newline */
import { loadRawInput } from '@spenserj-aoc/utilities';
import Solver, {
  renderSeaFloor,
} from './solve';

const oneLine = `
...>>>>>...

...>>>>.>..

...>>>.>.>.`.trim();

const simple = `
..........
.>v....v..
.......>..
..........

..........
.>........
..v....v>.
..........`.trim();

const withWrap = `
...>...
.......
......>
v.....>
......>
.......
..vvv..

..vv>..
.......
>......
v.....>
>......
.......
....v..

....v>.
..vv...
.>.....
......>
v>.....
.......
.......

......>
..v.v..
..>v...
>......
..>....
v......
.......

>......
..v....
..>.v..
.>.v...
...>...
.......
v......`.trim();

const example = `
v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`.trim();

const realInput = loadRawInput(__dirname);

describe('2020/12/25', () => {
  const testExpectedSteps = (raw: string): void => {
    const [input, ...steps] = raw.split('\n\n');
    const solver = new Solver(input);
    expect(renderSeaFloor(solver.state)).toEqual(input);
    for (const expected of steps) {
      solver.trackStep();
      expect(renderSeaFloor(solver.state)).toEqual(expected);
    }
  };

  test('simple', () => {
    testExpectedSteps(oneLine);
    testExpectedSteps(simple);
    testExpectedSteps(withWrap);
  });

  test('part 1', () => {
    const exampleSolver = new Solver(example);
    expect(exampleSolver.part1()).toEqual(58);
    expect(renderSeaFloor(exampleSolver.state)).toEqual(`
..>>v>vv..
..v.>>vv..
..>>v>>vv.
..>>>>>vv.
v......>vv
v>v....>>v
vvv.....>>
>vv......>
.>v.vv.v..`.trim());
    expect(new Solver(realInput).part1()).toEqual(458);
  });
});
