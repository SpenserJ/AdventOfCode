export interface Position {
  x: number;
  y: number;
}

export type Cell<T> = Position & {
  value: T;
};

export const serializePosition = (pos: Position) => `${pos.x},${pos.y}`;

export const deserializePosition = (pos: string): Position => {
  const split = pos.split(',');
  if (split.length !== 2) { throw new Error(`Invalid serialized position: ${pos}`); }
  const [x, y] = split.map((v) => Number(v));
  if (Number.isNaN(x) || Number.isNaN(y)) { throw new Error(`Invalid serialized position: ${pos}`); }
  return { x, y };
};

export default class Grid<T> {
  private _width: number;

  public get width() { return this._width; }

  private _height: number;

  public get height() { return this._height; }

  private cells: T[][];

  constructor(input: T[][]) {
    this._height = input.length;
    this._width = input[0].length;
    this.cells = input;
  }

  isValidPosition(x: number, y: number) {
    return (x < this.width && y < this.height && x >= 0 && y >= 0);
  }

  getCellValue(x: number, y: number): T {
    return this.cells[y][x];
  }

  getCell(x: number, y: number): Cell<T> {
    return { x, y, value: this.getCellValue(x, y) };
  }

  setCell(x: number, y: number, value: T) {
    if (!this.isValidPosition(x, y)) { throw new Error('Cannot set a cell outside of the grid'); }
    this.cells[y][x] = value;
  }

  getSurrounding(position: Position, diagonal: boolean): Cell<T>[];
  getSurrounding(x: number, y: number, diagonal: boolean): Cell<T>[];
  getSurrounding(...args: [number, number, boolean] | [Position, boolean]): Cell<T>[] {
    const [x, y] = ((typeof args[0] === 'object') ? [args[0].x, args[0].y] : [args[0], args[1]]) as [number, number];
    const diagonal = (typeof args[1] === 'boolean') ? args[1] : args[2];
    const result: Cell<T>[] = [];
    if (!this.isValidPosition(x, y)) { throw new Error('Cannot check outside of the grid'); }
    if (this.isValidPosition(x, y - 1)) { result.push(this.getCell(x, y - 1)); }
    if (this.isValidPosition(x, y + 1)) { result.push(this.getCell(x, y + 1)); }
    if (this.isValidPosition(x - 1, y)) { result.push(this.getCell(x - 1, y)); }
    if (this.isValidPosition(x + 1, y)) { result.push(this.getCell(x + 1, y)); }
    if (diagonal) {
      if (this.isValidPosition(x - 1, y - 1)) { result.push(this.getCell(x - 1, y - 1)); }
      if (this.isValidPosition(x + 1, y - 1)) { result.push(this.getCell(x + 1, y - 1)); }
      if (this.isValidPosition(x - 1, y + 1)) { result.push(this.getCell(x - 1, y + 1)); }
      if (this.isValidPosition(x + 1, y + 1)) { result.push(this.getCell(x + 1, y + 1)); }
    }
    return result;
  }

  filter(callbackFn: ((element: Cell<T>) => boolean)): Cell<T>[] {
    const result: Cell<T>[] = [];
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const cell = this.getCell(x, y);
        if (callbackFn(cell)) { result.push(cell); }
      }
    }
    return result;
  }

  flatten() {
    return this.cells.map((row) => row.join('')).join('\n');
  }

  print(): void {
    console.log(this.flatten());
  }
}
