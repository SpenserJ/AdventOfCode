type Position3D = [number, number, number];

interface Instruction {
  from: Position3D;
  to: Position3D;
  sign: 1 | -1;
}

export const parseInput = (rawInput: string) => {
  const result: Instruction[] = [];
  let match: RegExpExecArray;
  const regex = /^(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)$/gm;
  while (match = regex.exec(rawInput)) {
    const points = match.slice(2, 8).map((v) => Number(v));
    const pairs = [
      [points[0], points[1]], // X
      [points[2], points[3]], // Y
      [points[4], points[5]], // Z
    ];
    result.push({
      from: pairs.map((axis) => Math.min(...axis)) as Position3D,
      to: pairs.map((axis) => Math.max(...axis)) as Position3D,
      sign: match[1] === 'on' ? 1 : -1,
    });
  }
  return result;
};

const isPointWithinLine = (start: number, end: number, point: number) => (
  start <= point && point <= end
);

const getLineOverlap = (
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): false | [number, number] => {
  if (aStart > aEnd || bStart > bEnd) {
    throw new Error('getLineOverlap requires points to be ordered');
  }

  // aStart <= bStart <= aEnd
  if (isPointWithinLine(aStart, aEnd, bStart)) {
    // aStart <= bStart <= bEnd <= aEnd - A contains B
    if (isPointWithinLine(aStart, aEnd, bEnd)) { return [bStart, bEnd]; }
    // aStart <= bStart <= aEnd <= bEnd - A and B overlap
    return [bStart, aEnd];
  }

  // bStart <= aStart <= bEnd
  if (isPointWithinLine(bStart, bEnd, aStart)) {
    // bStart <= aStart <= aEnd <= bEnd - B contains A
    if (isPointWithinLine(bStart, bEnd, aEnd)) { return [aStart, aEnd]; }
    // bStart <= aStart <= bEnd <= aEnd - B and A overlap
    return [aStart, bEnd];
  }

  // If bStart doesn't fall within A, and aStart doesn't fall within B, there is no overlap
  return false;
};

export const getOverlap = (
  baseStart: Position3D,
  baseEnd: Position3D,
  compareStart: Position3D,
  compareEnd: Position3D,
): false | [Position3D, Position3D] => {
  const xOverlap = getLineOverlap(baseStart[0], baseEnd[0], compareStart[0], compareEnd[0]);
  if (!xOverlap) { return false; }
  const yOverlap = getLineOverlap(baseStart[1], baseEnd[1], compareStart[1], compareEnd[1]);
  if (!yOverlap) { return false; }
  const zOverlap = getLineOverlap(baseStart[2], baseEnd[2], compareStart[2], compareEnd[2]);
  if (!zOverlap) { return false; }

  return [
    [Math.min(...xOverlap), Math.min(...yOverlap), Math.min(...zOverlap)],
    [Math.max(...xOverlap), Math.max(...yOverlap), Math.max(...zOverlap)],
  ];
};

export const simplifyInstructions = (rawInstructions: Instruction[]) => {
  const ranges = new Map<string, Instruction>();

  for (let i = 0; i < rawInstructions.length; i += 1) {
    const test = rawInstructions[i];

    // We're going to compare each instruction to the ones that we've already processed.
    // If we see an `on` instruction, we'll add the ranges that aren't already covered.
    // If we see an `off` instruction, we'll split the ranges that were already added
    // to exclude the section that should be turned off.
    const toAdd = new Set<Instruction>();
    for (const against of ranges.values()) {
      const overlap = getOverlap(test.from, test.to, against.from, against.to);
      if (overlap) {
        // Add the overlap with the inverted sign so that it cancels out our add
        toAdd.add({ from: overlap[0], to: overlap[1], sign: -against.sign as 1 | -1 });
      }
    }
    // Only add 'on' ranges since everything starts as off by default
    if (test.sign === 1) { toAdd.add(test); }
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    toAdd.forEach((v) => {
      const key = `${v.from[0]},${v.from[1]},${v.from[2]} ${v.to[0]},${v.to[1]},${v.to[2]}`;
      const prev = ranges.get(key);
      if (prev) {
        prev.sign += v.sign;
        if (prev.sign === 0) { ranges.delete(key); }
      } else {
        ranges.set(key, v);
      }
    });
  }
  return ranges;
};

const solve = (instructions: Instruction[]) => {
  const ranges = simplifyInstructions(instructions);
  let total = 0;
  for (const range of ranges.values()) {
    const volume = (
      (range.to[0] - range.from[0] + 1)
      * (range.to[1] - range.from[1] + 1)
      * (range.to[2] - range.from[2] + 1)
    );
    total += (volume * range.sign);
  }
  return total;
};

export const part1 = (rawInput: string) => {
  const instructions = parseInput(rawInput).filter((instruction) => {
    const outsideRange = instruction.from.find((v) => v < -50 || v > 50)
      || instruction.to.find((v) => v < -50 || v > 50);
    return !outsideRange;
  });

  return solve(instructions);
};

export const part2 = (rawInput: string) => solve(parseInput(rawInput));
