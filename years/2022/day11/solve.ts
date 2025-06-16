import BaseDay from '@spenserj-aoc/utilities/BaseDay';

class Monkey {
  public items: number[];

  public itemsInspected = 0;

  public divisor: number;

  private operation: ((old: number) => number);

  private calculateThrowTarget: ((worry: number) => number);

  constructor(raw: string) {
    const lines = raw.split('\n');
    this.items = [...lines[1].matchAll(/\d+/g)].map((v) => +v);
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    this.operation = new Function('old', lines[2].replace('Operation: new =', 'return')) as ((old: number) => number);

    this.divisor = +lines[3].match(/\d+/)[0];
    const ifTrue = +lines[4].match(/\d+/)[0];
    const ifFalse = +lines[5].match(/\d+/)[0];
    this.calculateThrowTarget = (worry: number) => (worry % this.divisor === 0 ? ifTrue : ifFalse);
  }

  throwItems(worryDivisor: number, lcm: number) {
    let test: number;
    const throws: [number, number][] = [];
    while (test = this.items.shift()) {
      this.itemsInspected += 1;
      const worry = Math.floor(this.operation(test) / worryDivisor) % lcm;
      const throwTo = this.calculateThrowTarget(worry);
      throws.push([worry, throwTo]);
    }
    return throws;
  }
}

export default class Day11 extends BaseDay<Monkey[], null> {
  private worryDivisor = 3;

  private lcm = 1;

  parseInput(rawInput: string) {
    const rawMonkeys = rawInput.split('\n\n');
    const monkeys = rawMonkeys.map((rawMonkey) => new Monkey(rawMonkey));
    this.lcm = monkeys.reduce((acc, next) => acc * next.divisor, 1);
    return monkeys;
  }

  step() {
    for (let i = 0; i < this.state.length; i += 1) {
      const throwResult = this.state[i].throwItems(this.worryDivisor, this.lcm);
      throwResult.forEach(([worry, to]) => {
        this.state[to].items.push(worry);
      });
    }
  }

  part1() {
    for (let i = 0; i < 20; i += 1) { this.step(); }
    const itemsInspected = this.state
      .map((monkey) => monkey.itemsInspected)
      .sort((a, b) => b - a);
    return itemsInspected[0] * itemsInspected[1];
  }

  part2() {
    this.worryDivisor = 1;
    this.reset();
    for (let i = 0; i < 10_000; i += 1) { this.step(); }
    const itemsInspected = this.state
      .map((monkey) => monkey.itemsInspected)
      .sort((a, b) => b - a);
    return itemsInspected[0] * itemsInspected[1];
  }
}
