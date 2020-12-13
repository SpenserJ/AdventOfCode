import fs from 'fs';
import path from 'path';

export const loadInput = (dir: string, file = 'input'): string[] => fs
  .readFileSync(path.resolve(dir, file), 'utf-8')
  .trim()
  .split('\n')
  .filter((v) => !!v);

export const sortNumbers = (a: number, b: number): number => (a - b);
