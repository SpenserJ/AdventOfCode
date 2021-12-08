import { arrayIntersect, arrayDifference, isArraySubset } from '.';

describe('utils/array', () => {
  test('arrayIntersect', () => {
    expect(arrayIntersect([1, 2, 3, 4, 5, 6], [2, 4, 6, 8]))
      .toEqual([2, 4, 6]);

    expect(arrayIntersect([1, 2, 3], [4, 5, 6])).toEqual([]);
  });

  test('arrayDifference', () => {
    expect(arrayDifference([1, 2, 3, 4, 5, 6], [2, 4, 6, 8])).toEqual([1, 3, 5]);
    expect(arrayDifference([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3]);
  });

  test('isArraySubset', () => {
    expect(isArraySubset([2, 3, 4], [1, 2, 3, 4, 5])).toEqual(true);
    expect(isArraySubset([1, 3, 5], [1, 2, 3, 4, 5])).toEqual(true);
    expect(isArraySubset([], [1, 2, 3, 4, 5])).toEqual(true);
    expect(isArraySubset([4, 5, 6], [1, 2, 3, 4, 5])).toEqual(false);
  });
});
