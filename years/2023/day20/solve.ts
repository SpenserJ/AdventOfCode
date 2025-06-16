import { lcm } from '@spenserj-aoc/utilities';
import BaseDay from '@spenserj-aoc/utilities/BaseDay';

type OutputCallback = (state: boolean) => void;

abstract class Module {
  protected state: boolean | boolean[];

  protected outputs: OutputCallback[] = [];

  protected observer: OutputCallback | null = null;

  constructor(public readonly name: string, protected pulseQueue: OutputCallback[]) {}

  abstract addInput(): OutputCallback;

  public addOutputs(outputs: Module[]) {
    this.outputs.push(...outputs.map((output) => {
      const callback = output.addInput();
      (callback as any).moduleName = output.name;
      return callback;
    }));
  }

  protected send(state: boolean) {
    this.outputs.forEach((output) => {
      this.pulseQueue.push(() => output(state));
      if (this.observer) { this.pulseQueue.push(() => this.observer(state)); }
    });
  }

  public serialize(): number {
    if (typeof this.state === 'boolean') { return this.state ? 1 : 0; }
    return this.state.reduce((acc, next) => (acc << 1) + (next ? 1 : 0), 0);
  }

  public observe(observer: (state: boolean) => void) {
    this.observer = observer;
  }
}

class FlipFlopModule extends Module {
  protected state: boolean = false;

  addInput(): OutputCallback {
    return (state: boolean) => {
      // If a flip-flop module receives a high pulse, it is ignored and nothing happens.
      if (state === true) { return; }
      // If a flip-flop module receives a low pulse, it flips between on and off.
      this.state = !this.state;
      this.send(this.state);
    };
  }
}

class ConjunctionModule extends Module {
  protected state: boolean[] = [];

  addInput(): OutputCallback {
    // Remember the type of the most recent pulse received from each of the connected input modules.
    // Default to remembering a low pulse for each input.
    const inputIndex = this.state.length;
    this.state.push(false);
    return (state: boolean) => {
      this.state[inputIndex] = state;
      // If the state is all high, it sends a low pulse; otherwise, it sends a high pulse.
      const allHigh = this.state.every(Boolean);
      this.send(!allHigh);
    };
  }
}

class BroadcastModule extends Module {
  // Unused. This module immediately broadcasts and never updates its internal state.
  protected state: boolean = false;

  addInput(): OutputCallback {
    return (state: boolean) => {
      // Send the same pulse to all of its destination modules
      this.send(state);
    };
  }
}

class ButtonModule extends BroadcastModule {
  public send(state: boolean) { super.send(state); }
}

class OutputModule extends Module {
  // Unused. This module never tracks state or broadcasts
  protected state: boolean = false;

  addInput(): OutputCallback {
    return () => {};
  }
}

interface State {
  modules: Module[];
  button: ButtonModule;
  pulseQueue: OutputCallback[];
}

interface Node {
  name: string;
  type: 'normal' | 'flipflop' | 'conjunction';
  inputs: string[];
  outputs: string[];
}

export default class Day20 extends BaseDay<State, null> {
  parseInput(rawInput: string) {
    const pulseQueue: OutputCallback[] = [];

    const { modules, outputs } = rawInput.split('\n').reduce((acc, next) => {
      const [rawName, rawOutputs] = next.split(' -> ');
      const newOutputs = rawOutputs.split(', ');
      const name = rawName.charCodeAt(0) < 65 ? rawName.slice(1) : rawName;
      if (rawName.startsWith('%')) {
        acc.modules[name] = new FlipFlopModule(name, pulseQueue);
      } else if (rawName.startsWith('&')) {
        acc.modules[name] = new ConjunctionModule(name, pulseQueue);
      } else {
        acc.modules[name] = new BroadcastModule(name, pulseQueue);
      }
      acc.outputs[name] = newOutputs;
      return acc;
    }, {
      modules: {},
      outputs: {},
    } as { modules: Record<string, Module>, outputs: Record<string, string[]> });

    Object.entries(outputs).forEach(([name, outputNames]) => {
      modules[name].addOutputs(outputNames.map((outputName) => {
        if (!modules[outputName]) {
          modules[outputName] = new OutputModule(outputName, pulseQueue);
        }
        return modules[outputName];
      }));
    });

    const button = new ButtonModule('button', pulseQueue);
    button.addOutputs([modules.broadcaster]);

    return { modules: Object.values(modules), button, pulseQueue };
  }

  step() {}

  part1() {
    let high = 0;
    let low = 0;
    this.state.modules.concat(this.state.button).forEach((module) => {
      module.observe((state: boolean) => { if (state) { high += 1; } else { low += 1; } });
    });
    for (let i = 0; i < 1000; i += 1) {
      this.state.button.send(false);
      let nextQueue: OutputCallback;
      while (nextQueue = this.state.pulseQueue.shift()) {
        nextQueue(undefined);
      }
    }
    console.log({ high, low });
    return high * low;
  }

  part2() {
    const flatNodes = this.rawInput.split('\n').reduce((acc, next) => {
      const [rawName, rawOutputs] = next.split(' -> ');
      const name = rawName.charCodeAt(0) < 65 ? rawName.slice(1) : rawName;
      let type = 'normal';
      switch (rawName.charAt(0)) {
        case '%': type = 'flipflop'; break;
        case '&': type = 'conjunction'; break;
        default: break;
      }
      acc[name] = {
        name,
        type,
        inputs: [],
        outputs: rawOutputs.split(', '),
      } as Node;
      return acc;
    }, {} as Record<string, Node>);

    for (const node of Object.values(flatNodes)) {
      for (const output of node.outputs) {
        if (!flatNodes[output]) {
          flatNodes[output] = {
            name: output,
            type: 'normal',
            inputs: [],
            outputs: [],
          };
        }
        flatNodes[output].inputs.push(node.name);
      }
    }

    let cycleSyncNode = flatNodes.rx;
    while (cycleSyncNode.type !== 'conjunction' || cycleSyncNode.inputs.length === 1) {
      cycleSyncNode = flatNodes[cycleSyncNode.inputs[0]];
    }

    const cycleLengths = cycleSyncNode.inputs.map((cycleInputName) => {
      let inputNode = flatNodes[cycleInputName];
      while (inputNode.type !== 'conjunction' || inputNode.inputs.length === 1) {
        inputNode = flatNodes[inputNode.inputs[0]];
      }
      // eslint-disable-next-line max-len
      const cycleStart = flatNodes[inputNode.inputs.find((inputName) => inputNode.outputs.includes(inputName))];
      const bits: number[] = [];
      let nextNode = cycleStart;
      while (nextNode) {
        bits.unshift(nextNode.outputs.includes(inputNode.name) ? 1 : 0);
        nextNode = flatNodes[nextNode.outputs.find((inputName) => inputName !== inputNode.name)];
      }
      return parseInt(bits.join(''), 2);
    });
    return cycleLengths.reduce(lcm, 1);
  }
}
