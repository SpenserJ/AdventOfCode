import BaseDay from '@spenserj-aoc/utilities/BaseDay';

const intersect = <T extends string | string[]>(a: T, b: T) => {
  const found = new Set<string>();
  for (let i = 0; i < a.length; i += 1) {
    if (b.includes(a[i])) {
      found.add(a[i]);
    }
  }
  return [...found];
}

export default class Day03 extends BaseDay<string[], null> {
  parseInput(rawInput: string) {
    return rawInput.split('\n');
  }

  step() {}

  part1() {
    const inBoth = this.state
      .map((rucksack) => {
        const half = Math.floor(rucksack.length / 2);
        return [rucksack.slice(0, half), rucksack.slice(half)] as [string, string];
      })
      .flatMap(([left, right]) => intersect(left, right))
      .map((char) => {
        let code = char.charCodeAt(0) - 65;
        // Flip upper and lower case
        code += (code <= 27 ? 27 : -31);
        return code;
      });
    return inBoth.reduce((acc, next) => acc + next, 0);
  }

  part2() {
    const inBoth = this.state
      .reduce((acc, rucksack, rucksackIndex) => {
        const group = Math.floor(rucksackIndex / 3);
        acc[group] ||= [];
        acc[group].push(rucksack);
        return acc;
      }, [])
      .map((group) => group.reduce((acc, next) => {
        if (!acc) { return next; }
        return intersect(acc, next).join('');
      }, null))
      .map((char) => {
        console.log(char);
        let code = char.charCodeAt(0) - 65;
        // Flip upper and lower case
        code += (code <= 27 ? 27 : -31);
        return code;
      });
    console.log(inBoth);
    return inBoth.reduce((acc, next) => acc + next, 0);
  }
}
