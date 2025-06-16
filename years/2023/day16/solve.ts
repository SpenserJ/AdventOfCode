import BaseDay from '@spenserj-aoc/utilities/BaseDay';
import PseudoGrid, { Coordinate } from '@spenserj-aoc/utilities/PseudoGrid';

type Direction = 'up' | 'down' | 'left' | 'right';

interface Cell {
  type: '.' | '|' | '-' | '/' | '\\';
  beamsDead: Beam[];
  beamDirections: Record<Direction, boolean>;
}

interface Beam {
  path: Cell[];
  direction: Direction;
  done: boolean;
}

class PseudoBeamGrid extends PseudoGrid<Cell> {
  constructor(rawInput: string) {
    super(rawInput, { type: '.', beams: [], beamDirections: { up: false, down: false, left: false, right: false } });
  }

  transformCell(v: string): Cell {
    return { type: v as Cell['type'], beams: [], beamDirections: { up: false, down: false, left: false, right: false } };
  }

  cellToString(cell: Cell): string {
    if (cell.type !== '.') { return cell.type; }
    const beamDirections = Object.entries(cell.beamDirections).filter(([, v]) => v).map(([k]) => k);
    if (beamDirections.length === 0) { return '.'; }
    if (beamDirections.length === 1) {
      switch (beamDirections[0]) {
        case 'up': return '^';
        case 'down': return 'v';
        case 'left': return '<';
        case 'right': return '>';
        default: throw new Error(`Invalid direction: ${beamDirections[0]}`);
      }
    }
    return `${beamDirections.length}`;
  }
}

export default class Day16 extends BaseDay<PseudoBeamGrid, null> {
  parseInput(rawInput: string) {
    return new PseudoBeamGrid(rawInput);
  }

  step() {}

  splitBeam(beams: Beam[], beam: Beam, newDirection: Direction) {
    const newBeam = { ...beam, path: [...beam.path], direction: newDirection };
    // for (const cell of beam.path) {
    //   cell.beams.push(newBeam);
    // }
    beams.push(newBeam);
  }

  getEnergizedCellsForStartPosition(start: Coordinate, direction: Direction): number {
    // console.log(this.state.toGrid());
    const beams: Beam[] = [{ path: [], direction, done: false }];
    for (const beam of beams) {
      while (!beam.done) {
        const next: Coordinate = beam.path.length !== 0
          ? { ...this.state.getCoordinateForCell(beam.path[beam.path.length - 1]) }
          : start;
        switch (beam.direction) {
          case 'up':
            next.y -= 1;
            break;
          case 'down':
            next.y += 1;
            break;
          case 'left':
            next.x -= 1;
            break;
          case 'right':
            next.x += 1;
            break;
          default:
            throw new Error(`Invalid direction: ${beam.direction}`);
        }

        if (next.x < 0 || next.x >= this.state.width || next.y < 0 || next.y >= this.state.height) {
          beam.done = true;
          break;
        }

        const cell = this.state.at(next.x, next.y);
        if (cell.beamDirections[beam.direction]) {
          // throw new Error(`Beam already visited cell ${next.x}, ${next.y}`);
          beam.done = true;
          break;
        }

        cell.beamDirections[beam.direction] = true;
        beam.path.push(cell);

        switch (cell.type) {
          case '.': break;
          case '|': {
            if (beam.direction === 'left' || beam.direction === 'right') {
              beam.direction = 'up';
              this.splitBeam(beams, beam, 'down');
            }
            break;
          }
          case '-': {
            if (beam.direction === 'up' || beam.direction === 'down') {
              beam.direction = 'left';
              this.splitBeam(beams, beam, 'right');
            }
            break;
          }
          case '/': {
            switch (beam.direction) {
              case 'up':
                beam.direction = 'right';
                break;
              case 'down':
                beam.direction = 'left';
                break;
              case 'left':
                beam.direction = 'down';
                break;
              case 'right':
                beam.direction = 'up';
                break;
              default:
                throw new Error(`Invalid direction: ${beam.direction}`);
            }
            break;
          }
          case '\\': {
            switch (beam.direction) {
              case 'up':
                beam.direction = 'left';
                break;
              case 'down':
                beam.direction = 'right';
                break;
              case 'left':
                beam.direction = 'up';
                break;
              case 'right':
                beam.direction = 'down';
                break;
              default:
                throw new Error(`Invalid direction: ${beam.direction}`);
            }
            break;
          }
          default:
            throw new Error(`Invalid cell type: ${cell.type}`);
        }
      }
    }
    // console.log('');
    // console.log(this.state.toGrid());
    return this.state.rawCells
      .filter((cell) => Object.values(cell.beamDirections).filter(Boolean).length !== 0)
      .length;
  }

  part1() {
    return this.getEnergizedCellsForStartPosition({ x: -1, y: 0 }, 'right');
  }

  part2() {
    let best = 0;
    // Top and bottom rows
    for (let x = 0; x < this.state.width; x += 1) {
      this.reset();
      best = Math.max(best, this.getEnergizedCellsForStartPosition({ x, y: -1 }, 'down'));
      this.reset();
      best = Math.max(best, this.getEnergizedCellsForStartPosition({ x, y: this.state.height }, 'up'));
    }
    // Left and right columns
    for (let y = 0; y < this.state.height; y += 1) {
      this.reset();
      best = Math.max(best, this.getEnergizedCellsForStartPosition({ x: -1, y }, 'right'));
      this.reset();
      best = Math.max(best, this.getEnergizedCellsForStartPosition({ x: this.state.width, y }, 'left'));
    }
    return best;
  }
}
