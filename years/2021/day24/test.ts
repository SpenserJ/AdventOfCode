/* eslint-disable object-curly-newline */
import { loadRawInput } from '@spenserj-aoc/utilities';
import {
  checkInput,
  getConstants,
  getExecutableInput,
  part1,
  part2,
} from './solve';

const exampleInvert = `
inp x
mul x -1`;

const exampleIs3Times = `
inp z
inp x
mul z 3
eql z x`;

const exampleBinary = `
inp w
add z w
mod z 2
div w 2
add y w
mod y 2
div w 2
add x w
mod x 2
div w 2
mod w 2`;

const inputALU = loadRawInput(__dirname);

describe('2020/12/24', () => {
  test('getExecutableInput', () => {
    expect(getExecutableInput(exampleInvert)([10])).toEqual({ w: 0, x: -10, y: 0, z: 0 });
    expect(getExecutableInput(exampleInvert)([-2])).toEqual({ w: 0, x: 2, y: 0, z: 0 });

    expect(getExecutableInput(exampleIs3Times)([3, 9])).toEqual({ w: 0, x: 9, y: 0, z: 1 });
    expect(getExecutableInput(exampleIs3Times)([4, 2])).toEqual({ w: 0, x: 2, y: 0, z: 0 });

    expect(getExecutableInput(exampleBinary)([0])).toEqual({ w: 0, x: 0, y: 0, z: 0 });
    expect(getExecutableInput(exampleBinary)([3])).toEqual({ w: 0, x: 0, y: 1, z: 1 });
    expect(getExecutableInput(exampleBinary)([6])).toEqual({ w: 0, x: 1, y: 1, z: 0 });
    expect(getExecutableInput(exampleBinary)([10])).toEqual({ w: 1, x: 0, y: 1, z: 0 });
  });

  test('getConstants', () => {
    expect(getConstants(inputALU)).toEqual([
      [1, 1, 1, 1, 1, 26, 1, 26, 26, 1, 26, 26, 26, 26],
      [15, 10, 12, 10, 14, -11, 10, -16, -9, 11, -8, -8, -10, -9],
      [13, 16, 2, 8, 11, 6, 12, 2, 2, 15, 1, 10, 14, 10],
    ]);
  });

  test('Part 1', () => {
    expect(part1(inputALU)).toEqual(53999995829399);
    const verifyInput = '53999995829399'.toString().split('').map((v) => Number(v));
    expect(checkInput(getConstants(inputALU), [...verifyInput])).toEqual(0);
    expect(getExecutableInput(inputALU)([...verifyInput]).z).toEqual(0);
  });

  test('Part 2', () => {
    expect(part2(inputALU)).toEqual(11721151118175);
    const verifyInput = '11721151118175'.toString().split('').map((v) => Number(v));
    expect(checkInput(getConstants(inputALU), [...verifyInput])).toEqual(0);
    expect(getExecutableInput(inputALU)([...verifyInput]).z).toEqual(0);
  });
});
