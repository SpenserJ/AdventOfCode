type Position = [number, number];

type Fold = [0 | 1, number];

export const parseInput = (input: string): [Position[], Fold[]] => {
  const [dotPositions, foldInstructions] = input
    .trim()
    .split('\n\n');

  const positions = dotPositions.split('\n').map((line) => (
    line.split(',').map((v) => Number(v)) as Position
  ));

  const folds = foldInstructions.split('\n').map((line): Fold => {
    const [, axis, along] = line.match(/fold along (x|y)=(\d+)/);
    return [axis === 'x' ? 0 : 1, Number(along)];
  });

  return [positions, folds];
};

const renderGrid = (positions: Position[]) => {
  const grid: string[][] = [];
  positions.forEach(([x, y]) => {
    grid[y] ||= [];
    grid[y][x] = '#';
  });
  const gridSize = {
    width: grid.reduce((acc, next) => Math.max(acc, next.length), 0),
    height: grid.length,
  };
  for (let y = 0; y < gridSize.height; y += 1) {
    if (!grid[y]) {
      grid[y] ||= Array(gridSize.width).fill('.');
    } else {
      for (let x = 0; x < gridSize.width; x += 1) {
        grid[y][x] ||= '.';
      }
    }
  }
  return grid.map((v) => v.join('')).join('\n');
};

const executeFolds = (positions: Position[], folds: Fold[]): Position[] => {
  for (let i = 0; i < folds.length; i += 1) {
    const fold = folds[i];
    for (let p = 0; p < positions.length; p += 1) {
      const pos = positions[p];
      if (pos[fold[0]] > fold[1]) {
        // eslint-disable-next-line no-param-reassign
        pos[fold[0]] = fold[1] - (pos[fold[0]] - fold[1]);
      }
    }
  }
  return positions;
};

export const part1 = (rawInput: string) => {
  const [positions, folds] = parseInput(rawInput);
  const finalPositions = executeFolds(positions, folds.slice(0, 1));
  const unique = new Set(finalPositions.map((v) => v.join(',')));
  return unique.size;
};

export const part2 = (rawInput: string) => {
  const [positions, folds] = parseInput(rawInput);
  const finalPositions = executeFolds(positions, folds);
  return renderGrid(finalPositions);
};
