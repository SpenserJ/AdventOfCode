import bisect from '.';

describe('utils/bisect', () => {
  test('should find the last index of the left partition', () => {
    expect(bisect([1, 2, 3, 4, 5, 6], (value: number) => (value > 4))).toEqual([
      /* value */ 4,
      /* index */ 3,
    ]);

    expect(bisect(['a', 'a', 'b', 'b', 'b'], (value: string) => (value === 'b'))).toEqual([
      /* value */ 'a',
      /* index */ 1,
    ]);
  });
});
