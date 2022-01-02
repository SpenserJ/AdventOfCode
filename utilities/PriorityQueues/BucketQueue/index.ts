import PriorityQueue from '../PriorityQueue';

export default class BucketQueue<T> extends PriorityQueue<T> {
  protected buckets: T[][] = [];

  protected currentBucket = 0;

  public get isEmpty(): boolean {
    return !!this.buckets.find((bucket) => bucket.length > 0);
  }

  public insert(value: T, priority: number): this {
    this.buckets[priority] ||= [];
    this.buckets[priority].push(value);
    // Make sure we're always using the minimum bucket if we insert
    // a lower priority than the current head
    this.currentBucket = Math.min(this.currentBucket, priority);

    return this;
  }

  public pull(): T | null {
    while (this.currentBucket < this.buckets.length) {
      const bucket = this.buckets[this.currentBucket];
      const next = bucket ? bucket.pop() : undefined;
      if (typeof next !== 'undefined') { return next; }
      this.currentBucket += 1;
    }
    return null;
  }

  public remove(value: T, priority: number): this {
    const bucket = this.buckets[priority];
    if (!bucket || bucket.length === 0) { return this; }
    const index = bucket.findIndex((v) => v === value);
    if (index === -1) { return this; }
    bucket.splice(index, 1);

    return this;
  }
}
