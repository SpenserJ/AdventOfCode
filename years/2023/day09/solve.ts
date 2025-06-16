import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export default class Day09 extends BaseDay<number[][][], null> {
  parseInput(rawInput: string) {
    const allHistory: number[][] = rawInput.split('\n')
      .map((line) => line.split(' ').map(Number));
    const result: number[][][] = new Array(allHistory.length).fill(undefined);
    for (let historyIndex = 0; historyIndex < result.length; historyIndex += 1) {
      const history = allHistory[historyIndex];
      const levels = new Array(history.length)
        .fill(undefined).map((_, i) => new Array(history.length - i));
      levels[0] = history;
      for (let y = 1; y < history.length - 1; y += 1) {
        const prevLine = levels[y - 1];
        for (let x = 0; x < prevLine.length - 1; x += 1) {
          levels[y][x] = prevLine[x + 1] - prevLine[x];
        }
        if (levels[y].every((n) => n === 0)) {
          levels.splice(y + 1);
          break;
        }
      }
      // this.logLevels(levels);
      levels[levels.length - 1].push(0);
      // Stop before we reach the top row
      for (let y = levels.length - 1; y > 0; y -= 1) {
        const thisLevel = levels[y];
        const updateLevel = levels[y - 1];
        const diff = thisLevel[thisLevel.length - 1];
        updateLevel.push(updateLevel[updateLevel.length - 1] + diff);
      }
      // this.logLevels(levels);
      result[historyIndex] = levels;
    }
    return result;
  }

  step() {}

  logLevels(levels: number[][]) {
    const output: string[] = [];
    for (let i = 0; i < levels.length; i += 1) {
      output.push(`${new Array(i * 2).fill(' ').join('')}${levels[i].join('   ')}`);
    }
    console.log(output.join('\n'));
  }

  part1() {
    return this.state.reduce((acc, next) => acc + next[0][next[0].length - 1], 0);
  }

  part2() {
    const prevValues = new Array(this.state.length);
    for (let historyIndex = 0; historyIndex < this.state.length; historyIndex += 1) {
      const history = this.state[historyIndex];
      let nextDiff = 0;
      // Stop before we reach the top row
      for (let y = history.length - 1; y > 0; y -= 1) {
        const thisLevel = history[y];
        thisLevel.unshift(nextDiff);
        nextDiff = history[y - 1][0] - thisLevel[0];
      }
      prevValues[historyIndex] = nextDiff;
      history[0].unshift(prevValues[historyIndex]);
      // this.logLevels(history);
    }
    return prevValues.reduce((acc, next) => acc + next, 0);
  }
}
