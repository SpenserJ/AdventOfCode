interface Board {
  cells: string[];
  mask: number;
}

const getMaskForPos: {
  (index: number): number;
  (x: number, y: number): number;
} = (xOrIndex: number, y?: number) => {
  if (typeof y === 'undefined') {
    return 1 << xOrIndex;
  }
  return 1 << ((y * 5) + xOrIndex);
};

const validWins: number[] = [];
const winHorizontal = 0b11111_00000_00000_00000_00000;
const winVertical = 0b10000_10000_10000_10000_10000;
for (let i = 0; i < 5; i += 1) {
  validWins.push(winHorizontal >> i * 5);
  validWins.push(winVertical >> i);
}

const parseInput = (input: string) => {
  const [rawCellsDrawn, ...rawBoards] = input.trim().split('\n');
  const cellsDrawn = rawCellsDrawn.split(',');
  const boards = rawBoards.reduce((acc, next) => {
    if (next === '') {
      acc.push({ cells: [], mask: 0 });
    } else {
      const board = acc[acc.length - 1];
      next.split(' ').filter(Boolean).forEach((num) => { board.cells.push(num); });
    }
    return acc;
  }, <Board[]>[]);
  return { cellsDrawn, boards };
};

interface BoardResult {
  boardIndex: number;
  matchIndex: number;
  cellsDrawn: string[];
  score: {
    remainingSum: number;
    lastCall: number;
    result: number;
  };
}

interface GameResult {
  winners: BoardResult[];
  boards: Board[];
}

const solve = (input: string, playUntilWin: boolean): GameResult => {
  const { cellsDrawn: allCellsDrawn, boards } = parseInput(input);
  const currentCellsDrawn: string[] = [];
  const winningBoards: BoardResult[] = [];
  const winningBoardIndexes: number[] = [];

  for (let i = 0; i < allCellsDrawn.length; i += 1) {
    currentCellsDrawn.push(allCellsDrawn[i]);
    for (let b = 0; b < boards.length; b += 1) {
      if (winningBoardIndexes.includes(b)) { continue; }
      const board = boards[b];
      const matchIndex = board.cells.indexOf(allCellsDrawn[i]);
      if (matchIndex !== -1) {
        board.mask += getMaskForPos(matchIndex);
        board.cells[matchIndex] = '*';
        if (validWins.find((mask) => ((board.mask & mask) === mask))) {
          const remainingSum = board.cells.reduce((acc, next) => acc + (next === '*' ? 0 : parseInt(next, 10)), 0);
          const lastCall = parseInt(allCellsDrawn[i], 10);
          winningBoardIndexes.push(b);
          winningBoards.push({
            boardIndex: b,
            matchIndex,
            cellsDrawn: currentCellsDrawn,
            score: {
              remainingSum,
              lastCall,
              result: remainingSum * lastCall,
            },
          });
          if (playUntilWin === true) {
            return { winners: winningBoards, boards };
          }
        }
      }
    }
  }
  return { winners: winningBoards, boards };
};

export const part1 = (rawInput: string) => {
  const results = solve(rawInput, true);
  if (results.winners.length > 0) {
    return results.winners[0].score.result;
  }
  throw new Error('Could not determine a winner');
};

export const part2 = (input: string) => {
  const results = solve(input, false);
  if (results.winners.length > 0) {
    return results.winners[results.winners.length - 1].score.result;
  }
  throw new Error('Could not determine a winner');
};
