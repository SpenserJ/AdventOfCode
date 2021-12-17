export type HeapKey = string | number;

export default abstract class Heap<T extends HeapKey | {}> {
  protected _nodes: T[];

  constructor(nodes: T[]) {
    this._nodes = nodes;
    this.fix(); // TODO: This is probably not optimal if we add cloning
  }

  public get root() {
    return this._nodes[0] ?? null;
  }

  public get size() {
    return this._nodes.length;
  }

  public get isEmpty() {
    return this.size === 0;
  }

  public clear() {
    this._nodes = [];
  }

  public insert(node: T) {
    this._nodes.push(node);
    this.heapifyUp(this._nodes.length - 1);
  }

  public extractRoot(): T {
    if (this.isEmpty) { return null; }

    const { root } = this;
    this._nodes[0] = this._nodes[this.size - 1];
    this._nodes.pop();
    this.heapifyDown(0);

    return root;
  }

  /**
   * Correct all of the positions in the heap
   */
  fix() {
    for (let i = 0; i < this.size; i += 1) {
      this.heapifyUp(i);
    }
    return this;
  }

  /**
   * Get the key for a node
   */
  protected getKey(node: T): HeapKey {
    if (typeof node !== 'string' && typeof node !== 'number') {
      throw new Error(`Heap cannot be used with ${typeof node} without being overloaded`);
    }
    return node;
  }

  /**
   * Compare whether a parent key and child key are in the correct position
   * @returns True if they are in the correct positions
   */
  abstract compareKeys(parentKey: HeapKey, childKey: HeapKey): boolean;

  /**
   * Compare whether a parent node and child node are in the correct position
   * @returns True if they are in the correct positions
   */
  protected compare(parentNode: T, childNode: T): boolean {
    return this.compareKeys(
      this.getKey(parentNode),
      this.getKey(childNode),
    );
  }

  /**
   * Compare whether a parent index and child index are in the correct position or if they
   * need to be swapped
   * @returns True if they should be swapped
   */
  protected shouldSwap(parentIndex: number, childIndex: number): boolean {
    if (parentIndex < 0 || parentIndex >= this.size) { return false; }
    if (childIndex < 0 || childIndex >= this.size) { return false; }
    return !this.compare(this._nodes[parentIndex], this._nodes[childIndex]);
  }

  protected getParentIndex(childIndex: number) {
    return Math.floor((childIndex - 1) / 2);
  }

  protected getLeftChildIndex(parentIndex: number) {
    return (parentIndex * 2) + 1;
  }

  protected getRightChildIndex(parentIndex: number) {
    return (parentIndex * 2) + 2;
  }

  protected hasLeftChild(parentIndex: number) {
    return this.getLeftChildIndex(parentIndex) < this.size;
  }

  protected hasRightChild(parentIndex: number) {
    return this.getRightChildIndex(parentIndex) < this.size;
  }

  /**
   * Compare the children and determine which one should be swapped with the parent
   * @returns The index of the child that should be swapped
   */
  protected compareChildrenOf(parentIndex: number) {
    if (!this.hasLeftChild(parentIndex) && !this.hasRightChild(parentIndex)) {
      return -1;
    }

    const leftChildIndex = this.getLeftChildIndex(parentIndex);
    const rightChildIndex = this.getRightChildIndex(parentIndex);

    if (!this.hasLeftChild(parentIndex)) { return rightChildIndex; }
    if (!this.hasRightChild(parentIndex)) { return leftChildIndex; }

    const isLeft = this.compare(this._nodes[leftChildIndex], this._nodes[rightChildIndex]);
    return isLeft ? leftChildIndex : rightChildIndex;
  }

  protected swap(i, j) {
    const temp = this._nodes[i];
    this._nodes[i] = this._nodes[j];
    this._nodes[j] = temp;
  }

  protected heapifyUp(index: number) {
    let childIndex = index;
    let parentIndex = this.getParentIndex(childIndex);
    while (this.shouldSwap(parentIndex, childIndex)) {
      this.swap(parentIndex, childIndex);
      childIndex = parentIndex;
      parentIndex = this.getParentIndex(childIndex);
    }
  }

  protected heapifyDown(index: number) {
    let parentIndex = index;
    let childIndex = this.compareChildrenOf(parentIndex);
    while (this.shouldSwap(parentIndex, childIndex)) {
      this.swap(parentIndex, childIndex);
      parentIndex = childIndex;
      childIndex = this.compareChildrenOf(parentIndex);
    }
  }
}
