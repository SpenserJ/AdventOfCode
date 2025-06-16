/* eslint-disable object-curly-newline */
import { BucketQueue } from '@spenserj-aoc/utilities';
import BaseDay from '@spenserj-aoc/utilities/BaseDay';

interface BitshiftEncoderParam<T extends Record<string, any>> {
  value: keyof T | ((root: T) => number);
  maxSize: number;
}

const generateBitshiftEncoder = <T extends Record<string, any>>(
  ...params: BitshiftEncoderParam<T>[]
) => (root: T): number => {
    let result = 0;
    for (const { value, maxSize } of params) {
      const v = typeof value === 'function' ? value(root) : root[value];
      result += (v << maxSize);
    }
    return result;
  };

interface Node {
  x: number;
  y: number;
  direction: number;
  cost: number;
  // Uncomment if you need to debug the path it takes
  // path: Node[];
  stepsInDirection: number;
}

const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

export default class Day17 extends BaseDay<number[][], null> {
  parseInput(rawInput: string) {
    const rawGrid = rawInput.split('\n').map((line) => line.split('').map(Number));
    return rawGrid;
  }

  step() {}

  getNodeId2(node: Node) {
    const index = node.x + (node.y * this.state[0].length);
    return (index << 6) + (node.direction << 4) + node.stepsInDirection;
  }

  getNodeId = generateBitshiftEncoder<Node>(
    { value: (n) => n.x + (n.y * this.state[0].length), maxSize: 6 },
    { value: 'direction', maxSize: 4 },
    { value: 'stepsInDirection', maxSize: 0 },
  );

  calculateScore(min: number, max: number) {
    const queue = new BucketQueue<Node>();
    const costs = new Map<number, number>();
    queue.insert({
      x: 0,
      y: 0,
      direction: -1,
      cost: 0,
      // Uncomment if you need to debug the path it takes
      // path: [],
      stepsInDirection: 0,
    }, 0);
    let next: Node;
    while (next = queue.pull()) {
      // Check if we've reached the end
      if (next.x === this.state[0].length - 1 && next.y === this.state.length - 1) { break; }

      for (let d = 0; d < directions.length; d += 1) {
        // Don't continue in the same direction or turn around
        if (d === next.direction || (d + 2) % 4 === next.direction) { continue; }

        let costIncrease = 0;
        // const newPath: Node[] = [...next.path, next];
        // Add nodes for the possible steps in this direction
        for (let i = 1; i <= max; i += 1) {
          const nx = next.x + (directions[d][0] * i);
          const ny = next.y + (directions[d][1] * i);

          // Don't go off the grid
          if (nx < 0 || ny < 0) { break; }
          if (nx >= this.state[0].length || ny >= this.state.length) { break; }

          costIncrease += this.state[ny][nx];
          const newCost = next.cost + costIncrease;

          if (i < min) { continue; }

          const newNode: Node = {
            x: nx,
            y: ny,
            direction: d,
            cost: newCost,
            // Uncomment all lines referencing newPath if you need to debug the path it takes
            // path: [...newPath],
            stepsInDirection: i,
          };
          // newPath.push(newNode);

          // Calculate a cost ID
          const costId = this.getNodeId(newNode);
          // If this will cost more than a different path, don't bother pursuing it
          if (costs.get(costId) ?? Number.POSITIVE_INFINITY < newCost) { continue; }
          costs.set(costId, newCost);
          queue.insert(newNode, newCost);
        }
      }
    }

    // const newGrid: string[][] = this.state.map((row) => row.map((v) => `${v}`));
    // best[1].path.slice(1).concat(best[1]).forEach((n) => {
    //   switch (n.direction) {
    //     case 0: newGrid[n.y][n.x] = 'v'; break;
    //     case 1: newGrid[n.y][n.x] = '>'; break;
    //     case 2: newGrid[n.y][n.x] = '^'; break;
    //     case 3: newGrid[n.y][n.x] = '<'; break;
    //     default: throw new Error(`Invalid direction: ${n.direction}`);
    //   }
    // });
    // console.log(newGrid.map((row) => row.join('')).join('\n'));

    return next.cost;
  }

  part1() {
    return this.calculateScore(1, 3);
  }

  part2() {
    return this.calculateScore(4, 10);
  }
}
