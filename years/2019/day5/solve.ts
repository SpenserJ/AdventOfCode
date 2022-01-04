import BaseDay from '@spenserj-aoc/utilities/BaseDay';
import Intcode4, { OpcodeResult } from './Intcode';

export default class Day5 extends BaseDay<Intcode4> {
  private lastResult: OpcodeResult = undefined;

  public parseInput(rawInput: string) {
    return new Intcode4(rawInput);
  }

  protected step(): void {
    this.lastResult = this.state.step();
  }

  private reset(): void {
    this.state.reset();
    this.lastResult = undefined;
  }

  private run(): void {
    while (this.lastResult !== Intcode4.symbols.exit) { this.trackStep(); }
  }

  public part1(): number {
    this.reset();
    let value: number;
    this.state.setOutputCallback((v) => { value = v; });
    this.state.setInput(1);
    this.run();
    return value;
  }

  public part2(): number {
    this.reset();
    let value: number;
    this.state.setOutputCallback((v) => { value = v; });
    this.state.setInput(5);
    this.run();
    return value;
  }
}
