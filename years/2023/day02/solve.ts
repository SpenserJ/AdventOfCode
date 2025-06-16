import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export default class Day02 extends BaseDay<Array<{ red: number, green: number, blue: number }>, null> {
  parseInput(rawInput: string) {
    return rawInput.split('\n')
      .map((line) => {
        const matches = [...line.matchAll(/(\d+) (blue|red|green)/g)];
        return matches.reduce((acc, [, qty, color]) => {
          acc[color] = Math.max(acc[color] || 0, Number(qty));
          return acc;
        }, {});
      });
  }

  step() {}

  part1() {
    let score = 0;
    for (let i = 0; i < this.state.length; i += 1) {
      const game = this.state[i]
      if (game.red <= 12 && game.green <= 13 && game.blue <= 14) {
        score += i + 1;
      }
    }
    return score;
  }

  part2() {
    let score = 0;
    for (let i = 0; i < this.state.length; i += 1) {
      const game = this.state[i];
      score += game.red * game.green * game.blue;
    }
    return score;
  }
}
