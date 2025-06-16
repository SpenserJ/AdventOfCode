import BaseDay from '@spenserj-aoc/utilities/BaseDay';

const memoize = <T extends (...args: any[]) => any>(fn: T) => {
  const cache = new Map<string, any>();
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = `${args[0]}|${args[1].join(',')}`;
    if (cache.has(key)) { return cache.get(key); }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

export default class Day12 extends BaseDay<any, null> {
  parseInput(rawInput: string) {
    return rawInput.split('\n').map((rawLine) => {
      const [line, rawCount] = rawLine.split(' ');
      const brokenCount = rawCount.split(',').map(Number);
      return { line, brokenCount };
    });
  }

  step() {}

  getCheckFn() {
    const check = memoize((line: string, brokenCount: readonly number[]): number => {
      // If we're out of line, it passes if there are no broken items left
      if (line.length === 0) { return brokenCount.length ? 0 : 1; }

      // If there are no more broken items to check for, we can tell if this passes
      if (brokenCount.length === 0) { return line.indexOf('#') === -1 ? 1 : 0; }

      // If we can't fit the next broken group, this is a dead end
      if (brokenCount.length && line.length < brokenCount[0]) { return 0; }

      // If this is a good part, we can carry on
      if (line[0] === '.') { return check(line.slice(1), brokenCount); }

      // Check if we can fit a full broken group
      let canBeBrokenGroup = true;
      for (let i = 0; i < brokenCount[0]; i += 1) {
        if (line[i] === '.') {
          canBeBrokenGroup = false;
          break;
        }
      }
      canBeBrokenGroup = canBeBrokenGroup && line[brokenCount[0]] !== '#';
      const ifGoodPart = line[0] !== '#' ? check(line.slice(1), brokenCount) : 0;
      if (canBeBrokenGroup) {
        return check(line.slice(brokenCount[0] + 1), brokenCount.slice(1)) + ifGoodPart;
      }
      return ifGoodPart;
    });
    return check;
  }

  part1() {
    let total = 0;
    for (const { line, brokenCount } of this.state) {
      total += this.getCheckFn()(line, brokenCount);
    }
    return total;
  }

  part2() {
    let total = 0;
    const expandedState = this.state.map(({ line, brokenCount }) => ({
      line: new Array(5).fill(line).join('?'),
      brokenCount: new Array(5).fill(brokenCount).flat(),
    }));
    for (const { line, brokenCount } of expandedState) {
      total += this.getCheckFn()(line, brokenCount);
    }
    return total;
  }
}
