import Profiler from '../Profiler';
import RenderStore from '../RenderStore';

export interface Replay<TState = any> {
  state: TState;
}

export default abstract class BaseDay<TState, TReplay = Replay<TState>> {
  public profiler = new Profiler();

  public render = new RenderStore<TReplay>();

  public state: TState;

  public currentStep = 0;

  public abstract parseInput(rawInput: string): TState;

  constructor(rawInput: string) {
    this.profiler.start('parseInput');
    this.state = this.parseInput(rawInput);
    this.render.setLabel({ action: 'parseInt', step: 0 });
    this.render.update('state', this.state);
    this.profiler.stop('parseInput');
  }

  protected abstract step(): void;

  public trackStep(): void {
    this.currentStep += 1;
    this.render.setLabel({ action: 'step', step: this.currentStep });
    this.step();
    this.render.update('state', this.state);
  }

  public solve(): void {
    this.profiler.start('solve');
    if (typeof (this as any).part1 === 'function') {
      this.render.setLabel('part', 1);
      this.profiler.start('part1');
      const part1 = (this as any).part1();
      this.profiler.stop('part1');
      console.log('Part 1:', part1, `(${this.profiler.totals().part1.toFixed(2)}ms)`);
    }
    if (typeof (this as any).part2 === 'function') {
      this.render.setLabel('part', 2);
      this.profiler.start('part2');
      const part2 = (this as any).part2();
      this.profiler.stop('part2');
      console.log('Part 2:', part2, `(${this.profiler.totals().part2.toFixed(2)}ms)`);
    }
    this.profiler.stop('solve');
    const profilerTotals = this.profiler.totals();
    console.log(`Total time: ${profilerTotals.solve.toFixed(2)}ms`);
  }
}
