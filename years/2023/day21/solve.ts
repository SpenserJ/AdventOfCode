/* eslint-disable no-lonely-if */
import { BucketQueue } from '@spenserj-aoc/utilities';
import BaseDay from '@spenserj-aoc/utilities/BaseDay';
import { Coordinate, PseudoStringGrid } from '@spenserj-aoc/utilities/PseudoGrid';

interface Node extends Coordinate {
  stepsTaken: number;
}

export default class Day21 extends BaseDay<{ grid: PseudoStringGrid, start: Coordinate }, null> {
  parseInput(rawInput: string) {
    const grid = new PseudoStringGrid(rawInput, '.');
    const startIndex = rawInput.indexOf('S');
    const start = grid.getCoordinate(startIndex - Math.floor(startIndex / grid.width));
    return { grid, start };
  }

  step() {}

  findCellDistances() {
    const { grid } = this.state;
    const queue = new BucketQueue<Node>();
    queue.insert({ ...this.state.start, stepsTaken: 0 }, 0);
    const cellDistances = new Map<string, number>();
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    let curr: Node;
    while (curr = queue.pull()) {
      for (const direction of directions) {
        const next: Node = {
          x: curr.x + direction[0],
          y: curr.y + direction[1],
          stepsTaken: curr.stepsTaken + 1,
        };

        if (cellDistances.has(`${next.x},${next.y}`)) { continue; }

        // Ensure we're allowed to walk to this coordinate
        if (next.x < 0 || next.y < 0 || next.x >= grid.width || next.y >= grid.height) { continue; }
        if (grid.at(next.x, next.y) === '#') { continue; }

        queue.insert(next, next.stepsTaken);
        cellDistances.set(`${next.x},${next.y}`, next.stepsTaken);
      }
    }
    return cellDistances;
  }

  part1(targetSteps = 64) {
    const cellDistances = this.findCellDistances();
    let total = 0;
    for (const distance of cellDistances.values()) {
      if (distance <= targetSteps && distance % 2 === targetSteps % 2) {
        total += 1;
      }
    }
    return total;
  }

  part2(targetSteps = 26501365) {
    // This one nearly broke me, so go read a writeup of how it works at
    // https://github.com/villuna/aoc23/wiki/A-Geometric-solution-to-advent-of-code-2023,-day-21
    const { grid } = this.state;
    const halfWidth = Math.ceil(grid.width / 2);
    const n = Math.round((targetSteps - (grid.width / 2)) / grid.width);
    const cellDistances = this.findCellDistances();
    const reachable = {
      total: [0, 0],
      corners: [0, 0],
    };
    for (const distance of cellDistances.values()) {
      reachable.total[distance % 2] += 1;
      if (distance >= halfWidth) {
        reachable.corners[distance % 2] += 1;
      }
    }
    const fullOdd = ((n + 1) ** 2) * reachable.total[1];
    const fullEven = (n ** 2) * reachable.total[0];
    const partialOdd = (n + 1) * reachable.corners[1];
    const partialEven = n * reachable.corners[0];

    if (targetSteps === 26501365) {
      console.log('Expect:', 605247138198755);
    }
    return fullOdd + fullEven - partialOdd + partialEven;
  }
}
