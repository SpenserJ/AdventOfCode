import BaseDay from '@spenserj-aoc/utilities/BaseDay';
import { lcm } from '@spenserj-aoc/utilities/math';

type Nodes = Map<string, [string, string]>;

export default class Day08 extends BaseDay<{
  instructions: string,
  nodes: Nodes,
}, null> {
  parseInput(rawInput: string) {
    const [instructions, , ...rawNodes] = rawInput.split('\n');
    const nodes = new Map<string, [string, string]>();
    const nodeRegex = /(\w{3})/g;
    for (const rawNode of rawNodes) {
      const [[key], [left], [right]] = [...rawNode.matchAll(nodeRegex)];
      nodes.set(key, [left, right]);
    }
    return { instructions, nodes };
  }

  step() {}

  calculateStepsFromRoot(node: string, part2 = false): number {
    let position = node;
    let steps = 0;
    while (part2 ? !position.endsWith('Z') : position !== 'ZZZ') {
      const nextInstruction = this.state.instructions[steps % this.state.instructions.length] === 'R' ? 1 : 0;
      position = this.state.nodes.get(position)[nextInstruction];
      steps += 1;
    }
    return steps;
  }

  part1() {
    return this.calculateStepsFromRoot('AAA');
  }

  part2() {
    const steps = [...this.state.nodes.keys()]
      .filter((key) => key.endsWith('A'))
      .map((key) => this.calculateStepsFromRoot(key, true));
    return steps.reduce(lcm, 1);
  }
}
