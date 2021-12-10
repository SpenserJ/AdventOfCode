const parseInput = (input: string) => input
  .trim()
  .split(',')
  .map((v) => parseInt(v, 10));

export const solve = (rawInput: string) => {
  const sorted = parseInput(rawInput).sort((a, b) => (a - b));
  const median = sorted[Math.ceil(sorted.length / 2) - 1];
  const fuelUsed = sorted.reduce((acc, next) => (acc + Math.abs(next - median)), 0);
  console.log({ sorted, median, fuelUsed });
  return fuelUsed;
};

export const part1 = (rawInput: string) => {
  const sorted = parseInput(rawInput).sort((a, b) => (a - b));
  const median = sorted[Math.ceil(sorted.length / 2) - 1];
  const fuelUsed = sorted.reduce((acc, next) => (acc + Math.abs(next - median)), 0);
  return fuelUsed;
};

const sumTo = (n: number) => (n * (n + 1)) / 2;

export const part2 = (rawInput: string) => {
  const sorted = parseInput(rawInput).sort((a, b) => (a - b));
  const mean = sorted.reduce((acc, next) => (acc + next), 0) / sorted.length;
  const meanCeil = Math.ceil(mean);
  const meanFloor = Math.floor(mean);
  const [fuelUsedCeil, fuelUsedFloor] = sorted.reduce((acc, next) => ([
    acc[0] + sumTo(Math.abs(meanCeil - next)),
    acc[1] + sumTo(Math.abs(meanFloor - next)),
  ]), [0, 0]);
  return Math.min(fuelUsedCeil, fuelUsedFloor);
};
