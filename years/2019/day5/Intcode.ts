import BaseIntcode from '../Intcode';

export * from '../Intcode';

type OutputCallback = ((output: number) => void);

export default class Intcode8 extends BaseIntcode {
  protected input: number[] = [];

  protected onOutput?: OutputCallback;

  constructor(program: string) {
    super(program);

    this.addOpcode(3, (_modes, destination) => {
      this.set(destination, this.getInput());
    });

    this.addOpcode(4, (modes, source) => {
      if (this.onOutput) { this.onOutput(this.get(source, modes[0])); }
    });

    this.addOpcode(5, (modes, ifTrue, jumpTo) => {
      if (this.get(ifTrue, modes[0]) !== 0) {
        this.pointer.seek(this.get(jumpTo, modes[1]));
      }
    });

    this.addOpcode(6, (modes, ifFalse, jumpTo) => {
      if (this.get(ifFalse, modes[0]) === 0) {
        this.pointer.seek(this.get(jumpTo, modes[1]));
      }
    });

    this.addOpcode(7, (modes, a, b, storeIn) => {
      const value = this.get(a, modes[0]) < this.get(b, modes[1]);
      this.set(storeIn, Number(value));
    });

    this.addOpcode(8, (modes, a, b, storeIn) => {
      const value = this.get(a, modes[0]) === this.get(b, modes[1]);
      this.set(storeIn, Number(value));
    });
  }

  setInput(...input: number[] | [number[]]): void {
    this.input = (Array.isArray(input[0]) ? input[0] : input) as number[];
  }

  setOutputCallback(onOutput: OutputCallback): void {
    this.onOutput = onOutput;
  }

  protected getInput() {
    const input = this.input.shift();
    if (typeof input === 'undefined') {
      throw new Error('No input provided');
    }
    return input;
  }
}
