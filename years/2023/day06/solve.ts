import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export default class Day06 extends BaseDay<any, null> {
  parseInput(rawInput: string) {
    return rawInput.split('\n')
      .map((line) => [...line.matchAll(/(\d+)/g)]);
  }

  step() {}

  calculateRace(time: number, distance: number) {
    let min = Number.MAX_SAFE_INTEGER;
    for (let t = 1; t < time; t += 1) {
      const remainingTime = time - t;
      const distanceTraveled = remainingTime * t;
      if (distanceTraveled > distance) {
        min = t;
        break;
      }
    }
    return time - (min * 2) + 1;
  }

  part1() {
    const races = new Array(this.state[0].length);
    for (let i = 0; i < races.length; i += 1) {
      races[i] = {
        time: Number(this.state[0][i][1]),
        distance: Number(this.state[1][i][1]),
      };
    }
    const totalDurations: number[] = new Array(races.length).fill(0);
    for (let i = 0; i < races.length; i += 1) {
      const { time, distance } = races[i];
      totalDurations[i] = this.calculateRace(time, distance);
    }
    return totalDurations.reduce((acc, next) => acc * next, 1);
  }

  part2() {
    const time = Number(this.state[0].map((v) => v[1]).join(''));
    const duration = Number(this.state[1].map((v) => v[1]).join(''));
    const possibleDurations = this.calculateRace(time, duration);
    return possibleDurations;
  }
}
