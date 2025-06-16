import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export default class Day01 extends BaseDay<number[], null> {
  parseInput(rawInput: string) {
    return rawInput.split('\n');
  }

  step() {}

  part1() {
    return this.state
      .map((line) => line.replace(/[^0-9]/g, ''))
      .map((digits) => Number(`${digits[0]}${digits[digits.length - 1]}`))
      .reduce((acc, next) => acc + next, 0);;
  }

  part2() {
    return this.state
      .map((line) => (
        line
          // Keep the first and last letter if its used by another
          .replaceAll('one', 'o1e')
          .replaceAll('two', 't2o')
          .replaceAll('three', 't3e')
          .replaceAll('four', 'f4r')
          .replaceAll('five', 'f5e')
          .replaceAll('six', 's6x')
          .replaceAll('seven', 's7n')
          .replaceAll('eight', 'e8t')
          .replaceAll('nine', 'n9e')
      ))
      .map((line) => line.replace(/[^0-9]/g, ''))
      .map((digits) => Number(`${digits[0]}${digits[digits.length - 1]}`))
      .reduce((acc, next) => acc + next, 0);;
  }
}
