import { termial } from '@spenserj-aoc/utilities/math';
import BaseDay from '@spenserj-aoc/utilities/BaseDay';

//    5, 4,  3,  2,  1,  0, -1, -2, -3, -4, -5, -6
// 0, 5, 9, 12, 14, 15, 15, 14, 12,  9,  5,  0, -6
//    3, 2, 1, 0, -1, -2, -3, -4, -5
// 0, 3, 5, 6, 6,  5,  3,  0, -4, -9
//    8,  7,  6,  5,  4,  3,  2,  1,  0, -1, -2, -3, -4, -5, -6, -7, -8, -9
// 0, 8, 15, 21, 26, 30, 33, 35, 36, 36, 35, 33, 30, 26, 21, 15,  8,  0,  9
//    9,  8,  7,  6,  5,  4,  3,  2,  1,  0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10
// 0, 9, 17, 24, 30, 35, 39, 42, 44, 45, 45, 44, 42, 39, 35, 30, 24, 17,  9,  0, -10

// Target is y
// We move up at the same rate that we move back down, and hit the same positions on the way up/down
// The last step from 0=>y (where y < 0) is done with v=y
// The previous step of downward velocity would be v=y + 1 (where y < 0)
// The initial velocity should be the inverse of that: v=-(y + 1)
// The max height is m=v + (v - 1) + (v - 2) ... or termial(v)
const maxY = (targetY: number) => {
  const startingVelocity = -(targetY + 1);
  return termial(startingVelocity);
};

export interface Day17State {
  xRange: [number, number];
  yRange: [number, number];
  shotsP2?: Set<string>;
}

export default class Day17 extends BaseDay<Day17State> {
  parseInput(rawInput: string): Day17State {
    const [, x1, x2, y1, y2] = rawInput.match(/x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/) || [];
    return {
      xRange: [x1, x2].map((v) => Number(v)).sort((a, b) => a - b),
      yRange: [y1, y2].map((v) => Number(v)).sort((a, b) => a - b),
    } as Day17State;
  }

  step() {}

  part1(): number {
    return maxY(this.state.yRange[0]);
  }

  part2(): number {
    const [x1, x2] = this.state.xRange;
    const [y1, y2] = this.state.yRange;

    const xOptions: Record<number, number[]> = {};
    const xTrickshots: number[] = [];
    this.state.shotsP2 = new Set();
    for (let i = 1; i <= x2; i += 1) {
      let x = 0;
      let steps = 0;
      for (let v = i; v >= 0; v -= 1) {
        x += v;
        steps += 1;
        if (x1 <= x && x <= x2) {
          xOptions[steps] ||= [];
          xOptions[steps].push(i);
          if (v === 0) { xTrickshots.push(i); }
        }
        if (x > x2) { break; }
      }
    }

    let i = y1;
    while (i < Math.abs(y1)) {
      let y = 0;
      let steps = 0;
      for (let v = i; v >= y1; v -= 1) {
        y += v;
        steps += 1;
        if (y1 <= y && y <= y2) {
          const withX = xOptions[steps] || [];
          for (const x of xTrickshots) {
            if (i >= 0) {
              const oldSize = this.state.shotsP2.size;
              this.state.shotsP2.add(`${x},${i}`);
              if (this.state.shotsP2.size !== oldSize) {
                this.render.update('state', this.state);
              }
            }
          }
          for (const x of withX) {
            const oldSize = this.state.shotsP2.size;
            this.state.shotsP2.add(`${x},${i}`);
            if (this.state.shotsP2.size !== oldSize) {
              this.render.update('state', this.state);
            }
          }
        }
      }
      i += 1;
    }

    return this.state.shotsP2.size;
  }
}
