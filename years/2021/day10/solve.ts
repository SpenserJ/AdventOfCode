const parseInput = (input: string) => input
  .trim()
  .split('\n');

const correctPairs = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};
const closingBraces = Object.values(correctPairs);
const invalidPoints = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};
const completedPoints = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

export const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lineValues = input.reduce((acc, line) => {
    const expectedClosing: string[] = [];
    for (let i = 0; i < line.length; i += 1) {
      const v = line[i];
      if (closingBraces.includes(v)) {
        if (expectedClosing[0] === v) {
          expectedClosing.shift();
        } else {
          return acc + invalidPoints[v];
        }
      } else {
        expectedClosing.unshift(correctPairs[v]);
      }
    }
    return acc;
  }, 0);
  return lineValues;
};

export const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lineValues = input.map((line) => {
    const expectedClosing: string[] = [];
    for (let i = 0; i < line.length; i += 1) {
      const v = line[i];
      if (closingBraces.includes(v)) {
        if (expectedClosing[0] === v) {
          expectedClosing.shift();
        } else {
          return false;
        }
      } else {
        expectedClosing.unshift(correctPairs[v]);
      }
    }
    if (expectedClosing.length > 0) {
      return expectedClosing
        .reduce((acc, next) => ((acc * 5) + completedPoints[next]), 0);
    }
    return false;
  }).filter(Boolean).sort((a, b) => a - b);
  return lineValues[Math.floor(lineValues.length / 2)];
};
