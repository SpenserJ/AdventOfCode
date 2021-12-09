const parseInput = (input: string) => input
  .trim()
  .split('\n')
  .map((line) => line.split('').map((v) => parseInt(v, 10)));

const getSurrounding = <T = any>(grid: T[][], x: number, y: number): T[] => {
  const result: T[] = [];
  const row = grid[y];
  if (typeof row === 'undefined' || typeof row[x] === 'undefined') {
    throw new Error('Cannot check outside of the grid');
  }
  if (y > 0) { result.push(grid[y - 1][x]); }
  if (y + 1 < grid.length) { result.push(grid[y + 1][x]); }
  if (x > 0) { result.push(row[x - 1]); }
  if (x + 1 < row.length) { result.push(row[x + 1]); }
  return result;
};

export const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let result = 0;
  for (let y = 0; y < input.length; y += 1) {
    for (let x = 0; x < input[y].length; x += 1) {
      const surrounding = getSurrounding(input, x, y);
      const value = input[y][x];
      if (surrounding.every((v) => v > value)) {
        result += (value + 1);
      }
    }
  }
  return result;
};

interface Position {
  x: number;
  y: number;
  value: number;
}

/* eslint-disable no-param-reassign */
const mergeBasins = (basins: Position[][], basinTracker: (number | 'x')[][], merge: number[]) => {
  const [targetBasin, ...otherBasins] = merge;
  otherBasins.forEach((mergeBasin) => {
    basins[mergeBasin].forEach((pos) => {
      basinTracker[pos.y][pos.x] = targetBasin;
    });
    basins[targetBasin].push(...basins[mergeBasin]);
    basins[mergeBasin] = [];
  });
};
/* eslint-enable no-param-reassign */

export const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const basins: Position[][] = [];
  const basinTracker: (number | 'x')[][] = [];
  for (let y = 0; y < input.length; y += 1) {
    basinTracker[y] = [];
    for (let x = 0; x < input[y].length; x += 1) {
      basinTracker[y][x] = 'x'; // Start by tracking it as x
      const value = input[y][x];
      if (value === 9) { continue; }
      const surrounding = getSurrounding(basinTracker, x, y).filter((v) => v !== 'x');
      if (surrounding.length > 0) {
        const [targetBasin] = surrounding as number[];
        basinTracker[y][x] = targetBasin;
        basins[targetBasin].push({ x, y, value });
        // TODO: Check if we need to merge two basins
        if (!surrounding.every((v) => v === targetBasin)) {
          mergeBasins(basins, basinTracker, surrounding as number[]);
        }
      } else {
        basinTracker[y][x] = basins.length;
        basins.push([{ x, y, value }]);
      }
    }
  }

  const largestBasins = basins.sort((a, b) => b.length - a.length).slice(0, 3);
  const result = largestBasins.reduce((acc, next) => (acc * next.length), 1);
  return result;
};
