import Heap, { HeapKey } from '../Heap';

export default class MaxHeap<T> extends Heap<T> {
  compareKeys(parentKey: HeapKey, childKey: HeapKey): boolean {
    return parentKey > childKey;
  }
}
