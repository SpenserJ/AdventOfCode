import makeSeekableIterator, { SeekableIterator } from '@spenserj-aoc/utilities/makeSeekIterator';

export const symbolExit = Symbol('Exit');

export type OpcodeResult = number | void | typeof symbolExit;

export type OpcodeFunction = (...args: number[]) => OpcodeResult;

export default class BaseIntcode {
  private originalCode: string;

  public memory: number[];

  private pointer: SeekableIterator<number>;

  private opcodes = new Map<number, OpcodeFunction>();

  constructor(program: string) {
    this.originalCode = program.trim();
    this.reset();

    this.addOpcode(1, (a, b, output) => {
      this.memory[output] = this.memory[a] + this.memory[b];
    });

    this.addOpcode(2, (a, b, output) => {
      this.memory[output] = this.memory[a] * this.memory[b];
    });

    this.addOpcode(99, () => symbolExit);
  }

  public reset(): void {
    this.memory = this.originalCode.split(',').map((v) => Number(v));
    this.pointer = makeSeekableIterator(this.memory);
  }

  public addOpcode(code: number, fn: OpcodeFunction): void {
    this.opcodes.set(code, fn.bind(this));
  }

  public step(): OpcodeResult {
    const next = this.pointer.next();
    if (next.done === true) { return symbolExit; }

    const opcode = this.opcodes.get(next.value);
    if (!opcode) { throw new Error(`Unknown Opcode: ${next.value}`); }

    const args: number[] = [];
    // Function.length is the number of arguments that the function requires
    for (let i = 0; i < opcode.length; i += 1) {
      const nextArg = this.pointer.next();
      if (nextArg.done === true) {
        throw new Error(`Opcode ${next.value} was missing parameter ${i + 0}`);
      }
      args.push(nextArg.value);
    }

    return opcode(...args);
  }

  public getInstructions(): number[][] {
    const instructions: number[][] = [];
    for (let i = 0; i < this.memory.length; i += 1) {
      const next: number[] = [this.memory[i]];
      const opcode = this.opcodes.get(next[0]);
      for (let j = 0; j < opcode?.length ?? 0; j += 1) {
        i += 1;
        next.push(this.memory[i]);
      }
      instructions.push(next);
    }
    return instructions;
  }

  public run(): OpcodeResult {
    let value: OpcodeResult;
    while (value !== symbolExit) { value = this.step(); }
    return value;
  }
}
