import { loadInput, sortNumbers } from '../../utils';

interface Wire {
  from: [number, number];
  to: [number, number];
  startingSteps: number;
}

const wires: Wire[][] = loadInput(__dirname).map((wire) => {
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
});

const testOverlapPoints = (a: [number, number], b: [number, number]) => {
  if (a[0] < b[0] && b[0] < a[1]) { return true; }
  if (a[0] < b[1] && b[1] < a[1]) { return true; }
  if (b[0] < a[0] && a[0] < b[1]) { return true; }
  if (b[0] < a[1] && a[1] < b[1]) { return true; }
  return false;
};

const testOverlapWires = (a: Wire, b: Wire) => {
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

// Compare the two wire segments
const overlappingWirePoints = [];
for (let i = 0; i < wires[0].length; i += 1) {
  for (let j = 0; j < wires[1].length; j += 1) {
    const a = wires[0][i];
    const b = wires[1][j];
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
      overlappingWirePoints.push({
        x, y, distance, steps,
      });
    }
  }
}

console.log('Distance', overlappingWirePoints.sort((a, b) => (a.distance - b.distance)));
console.log('\n');
console.log('Steps', overlappingWirePoints.sort((a, b) => (a.steps - b.steps)));
