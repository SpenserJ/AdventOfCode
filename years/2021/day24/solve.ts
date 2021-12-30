import assert from 'assert';

interface ALUVars {
  w: number
  x: number;
  y: number;
  z: number;
}

type ExecutableInput = ((input: number[]) => ALUVars);

export const getExecutableInput = (rawInput: string): ExecutableInput => {
  const prefixVars = (v: string) => {
    if (v === 'w' || v === 'x' || v === 'y' || v === 'z') { return `reg.${v}`; }
    return v;
  };
  const func: string[] = ['const reg = { w: 0, x: 0, y: 0, z: 0 };'];
  const input = rawInput.trim().split('\n');
  for (let i = 0; i < input.length; i += 1) {
    const instruction = input[i].split(' ');
    switch (instruction[0]) {
      case 'inp':
        func.push(`${prefixVars(instruction[1])} = input.shift();`);
        break;

      case 'add':
        func.push(`${prefixVars(instruction[1])} = ${prefixVars(instruction[2])} + ${prefixVars(instruction[1])};`);
        break;

      case 'mul':
        func.push(`${prefixVars(instruction[1])} = ${prefixVars(instruction[1])} * ${prefixVars(instruction[2])};`);
        break;

      case 'div':
        func.push(`${prefixVars(instruction[1])} = Math.trunc(${prefixVars(instruction[1])} / ${prefixVars(instruction[2])});`);
        break;

      case 'mod':
        func.push(`${prefixVars(instruction[1])} = ${prefixVars(instruction[1])} % ${prefixVars(instruction[2])};`);
        break;

      case 'eql':
        func.push(`${prefixVars(instruction[1])} = Number(${prefixVars(instruction[1])} === ${prefixVars(instruction[2])});`);
        break;

      default:
        throw new Error(`Unimplemented instruction: ${instruction[0]}`);
    }
  }
  func.push('return reg;');
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  return new Function('input', func.join('\n')) as ExecutableInput;
};

export const getConstants = (rawInput: string): [number[], number[], number[]] => {
  const result: [number[], number[], number[]] = [[], [], []];
  const input = rawInput.trim().split('\n');
  for (let block = 0; block < 14; block += 1) {
    const i = block * 18;
    assert.match(input[i + 4], /div z (1|26)/);
    result[0][block] = input[i + 4] === 'div z 1' ? 1 : 26;
    assert.match(input[i + 5], /add x -?\d+/);
    result[1][block] = Number(input[i + 5].substring(6));
    assert.match(input[i + 15], /add y \d+/);
    result[2][block] = Number(input[i + 15].substring(6));
  }
  return result;
};

/**
 * The input can be reduced down to 14 steps where we push or pull base 26
 * values (adding in constants) on a stack. It can be reduced down to 4 simple
 * operations.
 */
export const checkInput = (
  constants: [number[], number[], number[]],
  input: Array<number | string>,
) => {
  // eslint-disable-next-line object-curly-newline
  const result: ALUVars = { w: 0, x: 0, y: 0, z: 0 };
  for (let step = 0; step < 14; step += 1) {
    result.w = Number(input.shift());
    result.x = Number((result.z % 26) + constants[1][step] !== result.w);

    // Either divide z by 26 or leave it as is
    if (constants[0][step] === 26) { result.z = Math.trunc(result.z / 26); }

    result.z *= (25 * result.x) + 1; // 1 || 26
    result.z += (result.w + constants[2][step]) * result.x;
  }
  return result.z;
};

const findConstraints = (input: string) => {
  const constants = getConstants(input);
  const stack: number[] = [];
  const constraints: [number, number, number][] = [];
  for (let i = 0; i < 14; i += 1) {
    if (constants[0][i] === 1) {
      stack.push(i);
    } else {
      const j = stack.pop();
      constraints.push([i, j, constants[2][j] + constants[1][i]]);
    }
  }
  return constraints;
};

const findMinMax = (input: string): [number, number] => {
  const min = Array(14).fill(1);
  const max = Array(14).fill(9);

  const constraints = findConstraints(input);
  for (const [i, j, diff] of constraints) {
    if (diff > 0) {
      min[i] += diff;
      max[j] -= diff;
    } else {
      min[j] -= diff;
      max[i] += diff;
    }
  }
  return [Number(min.join('')), Number(max.join(''))];
};

export const part1 = (rawInput: string) => {
  const [, testingMax] = findMinMax(rawInput);
  return testingMax;
};

export const part2 = (rawInput: string) => {
  const [testingMin] = findMinMax(rawInput);
  return testingMin;
};
