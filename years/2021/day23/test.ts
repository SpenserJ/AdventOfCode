/* eslint-disable object-curly-newline */
import Solver, {
  GameState,
  getPossibleRoomExits,
  Hallway,
  injectPart2,
} from './solve';

const input = `
#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;

describe('2020/12/23', () => {
  const flattenWithCost = (initialState: GameState): [string, number][] => (
    initialState.edges.map((gameState) => ([
      gameState.flatten(),
      gameState.cost(initialState),
    ]))
  );

  test('parseInput', () => {
    expect(new Solver(input).state).toEqual({
      hallway: Array(7).fill('.'),
      rooms: [
        { for: 'A', amphipods: ['B', 'A'], done: false, filling: false },
        { for: 'B', amphipods: ['C', 'D'], done: false, filling: false },
        { for: 'C', amphipods: ['B', 'C'], done: false, filling: false },
        { for: 'D', amphipods: ['D', 'A'], done: false, filling: false },
      ],
    });

    expect(new Solver(injectPart2(input)).state).toEqual({
      hallway: Array(7).fill('.'),
      rooms: [
        { for: 'A', amphipods: ['B', 'D', 'D', 'A'], done: false, filling: false },
        { for: 'B', amphipods: ['C', 'C', 'B', 'D'], done: false, filling: false },
        { for: 'C', amphipods: ['B', 'B', 'A', 'C'], done: false, filling: false },
        { for: 'D', amphipods: ['D', 'A', 'C', 'A'], done: false, filling: false },
      ],
    });
  });

  test('flattenGameState', () => {
    expect(new GameState(
      '.......'.split('') as Hallway,
      [
        { for: 'A', amphipods: ['A', 'A'], done: true, filling: false },
        { for: 'B', amphipods: ['B', 'B'], done: true, filling: false },
        { for: 'C', amphipods: ['C', 'C'], done: true, filling: false },
        { for: 'D', amphipods: ['D', 'D'], done: true, filling: false },
      ],
    ).flatten()).toEqual('.......AABBCCDD');

    expect(new GameState(
      '.......'.split('') as Hallway,
      [
        { for: 'A', amphipods: ['B', 'A'], done: false, filling: false },
        { for: 'B', amphipods: ['C', 'D'], done: false, filling: false },
        { for: 'C', amphipods: ['B', 'C'], done: false, filling: false },
        { for: 'D', amphipods: ['D', 'A'], done: false, filling: false },
      ],
    ).flatten()).toEqual('.......BACDBCDA');

    expect(new GameState(
      'A.CD.BA'.split('') as Hallway,
      [
        { for: 'A', amphipods: ['.', 'B'], done: false, filling: false },
        { for: 'B', amphipods: ['C', 'D'], done: false, filling: false },
        { for: 'C', amphipods: ['.', '.'], done: false, filling: 0 },
        { for: 'D', amphipods: ['B', '.'], done: false, filling: false },
      ],
    ).flatten()).toEqual('A.CD.BA.BCD..B.');
  });

  test('getPossibleRoomExits', () => {
    // No blockers
    expect(getPossibleRoomExits(0, '.......'.split('') as Hallway))
      .toEqual([1, 0, 2, 3, 4, 5, 6]);
    expect(getPossibleRoomExits(1, '.......'.split('') as Hallway))
      .toEqual([2, 1, 0, 3, 4, 5, 6]);
    expect(getPossibleRoomExits(2, '.......'.split('') as Hallway))
      .toEqual([3, 2, 1, 0, 4, 5, 6]);
    expect(getPossibleRoomExits(3, '.......'.split('') as Hallway))
      .toEqual([4, 3, 2, 1, 0, 5, 6]);
    // Can't leave the room
    expect(getPossibleRoomExits(0, '.AA....'.split('') as Hallway))
      .toEqual([]);
    expect(getPossibleRoomExits(1, '..AA...'.split('') as Hallway))
      .toEqual([]);
    expect(getPossibleRoomExits(2, '...AA..'.split('') as Hallway))
      .toEqual([]);
    expect(getPossibleRoomExits(3, '....AA.'.split('') as Hallway))
      .toEqual([]);
    // Can leave the room, but can't go far
    expect(getPossibleRoomExits(0, 'A..A...'.split('') as Hallway))
      .toEqual([1, 2]);
    expect(getPossibleRoomExits(1, '.A..A..'.split('') as Hallway))
      .toEqual([2, 3]);
    expect(getPossibleRoomExits(2, '..A..A.'.split('') as Hallway))
      .toEqual([3, 4]);
    expect(getPossibleRoomExits(3, '...A..A'.split('') as Hallway))
      .toEqual([4, 5]);
  });

  test('getPossibleStates', () => {
    // #region Filling only
    expect(flattenWithCost(new GameState(
      '.......'.split('') as Hallway,
      [
        { for: 'A', amphipods: ['A', 'A'], done: true, filling: false },
        { for: 'B', amphipods: ['B', 'B'], done: true, filling: false },
        { for: 'C', amphipods: ['C', 'C'], done: true, filling: false },
        { for: 'D', amphipods: ['D', 'D'], done: true, filling: false },
      ],
    ))).toEqual([]);

    expect(flattenWithCost(new GameState(
      'AA.....'.split('') as Hallway,
      [
        { for: 'A', amphipods: ['.', '.'], done: false, filling: 1 },
        { for: 'B', amphipods: ['B', 'B'], done: true, filling: false },
        { for: 'C', amphipods: ['C', 'C'], done: true, filling: false },
        { for: 'D', amphipods: ['D', 'D'], done: true, filling: false },
      ],
    ))).toEqual([
      ['A.......ABBCCDD', 3],
    ]);

    expect(flattenWithCost(new GameState(
      '.AA....'.split('') as Hallway,
      [
        { for: 'A', amphipods: ['.', '.'], done: false, filling: 1 },
        { for: 'B', amphipods: ['B', 'B'], done: true, filling: false },
        { for: 'C', amphipods: ['C', 'C'], done: true, filling: false },
        { for: 'D', amphipods: ['D', 'D'], done: true, filling: false },
      ],
    ))).toEqual([
      ['..A.....ABBCCDD', 3],
      ['.A......ABBCCDD', 3],
    ]);

    expect(flattenWithCost(new GameState(
      '.ABA...'.split('') as Hallway,
      [
        { for: 'A', amphipods: ['.', '.'], done: false, filling: 1 },
        { for: 'B', amphipods: ['.', 'B'], done: false, filling: 0 },
        { for: 'C', amphipods: ['C', 'C'], done: true, filling: false },
        { for: 'D', amphipods: ['D', 'D'], done: true, filling: false },
      ],
    ))).toEqual([
      ['..BA....A.BCCDD', 3],
      ['.A.A.....BBCCDD', 20],
    ]);

    expect(flattenWithCost(new GameState(
      'D.....A'.split('') as Hallway,
      [
        { for: 'A', amphipods: ['.', 'A'], done: false, filling: 0 },
        { for: 'B', amphipods: ['B', 'B'], done: true, filling: false },
        { for: 'C', amphipods: ['C', 'C'], done: true, filling: false },
        { for: 'D', amphipods: ['.', 'D'], done: false, filling: 0 },
      ],
    ))).toEqual([
      ['......A.ABBCCDD', 9000],
      ['D......AABBCC.D', 9],
    ]);
    // #endregion

    // #region Emptying only
    expect(flattenWithCost(new GameState(
      '.......'.split('') as Hallway,
      [
        { for: 'A', amphipods: ['D', 'D'], done: false, filling: 0 },
        { for: 'B', amphipods: ['B', 'B'], done: true, filling: false },
        { for: 'C', amphipods: ['C', 'C'], done: true, filling: false },
        { for: 'D', amphipods: ['A', 'A'], done: false, filling: 0 },
      ],
    ))).toEqual([
      ['.D......DBBCCAA', 2000],
      ['D.......DBBCCAA', 3000],
      ['..D.....DBBCCAA', 2000],
      ['...D....DBBCCAA', 4000],
      ['....D...DBBCCAA', 6000],
      ['.....D..DBBCCAA', 8000],
      ['......D.DBBCCAA', 9000],
      ['....A..DDBBCC.A', 2],
      ['...A...DDBBCC.A', 4],
      ['..A....DDBBCC.A', 6],
      ['.A.....DDBBCC.A', 8],
      ['A......DDBBCC.A', 9],
      ['.....A.DDBBCC.A', 2],
      ['......ADDBBCC.A', 3],
    ]);
    // #endregion
  });

  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(12521);
  });

  test('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(44169);
  });
});
