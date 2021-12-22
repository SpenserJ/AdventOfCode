const parseInput = (rawInput: string) => rawInput
  .trim()
  .split('\n')
  .map((line) => Number(line.slice(-2).trim())) as [number, number];

export const getRollsForTurn = (turn: number) => {
  const topRoll = (turn * 3) % 100;
  return (
    (topRoll + (topRoll - 2 <= 0 ? 98 : -2))
    + (topRoll + (topRoll - 1 <= 0 ? 99 : -1))
    + (topRoll + (topRoll === 0 ? 100 : 0))
  );
};

export const part1 = (rawInput: string) => {
  const boardPosition = parseInput(rawInput);
  const score = [0, 0];
  let turn = 1;
  console.log('score', score);
  while (score[0] < 1000 && score[1] < 1000) {
    const roll = getRollsForTurn(turn);
    const player = (turn - 1) % 2;
    boardPosition[player] = (boardPosition[player] + roll) % 10 || 10;
    score[player] += boardPosition[player];
    turn += 1;
  }
  return Math.min(...score) * (turn - 1) * 3;
};

/**
 * Since we roll a three-sided dice 3 times, there are a limited number of permutations.
 * [total value of dice - 3]: combinations to get total value
 */
const roleTotalTimes = [
  1, // 3 from 1 combo:  - 1+1+1
  3, // 4 from 3 combos: - 1+1+2, 1+2+1, 2+1+1
  6, // 5 from 6 combos: - 1+1+3, 1+3+1, 3+1+1, 1+2+2, 2+1+2, 2+2+1
  7, // 6 from 7 combos: - 1+2+3, 1+3+2, 2+1+3, 2+3+1, 3+1+2, 3+2+1, 2+2+2,
  6, // 7 from 6 combos: - 1+3+3, 3+1+3, 3+3+1, 2+2+3, 2+3+2, 3+2+2
  3, // 8 from 3 combos: - 2+3+3, 3+2+3, 3+3+2
  1, // 9 from 1 combo:  - 3+3+3
];

const gameCache = new Map<string, [number, number]>();

const runPart2Game = (
  pos1: number,
  pos2: number,
  score1: number,
  score2: number,
): [number, number] => {
  const unique = `${pos1},${pos2}-${score1},${score2}`;
  if (gameCache.has(unique)) { return gameCache.get(unique); }

  const wins = [0, 0] as [number, number];
  for (let rollTotal = 3; rollTotal < 10; rollTotal += 1) {
    const rollCombos = roleTotalTimes[rollTotal - 3];
    const newPos1 = (pos1 + rollTotal) % 10 || 10;
    const newScore1 = score1 + newPos1;
    if (newScore1 >= 21) {
      wins[0] += rollCombos;
    } else {
      // Flip the players when we run the next round
      const nestedScore = runPart2Game(pos2, newPos1, score2, newScore1);
      wins[1] += nestedScore[0] * rollCombos;
      wins[0] += nestedScore[1] * rollCombos;
    }
  }
  gameCache.set(unique, wins);
  return wins;
};

export const part2 = (rawInput: string) => {
  const boardPosition = parseInput(rawInput);
  const wins = runPart2Game(boardPosition[0], boardPosition[1], 0, 0);
  return Math.max(...wins);
};
