import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export default class Day08 extends BaseDay<string[], null> {
  parseInput(rawInput: string) {
    return rawInput.split('\n');
  }

  step() {}

  part1() {
    let max: number;
    const visible = new Set<string>();
    for (let y = 0; y < this.state.length; y += 1) {
      max = -1;
      for (let x = 0; x < this.state[y].length; x += 1) {
        if (+this.state[y][x] > max) {
          max = +this.state[y][x];
          visible.add(`${x},${y}`);
        }
      }
      max = -1;
      for (let x = this.state[y].length - 1; x >= 0; x -= 1) {
        if (+this.state[y][x] > max) {
          max = +this.state[y][x];
          visible.add(`${x},${y}`);
        }
      }
    }
    for (let x = 0; x < this.state[0].length; x += 1) {
      max = -1;
      for (let y = 0; y < this.state.length; y += 1) {
        if (+this.state[y][x] > max) {
          max = +this.state[y][x];
          visible.add(`${x},${y}`);
        }
      }
      max = -1;
      for (let y = this.state[0].length - 1; y >= 0; y -= 1) {
        if (+this.state[y][x] > max) {
          max = +this.state[y][x];
          visible.add(`${x},${y}`);
        }
      }
    }
    return visible.size;
  }

  part2() {
    let best = 0;
    for (let y = 0; y < this.state.length; y += 1) {
      for (let x = 0; x < this.state[y].length; x += 1) {
        const visibility = {
          N: 0,
          E: 0,
          S: 0,
          W: 0,
        };
        const height = +this.state[y][x];
        for (let check = y - 1; check >= 0; check -= 1) {
          visibility.N += 1;
          if (+this.state[check][x] >= height) { break; }
        }
        if (visibility.N === 0) { continue; }
        for (let check = y + 1; check < this.state.length; check += 1) {
          visibility.S += 1;
          if (+this.state[check][x] >= height) { break; }
        }
        if (visibility.S === 0) { continue; }
        for (let check = x - 1; check >= 0; check -= 1) {
          visibility.W += 1;
          if (+this.state[y][check] >= height) { break; }
        }
        if (visibility.W === 0) { continue; }
        for (let check = x + 1; check < this.state[y].length; check += 1) {
          visibility.E += 1;
          if (+this.state[y][check] >= height) { break; }
        }
        if (visibility.E === 0) { continue; }
        best = Math.max(best, visibility.N * visibility.E * visibility.S * visibility.W);
      }
    }
    return best;
  }
}
