import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export default class Day04 extends BaseDay<any, null> {
  parseInput(rawInput: string) {
    return rawInput.split('\n')
      .map((line) => line.split(',').map((assignment) => assignment.split('-').map((v) => +v)));
  }

  step() {
  }

  part1() {
    return this.state.filter(([a, b]) => {
      if (a[0] <= b[0] && a[1] >= b[1]) { return true; }
      if (b[0] <= a[0] && b[1] >= a[1]) { return true; }
      return false;
    }).length;
  }

  part2() {
    return this.state.filter(([a, b]) => {
      if (a[0] <= b[0] && a[1] >= b[0]) { return true; }
      if (a[0] <= b[1] && a[1] >= b[1]) { return true; }
      if (b[0] <= a[0] && b[1] >= a[0]) { return true; }
      if (b[0] <= a[1] && b[1] >= a[1]) { return true; }
      return false;
    }).length;
  }
}
