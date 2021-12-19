import fs from 'fs';
import path from 'path';

export const loadRawInput = (dir: string, file = 'input'): string => fs
  .readFileSync(path.resolve(dir, file), 'utf-8')
  .trim();

export const loadInput = (dir: string, file = 'input'): string[] => loadRawInput(dir, file)
  .split('\n')
  .filter((v) => !!v);

export const sortNumbers = (a: number, b: number): number => (a - b);

export const numBetween = (value: any, min: number, max: number): boolean => {
  const num = (typeof value === 'number') ? value : Number(value);

  // Handle invalid input
  if (typeof num !== 'number') { return false; }

  return min <= num && num <= max;
};

// Input of false means left and true means right
export const binaryPartition = (min: number, max: number, input: boolean[]): [number, number] => {
  const range = [min, max] as [number, number];

  let nextStep = input.shift();
  while (typeof nextStep !== 'undefined') {
    const rangeSize = range[1] - range[0];
    const halfRange = Math.ceil(rangeSize / 2);
    if (nextStep) {
      range[0] += halfRange;
    } else {
      range[1] -= halfRange;
    }

    // Pull the next step out of the input
    nextStep = input.shift();
  }

  return range;
};

export const sum = (input: number[]) => input.reduce((acc, next) => (acc + next), 0);

/**
 * The termial is the sum of all positive integers less than or equal to n.
 *
 * termial(5) = 5 + 4 + 3 + 2 + 1
 * @returns The termial of n
 */
export const termial = (n: number) => (n * (n + 1)) / 2;

export { default as bisect } from './bisect';
export * from './arrays';
export { default as Grid } from './Grid';
export * from './Grid';
export * from './ExhaustivePathFinder';
export { default as DijkstraPathFinder } from './DijkstraPathFinder';
export * from './DijkstraPathFinder';
export * from './Heaps';
export * from './PriorityQueues';
