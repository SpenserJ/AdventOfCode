import BaseDay from '@spenserj-aoc/utilities/BaseDay';

enum HandType {
  FiveOfAKind = 6,
  FourOfAKind = 5,
  FullHouse = 4,
  ThreeOfAKind = 3,
  TwoPair = 2,
  OnePair = 1,
  HighCard = 0,
}

const cardValues = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};

interface Hand {
  strHand: string;
  type: HandType;
  value: number;
  bet: number;
}

export default class Day07 extends BaseDay<any, null> {
  parseInput(rawInput: string) {
    const getHandType = (hand: Record<Partial<keyof typeof cardValues>, number>, wild = 0) => {
      const grouped = Object.values(hand).sort((a: number, b: number) => b - a);
      grouped[0] += wild;
      if (grouped[0] === 5) { return HandType.FiveOfAKind; }
      if (grouped[0] === 4) { return HandType.FourOfAKind; }
      if (grouped[0] === 3 && grouped[1] === 2) { return HandType.FullHouse; }
      if (grouped[0] === 3) { return HandType.ThreeOfAKind; }
      if (grouped[0] === 2 && grouped[1] === 2) { return HandType.TwoPair; }
      if (grouped[0] === 2) { return HandType.OnePair; }
      return HandType.HighCard;
    };

    return rawInput.split('\n')
      .map((line) => {
        const [strHand, strBet] = line.split(' ');
        const grouped = strHand.split('').reduce((acc, next) => {
          acc[next] = (acc[next] || 0) + 1;
          return acc;
        }, {} as Record<Partial<keyof typeof cardValues>, number>);
        const type = [
          getHandType(grouped),
          getHandType({ ...grouped, J: 0 }, grouped.J),
        ];
        // Use bit-shifting to calculate a unique value for each hand
        const value = strHand.split('')
          .reduce((acc, next) => {
            acc[0] = (acc[0] << 4) + cardValues[next];
            acc[1] = (acc[1] << 4) + (next === 'J' ? 0 : cardValues[next]);
            return acc;
          }, [type[0], type[1]]);
        return {
          strHand,
          type,
          value,
          bet: Number(strBet),
        };
      });
  }

  step() {}

  getHandComparator(part2 = false) {
    const part = part2 ? 1 : 0;
    return (a: Hand, b: Hand) => a.value[part] - b.value[part];
  }

  part1() {
    return this.state
      .sort(this.getHandComparator(false))
      .reduce((acc, next, i) => acc + (next.bet * (i + 1)), 0);
  }

  part2() {
    return this.state
      .sort(this.getHandComparator(true))
      .reduce((acc, next, i) => acc + (next.bet * (i + 1)), 0);
  }
}
