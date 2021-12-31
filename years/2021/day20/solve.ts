type Image = Map<number, boolean>;

export interface State {
  step: number;
  algorithm: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  data: Image;
}

const getKey = (x: number, y: number) => (y << 8) + x;

export const getCurrentPixelState = (
  state: State,
  x: number,
  y: number,
  defaultValue = false,
): number => (
  (Number(state.data.get(getKey(x - 1, y - 1)) ?? defaultValue) << 8) // UL
  + (Number(state.data.get(getKey(x, y - 1)) ?? defaultValue) << 7) // U
  + (Number(state.data.get(getKey(x + 1, y - 1)) ?? defaultValue) << 6) // UR
  + (Number(state.data.get(getKey(x - 1, y)) ?? defaultValue) << 5) // L
  + (Number(state.data.get(getKey(x, y)) ?? defaultValue) << 4) // The pixel
  + (Number(state.data.get(getKey(x + 1, y)) ?? defaultValue) << 3) // R
  + (Number(state.data.get(getKey(x - 1, y + 1)) ?? defaultValue) << 2) // DL
  + (Number(state.data.get(getKey(x, y + 1)) ?? defaultValue) << 1) // D
  + (Number(state.data.get(getKey(x + 1, y + 1)) ?? defaultValue)) // DR
);

export const getNewPixelValue = (
  state: State,
  x: number,
  y: number,
  defaultValue = false,
): boolean => state.algorithm[getCurrentPixelState(state, x, y, defaultValue)] === '#';

export const parseInput = (rawInput: string): State => {
  const [algorithm, rawData] = rawInput.trim().split('\n\n');
  let width = 0;
  let height = 0;
  const splitData = rawData.split('\n').reduce((acc, rawRow, y) => {
    height = y;
    const row = rawRow.split('');
    for (let x = 0; x < row.length; x += 1) {
      acc.set(getKey(x, y), row[x] === '#');
    }
    width = row.length - 1;
    return acc;
  }, new Map() as Image);
  return {
    step: 0,
    algorithm,
    minX: 0,
    maxX: width,
    minY: 0,
    maxY: height,
    data: splitData,
  };
};

export const step = (state: State): State => {
  const newState = {
    ...state,
    step: state.step + 1,
    data: new Map(),
    minX: state.minX - 1,
    maxX: state.maxX + 1,
    minY: state.minY - 1,
    maxY: state.maxY + 1,
  };
  const infiniteMode = state.algorithm[0] === '#' && state.algorithm[511] === '.';
  const defaultVal = (infiniteMode && newState.step % 2 === 0);

  for (let y = state.minY - 1; y <= state.maxY + 1; y += 1) {
    for (let x = state.minX - 1; x <= state.maxX + 1; x += 1) {
      newState.data.set(getKey(x, y), getNewPixelValue(state, x, y, defaultVal));
    }
  }
  return newState;
};

const countPixels = (state: State): number => [...state.data.values()]
  .reduce((acc, next) => (next ? acc + 1 : acc), 0);

export const renderState = (state: State): string => {
  const lines: string[] = [];
  for (let y = state.minY; y <= state.maxY; y += 1) {
    const newLine: string[] = [];
    for (let x = state.minX; x <= state.maxX; x += 1) {
      newLine.push(state.data.get(getKey(x, y)) ? '#' : '.');
    }
    lines.push(newLine.join(''));
  }
  return lines.join('\n');
};

export const part1 = (rawInput: string) => {
  let state = parseInput(rawInput);
  state = step(state);
  state = step(state);
  return countPixels(state);
};

export const part2 = (rawInput: string) => {
  let state = parseInput(rawInput);
  for (let i = 0; i < 50; i += 1) {
    state = step(state);
  }
  return countPixels(state);
};
