import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export default class Day01 extends BaseDay<number[], null> {
  parseInput(rawInput: string) {
    // A bit of cheese by relying on TS to evaluate the math, instead of splitting
    // and reducing it ourselves. This is functionally similar to running:
    // return rawInput.split('\n\n')
    //   .map((elf) => elf.split('\n').reduce((acc, next) => acc + (+next), 0))
    //   .sort((a: number, b: number) => b - a);

    // eslint-disable-next-line no-eval
    return eval(`[${rawInput.replaceAll('\n\n', ',').replaceAll('\n', '+')}]`)
      .sort((a: number, b: number) => b - a);
  }

  step() {}

  part1() {
    return this.state[0];
  }

  part2() {
    return this.state.slice(0, 3).reduce((acc, next) => acc + next, 0);
  }
}
