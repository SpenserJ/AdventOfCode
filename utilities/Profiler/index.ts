type RecordedTimes<T = number> = Record<string, T>;

const getNow = () => {
  if (typeof process.hrtime !== 'undefined') { return process.hrtime.bigint(); }
  return BigInt(Math.trunc(performance.now() * 1_000_000));
};

export default class Profiler {
  private times: RecordedTimes<number[]> = {};

  private inProgress: RecordedTimes<bigint> = {};

  public start(name: string): void {
    if (this.inProgress[name]) { throw new Error(`Profiler already started for ${name}`); }
    this.inProgress[name] = getNow();
  }

  public stop(name: string): void {
    if (!this.inProgress[name]) { throw new Error(`Profiler wasn't started for ${name}`); }
    const time = Number(getNow() - this.inProgress[name]);
    delete this.inProgress[name];
    this.times[name] ||= [];
    this.times[name].push(time);
  }

  public totals(): Record<string, number> {
    return Object.entries(this.times).reduce((acc, next) => {
      acc[next[0]] = next[1].reduce((sum, v) => (sum + v), 0) / 1_000_000;
      return acc;
    }, {} as RecordedTimes);
  }

  public averages(): Record<string, number> {
    return Object.entries(this.times).reduce((acc, next) => {
      acc[next[0]] = next[1].reduce((sum, v) => (sum + v), 0) / next[1].length;
      return acc;
    }, {} as RecordedTimes);
  }

  public reset(): void {
    this.times = {};
    this.inProgress = {};
  }
}
