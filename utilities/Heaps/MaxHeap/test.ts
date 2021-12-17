/* eslint-disable no-underscore-dangle */
import MaxHeap from '.';

interface CostNode {
  cost: number;
}

class MaxObjectHeap extends MaxHeap<CostNode> {
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
  // 2 inserts as left child of 5 and stays where it is
  [2, [5, 2]],
  // 6 inserts as right child of 5 and swaps with it
  [6, [6, 2, 5]],
  // 4 inserts as left child of 2 and swaps with it
  [4, [6, 4, 5, 2]],
  // 1 inserts as right child of 4 and stays where it is
  [1, [6, 4, 5, 2, 1]],
  // 7 inserts as left child of 5 and swaps with it
  // 7 is now right child of 6 and swaps with it
  [7, [7, 4, 6, 2, 1, 5]],
];

const removalInitialState = [6, 5, 4, 3, 2, 1];
const removals: [
  number, /* Expected root */
  number[], /* Expected heap array */
][] = [
  // Returns 6 and moves 1 to the root
  // Swaps 1 with 5 (larger than 4)
  // Swaps 1 with 3 (larger than 2)
  [6, [5, 3, 4, 1, 2]],
  // Returns 5 and moves 2 to the root
  // Swaps 2 with 4 (larger than 3)
  [5, [4, 3, 2, 1]],
  // Returns 4 and moves 1 to the root
  // Swaps 1 with 3 (larger than 2)
  [4, [3, 1, 2]],
];

describe('Heaps', () => {
  describe('MaxHeap', () => {
    describe('with numbers', () => {
      test('handles insertions', () => {
        const heap = new MaxHeap<number>([]);
        expect((heap as any)._nodes).toEqual([]);

        insertions.forEach(([insert, expectedHeap]) => {
          heap.insert(insert);
          expect((heap as any)._nodes).toEqual(expectedHeap);
        });
      });

      test('handles removal', () => {
        const heap = new MaxHeap<number>([...removalInitialState]);
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
        const heap = new MaxHeap<string>([]);
        expect((heap as any)._nodes).toEqual([]);

        insertions.forEach(([insert, expectedHeap]) => {
          heap.insert(numToLetter(insert));
          expect((heap as any)._nodes).toEqual(expectedHeap.map(numToLetter));
        });
      });

      test('handles removal', () => {
        const heap = new MaxHeap<string>(removalInitialState.map(numToLetter));
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
        const heap = new MaxObjectHeap([]);
        expect((heap as any)._nodes).toEqual([]);

        insertions.forEach(([insert, expectedHeap]) => {
          heap.insert(numToObj(insert));
          expect((heap as any)._nodes).toEqual(expectedHeap.map(numToObj));
        });
      });

      test('handles removal', () => {
        const heap = new MaxObjectHeap(removalInitialState.map(numToObj));
        expect((heap as any)._nodes).toEqual(removalInitialState.map(numToObj));

        removals.forEach(([root, expectedHeap]) => {
          expect(heap.extractRoot()).toEqual(numToObj(root));
          expect((heap as any)._nodes).toEqual(expectedHeap.map(numToObj));
        });
      });
    });
  });
});
