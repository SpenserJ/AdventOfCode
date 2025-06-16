/* eslint-disable no-param-reassign */
import BaseDay from '@spenserj-aoc/utilities/BaseDay';
import PseudoGrid, { Coordinate } from '@spenserj-aoc/utilities/PseudoGrid';

/*
interface PlanStep {
  x: number;
  y: number;
  color: string;
}

interface Cell {
  reason: 'defined' | 'filled';
  color: string;
}

class PseudoLagoonGrid extends PseudoGrid<Cell> {
  constructor(input: Cell[], width: number, height: number) {
    super(input, null, width, height);
  }

  // This method is unused in this class implementation
  transformCell(): Cell { return null; }

  cellToString(cell: Cell): string {
    return cell ? '#' : '.';
  }
}

function getContentsOfGridPath<T = any>(
  grid: PseudoGrid<T>,
  isPathMarker: (cell: [T, Coordinate]) => Boolean,
): Coordinate[] {
  const contents: Coordinate[] = [];
  for (const row of grid.rows(true)) {
    let inside = false;
    for (const cell of row) {
      if (isPathMarker(cell)) { inside = !inside; }
      if (inside) { contents.push(cell[1]); }
    }
  }
  return contents;
}

export default class Day18 extends BaseDay<PseudoLagoonGrid, null> {
  parseInput(rawInput: string) {
    let x = 0;
    let y = 0;
    const steps: PlanStep[] = rawInput.split('\n')
      .flatMap((line) => {
        const split = line.split(' ');
        const distance = Number(split[1]);
        const holes: PlanStep[] = new Array(distance);
        for (let i = 0; i < distance; i += 1) {
          switch (split[0]) {
            case 'U': y -= 1; break;
            case 'D': y += 1; break;
            case 'L': x -= 1; break;
            case 'R': x += 1; break;
            default: throw new Error(`Invalid direction: ${split[0]}`);
          }
          holes[i] = { x, y, color: split[2].slice(2, -1) } as PlanStep;
        }
        return holes;
      });
    const dimensions = steps.reduce((acc, next) => {
      acc[0] = acc[0] < next.x ? acc[0] : next.x;
      acc[1] = acc[1] < next.y ? acc[1] : next.y;
      acc[2] = acc[2] > next.x ? acc[2] : next.x;
      acc[3] = acc[3] > next.y ? acc[3] : next.y;
      return acc;
    }, [0, 0, 0, 0] as [number, number, number, number]);
    const width = dimensions[2] - dimensions[0] + 1;
    const height = dimensions[3] - dimensions[1] + 1;
    const gridCells = new Array(width * height).fill(null);
    const grid = new PseudoLagoonGrid(gridCells, width, height);
    // Fill in the path on the grid with transposed coordinates so that the origin is at 0,0
    for (const step of steps) {
      grid.set(step.x - dimensions[0], step.y - dimensions[1], { color: step.color, reason: 'defined' });
    }
    return grid;
  }

  step() {}

  part1() {
    console.log(this.state.toGrid());
    // console.log(this.state.width, this.state.height);
    const checkCell = ([cell, pos]: [Cell, Coordinate]) => {
      if (!cell) { return false; }
      const prev = pos.x > 0 ? this.state.at(pos.x - 1, pos.y) : null;
      const next = pos.x < this.state.width - 1 ? this.state.at(pos.x + 1, pos.y) : null;
      // Ignore cells in the middle
      return cell.reason === 'defined' && (prev?.reason !== 'defined' && next?.reason !== 'defined');
    };
    for (const { x, y } of getContentsOfGridPath(this.state, checkCell)) {
      this.state.set(x, y, { color: 'ffffff', reason: 'filled' });
    }
    console.log(this.state.toGrid());
    return this.state.rawCells.filter(Boolean).length;
  }

  part2() {
  }
}
*/

/**
 * Get the dot product of a matrix
 * @param a The first row of the matrix
 * @param b The second row of the matrix
 * @returns The dot product of the matrix
 */
const dotProduct = (a: number[], b: number[]) => Number(
  a.reduce((acc, n, i) => acc + BigInt(n * b[i]), BigInt(0)),
);

const coordinateArrayToMatrix = (points: Coordinate[]) => points.reduce((acc, { x, y }, i) => {
  acc[0][i] = x;
  acc[1][i] = y;
  return acc;
}, [new Array(points.length), new Array(points.length)]);

/**
 * Calculate the inner area of a simple polygon
 * https://en.wikipedia.org/wiki/Shoelace_formula
 */
function shoelace(points: Coordinate[]): number;
function shoelace(x: number[], y: number[]): number;
function shoelace(pointsOrX: Coordinate[] | number[], possibleY?: number[]) {
  let x: number[];
  let y: number[];
  if (possibleY) {
    x = pointsOrX as number[];
    y = possibleY;
  } else {
    [x, y] = coordinateArrayToMatrix(pointsOrX as Coordinate[]);
  }
  return Math.abs(
    dotProduct(x, y.slice(1).concat(y[0])) - dotProduct(y, x.slice(1).concat(x[0])),
  ) / 2;
}

const calculatePathLength = (points: Coordinate[], manhattan = true) => {
  let length = 0;
  for (let i = 1; i < points.length; i += 1) {
    const dx = points[i].x > points[i - 1].x
      ? points[i].x - points[i - 1].x
      : points[i - 1].x - points[i].x;
    const dy = points[i].y > points[i - 1].y
      ? points[i].y - points[i - 1].y
      : points[i - 1].y - points[i].y;
    if (manhattan || dx === 0 || dy === 0) {
      length += dx + dy;
    } else {
      length += Math.sqrt(dx * dx + dy * dy);
    }
  }
  return length;
};

/**
 * Returns the number of cells contained within a path, including the path itself
 */
function countCellsContainedInPath(points: Coordinate[], cornersOnly: boolean): number;
function countCellsContainedInPath(points: Coordinate[], boundaryLength: number): number;
function countCellsContainedInPath(
  points: Coordinate[],
  cornersOnlyOrBoundaryLength: number | boolean = true,
) {
  const area = shoelace(points);
  let boundaryPoints: number;
  if (typeof cornersOnlyOrBoundaryLength === 'number') {
    boundaryPoints = cornersOnlyOrBoundaryLength;
  } else {
    boundaryPoints = cornersOnlyOrBoundaryLength
      ? calculatePathLength(points, true)
      : points.length;
  }
  // Since the shoelace algorithm gives us the area of the polygon, we can rearrange the formula
  // to give us the number of interior and boundary cells
  // A = i + (b / 2) - 1
  // i = A + 1 - (b / 2)
  // https://en.wikipedia.org/wiki/Pick's_theorem#Formula
  // https://old.reddit.com/r/adventofcode/comments/18lg2we/2023_day_18_why_1_instead_of_1/
  const interior = area + 1 - (boundaryPoints / 2);
  return interior + boundaryPoints;
}

//   Ordered to match part 2
const directions = {
  R: [1, 0],
  D: [0, 1],
  L: [-1, 0],
  U: [0, -1],
};

export default class Day18 extends BaseDay<[string, string, string][], null> {
  parseInput(rawInput: string) {
    return rawInput.split('\n').map((line) => line.split(' ') as [string, string, string]);
  }

  step() {}

  part1() {
    const points: Coordinate[] = new Array(this.state.length + 1);
    points[0] = { x: 0, y: 0 };
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.state.length; i += 1) {
      const [direction, distanceRaw] = this.state[i];
      const distance = Number(distanceRaw);
      const [dx, dy] = directions[direction];
      x += dx * distance;
      y += dy * distance;
      points[i + 1] = { x, y };
    }
    return countCellsContainedInPath(points, true);
  }

  part2() {
    const numericDirections = Object.values(directions);
    const points: Coordinate[] = new Array(this.state.length + 1);
    points[0] = { x: 0, y: 0 };
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.state.length; i += 1) {
      const [, , color] = this.state[i];
      const distance = parseInt(color.slice(2, 7), 16);
      const [dx, dy] = numericDirections[color[7]];
      x += dx * distance;
      y += dy * distance;
      points[i + 1] = { x, y };
    }
    return countCellsContainedInPath(points, true);
  }
}
