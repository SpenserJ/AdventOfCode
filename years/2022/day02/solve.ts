import BaseDay from '@spenserj-aoc/utilities/BaseDay';

enum Moves {
  A = 1,
  B = 2,
  C = 3,
}

enum Part1OurMoves {
  X = 'A',
  Y = 'B',
  Z = 'C',
}

enum WinningMoves {
  A = 'B',
  B = 'C',
  C = 'A',
}

enum GoalPoints {
  X = 0,
  Y = 3,
  Z = 6,
}

export default class Day02 extends BaseDay<[string, string][], null> {
  parseInput(rawInput: string) {
    return rawInput
      .split('\n')
      .map((line) => line.split(' ') as [string, string]);
  }

  step() {}

  part1() {
    return this.state
      .map((round) => {
        const them = Moves[round[0]];
        const us = Moves[Part1OurMoves[round[1]] as 'A' | 'B' | 'C'];
        let points = us;
        points += (them === us && 3) || ((them === us - 1 || them === us + 2) && 6) || 0;
        return points;
      })
      .reduce((acc, next) => acc + next, 0);
  }

  part2() {
    return this.state
      .map((round) => {
        const [them, goal] = round;
        let points = GoalPoints[goal];
        const us = (goal === 'Y' && them) || (goal === 'Z' && WinningMoves[them]) || WinningMoves[WinningMoves[them]];
        points += Moves[us];
        return points;
      })
      .reduce((acc, next) => acc + next, 0);
  }
}
