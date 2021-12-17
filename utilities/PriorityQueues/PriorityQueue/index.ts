abstract class PriorityQueue<T> {
  public abstract get isEmpty(): boolean;

  public abstract insert(value: T, priority: number): this;

  public abstract remove(value: T, priority: number): this;

  public abstract pull(): T;
}

export default PriorityQueue;
