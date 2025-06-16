import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export default class Day04 extends BaseDay<any, null> {
  parseInput(rawInput: string) {
    return rawInput.split('\n')
      .map((line) => {
        const [winning, ours] = line
          .slice(line.indexOf(':') + 1)
          .trim()
          .split(' | ')
          .map((segment) => segment.split(/ +/).map(Number));
        return ours.filter((v) => winning.includes(v));
      });
  }

  step() {}

  part1() {
    return this.state.reduce((acc, next) => {
      if (next.length === 0) { return acc; }
      const cardScore = (2 ** (next.length - 1));
      return acc + cardScore;
    }, 0);
  }

  part2() {
    return this.state
      .reduce((acc, next, i) => {
        if (next.length === 0) { return acc; }
        const cardScore = next.length;
        for (let x = 0; x < cardScore; x += 1) {
          acc[i + x + 1] += acc[i];
        }
        return acc;
      }, new Array(this.state.length).fill(1))
      .reduce((acc, next) => acc + next, 0);
  }
}
