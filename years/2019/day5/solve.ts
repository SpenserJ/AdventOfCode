import { AsyncBaseDay } from '@spenserj-aoc/utilities/BaseDay';
import Intcode4, { OpcodeResult } from './Intcode';

export default class Day5 extends AsyncBaseDay<Intcode4> {
  private lastResult: OpcodeResult = undefined;

  public parseInput(rawInput: string) {
    return new Intcode4(rawInput);
  }

  protected async step(): Promise<void> {
    this.lastResult = await this.state.step();
  }

  private reset(): void {
    this.state.reset();
    this.lastResult = undefined;
  }

  private async run(): Promise<void> {
    // eslint-disable-next-line no-await-in-loop
    while (this.lastResult !== Intcode4.symbols.exit) { await this.trackStep(); }
  }

  public async part1(): Promise<number> {
    this.reset();
    let value: number;
    this.state.setOutputCallback((v) => { value = v; });
    this.state.addInput(1);
    await this.run();
    return value;
  }

  public async part2(): Promise<number> {
    this.reset();
    let value: number;
    this.state.setOutputCallback((v) => { value = v; });
    this.state.addInput(5);
    await this.run();
    return value;
  }
}
