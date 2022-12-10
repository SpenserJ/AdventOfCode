import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export default class Day07 extends BaseDay<Record<string, number>, null> {
  parseInput(rawInput: string) {
    const path: string[] = [];
    const sizes: Record<string, number> = {};
    const lines = rawInput.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      const next = lines[i];
      if (next[0] === '$') {
        // Command
        const [, cmd, ...args] = next.split(' ');
        if (cmd === 'cd') {
          if (args[0] === '/') { continue; }
          if (args[0] === '..') {
            path.pop();
          } else {
            path.push(args[0]);
          }
          continue;
        }

        // Must be an ls
        while (i + 1 < lines.length) {
          i += 1;
          const lsNext = lines[i].split(' ');
          if (lsNext[0] === '$') {
            i -= 1;
            break;
          }
          if (lsNext[0] !== 'dir') {
            const size = Number(lsNext[0]);
            for (let j = 0; j <= path.length; j += 1) {
              const fullPath = `/${path.slice(0, j).join('/')}`;
              sizes[fullPath] = (sizes[fullPath] || 0) + size;
            }
          }
        }
      }
    }
    return sizes;
  }

  step() {}

  part1() {
    return Object.values(this.state).reduce((acc, next) => {
      if (next > 100_000) { return acc; }
      return acc + next;
    }, 0);
  }

  part2() {
    const free = 70_000_000 - this.state['/'];
    const need = 30_000_000 - free;
    return Object.values(this.state).sort((a, b) => a - b).find((v) => {
      console.log(need, v);
      return v >= need;
    });
  }
}
