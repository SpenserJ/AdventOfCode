// $& means the whole matched string
const escapeRegex = (toEscape: string) => toEscape.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const explode = (input: string): string => {
  const braceRegex = /[[\]]/g;
  let openBraces = 0;
  let openingBrace: RegExpExecArray;
  while (openingBrace = braceRegex.exec(input)) {
    openBraces += (openingBrace[0] === '[' ? 1 : -1);
    if (openBraces > 4) {
      let closingBrace = braceRegex.exec(input);
      while (closingBrace[0] === '[') {
        // We've accidentally found '[[' instead of '[\d,\d]', so continue to the next brace
        openingBrace = closingBrace;
        closingBrace = braceRegex.exec(input);
      }
      const toReplace = input.substring(openingBrace.index, closingBrace.index + 1);
      const beforeStr = input.substring(0, openingBrace.index);
      const beforeMatch = beforeStr.match(/^(.+[,[])(?:\d+)(.*?)$/);
      const before = beforeMatch
        ? `^(${escapeRegex(beforeMatch[1])})(\\d+)(${escapeRegex(beforeMatch[2])})`
        : `^(${escapeRegex(beforeStr)})(\\d+)?(.*?)`;
      const after = '([^\\d]+)(\\d+)?';
      const regex = new RegExp(`${before}${escapeRegex(toReplace)}${after}`);
      const [left, right] = JSON.parse(toReplace).map((v) => Number(v));
      const result = input.replace(regex, (...match) => {
        const leftAdd = match[2] !== undefined ? `${Number(match[2]) + left}` : '';
        const rightAdd = match[5] !== undefined ? `${Number(match[5]) + right}` : '';
        return `${match[1]}${leftAdd}${match[3]}0${match[4]}${rightAdd}`;
      });
      return result;
    }
  }
  return input;
};

export const split = (input: string): string => input.replace(/\d{2,}/, (rawValue) => {
  const value = Number(rawValue) / 2;
  return `[${Math.floor(value)},${Math.ceil(value)}]`;
});

export const run = (rawInput: string) => {
  let lastRun = rawInput;
  let changed = true;
  while (changed) {
    let newRun = lastRun;
    newRun = explode(newRun);
    // Only split if we didn't explode anything
    if (lastRun === newRun) {
      newRun = split(newRun);
    }
    changed = lastRun !== newRun;
    lastRun = newRun;
  }
  return lastRun;
};

export const parseInput = (rawInput: string) => {
  const input = rawInput.trim().split('\n');
  let current = input[0];
  for (let i = 1; i < input.length; i += 1) {
    current = run(`[${current},${input[i]}]`);
  }
  return current;
};

type SnailfishPrimitive = number | [SnailfishPrimitive, SnailfishPrimitive];

export const calculateMagnitude = (input: string | SnailfishPrimitive): number => {
  const actualInput = typeof input === 'string' ? JSON.parse(input) : input;
  if (typeof actualInput === 'number') { return actualInput; }
  const a = calculateMagnitude(actualInput[0]) * 3;
  const b = calculateMagnitude(actualInput[1]) * 2;
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
