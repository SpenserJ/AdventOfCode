import BaseDay from '@spenserj-aoc/utilities/BaseDay';

interface Brick {
  id: number;
  sx: number;
  sy: number;
  sz: number;
  ex: number;
  ey: number;
  ez: number;
  restingOn: Set<Brick>;
  supporting: Set<Brick>;
}

const coordinateToId = (x: number, y: number) => (
  // Bitshifting by 9 will let us store up to 512x512
  (x << 9) + y
);

export default class Day22 extends BaseDay<Brick[], null> {
  parseInput(rawInput: string) {
    const bricks = rawInput.split('\n').map((line, i) => {
      const [sx, sy, sz, ex, ey, ez] = line.split(/[,~]/).map(Number);
      const brick: Brick = {
        id: i,
        sx,
        sy,
        sz,
        ex,
        ey,
        ez,
        restingOn: new Set(),
        supporting: new Set(),
      };
      return brick;
    }).sort((a, b) => a.sz - b.sz);

    const highPoints = new Map<number, Brick>();
    for (const brick of bricks) {
      // Find the highest point below this brick
      let highestPoint = 0;
      for (let x = brick.sx; x <= brick.ex; x += 1) {
        for (let y = brick.sy; y <= brick.ey; y += 1) {
          const xyId = coordinateToId(x, y);
          const newHigh = highPoints.get(xyId);
          if (newHigh && newHigh.ez > highestPoint) {
            highestPoint = newHigh.ez;
          }
        }
      }

      // Set the new highest point for all x,y that this brick occupies
      const newHighestPoint = highestPoint + (brick.ez - brick.sz) + 1;
      for (let x = brick.sx; x <= brick.ex; x += 1) {
        for (let y = brick.sy; y <= brick.ey; y += 1) {
          const xyId = coordinateToId(x, y);
          // If there was a brick at this position, then it must be supporting this brick
          const oldHighest = highPoints.get(xyId);
          if (oldHighest && oldHighest.ez === highestPoint) {
            brick.restingOn.add(oldHighest);
            oldHighest.supporting.add(brick);
          }
          // Set the new highest point
          highPoints.set(xyId, brick);
        }
      }
      brick.sz = highestPoint + 1;
      brick.ez = newHighestPoint;
    }

    return bricks;
  }

  step() {}

  part1() {
    const cannotBeRemoved = new Set<Brick>();
    for (const brick of this.state) {
      // If this brick is resting on only one other brick, that brick cannot be removed
      if (brick.restingOn.size === 1) {
        cannotBeRemoved.add(brick.restingOn.values().next().value);
      }
    }
    return this.state.length - cannotBeRemoved.size;
  }

  part2() {
    let total = 0;
    for (const brickToRemove of this.state) {
      const willFall = new Set<Brick>([brickToRemove]);
      const queue = Array.from(brickToRemove.supporting);
      let nextCheck: Brick;
      while (nextCheck = queue.pop()) {
        if (Array.from(nextCheck.restingOn).every((brick) => willFall.has(brick))) {
          willFall.add(nextCheck);
          queue.push(...nextCheck.supporting);
        }
      }
      total += (willFall.size - 1);
    }
    return total;
  }
}
