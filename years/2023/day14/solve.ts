import BaseDay from '@spenserj-aoc/utilities/BaseDay';
import { PseudoStringGrid } from '@spenserj-aoc/utilities/PseudoGrid';

export default class Day14 extends BaseDay<PseudoStringGrid, null> {
  parseInput(rawInput: string) {
    return new PseudoStringGrid(rawInput, '.');
  }

  tilt(direction: 'north' | 'south' | 'east' | 'west') {
    switch (direction) {
      case 'north': {
        for (const col of this.state.cols(true)) {
          let lastOpenSpace: number = 0;
          for (const [rock, { x, y }] of col) {
            if (rock === '.') { continue; }
            if (rock === '#') {
              lastOpenSpace = y + 1;
            } else if (y === lastOpenSpace) {
              lastOpenSpace += 1;
            } else {
              this.state.move(x, y, x, lastOpenSpace);
              lastOpenSpace += 1;
            }
          }
        }
        break;
      }
      case 'south': {
        for (const col of this.state.cols(true)) {
          let lastOpenSpace: number = this.state.height - 1;
          for (const [rock, { x, y }] of col.reverse()) {
            if (rock === '.') { continue; }
            if (rock === '#') {
              lastOpenSpace = y - 1;
            } else if (y === lastOpenSpace) {
              lastOpenSpace -= 1;
            } else {
              this.state.move(x, y, x, lastOpenSpace);
              lastOpenSpace -= 1;
            }
          }
        }
        break;
      }
      case 'east': {
        for (const row of this.state.rows(true)) {
          let lastOpenSpace: number = this.state.width - 1;
          for (const [rock, { x, y }] of row.reverse()) {
            if (rock === '.') { continue; }
            if (rock === '#') {
              lastOpenSpace = x - 1;
            } else if (x === lastOpenSpace) {
              lastOpenSpace -= 1;
            } else {
              this.state.move(x, y, lastOpenSpace, y);
              lastOpenSpace -= 1;
            }
          }
        }
        break;
      }
      case 'west': {
        for (const row of this.state.rows(true)) {
          let lastOpenSpace: number = 0;
          for (const [rock, { x, y }] of row) {
            if (rock === '.') { continue; }
            if (rock === '#') {
              lastOpenSpace = x + 1;
            } else if (x === lastOpenSpace) {
              lastOpenSpace += 1;
            } else {
              this.state.move(x, y, lastOpenSpace, y);
              lastOpenSpace += 1;
            }
          }
        }
        break;
      }
      default: throw new Error(`Invalid direction: ${direction}`);
    }
  }

  flatten() {
    return this.state.toGrid();
  }

  print() {
    console.log(this.flatten());
  }

  step() {}

  part1() {
    this.tilt('north');
    let total = 0;
    for (const row of this.state.rows(true)) {
      for (const [rock, { y }] of row) {
        if (rock !== 'O') { continue; }
        total += this.state.height - y;
      }
    }
    return total;
  }

  part2() {
    const loopDetection = new Map<string, string>();
    let lastFlat = this.flatten();
    let loopEnd = -1;
    let loopStart = -1;
    for (let i = 0; i < 1_000; i += 1) {
      if (loopDetection.has(lastFlat)) {
        loopEnd = i;
        loopStart = Array.from(loopDetection.keys()).indexOf(lastFlat);
        break;
      }
      this.tilt('north');
      this.tilt('west');
      this.tilt('south');
      this.tilt('east');
      const nextFlat = this.flatten();
      loopDetection.set(lastFlat, nextFlat);
      lastFlat = nextFlat;
    }
    const remainingIterations = (1_000_000_000 - loopEnd) % (loopEnd - loopStart);
    this.state = this.parseInput(Array.from(loopDetection.keys())[loopStart + remainingIterations]);
    let total = 0;
    for (const row of this.state.rows(true)) {
      for (const [rock, { y }] of row) {
        if (rock !== 'O') { continue; }
        total += this.state.height - y;
      }
    }
    return total;
  }
}
