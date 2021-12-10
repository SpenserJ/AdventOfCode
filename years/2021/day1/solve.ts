const parseInput = (input: string): number[] => input
  .trim()
  .split('\n')
  .map((v) => parseInt(v, 10));

const execute = (input: number[]) => {
  const { individual, windows: windowSizes } = input.reduce((acc, next, i, arr) => {
    // Increment the number of individual increases as needed
    if (i > 0) { acc.individual += (next > arr[i - 1] ? 1 : 0); }

    for (let windowI = i; windowI > i - 3 && windowI >= 0; windowI -= 1) {
      acc.windows[windowI] ||= 0;
      acc.windows[windowI] += next;
    }

    return acc;
  }, { individual: 0, windows: [] });

  const windows = windowSizes.reduce((acc, next, i, arr) => {
    if (i === 0) { return acc; }
    return acc + (next > arr[i - 1] ? 1 : 0);
  }, 0);

  return { individual, windows };
};

export const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return execute(input).individual;
};

export const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return execute(input).windows;
};
