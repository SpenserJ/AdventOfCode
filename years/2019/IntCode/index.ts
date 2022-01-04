import makeSeekableIterator, { SeekableIterator } from '@spenserj-aoc/utilities/makeSeekIterator';

export const symbolExit = Symbol('Exit');

export type OpcodeResult = number | void | typeof symbolExit;

export type OpcodeFunction = (modes: number[], ...args: number[]) => OpcodeResult;

export enum ParameterMode {
  position,
  immediate,
}

export interface OpcodeWithModes {
  opcode: number;
  modes: ParameterMode[];
  call: OpcodeFunction;
  numParameters: number;
}

export default class BaseIntcode {
  private originalCode: string;

  public memory: number[];

  private pointer: SeekableIterator<number>;

  private opcodes = new Map<number, OpcodeFunction>();

  constructor(program: string) {
    this.originalCode = program.trim();
    this.reset();

    this.addOpcode(1, (modes, a, b, output) => {
      this.set(output, this.get(a, modes[0]) + this.get(b, modes[1]));
    });

    this.addOpcode(2, (modes, a, b, output) => {
      this.set(output, this.get(a, modes[0]) * this.get(b, modes[1]));
    });

    this.addOpcode(99, () => symbolExit);
  }

  public reset(): void {
    this.memory = this.originalCode.split(',').map((v) => Number(v));
    this.pointer = makeSeekableIterator(this.memory);
  }

  protected addOpcode(code: number, fn: OpcodeFunction): void {
    this.opcodes.set(code, fn.bind(this));
  }

  public get(param: number, mode: ParameterMode = ParameterMode.position): number {
    if (mode === ParameterMode.position) { return this.memory[param]; }
    return param;
  }

  public set(param: number, value: number): void {
    this.memory[param] = value;
  }

  protected getOpcodeData(rawOpcode: number): OpcodeWithModes {
    const str = rawOpcode.toString();
    const opcode = Number(str.slice(-2));
    const call = this.opcodes.get(opcode);
    const numParameters = Math.max(0, call ? call.length - 1 : 0);

    const modes: ParameterMode[] = Array(numParameters).fill(0);
    for (let i = 0; i < str.length - 2; i += 1) {
      modes[i] = Number(str[str.length - 3 - i]) as ParameterMode;
    }
    return {
      opcode,
      modes,
      call,
      numParameters,
    }
  }

  public step(): OpcodeResult {
    const next = this.pointer.next();
    if (next.done === true) { return symbolExit; }

    const opcodeData = this.getOpcodeData(next.value);
    if (!opcodeData.call) { throw new Error(`Unknown Opcode: ${next.value}`); }

    const args: number[] = [];
    // Function.length is the number of arguments that the function requires
    for (let i = 0; i < opcodeData.numParameters; i += 1) {
      const nextArg = this.pointer.next();
      if (nextArg.done === true) {
        throw new Error(`Opcode ${next.value} was missing parameter ${i + 0}`);
      }
      args.push(nextArg.value);
    }

    return opcodeData.call(opcodeData.modes, ...args);
  }

  public getInstructions(): number[][] {
    const instructions: number[][] = [];
    for (let i = 0; i < this.memory.length; i += 1) {
      const next: number[] = [this.memory[i]];
      const opcodeData = this.getOpcodeData(next[0]);
      for (let j = 0; j < opcodeData?.numParameters ?? 0; j += 1) {
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
