const parseInput = (input: string) => input
  .trim()
  .split(',')
  .reduce((acc, next) => {
    acc[next] += 1;
    return acc;
  }, Array<number>(9).fill(0));

export const solve = (rawInput: string, days: number) => {
  const daysUntilSpawn = parseInput(rawInput);
  for (let i = 0; i < days; i += 1) {
    const spawningFish = daysUntilSpawn.shift();
    daysUntilSpawn[6] += spawningFish; // Re-add the original fish with 6 days to spawn
    daysUntilSpawn.push(spawningFish); // Add the new fish with 8 days to spawn
  }
  return daysUntilSpawn.reduce((acc, next) => (acc + next), 0);
};

export const part1 = (rawInput: string) => solve(rawInput, 80);
export const part2 = (rawInput: string) => solve(rawInput, 256);
