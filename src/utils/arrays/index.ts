export const arrayDifference = <T = any>(test: T[], against: T[]): T[] => (
  test.filter((v) => !against.includes(v))
);

export const arrayIntersect = <T = any>(test: T[], against: T[]): T[] => (
  test.filter((v) => against.includes(v))
);

export const isArraySubset = <T = any>(target: T[], subsetOf: T[]): boolean => (
  target.every((v) => subsetOf.includes(v))
);
