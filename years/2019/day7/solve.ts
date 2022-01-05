import { AsyncBaseDay } from '@spenserj-aoc/utilities/BaseDay';
import Intcode8, { OpcodeResult } from '../day5/Intcode';

type Day7State = [Intcode8, Intcode8, Intcode8, Intcode8, Intcode8];

export default class Day7 extends AsyncBaseDay<Day7State> {
  private lastResult: OpcodeResult[] = undefined;

  public parseInput(rawInput: string) {
    const amps: Day7State = [
      new Intcode8(rawInput),
      new Intcode8(rawInput),
      new Intcode8(rawInput),
      new Intcode8(rawInput),
      new Intcode8(rawInput),
    ];
    amps[0].setOutputCallback((v) => amps[1].addInput(v));
    amps[1].setOutputCallback((v) => amps[2].addInput(v));
    amps[2].setOutputCallback((v) => amps[3].addInput(v));
    amps[3].setOutputCallback((v) => amps[4].addInput(v));
    return amps;
  }

  protected async step(): Promise<void> {
    this.lastResult = await Promise.all([
      this.state[0].run(),
      this.state[1].run(),
      this.state[2].run(),
      this.state[3].run(),
      this.state[4].run(),
    ]);
  }

  private reset(): void {
    this.state[0].reset();
    this.state[1].reset();
    this.state[2].reset();
    this.state[3].reset();
    this.state[4].reset();
    this.lastResult = undefined;
  }

  private async run(): Promise<void> {
    // eslint-disable-next-line no-await-in-loop
    while (!this.lastResult || this.lastResult.find((v) => v !== Intcode8.symbols.exit)) { await this.trackStep(); }
  }

  public async part1(): Promise<number> {
    let value: number;
    let best = 0;
    this.state[4].setOutputCallback((v) => { value = v; });
    for (let a = 0; a < 5; a += 1) {
      for (let b = 0; b < 5; b += 1) {
        if (b === a) { continue; }
        for (let c = 0; c < 5; c += 1) {
          if (c === a || c === b) { continue; }
          for (let d = 0; d < 5; d += 1) {
            if (d === a || d === b || d === c) { continue; }
            for (let e = 0; e < 5; e += 1) {
              if (e === a || e === b || e === c || e === d) { continue; }

              this.reset();
              this.state[0].addInput(a, 0);
              this.state[1].addInput(b);
              this.state[2].addInput(c);
              this.state[3].addInput(d);
              this.state[4].addInput(e);
              // eslint-disable-next-line no-await-in-loop
              await this.run();
              best = Math.max(best, value);
            }
          }
        }
      }
    }
    return best;
  }

  public async part2(): Promise<number> {
    let value: number;
    let best = 0;
    this.state[4].setOutputCallback((v) => {
      value = v;
      this.state[0].addInput(v);
    });
    for (let a = 0; a < 5; a += 1) {
      for (let b = 0; b < 5; b += 1) {
        if (b === a) { continue; }
        for (let c = 0; c < 5; c += 1) {
          if (c === a || c === b) { continue; }
          for (let d = 0; d < 5; d += 1) {
            if (d === a || d === b || d === c) { continue; }
            for (let e = 0; e < 5; e += 1) {
              if (e === a || e === b || e === c || e === d) { continue; }

              this.reset();
              this.state[0].addInput(a + 5, 0);
              this.state[1].addInput(b + 5);
              this.state[2].addInput(c + 5);
              this.state[3].addInput(d + 5);
              this.state[4].addInput(e + 5);
              // eslint-disable-next-line no-await-in-loop
              await this.run();
              best = Math.max(best, value);
            }
          }
        }
      }
    }
    return best;
  }
}
