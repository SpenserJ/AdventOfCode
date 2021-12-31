type Spot = '>' | 'v' | '.';

type Vector2D = [number, number];

interface State {
  floor: Spot[][];
  open: Vector2D[];
}

const wrap = (state: State, pos: Vector2D): Vector2D => {
  const [x, y] = pos;
  if (y < 0) {
    return [x, y + state.floor.length];
  }
  if (x < 0) {
    return [x + state.floor[y].length, y];
  }
  return pos;
};

export const parseInput = (rawInput: string): State => {
  const floor = rawInput.split('\n').map((line) => line.split('') as Spot[]);
  const open: Vector2D[] = [];
  for (let y = 0; y < floor.length; y += 1) {
    for (let x = 0; x < floor[y].length; x += 1) {
      if (floor[y][x] === '.') { open.push([x, y]); }
    }
  }
  return { floor, open };
};

const stepOrder: [number, number, Spot][] = [
  [-1, 0, '>'],
  [0, -1, 'v'],
];

/* eslint-disable no-param-reassign */
export const step = (state: State): boolean => {
  let moves: [Vector2D, Vector2D][];
  let hasMoved = false;
  for (const [offsetX, offsetY, targetCucumber] of stepOrder) {
    moves = [];
    for (let i = 0; i < state.open.length; i += 1) {
      const next = state.open[i];
      const check = wrap(state, [next[0] + offsetX, next[1] + offsetY]);
      if (state.floor[check[1]][check[0]] === targetCucumber) {
        moves.push([check, next]);
        state.open[i] = check;
      }
    }
    for (const [from, to] of moves) {
      const tmp = state.floor[from[1]][from[0]];
      state.floor[from[1]][from[0]] = state.floor[to[1]][to[0]];
      state.floor[to[1]][to[0]] = tmp;
    }
    hasMoved = hasMoved || moves.length !== 0;
  }
  return hasMoved;
};
/* eslint-enable no-param-reassign */

export const renderSeaFloor = (state: State): string => state.floor.map((line) => line.join('')).join('\n');

export const part1 = (rawInput: string) => {
  const state = parseInput(rawInput);
  let i = 1;
  while (step(state)) { i += 1; }
  return i;
};
