import DijkstraPathFinder from '@spenserj-aoc/utilities/DijkstraPathFinder';
import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export const validAmphipods = ['A', 'B', 'C', 'D'] as const;
export type Amphipod = typeof validAmphipods[number];
export type PossibleAmphipod = Amphipod | '.';
export type Hallway = [
  PossibleAmphipod,
  PossibleAmphipod,
  PossibleAmphipod,
  PossibleAmphipod,
  PossibleAmphipod,
  PossibleAmphipod,
  PossibleAmphipod,
];
// TODO: Is there a good way to make a generic that limits this to 2 or 4 length?
export interface RoomGeneration {
  for: Amphipod;
  amphipods: PossibleAmphipod[];
}
export type Room = RoomGeneration & {
  done: boolean;
  filling: number | false;
};

// Hall: 01x2x3x4x56
// Room: xx0x1x2x3xx
const adjustedRoomIndex = [2, 4, 6, 8];
export const adjustedHallIndex = [0, 1, 3, 5, 7, 9, 10];

const seenStates = new Map<string, GameState>();

export const getPossibleRoomExits = (fromRoom: number, hallway: Hallway): number[] => {
  const possible: number[] = [];
  // Check spaces to the left of the room
  for (let i = fromRoom + 1; i >= 0; i -= 1) {
    if (hallway[i] !== '.') { break; }
    possible.push(i);
  }
  // Check spaces to the right of the room
  for (let i = fromRoom + 2; i < 7; i += 1) {
    if (hallway[i] !== '.') { break; }
    possible.push(i);
  }
  return possible;
};

export const injectPart2 = (rawInput: string) => `${rawInput.slice(0, 42)}
#D#C#B#A#
#D#B#A#C#${rawInput.slice(42)}`;

export class GameState {
  public hallway: Hallway;

  public rooms: Room[];

  public key: Readonly<string>;

  private _edges: GameState[] | null = null;

  constructor(hallway: Hallway, rooms: Array<RoomGeneration | Room>) {
    this.hallway = hallway;
    this.rooms = rooms.map((room) => this.processRoomState(room));

    this.key = this.flatten();
    // eslint-disable-next-line no-constructor-return
    if (seenStates.has(this.key)) { return seenStates.get(this.key)!; }
    seenStates.set(this.key, this);
  }

  private processRoomState(room: RoomGeneration | Room): Room {
    if ('done' in room && room.done) { return room; }
    let done = true;
    let filling: number | false = 0;
    for (let i = 0; i < room.amphipods.length; i += 1) {
      const check = room.amphipods[i];
      if (check !== room.for && check !== '.') {
        filling = false;
        done = false;
        break;
      }

      if (check === '.') { filling = i; }

      // Room may be filling but not done yet
      if (done && check !== room.for) { done = false; }
    }
    if ('done' in room && room.done === done && room.filling === filling) { return room; }
    return { ...room, done, filling };
  }

  public get edges() {
    if (this._edges) { return this._edges; }

    const possibleStates: GameState[] = [];

    // For everyone in a room, determine which hallway positions they can move to
    for (let i = 0; i < this.rooms.length; i += 1) {
      const room = this.rooms[i];
      if (room.done) { continue; }

      // If there are no wrong amphipods in this room, we can skip it
      const hasWrongAmphipod = !!room.amphipods.find((v) => v !== '.' && v !== room.for);
      if (!hasWrongAmphipod) { continue; }

      // If there are no amphipods in the room, skip the room
      const firstAmphipodIndex = room.amphipods.findIndex((v) => v !== '.');
      if (firstAmphipodIndex === -1) { continue; }

      const possiblePositions = getPossibleRoomExits(i, this.hallway);
      for (let j = 0; j < possiblePositions.length; j += 1) {
        possibleStates.push(this.derive(
          possiblePositions[j],
          i,
          firstAmphipodIndex,
          true,
          room.amphipods[firstAmphipodIndex] as Amphipod,
        ));
      }
    }

    // For everyone in the hallway, determine which rooms they can move to
    for (let i = 0; i < this.hallway.length; i += 1) {
      const amphipod = this.hallway[i];
      if (amphipod === '.') { continue; }

      // Amphipods can only move back into their own rooms, and only if no other types are in it
      const targetRoomIndex = validAmphipods.indexOf(amphipod);
      const targetRoom = this.rooms[targetRoomIndex];
      if (targetRoom.filling === false) { continue; }

      // If there is another amphipod in the hallway between them and their room, they cannot move
      let collision = false;
      // Since the hallway has two spaces before the first room, we need to offset
      // Hall: 01x2x3x4x56
      // Room: xx0x1x2x3xx
      // If the room is more than 1 step left or right of the amphipod, check if anyone is between,
      // otherwise we can step right into it
      if (i - 1 !== targetRoomIndex && i - 2 !== targetRoomIndex) {
        if (i <= targetRoomIndex) {
          // Moving right
          for (let j = i; j <= targetRoomIndex; j += 1) {
            if (this.hallway[j + 1] !== '.') { collision = true; break; }
          }
        } else {
          // Moving left
          for (let j = i; j > targetRoomIndex + 2; j -= 1) {
            if (this.hallway[j - 1] !== '.') { collision = true; break; }
          }
        }
      }
      if (collision) { continue; }

      possibleStates.push(
        this.derive(i, targetRoomIndex, targetRoom.filling, false, amphipod),
      );
    }

    this._edges = possibleStates;
    return possibleStates;
  }

  /**
   * The cost for this step over the previous step
   */
  public cost(from: GameState | null): number {
    if (from === null) { return 0; }

    const hallIndex = from.hallway.findIndex((v, i) => this.hallway[i] !== v);
    for (let roomIndex = 0; roomIndex < 4; roomIndex += 1) {
      const roomAmphipods = from.rooms[roomIndex].amphipods;
      for (let posIndex = 0; posIndex < roomAmphipods.length; posIndex += 1) {
        if (this.rooms[roomIndex].amphipods[posIndex] !== roomAmphipods[posIndex]) {
          // We found the room, position, and hall indexes that have changed
          const amphipod = roomAmphipods[posIndex] !== '.'
            ? roomAmphipods[posIndex]
            : this.rooms[roomIndex].amphipods[posIndex];
          let stepCost = Math.abs(adjustedRoomIndex[roomIndex] - adjustedHallIndex[hallIndex]);
          stepCost += posIndex + 1;
          // Adjust for the Amphipod's energy consumption
          stepCost *= 10 ** validAmphipods.indexOf(amphipod as Amphipod);
          return stepCost;
        }
      }
    }
    throw new Error('Could not calculate change in game state');
  }

  public flatten() {
    return `${this.hallway.join('')}${this.rooms.map((v) => v.amphipods.join('')).join('')}`;
  }

  public pretty() {
    const { hallway: hall, rooms } = this;
    let str = `
#############
#${hall[0]}${hall[1]}.${hall[2]}.${hall[3]}.${hall[4]}.${hall[5]}${hall[6]}#
##`;
    for (let y = 0; y < rooms[0].amphipods.length; y += 1) {
      for (let x = 0; x < 4; x += 1) {
        str = `${str}#${rooms[x].amphipods[y]}`;
      }
      str = `${str}${y === 0 ? '##' : ''}#\n  `;
    }
    return `${str}#########`;
  }

  public derive(
    hallIndex: number,
    roomIndex: number,
    roomPositionIndex: number,
    moveToHallway: boolean,
    amphipod: Amphipod,
  ): GameState {
    const newHallway = [...this.hallway] as Hallway;
    const newRooms = [...this.rooms];
    // Update the hallway
    newHallway[hallIndex] = (moveToHallway ? amphipod : '.');
    const newRoom = {
      ...newRooms[roomIndex],
      amphipods: [...newRooms[roomIndex].amphipods],
      done: false, // Trigger the GameState to update the room's status
    };
    newRoom.amphipods[roomPositionIndex] = (moveToHallway ? '.' : amphipod);
    newRooms[roomIndex] = newRoom;
    return new GameState(newHallway, newRooms);
  }

  public clone() { return this; }
}

export interface ReplayState {
  state: GameState;
  bestPath?: GameState[];
  currentNode?: GameState;
}

export default class Day23 extends BaseDay<GameState, ReplayState> {
  private rawInput: string;

  constructor(rawInput: string) {
    super(rawInput);
    this.rawInput = rawInput;
  }

  parseInput(rawInput: string) {
    seenStates.clear();
    const hallway = Array(7).fill('.') as Hallway;
    const allAmphipods = rawInput.trim()
      .substring(31) // There are 31 characters that come before the first room
      .split('')
      .filter((v) => validAmphipods.includes(v as Amphipod)) as Amphipod[];

    const rooms: RoomGeneration[] = [];
    const countPerRoom = allAmphipods.length / 4;
    for (let i = 0; i < 4; i += 1) {
      const room: RoomGeneration = { for: validAmphipods[i], amphipods: [] };
      for (let j = 0; j < countPerRoom; j += 1) {
        room.amphipods.push(allAmphipods[i + (j * 4)]);
      }
      rooms.push(room);
    }
    return new GameState(hallway, rooms);
  }

  step() {}

  runPathFinder(solved: GameState) {
    const pathWalker = new DijkstraPathFinder([this.state, solved]);
    pathWalker.circuitBreaker = 500000;
    return pathWalker.run(this.state, solved);
  }

  part1() {
    seenStates.clear();
    const { path, cost } = this.runPathFinder(new GameState(
      '.......'.split('') as Hallway,
      [
        { for: 'A', amphipods: ['A', 'A'] },
        { for: 'B', amphipods: ['B', 'B'] },
        { for: 'C', amphipods: ['C', 'C'] },
        { for: 'D', amphipods: ['D', 'D'] },
      ],
    ));
    this.render.update('bestPath', path);
    for (let i = 0; i < path.length; i += 1) {
      this.render.update('currentNode', path[i]);
    }
    return cost;
  }

  part2() {
    seenStates.clear();
    this.state = this.parseInput(injectPart2(this.rawInput));
    const { path, cost } = this.runPathFinder(new GameState(
      '.......'.split('') as Hallway,
      [
        { for: 'A', amphipods: ['A', 'A', 'A', 'A'] },
        { for: 'B', amphipods: ['B', 'B', 'B', 'B'] },
        { for: 'C', amphipods: ['C', 'C', 'C', 'C'] },
        { for: 'D', amphipods: ['D', 'D', 'D', 'D'] },
      ],
    ));
    this.render.update('bestPath', path);
    for (let i = 0; i < path.length; i += 1) {
      this.render.update('currentNode', path[i]);
    }
    return cost;
  }
}
