class BadXMASValueError extends Error {
  constructor(public badValue: number, public preamble: number[]) {
    super(`Value ${badValue} cannot be verified with preamble: ${preamble.join(', ')}`);
    this.name = 'BadXMASValueError';
  }
}

const parseInput = (input: string): number[] => input
  .trim()
  .split('\n')
  .map((v) => parseInt(v, 10));

const execute = (input: number[], preambleSize) => {
  const remaining = [...input];
  const preamble: number[] = remaining.splice(0, preambleSize);
  let nextNum: number | undefined;
  while (nextNum = remaining.shift()) {
    let foundMatch = false;
    for (let i = 0; i < preamble.length; i += 1) {
      const needValue = nextNum - preamble[i];
      if (preamble.includes(needValue)) {
        foundMatch = true;
        continue;
      }
    }
    if (!foundMatch) {
      throw new BadXMASValueError(nextNum, preamble);
    }

    preamble.push(nextNum);
    preamble.splice(0, preamble.length - preambleSize);
  }

  // return undefined;
};

export const part1 = (rawInput: string, preambleSize = 25) => {
  const input = parseInput(rawInput);
  try {
    return execute(input, preambleSize);
  } catch (e) {
    if (e instanceof BadXMASValueError) {
      return e.badValue;
    }
    throw e;
  }
};

/*
const flipJmpNop = (instruction: Instruction) => {
  if (instruction.op === 'jmp') {
    instruction.op = 'nop'; // eslint-disable-line no-param-reassign
  } else if (instruction.op === 'nop') {
    instruction.op = 'jmp'; // eslint-disable-line no-param-reassign
  }
};
*/

export const part2 = (rawInput: string, preambleSize = 25) => {
  const input = parseInput(rawInput);
  try {
    execute(input, preambleSize);
  } catch (e) {
    if (e instanceof BadXMASValueError) {
      const sumTogether: number[] = [];
      let sum = 0;
      for (let i = 0; i < input.length; i += 1) {
        const next = input[i];
        sum += next;
        sumTogether.push(next);

        // If we're over the largest value, remove the first item from the list
        while (sum > e.badValue) {
          const remove = sumTogether.shift();
          sum -= remove;
        }

        // If we've found a sum that matches, return the sum of the smallest and largest
        if (sum === e.badValue) {
          return Math.min(...sumTogether) + Math.max(...sumTogether);
        }
      }
      throw new Error(`Could not find contiguous set for ${e.badValue}`);
    }
    throw e;
  }
  throw new Error('Could not find vulnerability in input');
};
