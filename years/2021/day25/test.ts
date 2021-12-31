/* eslint-disable object-curly-newline */
import { loadRawInput } from '@spenserj-aoc/utilities';
import {
  parseInput,
  part1,
  renderSeaFloor,
  step,
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
    const state = parseInput(input);
    expect(renderSeaFloor(state)).toEqual(input);
    for (const expected of steps) {
      step(state);
      expect(renderSeaFloor(state)).toEqual(expected);
    }
  };

  test('simple', () => {
    testExpectedSteps(oneLine);
    testExpectedSteps(simple);
    testExpectedSteps(withWrap);
  });

  test('part 1', () => {
    expect(part1(example)).toEqual(58);
    expect(part1(realInput)).toEqual(458);
  });
});
