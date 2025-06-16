import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export default class Day03 extends BaseDay<any, null> {
  checkAdjacent(x, y, lines) {
    for (let cy = y - 1; cy <= y + 1; cy += 1) {
      for (let cx = x - 1; cx <= x + 1; cx += 1) {
        // Skip the character we're looking around
        if (cy === y && cx === x) { continue; }
        const char = lines[cy]?.[cx] ?? '.';
        // Skip any dots
        if (char === '.') { continue; }
        // Skip any numbers
        if (!isNaN(char)) { continue; }
        return `${cx},${cy}`;
      }
    }
    return null;
  }

  parseInput(rawInput: string) {
    const lines = rawInput.split('\n');
    const parts = [];
    lines.forEach((line, y) => {
      let currentNumber = '';
      let symbols = [];
      for (let x = 0; x < line.length; x += 1) {
        const char = line[x];
        if (!isNaN(char)) {
          currentNumber += char;
          symbols.push(this.checkAdjacent(x, y, lines));
        } else if (currentNumber !== '') {
          parts.push([
            Number(currentNumber),
            symbols.filter((v, i, arr) => !!v && arr.indexOf(v) === i),
          ]);
          currentNumber = '';
          symbols = [];
        }
      }
      if (currentNumber !== '') {
        parts.push([
          Number(currentNumber),
          symbols.filter((v, i, arr) => !!v && arr.indexOf(v) === i),
        ]);
      }
    });
    const gearPositions = parts.reduce((acc, next) => {
      next[1].forEach((coord) => {
        const [x, y] = coord.split(',').map(Number);
        // Skip if it isn't a gear indicator
        if (lines[y][x] !== '*') { return; }
        acc[coord] ||= [];
        acc[coord].push(next[0]);
      });
      return acc;
    }, {});
    const gears = Object.values(gearPositions).filter((v) => v.length >= 2);
    return { parts, gears };
  }

  step() {}

  part1() {
    return this.state.parts
      .filter((v) => v[1].length !== 0)
      .reduce((acc, next) => acc + next[0], 0);
  }

  part2() {
    return this.state.gears
      .map((gearSet) => gearSet.reduce((acc, next) => acc * next, 1))
      .reduce((acc, next) => acc + next, 0);
  }
}
