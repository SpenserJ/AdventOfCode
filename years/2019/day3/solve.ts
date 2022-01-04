import { sortNumbers } from '@spenserj-aoc/utilities';
import BaseDay from '@spenserj-aoc/utilities/BaseDay';

interface WireSegment {
  from: [number, number];
  to: [number, number];
  startingSteps: number;
}

type Wire = WireSegment[];

const testOverlapPoints = (a: [number, number], b: [number, number]) => {
  if (a[0] < b[0] && b[0] < a[1]) { return true; }
  if (a[0] < b[1] && b[1] < a[1]) { return true; }
  if (b[0] < a[0] && a[0] < b[1]) { return true; }
  if (b[0] < a[1] && a[1] < b[1]) { return true; }
  return false;
};

const testOverlapWires = (a: WireSegment, b: WireSegment) => {
  const overlapsHorizontal = testOverlapPoints(
    [a.from[0], a.to[0]].sort(sortNumbers) as [number, number],
    [b.from[0], b.to[0]].sort(sortNumbers) as [number, number],
  );
  const overlapsVertical = testOverlapPoints(
    [a.from[1], a.to[1]].sort(sortNumbers) as [number, number],
    [b.from[1], b.to[1]].sort(sortNumbers) as [number, number],
  );
  return overlapsHorizontal && overlapsVertical;
};

interface Day3State {
  wires: Wire[];
  overlaps: Array<{
    x: number;
    y: number;
    distance: number;
    steps: number;
  }>;
}

export default class Day3 extends BaseDay<Day3State> {
  public parseInput(rawInput: string) {
    return {
      wires: rawInput.split('\n').map((wire) => {
        let x = 0;
        let y = 0;
        let steps = 0;
        return wire.trim().split(',').map((step) => {
          const startingSteps = steps;
          const [direction, ...amountRaw] = step.split('');
          const amount = parseInt(amountRaw.join(''), 10);
          const from = [x, y] as [number, number];
          if (direction === 'U' || direction === 'D') {
            y += amount * (direction === 'U' ? -1 : 1);
          } else {
            x += amount * (direction === 'L' ? -1 : 1);
          }
          const to = [x, y] as [number, number];
          steps += amount;
          return { from, to, startingSteps };
        });
      }),
      overlaps: [],
    };
  }

  protected step(): void {
    const a = this.state.wires[0][this.currentStep - 1];
    for (let i = 0; i < this.state.wires[1].length; i += 1) {
      const b = this.state.wires[1][i];
      if (testOverlapWires(a, b)) {
        // We can grab either of the inner two points since these will be the overlap
        const x = [a.from[0], a.to[0], b.from[0], b.to[0]].sort(sortNumbers)[1];
        const y = [a.from[1], a.to[1], b.from[1], b.to[1]].sort(sortNumbers)[1];
        const intersectSteps = {
          x: Math.max(Math.abs(a.from[0] - x), Math.abs(b.from[0] - x)),
          y: Math.max(Math.abs(a.from[1] - y), Math.abs(b.from[1] - y)),
        };
        const distance = Math.abs(x) + Math.abs(y);
        const steps = a.startingSteps + b.startingSteps + intersectSteps.x + intersectSteps.y;
        this.state.overlaps.push({
          x, y, distance, steps,
        });
      }
    }
  }

  part1(): number {
    while (this.currentStep < this.state.wires[0].length) { this.trackStep(); }
    return this.state.overlaps.sort((a, b) => (a.distance - b.distance))[0].distance;
  }

  part2(): number {
    while (this.currentStep < this.state.wires[0].length) { this.trackStep(); }
    return this.state.overlaps.sort((a, b) => (a.steps - b.steps))[0].steps;
  }
}
