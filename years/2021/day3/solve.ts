import { bisect } from '@spenserj-aoc/utilities';

const parseInput = (input: string) => input
  .trim()
  .split('\n');

export const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const size = input.length;
  const numBits = input[0].length;
  const oneBits = input.reduce((acc, next) => {
    for (let i = 0; i < numBits; i += 1) {
      if (next[i] === '1') { acc[i] += 1; }
    }
    return acc;
  }, Array<number>(numBits).fill(0));
  const gammaBits = [];
  const epsilonBits = [];
  for (let i = 0; i < numBits; i += 1) {
    gammaBits.push(Number(oneBits[i] >= size / 2));
    epsilonBits.push(Number(oneBits[i] < size / 2));
  }
  return parseInt(gammaBits.join(''), 2) * parseInt(epsilonBits.join(''), 2);
};

const splitMatchingBits = (input: string[], bitPosition: number) => {
  const [, lastLeft] = bisect(input, (value) => (value[bitPosition] === '1'));
  return [input.slice(0, lastLeft + 1), input.slice(lastLeft + 1)];
};

export const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).sort();
  let oxygen = input;
  let co2 = input;
  for (let i = 0; i < input[0].length; i += 1) {
    if (oxygen.length > 1) {
      const result = splitMatchingBits(oxygen, i);
      oxygen = result[0].length > result[1].length ? result[0] : result[1];
    }
    if (co2.length > 1) {
      const result = splitMatchingBits(co2, i);
      co2 = result[0].length <= result[1].length ? result[0] : result[1];
    }
  }

  return parseInt(oxygen[0], 2) * parseInt(co2[0], 2);
};
