export interface Coordinate {
  x: number;
  y: number;
}

export default abstract class PseudoGrid<T> {
  public readonly rawCells: T[];

  public readonly emptyCell: T;

  public readonly width: number;

  public readonly height: number;

  public timesRotatedClockwise = 0;

  constructor(input: string, emptyCell: T);
  constructor(input: T[], emptyCell: T, width: number, height: number);
  constructor(input: string | T[], emptyCell: T, width?: number, height?: number) {
    this.emptyCell = emptyCell;
    if (typeof input === 'string') {
      this.rawCells = input.replaceAll('\n', '').split('').map(this.transformCell);
      this.width = input.indexOf('\n');
      this.height = Math.ceil(input.length / (this.width + 1));
    } else {
      this.rawCells = input;
      this.width = width;
      this.height = height;
    }
  }

  abstract transformCell?(v: string, i: number): T;

  rotate(right = true) {
    this.timesRotatedClockwise += (right ? 1 : -1);
    if (this.timesRotatedClockwise > 3) { this.timesRotatedClockwise -= 4; }
    else if (this.timesRotatedClockwise < 0) { this.timesRotatedClockwise += 4; }
  }

  /*
  // Takes a source (untransposed) coordinate and returns the transposed coordinate
  transposeSource(x: number, y: number): [number, number] {
    // Comments reference a grid of 5x5
    if (this.timesRotatedClockwise === 0) { return [x, y]; }
    // [0, 0] -> [4, 0]
    if (this.timesRotatedClockwise === 1) { return [this.width - y - 1, this.height - x - 1]; }
    return [x, y];
  }

  // Takes a destination (transposed) coordinate and returns the source coordinate
  transposeDestination(x: number, y: number): [number, number] {
    if (this.timesRotatedClockwise === 0) { return [x, y]; }
    if (this.timesRotatedClockwise === 1) { return [this.height - y - 1, x]; }
    return [x, y];
  }
  */

  at(x: number, y: number): T {
    if (x < 0 || y < 0 || x > this.width || y > this.height) {
      throw new Error(`Invalid coordinate: (${x}, ${y})`);
    }
    return this.rawCells[(y * this.width) + x] as unknown as T;
  }

  set(x: number, y: number, value: T) {
    this.rawCells[(y * this.width) + x] = value;
  }

  getCoordinate(i: number): Coordinate;
  getCoordinate(x: number, y: number): Coordinate;
  getCoordinate(xOrI: number, y?: number): Coordinate {
    // if (typeof y === 'number') { return getCoordinate(xOrI, y); }
    // return getCoordinate(xOrI % this.width, Math.floor(xOrI / this.width));
    if (typeof y === 'number') { return { x: xOrI, y }; }
    return { x: xOrI % this.width, y: Math.floor(xOrI / this.width) };
  }

  getCoordinateForCell(cell: T): Coordinate {
    return this.getCoordinate(this.rawCells.indexOf(cell));
  }

  rows(): Generator<T[]>;
  rows(withCoordinate: true): Generator<[T, Coordinate][]>;
  * rows(withCoordinate = false) {
    for (let y = 0; y < this.height; y += 1) {
      const row: Array<T | [T, Coordinate]> = new Array(this.width);
      for (let x = 0; x < this.width; x += 1) {
        row[x] = !withCoordinate ? this.at(x, y) : [this.at(x, y), this.getCoordinate(x, y)];
      }
      yield row;
    }
  }

  reverseRows(): Generator<T[]>;
  reverseRows(withCoordinate: true): Generator<[T, Coordinate][]>;
  * reverseRows(withCoordinate = false) {
    for (let y = this.height - 1; y >= 0; y -= 1) {
      const row: Array<T | [T, Coordinate]> = new Array(this.width);
      for (let x = 0; x < this.width; x += 1) {
        row[x] = !withCoordinate ? this.at(x, y) : [this.at(x, y), this.getCoordinate(x, y)];
      }
      yield row;
    }
  }

  cols(): Generator<T[]>;
  cols(withCoordinate: true): Generator<[T, Coordinate][]>;
  * cols(withCoordinate = false) {
    for (let x = 0; x < this.width; x += 1) {
      const col: Array<T | [T, Coordinate]> = new Array(this.height);
      for (let y = 0; y < this.height; y += 1) {
        col[y] = !withCoordinate ? this.at(x, y) : [this.at(x, y), this.getCoordinate(x, y)];
      }
      yield col;
    }
  }

  reverseCols(): Generator<T[]>;
  reverseCols(withCoordinate: true): Generator<[T, Coordinate][]>;
  * reverseCols(withCoordinate = false) {
    for (let x = this.width - 1; x >= 0; x -= 1) {
      const col: Array<T | [T, Coordinate]> = new Array(this.height);
      for (let y = 0; y < this.height; y += 1) {
        col[y] = !withCoordinate ? this.at(x, y) : [this.at(x, y), this.getCoordinate(x, y)];
      }
      yield col;
    }
  }

  move(x: number, y: number, dx: number, dy: number) {
    const i = y * this.width + x;
    const d = dy * this.width + dx;
    this.rawCells[d] = this.rawCells[i];
    this.rawCells[i] = this.emptyCell;
  }

  inspect() {
    return { ...this };
  }

  cellToString(cell: T) {
    return cell.toString();
  }

  toString() {
    return this.rawCells.map(this.cellToString).join('');
  }

  toGrid() {
    const lines = new Array(this.height);
    for (let y = 0; y < this.height; y += 1) {
      lines[y] = this.rawCells
        .slice(y * this.width, y * this.width + this.width)
        .map(this.cellToString)
        .join('');
    }
    return lines.join('\n');
  }
}

export class PseudoStringGrid extends PseudoGrid<string> {
  transformCell(v: string) { return v; }
}
