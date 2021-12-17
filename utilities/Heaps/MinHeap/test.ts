/* eslint-disable no-underscore-dangle */
import MinHeap from '.';

interface CostNode {
  cost: number;
}

class MinObjectHeap extends MinHeap<CostNode> {
  protected getKey(node: CostNode) {
    return node.cost;
  }
}

const insertions: [
  number, /* Insert into heap */
  number[], /* Expected heap array */
][] = [
  // 5 inserts as root
  [5, [5]],
  // 2 inserts as left child of 5 and swaps with it
  [2, [2, 5]],
  // 6 inserts as right child of 2 and stays where it is
  [6, [2, 5, 6]],
  // 4 inserts as left child of 5 and swaps with it
  [4, [2, 4, 6, 5]],
  // 1 inserts as right child of 4 and swaps with it
  // 1 is now left child of 2 and swaps with it
  [1, [1, 2, 6, 5, 4]],
  // 1 inserts again as left child of 6 and swaps with it
  [1, [1, 2, 1, 5, 4, 6]],
];

const removalInitialState = [1, 2, 3, 4, 5, 6];
const removals: [
  number, /* Expected root */
  number[], /* Expected heap array */
][] = [
  // Returns 1 and moves 6 to the root
  // Swaps 6 with 2 (smaller than 3)
  // Swaps 6 with 4 (smaller than 5)
  [1, [2, 4, 3, 6, 5]],
  // Returns 2 and moves 5 to the root
  // Swaps 5 with 3 (smaller than 4)
  [2, [3, 4, 5, 6]],
  // Returns 3 and moves 6 to the root
  // Swaps 6 with 4 (smaller than 5)
  [3, [4, 6, 5]],
];

describe('Heaps', () => {
  describe('MinHeap', () => {
    describe('with numbers', () => {
      test('handles insertions', () => {
        const heap = new MinHeap<number>([]);
        expect((heap as any)._nodes).toEqual([]);

        insertions.forEach(([insert, expectedHeap]) => {
          heap.insert(insert);
          expect((heap as any)._nodes).toEqual(expectedHeap);
        });
      });

      test('handles removal', () => {
        const heap = new MinHeap<number>([...removalInitialState]);
        expect((heap as any)._nodes).toEqual(removalInitialState);

        removals.forEach(([root, expectedHeap]) => {
          expect(heap.extractRoot()).toEqual(root);
          expect((heap as any)._nodes).toEqual(expectedHeap);
        });
      });
    });

    describe('with strings', () => {
      const letters = 'abcdefg';
      const numToLetter = (num: number) => letters[num - 1];

      test('handles insertions', () => {
        const heap = new MinHeap<string>([]);
        expect((heap as any)._nodes).toEqual([]);

        insertions.forEach(([insert, expectedHeap]) => {
          heap.insert(numToLetter(insert));
          expect((heap as any)._nodes).toEqual(expectedHeap.map(numToLetter));
        });
      });

      test('handles removal', () => {
        const heap = new MinHeap<string>(removalInitialState.map(numToLetter));
        expect((heap as any)._nodes).toEqual(removalInitialState.map(numToLetter));

        removals.forEach(([root, expectedHeap]) => {
          expect(heap.extractRoot()).toEqual(numToLetter(root));
          expect((heap as any)._nodes).toEqual(expectedHeap.map(numToLetter));
        });
      });
    });

    describe('with objects', () => {
      const numToObj = (cost: number): CostNode => ({ cost });

      test('handles insertions', () => {
        const heap = new MinObjectHeap([]);
        expect((heap as any)._nodes).toEqual([]);

        insertions.forEach(([insert, expectedHeap]) => {
          heap.insert(numToObj(insert));
          expect((heap as any)._nodes).toEqual(expectedHeap.map(numToObj));
        });
      });

      test('handles removal', () => {
        const heap = new MinObjectHeap(removalInitialState.map(numToObj));
        expect((heap as any)._nodes).toEqual(removalInitialState.map(numToObj));

        removals.forEach(([root, expectedHeap]) => {
          expect(heap.extractRoot()).toEqual(numToObj(root));
          expect((heap as any)._nodes).toEqual(expectedHeap.map(numToObj));
        });
      });
    });
  });
});
