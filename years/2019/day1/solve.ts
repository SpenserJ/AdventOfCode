import BaseDay from '@spenserj-aoc/utilities/BaseDay';

const calculateFuelRequired = (v: number) => (Math.floor(v / 3) - 2);

type Day1State = Array<{
  mass: number;
  baseFuel?: number;
  extraFuel?: number;
}>;

export default class Day1 extends BaseDay<Day1State> {
  public parseInput(rawInput: string) {
    return rawInput.split('\n').map((v) => ({ mass: Number(v) }));
  }

  protected step(): void {
    const moduleInput = this.state[this.currentStep - 1];
    moduleInput.baseFuel = calculateFuelRequired(moduleInput.mass);
    moduleInput.extraFuel = 0;
    let lastFuel = moduleInput.baseFuel;
    while (lastFuel > 0) {
      lastFuel = calculateFuelRequired(lastFuel);
      if (lastFuel > 0) { moduleInput.extraFuel += lastFuel; }
    }
  }

  public part1(): number {
    while (this.currentStep < this.state.length) { this.trackStep(); }
    return this.state.reduce((acc, next) => acc + next.baseFuel!, 0);
  }

  public part2(): number {
    while (this.currentStep < this.state.length) { this.trackStep(); }
    return this.state.reduce((acc, next) => acc + next.baseFuel! + next.extraFuel!, 0);
  }
}
