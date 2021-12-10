/* eslint-disable no-cond-assign, no-continue */

interface Instruction {
  direction: 'forward' | 'up' | 'down';
  amount: number;
}

const parseInput = (input: string): Instruction[] => input
  .trim()
  .split('\n')
  .map((v) => {
    const [direction, amount] = v.split(' ');
    if (direction !== 'forward' && direction !== 'up' && direction !== 'down') {
      throw new Error(`Invalid instruction direction "${direction}`);
    }
    return { direction, amount: parseInt(amount, 10) };
  });

const execute = (input: Instruction[], forwardDepth: boolean) => {
  const result = input.reduce((acc, next) => {
    switch (next.direction) {
      case 'forward':
        acc.x += next.amount;
        if (forwardDepth) {
          acc.y += acc.aim * next.amount;
        }
        return acc;
      case 'up':
        if (forwardDepth) {
          return { ...acc, aim: acc.aim - next.amount };
        }
        return { ...acc, y: acc.y - next.amount };
      case 'down':
        if (forwardDepth) {
          return { ...acc, aim: acc.aim + next.amount };
        }
        return { ...acc, y: acc.y + next.amount };
      default: return acc;
    }
  }, { x: 0, y: 0, aim: 0 });
  return result.x * result.y;
};

export const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return execute(input, false);
};

export const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return execute(input, true);
};
