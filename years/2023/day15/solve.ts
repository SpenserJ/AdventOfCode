import BaseDay from '@spenserj-aoc/utilities/BaseDay';

interface Lens {
  label: string;
  focalLength: number;
}

export default class Day15 extends BaseDay<string[], null> {
  parseInput(rawInput: string) {
    return rawInput.split(',');
  }

  step() {}

  getHash(input: string) {
    let value = 0;
    for (let i = 0; i < input.length; i += 1) {
      value = ((value + input.charCodeAt(i)) * 17) & 255;
    }
    return value;
  }

  part1() {
    let total = 0;
    for (const step of this.state) { total += this.getHash(step); }
    return total;
  }

  part2() {
    const boxes: Lens[][] = new Array(256);
    for (const step of this.state) {
      let label: string;
      let operation: string;
      let focalLength = 0;
      if (step[step.length - 1] === '-') {
        label = step.slice(0, -1);
        operation = '-';
      } else {
        const i = step.indexOf('=');
        label = step.slice(0, i);
        operation = '=';
        focalLength = Number(step.slice(i + 1));
      }

      const boxIndex = this.getHash(label);
      boxes[boxIndex] ||= [];
      const box = boxes[boxIndex];
      const index = box.findIndex((lens) => lens.label === label);
      if (index !== -1) {
        if (operation === '-') {
          box.splice(index, 1);
        } else {
          box.splice(index, 1, { label, focalLength });
        }
      } else if (operation === '=') {
        box.push({ label, focalLength });
      }
    }

    let total = 0;
    for (let iBox = 0; iBox < boxes.length; iBox += 1) {
      const box = boxes[iBox];
      if (!box) { continue; }
      for (let iLens = 0; iLens < box.length; iLens += 1) {
        const lens = box[iLens];
        total += lens.focalLength * (iBox + 1) * (iLens + 1);
      }
    }
    return total;
  }
}
