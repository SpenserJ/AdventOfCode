import BaseDay from '@spenserj-aoc/utilities/BaseDay';

type Layout = string[][];

interface Step {
  count: number;
  from: number;
  to: number;
}

// const printLayout = (layout) => {
//   const output: any[] = [layout.map((_, i) => ` ${i + 1} `)];
//   const emptyLine = new Array(layout.length * 3).fill(' ').join(' ');
//   for (let i = 0; i < layout.length; i += 1) {
//     for (let j = 0; j < layout[i].length; j += 1) {
//       if (output.length - 1 <= j) { output.push(emptyLine); }
//       const replace = output[j + 1].split('');
//       replace.splice(i * 4, 3, `[${layout[i][j]}]`);
//       output[j + 1] = replace.join('');
//     }
//   }
//   console.log(output.reverse().join('\n'));
// };

export default class Day05 extends BaseDay<{ layout: Layout, steps: Step[] }, null> {
  parseInput(rawInput: string) {
    const [layoutRaw, stepsRaw] = rawInput.split('\n\n');
    const layout: Layout = layoutRaw.split('\n')
      .slice(1)
      .reduce((acc, line) => {
        for (let i = 1; i < line.length; i += 4) {
          const col = Math.floor((i - 1) / 4);
          acc[col] ||= [];
          if (line[i] !== ' ') {
            acc[col].unshift(line[i]);
          }
        }
        return acc;
      }, []);
    const steps: Step[] = [...stepsRaw.matchAll(/move (?<count>\d+) from (?<from>\d+) to (?<to>\d+)/g)]
      .map(({ groups }) => ({
        count: Number(groups.count),
        from: Number(groups.from),
        to: Number(groups.to),
      }));
    return { layout, steps };
  }

  step() {}

  part1() {
    while (this.state.steps.length) {
      const step = this.state.steps.shift();
      const moving = this.state.layout[step.from - 1].splice(-step.count);
      this.state.layout[step.to - 1].push(...moving.reverse());
    }
    return this.state.layout.map((col) => col.slice(-1)).join('');
  }

  part2() {
    this.reset();
    while (this.state.steps.length) {
      const step = this.state.steps.shift();
      const moving = this.state.layout[step.from - 1].splice(-step.count);
      this.state.layout[step.to - 1].push(...moving);
    }
    return this.state.layout.map((col) => col.slice(-1)).join('');
  }
}
