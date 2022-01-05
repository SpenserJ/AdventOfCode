import BaseIntcode from '../Intcode';

export * from '../Intcode';

type OutputCallback = ((output: number) => void);

export default class Intcode8 extends BaseIntcode {
  protected input: number[] = [];

  protected inputQueue: ((value: number | PromiseLike<number>) => void)[] = [];

  protected onOutput?: OutputCallback;

  constructor(program: string) {
    super(program);

    this.addOpcode(3, async (_modes, destination) => {
      this.set(destination, await this.getInput());
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

  protected getInput(): Promise<number> {
    if (this.input.length > 0) {
      // Return the next available input
      return Promise.resolve(this.input.shift());
    }

    // Queue an input request
    return new Promise((res) => {
      this.inputQueue.push(res);
    });
  }

  public addInput(...input: number[] | [number[]]): void {
    const flatInput = (Array.isArray(input[0]) ? input[0] : input) as number[];
    for (let i = 0; i < flatInput.length; i += 1) {
      if (this.inputQueue.length === 0) {
        // Add the input to our list of available inputs
        this.input.push(flatInput[i]);
      } else {
        // Resolve the first queued input request
        const next = this.inputQueue.shift();
        next(flatInput[i]);
      }
    }
  }

  public setOutputCallback(onOutput: OutputCallback): void {
    this.onOutput = onOutput;
  }

  public reset(): void {
    super.reset();
    this.input = [];
    this.inputQueue = [];
  }
}
