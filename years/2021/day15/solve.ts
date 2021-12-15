import { DijkstraPathFinder, Grid, CostNode } from '@spenserj-aoc/utilities';

export const parseInput = (input: string, expand: boolean) => {
  const costs = input
    .trim()
    .split('\n')
    .map((line) => line.split('').map((v) => Number(v)));

  if (expand) {
    const size = {
      width: costs[0].length,
      height: costs.length,
    };
    for (let iy = 0; iy < 5; iy += 1) {
      for (let sy = 0; sy < size.height; sy += 1) {
        const dy = (iy * size.height) + sy;
        if (iy !== 0) { costs[dy] = []; }
        for (let ix = 0; ix < 5; ix += 1) {
          // Skip over the initial grid
          if (iy === 0 && ix === 0) { continue; }
          for (let sx = 0; sx < size.width; sx += 1) {
            const dx = (ix * size.width) + sx;
            let value = (costs[sy][sx] + iy + ix);
            if (value > 9) { value -= 9; }
            costs[dy][dx] = value;
          }
        }
      }
    }
  }

  const nodes = costs.map((line) => line.map((cost): CostNode => ({ edges: [], cost })));
  const grid = new Grid(nodes);
  grid.forEach((cell) => {
    const surrounding = grid.getSurrounding(cell, false);
    // eslint-disable-next-line no-param-reassign
    cell.value.edges = surrounding.map((v) => v.value);
  });
  return {
    nodes: nodes.flat(),
    grid,
    start: nodes[0][0], // Top Left
    end: nodes[nodes.length - 1][nodes[0].length - 1], // Bottom Right
  };
};

export const part1 = (rawInput: string) => {
  const { nodes, start, end } = parseInput(rawInput, false);
  const pathWalker = new DijkstraPathFinder(nodes);
  const { /* path, */ cost } = pathWalker.run(start, end);
  // console.log(path.map((v) => v.cost));
  return cost;
};

export const part2 = (rawInput: string) => {
  const { nodes, start, end } = parseInput(rawInput, true);
  const pathWalker = new DijkstraPathFinder(nodes);
  const { /* path, */ cost } = pathWalker.run(start, end);
  // console.log(path.map((v) => v.cost));
  return cost;
};
