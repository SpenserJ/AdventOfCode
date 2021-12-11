import {
  serializePosition,
  deserializePosition,
  Grid,
  Position,
} from '@spenserj-aoc/utilities';

export const parseInput = (input: string) => {
  const processed = input
    .trim()
    .split('\n')
    .map((line) => line.split('').map((v) => parseInt(v, 10)));
  return new Grid(processed);
};

export const step = (grid: Grid<number>) => {
  // Increment each of the cells
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      grid.setCell(x, y, grid.getCellValue(x, y) + 1);
    }
  }

  const queue: Position[] = grid.filter((cell) => cell.value > 9);
  const flashed: string[] = queue.map((v) => serializePosition(v));
  let next: Position;
  while (next = queue.shift()) {
    const surrounding = grid.getSurrounding(next, true);
    surrounding.forEach(({ x, y, value }) => {
      const newVal = value + 1;
      grid.setCell(x, y, newVal);
      if (newVal > 9) {
        const posStr = serializePosition({ x, y });
        if (!flashed.includes(posStr)) {
          queue.push({ x, y });
          flashed.push(posStr);
        }
      }
    });
  }

  flashed.forEach((posStr) => {
    const position = deserializePosition(posStr);
    grid.setCell(position.x, position.y, 0);
  });

  return flashed.length;
};

export const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  let totalFlashes = 0;
  for (let i = 0; i < 100; i += 1) { totalFlashes += step(grid); }
  return totalFlashes;
};

export const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const targetFlashes = grid.width * grid.height;
  for (let i = 0; i < 10000; i += 1) {
    const stepFlashes = step(grid);
    if (stepFlashes === targetFlashes) {
      return i + 1;
    }
  }
  throw new Error('Could not determine the step where all octopuses flash simultaneously');
};
