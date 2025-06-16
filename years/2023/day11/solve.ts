import BaseDay from '@spenserj-aoc/utilities/BaseDay';

type Coordinate = [number, number];

export default class Day11 extends BaseDay<{
  galaxies: Coordinate[],
  expansionPoints: [number[], number[]],
}, null> {
  parseInput(rawInput: string) {
    const size = rawInput.indexOf('\n') + 1;
    const galaxies: Coordinate[] = [];
    const arrayOfSize = new Array(size - 1).fill(undefined).map((_, i) => i);
    const expansionPoints: [Set<number>, Set<number>] = [
      new Set<number>(arrayOfSize),
      new Set<number>(arrayOfSize),
    ];
    // Gather all of the galaxies and track which rows and columns have been seen
    for (const match of rawInput.matchAll(/#/g)) {
      galaxies.push([match.index % size, Math.floor(match.index / size)]);
      expansionPoints[0].delete(match.index % size);
      expansionPoints[1].delete(Math.floor(match.index / size));
    }
    return {
      galaxies,
      expansionPoints: [Array.from(expansionPoints[0]), Array.from(expansionPoints[1])],
    } as { galaxies: Coordinate[], expansionPoints: [number[], number[]] };
  }

  printGalaxies(galaxies: Coordinate[]) {
    const width = Math.max(...galaxies.flat()) + 1;
    const lines = new Array(width).fill(undefined).map(() => new Array(width).fill('.'));
    for (const [x, y] of galaxies) {
      lines[y][x] = '#';
    }
    console.log(lines.map((line) => line.join('')).join('\n'));
  }

  step() {}

  expandGalaxy(by: number) {
    // Clone all of the galaxies so we can share the input between multiple parts
    const expanded: Coordinate[] = this.state.galaxies.map((g) => [...g]);
    // Get an array of all of the expansion points
    const expansionPointsX = Array.from(this.state.expansionPoints[0].values());
    const expansionPointsY = Array.from(this.state.expansionPoints[1].values());
    for (const galaxy of expanded) {
      // Expand the galaxy by the number of expansion points that are less than the galaxy's
      // current position
      const expandXByPoints = expansionPointsX.filter((x) => x < galaxy[0]).length;
      const expandYByPoints = expansionPointsY.filter((y) => y < galaxy[1]).length;
      galaxy[0] += (expandXByPoints * by) - expandXByPoints;
      galaxy[1] += (expandYByPoints * by) - expandYByPoints;
    }
    return expanded;
  }

  calculateDistances(galaxies: Coordinate[]) {
    let sum = 0;
    for (let a = 0; a < galaxies.length; a += 1) {
      for (let b = a + 1; b < galaxies.length; b += 1) {
        const x = galaxies[a][0] - galaxies[b][0];
        const y = galaxies[a][1] - galaxies[b][1];
        sum += (x < 0 ? -x : x) + (y < 0 ? -y : y);
      }
    }
    return sum;
  }

  part1() {
    return this.calculateDistances(this.expandGalaxy(2));
  }

  part2() {
    return this.calculateDistances(this.expandGalaxy(1000000));
  }
}
