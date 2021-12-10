/* eslint-disable no-bitwise, no-continue */

interface Point {
  x: number;
  y: number;
}

interface Line {
  from: Point;
  to: Point;
}

const expandLineToPoints = (line: Line): Point[] => {
  const points: Point[] = [line.from];

  let { x, y } = line.from;

  while (x !== line.to.x || y !== line.to.y) {
    if (x !== line.to.x) { x += Math.sign(line.to.x - x); }
    if (y !== line.to.y) { y += Math.sign(line.to.y - y); }
    points.push({ x, y });
  }

  return points;
};

const parseInput = (input: string, allowDiagonal: boolean) => {
  const lines = input.trim().split('\n').map((line) => {
    const [, fromX, fromY, toX, toY] = line.match(/^(\d+),(\d+) -> (\d+),(\d+)$/);

    // Filter out diagonal lines
    if (!allowDiagonal && fromX !== toX && fromY !== toY) { return undefined; }

    return {
      from: {
        x: parseInt(fromX, 10),
        y: parseInt(fromY, 10),
      },
      to: {
        x: parseInt(toX, 10),
        y: parseInt(toY, 10),
      },
    };
  }).filter(Boolean);

  const points = lines.flatMap(expandLineToPoints);
  const grid = points.reduce((acc, next) => {
    acc[next.y] ||= [];
    acc[next.y][next.x] = (acc[next.y][next.x] || 0) + 1;
    return acc;
  }, [] as number[][]);
  return grid;
};

const solve = (input: string, allowDiagonal: boolean) => {
  const grid = parseInput(input, allowDiagonal);
  return grid.flat().filter((v) => v >= 2).length;
};

export const part1 = (input: string) => solve(input, false);

export const part2 = (input: string) => solve(input, true);
