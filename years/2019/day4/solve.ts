import BaseDay from '@spenserj-aoc/utilities/BaseDay';

type Day4State = {
  part1: number;
  part2: number;
};

export default class Day4 extends BaseDay<Day4State> {
  public parseInput(rawInput: string): Day4State {
    const state: Day4State = { part1: 0, part2: 0 };
    const input = rawInput.split('-').map((v) => Number(v));
    for (let i = input[0]; i <= input[1]; i += 1) {
      const iStr = i.toString();
      // Don't allow numbers to decrease in value
      if (/^1*2*3*4*5*6*7*8*9*$/.test(iStr) === false) { continue; }
      const repeatingMatch = iStr.match(/(.)\1+/g);
      // Ensure strings have repeating numbers
      if (!repeatingMatch) { continue; }

      state.part1 += 1;
      if (repeatingMatch[0]?.length === 2 || repeatingMatch[1]?.length === 2) {
        state.part2 += 1;
      }
    }
    return state;
  }

  protected step(): void {}

  part1(): number { return this.state.part1; }

  part2(): number { return this.state.part2; }
}
