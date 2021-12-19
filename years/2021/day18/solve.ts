type SnailfishPrimitive = number | [SnailfishPrimitive, SnailfishPrimitive];

type Side = 'left' | 'right';

const flipSide = (side: Side): Side => (side === 'left' ? 'right' : 'left');

export class SnailfishNumber {
  private left: number | SnailfishNumber;

  private right: number | SnailfishNumber;

  private explodableSide: Side | false;

  private splitableSide: Side | false;

  private parent: SnailfishNumber | null;

  private depth: number;

  constructor(node: Exclude<SnailfishPrimitive, number>, parent: SnailfishNumber = null) {
    this.parent = parent;
    this.depth = (parent?.depth || 0) + 1;
    this.left = typeof node[0] === 'number' ? node[0] : new SnailfishNumber(node[0], this);
    this.right = typeof node[1] === 'number' ? node[1] : new SnailfishNumber(node[1], this);

    this.updateExplodableSide(false);
    this.updateSplitableSide(false);
  }

  private updateExplodableSide(updateParent = true) {
    const original = this.explodableSide;
    this.explodableSide = false;
    if ((this.left as SnailfishNumber).canExplode) {
      this.explodableSide = 'left';
    } else if ((this.right as SnailfishNumber).canExplode) {
      this.explodableSide = 'right';
    }
    if (updateParent && this.explodableSide !== original) {
      this.parent?.updateExplodableSide(true);
    }
  }

  private updateSplitableSide(updateParent = true) {
    const original = this.splitableSide;
    this.splitableSide = false;
    if (this.left >= 10 || (this.left as SnailfishNumber).canSplit) {
      this.splitableSide = 'left';
    } else if (this.right >= 10 || (this.right as SnailfishNumber).canSplit) {
      this.splitableSide = 'right';
    }
    if (updateParent && this.splitableSide !== original) {
      this.parent?.updateSplitableSide(true);
    }
  }

  public get canExplode() {
    return this.depth > 4 || this.explodableSide !== false;
  }

  public get canSplit() {
    return this.splitableSide !== false;
  }

  public explode(): void {
    // If we can't explode, why are we calling this?
    if (!this.canExplode) { throw new Error('Cannot explode!'); }

    // If this is the SnailfishNumber that needs to explode, return the values since
    // they should always be numbers
    if (this.explodableSide === false) {
      this.parent?.explode();
      return;
    }

    // If this is the parent of the explodable side, trigger the explosion
    const exploding = (this[this.explodableSide] as SnailfishNumber);
    if ((this[this.explodableSide] as SnailfishNumber).explodableSide === false) {
      this[this.explodableSide] = 0;
      // The side being exploded steps up one level before adding
      this.parent?.add(this.explodableSide, this, exploding[this.explodableSide] as number);
      // The side not exploded gets added from here
      const otherSide = flipSide(this.explodableSide);
      this.add(otherSide, this, exploding[otherSide] as number);
      this.updateExplodableSide();
    } else {
      exploding.explode();
    }
  }

  public add(branchSide: Side, lastChild: SnailfishNumber, value: number): void {
    // If we've found a number that we can add to, do so
    if (typeof this[branchSide] === 'number') {
      (this[branchSide] as number) += value;
      this.updateSplitableSide(true);
      return;
    }

    // If we're walking up from this element, keep walking up the tree on the same side
    if (this[branchSide] === lastChild) {
      // Keep walking up the tree on the same side
      this.parent?.add(branchSide, this, value);
      return;
    }

    // If we were walking up the tree, and can now cross over, start moving down on the
    // opposite side (up on the left becomes down on the right of the new branch)
    if (lastChild) {
      (this[branchSide] as SnailfishNumber).add(flipSide(branchSide), null, value);
      return;
    }

    // Otherwise keep walking down the same side
    (this[branchSide] as SnailfishNumber).add(branchSide, null, value);
  }

  public split(): void {
    // If we can't split, why are we calling this?
    if (!this.canSplit || this.splitableSide === false) { throw new Error('Cannot splut!'); }

    // If the side that is splitting is directly below, do the split here
    const value = this[this.splitableSide];
    if (typeof value === 'number') {
      this[this.splitableSide] = new SnailfishNumber([
        Math.floor(value / 2),
        Math.ceil(value / 2),
      ], this);
    } else {
      value.split();
    }
    this.updateExplodableSide();
    this.updateSplitableSide();
  }

  public flatten(): SnailfishPrimitive {
    return [
      typeof this.left === 'number' ? this.left : this.left.flatten(),
      typeof this.right === 'number' ? this.right : this.right.flatten(),
    ];
  }

  public toJSON(): any {
    return { ...this, parent: undefined };
  }

  public get canRun(): Boolean {
    return this.canExplode || this.canSplit;
  }

  public step(): SnailfishNumber {
    if (this.canExplode) {
      this.explode();
    } else if (this.canSplit) {
      this.split();
    }
    return this;
  }

  public run(): SnailfishPrimitive {
    while (this.canRun) { this.step(); }
    return this.flatten();
  }
}

export const parseInput = (rawInput: string) => {
  const lines = rawInput.trim().split('\n')
    .map((line) => JSON.parse(line) as SnailfishPrimitive);
  const value = lines.reduce((acc, next) => {
    if (!acc) { return next; }
    return new SnailfishNumber([acc, next]).run();
  });
  return value;
};

export const calculateMagnitude = (input: SnailfishPrimitive): number => {
  if (typeof input === 'number') { return input; }
  const a = calculateMagnitude(input[0]) * 3;
  const b = calculateMagnitude(input[1]) * 2;
  return a + b;
};

export const part1 = (rawInput: string) => {
  const value = parseInput(rawInput);
  return calculateMagnitude(value);
};

export const part2 = (rawInput: string) => {
  const input = rawInput.trim().split('\n');
  let largest = 0;
  for (let i = 0; i < input.length; i += 1) {
    for (let i2 = 0; i2 < input.length; i2 += 1) {
      // Don't check the line against itself
      if (i === i2) { continue; }
      largest = Math.max(largest, part1([input[i], input[i2]].join('\n')));
    }
  }
  return largest;
};
