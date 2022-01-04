import BaseDay from '@spenserj-aoc/utilities/BaseDay';
import BaseIntcode, { OpcodeResult } from '../Intcode';

export default class Day2 extends BaseDay<BaseIntcode> {
  private lastResult: OpcodeResult = undefined;

  public parseInput(rawInput: string) {
    return new BaseIntcode(rawInput);
  }

  protected step(): void {
    this.lastResult = this.state.step();
  }

  private reset(): void {
    this.state.reset();
    this.lastResult = undefined;
  }

  private run(): void {
    while (this.lastResult !== BaseIntcode.symbols.exit) { this.trackStep(); }
  }

  public part1(): number {
    this.reset();
    this.state.memory[1] = 12;
    this.state.memory[2] = 2;
    this.run();
    return this.state.memory[0];
  }

  public part2(): number {
    for (let noun = 0; noun <= 99; noun += 1) {
      for (let verb = 0; verb <= 99; verb += 1) {
        this.reset();
        this.state.memory[1] = noun;
        this.state.memory[2] = verb;
        this.render.setLabel('pair', `${noun},${verb}`);
        this.run();
        if (this.state.memory[0] === 19690720) {
          return (100 * noun) + verb;
        }
      }
    }

    throw new Error('Failed to solve part 2');
  }
}
