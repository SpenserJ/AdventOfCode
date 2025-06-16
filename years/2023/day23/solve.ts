import { MaxHeap } from '@spenserj-aoc/utilities';
import BaseDay from '@spenserj-aoc/utilities/BaseDay';
import { HeapKey } from '@spenserj-aoc/utilities/Heaps/Heap';
import { Coordinate, PseudoStringGrid } from '@spenserj-aoc/utilities/PseudoGrid';

// 8 bits will let us track up to 256x256, and we need 141x141
const encodePosition = (x: number, y: number) => ((x << 8) + y);

interface Node extends Coordinate {
  distance: number;
  visited: number[];
}

interface Path {
  edges: Path[];
  points: Coordinate[];
  // If there is a slop on this path, it is directional in part 1. We only care about avoiding
  // walking uphill though, so we can treat flat and downhill as the same
  // uphill: boolean;
  pathId: string;
}

class MaxDistanceHeap extends MaxHeap<Node> {
  protected getKey(node: Node): HeapKey {
    return node.distance;
  }
}

const directions = [[0, 1, 'v'], [1, 0, '>'], [0, -1, '^'], [-1, 0, '<']] as [number, number, string][];

export default class Day22 extends BaseDay<PseudoStringGrid, null> {
  parseInput(rawInput: string) {
    const grid = new PseudoStringGrid(rawInput, '.');
    // We track new paths as the start coordinate and the direction we're coming from so that we
    // don't double back on ourselves
    const initialPath: Path = {
      edges: [],
      points: [{ x: 1, y: 0 }],
      pathId: 'A',
    };
    const paths: Path[] = [initialPath];
    const toVisit: [Path, number][] = [[initialPath, 0]];
    const seenIntersections = new Map<number, Path[]>();
    let curr: [Path, number] | undefined;
    // The order we visit in doesn't matter
    while (curr = toVisit.shift()) {
      const startPoint = curr[0].points[0];
      if (seenIntersections.has(encodePosition(startPoint.x, startPoint.y))) {
        console.log('Already seen?');
        continue;
      }
      const [path] = curr;
      let [, towardDirection] = curr;
      let neighbours: [Coordinate, number][] = [];
      // Keep walking until we find a branch
      while (neighbours.length < 2) {
        const currPos = path.points[path.points.length - 1];
        // TODO: Move this elsewhere because we're double counting the first point
        path.points.push(currPos);
        // Check if we've reached the end
        if (currPos.x === grid.width - 2 && currPos.y === grid.height - 1) {
          neighbours = [];
          break;
        }

        // eslint-disable-next-line @typescript-eslint/no-loop-func
        neighbours = directions.reduce((acc, d, di) => {
          // Prevent doubling back
          if ((di + 2) % 4 === towardDirection) { return acc; }
          // Prevent going off the map
          if (currPos.x + d[0] < 0 || currPos.x + d[0] >= grid.width) { return acc; }
          if (currPos.y + d[1] < 0 || currPos.y + d[1] >= grid.height) { return acc; }
          const check = grid.at(currPos.x + d[0], currPos.y + d[1]);
          if (check === '#') { return acc; }
          // console.log(check, currPos.x + d[0], currPos.y + d[1]);
          acc.push([{ x: currPos.x + d[0], y: currPos.y + d[1] }, di]);
          return acc;
        }, [] as [Coordinate, number][]);
        // TODO: Remove this check
        if (neighbours.length === 0) { throw new Error('WTF'); }
        if (neighbours.length === 1) {
          path.points.push(neighbours[0][0]);
          towardDirection = neighbours[0][1]; // eslint-disable-line prefer-destructuring
        }
      }
      // console.log('Reached branch!', { curr, length }, '\n', neighbours);
      // const newPath: Path = {
      //   // edges: curr[2] ? [curr[2]] : [],
      //   edges: [],
      //   points: [],
      //   length,
      // };
      // // if (curr[2]) { curr[2].edges.push(newPath); }
      // paths.push(newPath);

      // If we've reached the end, there won't be any neighbours
      if (neighbours.length === 0) { break; }

      const lastPoint = path.points[path.points.length - 1];
      const intersectionId = encodePosition(lastPoint.x, lastPoint.y);
      if (!seenIntersections.has(intersectionId)) {
        seenIntersections.set(intersectionId, [path]);
        // console.log('New intersection!', intersectionId, neighbours);
        for (const n of neighbours) {
          const newPath: Path = {
            edges: [],
            points: [{
              x: lastPoint.x + directions[n[1]][0],
              y: lastPoint.y + directions[n[1]][1],
            }],
            pathId: String.fromCharCode(65 + paths.length),
          };
          paths.push(newPath);
          seenIntersections.get(intersectionId).push(newPath);
          toVisit.push([newPath, n[1]]);
        }
      } else {
        console.log('Known intersection!', intersectionId, neighbours);
        // TODO: Must be a duplicate path that we can replace
        // seenIntersections.get(intersectionId).push(path);
      }
    }
    // console.log(paths);
    console.log(Array.from(seenIntersections.entries()).reduce((acc, next) => {
      // eslint-disable-next-line prefer-destructuring
      // acc[`${next[0] >> 8},${next[0] & 0xFF}`] = next[1].map((v) => v.points);
      acc[`${next[0] >> 8},${next[0] & 0xFF}`] = next[1].map((v) => v.pathId);
      return acc;
    }, {}));
    paths.forEach((path, i) => {
      path.points.forEach((point) => {
        grid.set(point.x, point.y, path.pathId);
      });
    });
    seenIntersections.forEach((_, key) => {
      grid.set(key >> 8, key & 0xFF, 'X');
    });
    for (let x = 0; x < grid.width; x += 1) {
      for (let y = 0; y < grid.height; y += 1) {
        if (grid.at(x, y) === '#') {
          grid.set(x, y, ' ');
        }
      }
    }
    console.log(grid.toGrid());
    console.log(paths.map((p) => p.pathId));
    return grid;
  }

  step() {}

  // Step 1: Find the unique path segments
  // - Track them as the length and start/end points (direction matters since there is a p1 slope)
  // Step 2: Walk the graph of path segments

  findLongestPath(onlyDownhill: boolean) {
    const start: Coordinate = { x: 1, y: 0 };
    const end: Coordinate = { x: this.state.width - 2, y: this.state.height - 1 };

    const queue = new MaxDistanceHeap([{
      ...start,
      distance: 0,
      visited: [encodePosition(start.x, start.y)],
    }]);
    let curr: Node;
    let best: Node;
    while (curr = queue.extractRoot()) {
      for (const d of directions) {
        const nx = curr.x + d[0];
        const ny = curr.y + d[1];

        // Stay within the map
        if (nx < 0 || nx >= this.state.width || ny < 0 || ny >= this.state.height) { continue; }

        const encoded = encodePosition(nx, ny);

        // Don't walk on the same node we've been on already
        if (curr.visited.includes(encoded)) { continue; }

        const nextChar = this.state.at(nx, ny);
        // Don't try to walk through walls
        if (nextChar === '#') { continue; }
        // Ensure we're not trying to walk up slopes
        if (onlyDownhill && nextChar !== '.' && nextChar !== d[2]) { continue; }
        // Note: We can't optimize for the number of slopes, because some paths could have 8 slopes
        // while others have 10, despite both leading to the end. Some slopes are just steeper

        const next: Node = {
          x: nx,
          y: ny,
          distance: curr.distance + 1,
          visited: [...curr.visited, encoded],
        };

        // If we've reached the destination, check if this is our best path
        if (nx === end.x && ny === end.y) {
          if (!best || next.distance > best.distance) {
            best = next;
          }
        }

        queue.insert(next);
      }
    }

    return best.distance;
  }

  part1() {
    return 0;
    // return this.findLongestPath(true);
  }

  part2() {
    return this.findLongestPath(false);
  }
}
