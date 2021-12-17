import Heap, { HeapKey } from '../Heap';

export default class MinHeap<T> extends Heap<T> {
  compareKeys(parentKey: HeapKey, childKey: HeapKey): boolean {
    return parentKey < childKey;
  }
}
