import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export default class Day06 extends BaseDay<string, null> {
  parseInput(rawInput: string) {
    return rawInput;
  }

  step() {}

  findMarker(length: number) {
    for (let i = length; i < this.state.length; i += 1) {
      const working = new Set(this.state.slice(i - length, i).split(''));
      if (working.size === length) { return i; }
    }
    return null;
  }

  part1() {
    return this.findMarker(4);
  }

  part2() {
    return this.findMarker(14);
  }
}
