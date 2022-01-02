export const sortNumbers = (a: number, b: number): number => (a - b);

export const numBetween = (value: any, min: number, max: number): boolean => {
  const num = (typeof value === 'number') ? value : Number(value);

  // Handle invalid input
  if (typeof num !== 'number') { return false; }

  return min <= num && num <= max;
};

export const sum = (input: number[]) => input.reduce((acc, next) => (acc + next), 0);

/**
 * The termial is the sum of all positive integers less than or equal to n.
 *
 * termial(5) = 5 + 4 + 3 + 2 + 1
 * @returns The termial of n
 */
export const termial = (n: number) => (n * (n + 1)) / 2;
