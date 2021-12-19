import { termial } from '@spenserj-aoc/utilities';

export const parseInput = (rawInput: string): [number, number, number, number] => {
  const [, x1, x2, y1, y2] = rawInput.match(/x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/);
  return [
    ...[x1, x2].map((v) => Number(v)).sort((a, b) => a - b),
    ...[y1, y2].map((v) => Number(v)).sort((a, b) => a - b),
  ] as [number, number, number, number];
};

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

export const part1 = (rawInput: string) => {
  const coords = parseInput(rawInput);
  const targetY = coords[2];
  return maxY(targetY);
};

/**
 * * Key: The steps required
 * * Value: The velocities that will reach the target
 */
type StepVelocity = Map<number, number[]>;

export const part2 = (rawInput: string) => {
  const [x1, x2, y1, y2] = parseInput(rawInput);

  const yRangeForStep = (step) => ([
    Math.ceil((termial(step - 1) + y1) / step),
    Math.floor((termial(step - 1) + y2) / step),
  ]);

  // Find all of the velocities that will land in the zone, whether through multiple
  // steps or in a single step.
  // Range: 5-10
  // * 10=10
  // * 9=9
  // * ...
  // * 5=5
  // * 4+3=7, 4+3+2=9, 4+3+2+1
  // * 3+2=5, 3+2+1=6
  // Initial velocities from 3-10 will all land in the range. Anything lower undershoots
  // and anything higher overshoots.
  // We can use the termial to quickly calculate the end point if all steps are taken, and
  // walk backward by however many steps are needed to avoid overshooting

  const velocityEndPoints: number[] = [0];
  let lastEnd = 0;
  let v = 0;
  // TODO: Do we need to check this many velocities?
  while (lastEnd < x2 || v <= x2) {
    v += 1;
    lastEnd = termial(v);
    velocityEndPoints[v] = lastEnd;
  }

  const guaranteedVelocityX: StepVelocity = new Map();
  for (v = 1; v < velocityEndPoints.length; v += 1) {
    const fullStepEnd = velocityEndPoints[v];
    // Check if we can cut any steps off the end to land back in the range.
    // We start with vCut=0, which will check the exact end
    for (let vCut = 0; vCut < v; vCut += 1) {
      const partialStepEnd = fullStepEnd - velocityEndPoints[vCut];
      // If we fall short, break out of the loop
      if (partialStepEnd < x1) { break; }
      // If we fall within range, mark it as valid
      if (partialStepEnd <= x2) {
        if (!guaranteedVelocityX.has(v - vCut)) { guaranteedVelocityX.set(v - vCut, []); }
        guaranteedVelocityX.get(v - vCut).push(v);
      }
    }
  }

  // Once we know how many steps we are dealing with, we can calculate the range of
  // y velocities that would land in time
  const guaranteedVelocityY: StepVelocity = new Map();
  for (const step of guaranteedVelocityX.keys()) {
    // 1 step:  -5 through -10: y1/step -> y2/step
    // 2 steps: -2 (-2-3=-5), -3 (-3-4=-7), -4 (-4-5=-9): y1/step (2.5) -> y2/step (5)
    // 3 steps: -1 (-1-2-3=-6), -2 (-2-3-4=-9): y1/step (1.6) -> y2/step (3.333)
    // 4 steps: 0 (0-1-2-3=-6), -1 (-1-2-3-4=-10): y1/step (1.25) -> y2/step (2.5) ???
    // 5 steps: 1 (1-0-1-2-3=-5), 0 (0-1-2-3-4=-10): y1+6 -> y2+10 ???
    // 6 steps: 1 (1-0-1-2-3-4=-9)
    // 7 steps: 2 (2+1-0-1-2-3-4=-7)
    // if vy<0 && steps=2: y=termial(-vy-1)-termial(-vy+(steps-1))
    // if vy<0 && steps=3: y=termial(-vy-1)-termial(-vy+(steps-1))
    // if vy<0 && steps=4: y=termial(-vy-1)-termial(-vy+(steps-1))
    // y=termial(-vy-1)-termial(-vy+(steps-1))
    // if vy=0: y=-termial(steps-1)
    // if vy>0: vy+1 steps cancel out, so y=-vy
    // If vx=steps: Trick shot unlocked
    // TODO: Add positive values

    // Going to change by -termial(steps-1) over the run
    // Initial vy/steps=y1+termial(steps-1)
    const [vyMin, vyMax] = yRangeForStep(step);
    for (let vy = vyMin; vy <= vyMax; vy += 1) {
      if (!guaranteedVelocityY.has(step)) { guaranteedVelocityY.set(step, []); }
      guaranteedVelocityY.get(step).push(vy);
    }
    // TODO: Add trickshots
  }

  const result = new Set<string>();
  for (const [step, xVelocities] of guaranteedVelocityX) {
    const yVelocities = guaranteedVelocityY.get(step) || [];
    for (const vx of xVelocities) {
      for (const vy of yVelocities) {
        result.add(`${vx},${vy}`);
      }

      // Trickshot time
      if (vx === step) {
        // 6,2 -> 11,3 -> 15,3 -> 18,2 -> 20,1 -> 21,0 -> 21,-1 -> 21,-3 -> 21,-6
        // Velocities that will reach y=0 again by the last step
        for (let vy = 0; vy > y1; vy -= 1) {
          let vy2 = vy;
          let y = vy2;
          while (y > y1) {
            if (y1 <= y && y <= y2) {
              result.add(`${vx},${Math.abs(vy2 + 1)}`);
            }
            vy2 -= 1;
            y += vy2;
          }
        }
        // Velocities
        /*
        let vy = 1;
        while (-termial(vy) >= y1) {
          result.add(`${vx},${Math.abs(vy)}`);
          vy += 1;
        }
        */
      }
    }
  }

  //console.log('x', guaranteedVelocityX);
  //console.log('y', guaranteedVelocityY);

  console.log(result.size);
  return [...result];
  //return result.size;
}
