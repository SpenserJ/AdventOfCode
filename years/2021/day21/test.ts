import { getRollsForTurn, part1, part2 } from './solve';

const input = `
Player 1 starting position: 4
Player 2 starting position: 8`;

describe('2020/12/21', () => {
  test('getRollsForTurn', () => {
    expect(getRollsForTurn(1)).toEqual(6); // 1, 2, 3
    expect(getRollsForTurn(2)).toEqual(15); // 4, 5, 6
    expect(getRollsForTurn(3)).toEqual(24); // 7, 8, 9
    expect(getRollsForTurn(4)).toEqual(33); // 10, 11, 12
    expect(getRollsForTurn(11)).toEqual(96); // 31, 32, 33
    expect(getRollsForTurn(12)).toEqual(105); // 34, 35, 36
    expect(getRollsForTurn(33)).toEqual(294); // 97, 98, 99
    // Wrap around
    expect(getRollsForTurn(34)).toEqual(103); // 100, 1, 2
    expect(getRollsForTurn(35)).toEqual(12); // 3, 4, 5
    expect(getRollsForTurn(36)).toEqual(21); // 6, 7, 8
    expect(getRollsForTurn(66)).toEqual(291); // 96, 97, 98
    // Wrap around
    expect(getRollsForTurn(67)).toEqual(200); // 99, 100, 101
    expect(getRollsForTurn(68)).toEqual(9); // 2, 3, 4
  });

  test('Part 1', () => {
    expect(part1(input)).toEqual(739785);
  });

  test('Part 2', () => {
    expect(part2(input)).toEqual(444356092776315);
  });
});
