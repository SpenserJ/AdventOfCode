import fs from 'fs';
import path from 'path';

export const loadRawInput = (dir: string, file = 'input'): string => fs
  .readFileSync(path.resolve(dir, file), 'utf-8')
  .trim();

export const loadInput = (dir: string, file = 'input'): string[] => loadRawInput(dir, file)
  .split('\n')
  .filter((v) => !!v);

export const sortNumbers = (a: number, b: number): number => (a - b);

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const numBetween = (value: any, min: number, max: number): boolean => {
  const num = (typeof value === 'number') ? value : Number(value);

  // Handle invalid input
  if (typeof num !== 'number') { return false; }

  return min <= num && num <= max;
};
