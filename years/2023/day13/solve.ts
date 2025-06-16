import BaseDay from '@spenserj-aoc/utilities/BaseDay';

type Orientation = 'none' | 'horizontal' | 'vertical';

type Tiles = Array<'#' | '.'>[];

interface Pattern {
  tiles: Tiles;
  orientation: Orientation;
  mirrorIndex: number;
}

export default class Day13 extends BaseDay<Tiles[], null> {
  testPattern(
    tiles: Tiles,
    index: number,
    orientation: Orientation,
    requiredSmudges: number,
  ): boolean {
    let smudges = 0;
    if (orientation === 'vertical') {
      for (let y = 0; y < tiles.length; y += 1) {
        for (let s = 0; s < tiles[0].length; s += 1) {
          // If we're out of bounds, this could still be the match
          if (index - s < 0 || index + s >= tiles[0].length - 1) { break; }
          // If the characters don't match, this can't be the match
          if (tiles[y][index - s] !== tiles[y][index + s + 1]) { smudges += 1; }
          if (smudges > requiredSmudges) { return false; }
        }
      }
      return smudges === requiredSmudges;
    }
    if (orientation === 'horizontal') {
      for (let x = 0; x < tiles[0].length; x += 1) {
        for (let s = 0; s < tiles.length; s += 1) {
          // If we're out of bounds, this could still be the match
          if (index - s < 0 || index + s >= tiles.length - 1) { break; }
          // If the characters don't match, this can't be the match
          if (tiles[index - s][x] !== tiles[index + s + 1][x]) { smudges += 1; }
          if (smudges > requiredSmudges) { return false; }
        }
      }
      return smudges === requiredSmudges;
    }
    return false;
  }

  findMirror(tiles: Tiles, requiredSmudges: number): Pattern | null {
    let bestMatch: { orientation: Orientation, index: number, score: number } | null = null;
    for (let x = 0; x < tiles[0].length - 1; x += 1) {
      if (this.testPattern(tiles, x, 'vertical', requiredSmudges)) {
        const score = Math.min(x, tiles[0].length - x - 1);
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { orientation: 'vertical', index: x, score };
        }
      }
    }
    for (let y = 0; y < tiles.length - 1; y += 1) {
      if (this.testPattern(tiles, y, 'horizontal', requiredSmudges)) {
        const score = Math.min(y, tiles.length - y - 1);
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { orientation: 'horizontal', index: y, score };
        }
      }
    }
    if (!bestMatch) {
      throw new Error(`Could not find match:\n${tiles.map((v) => v.join('')).join('\n')}`);
    }
    return {
      tiles,
      orientation: bestMatch.orientation,
      mirrorIndex: bestMatch.index,
    };
  }

  printPattern(pattern: Pattern) {
    if (pattern.orientation === 'vertical') {
      const indicator = `${new Array(pattern.mirrorIndex + 1).fill('').join(' ')}><`;
      console.log(`\n${indicator}\n${pattern.tiles.map((v) => v.join('')).join('\n')}\n${indicator}\n`);
    } else if (pattern.orientation === 'horizontal') {
      const dumped = pattern.tiles
        .map((v, i) => {
          if (i === pattern.mirrorIndex) { return `v${v.join('')}v`; }
          if (i === pattern.mirrorIndex + 1) { return `^${v.join('')}^`; }
          return ` ${v.join('')} `;
        })
        .join('\n');
      console.log(`\n${dumped}\n`);
    } else {
      console.log('Unknown!');
    }
  }

  parseInput(rawInput: string) {
    return rawInput.split('\n\n')
      .map((rawTiles) => rawTiles.split('\n').map((v) => v.split('')) as Tiles);
  }

  step() {}

  part1() {
    return this.state.reduce((acc, next) => {
      const pattern = this.findMirror(next, 0);
      if (pattern.orientation === 'vertical') { return acc + (pattern.mirrorIndex + 1); }
      if (pattern.orientation === 'horizontal') { return acc + ((pattern.mirrorIndex + 1) * 100); }
      return acc;
    }, 0);
  }

  part2() {
    return this.state.reduce((acc, next) => {
      const pattern = this.findMirror(next, 1);
      if (pattern.orientation === 'vertical') { return acc + (pattern.mirrorIndex + 1); }
      if (pattern.orientation === 'horizontal') { return acc + ((pattern.mirrorIndex + 1) * 100); }
      return acc;
    }, 0);
  }
}
