import { loadInput } from '../../utils';

interface Entry {
  numbers: [number, number];
  character: string; // TypeScript doesn't have a type for a fixed-length string
  password: string;
}

const entryMatchRegExp = /^(\d+)-(\d+) (\w): (.*)$/;
const entries = loadInput(__dirname).map((line): Entry => {
  const parts = entryMatchRegExp.exec(line);
  if (!parts) { throw new Error(`Failed to parse line: "${line}"`); }

  const [, num1, num2, character, password] = parts;
  return {
    numbers: [parseInt(num1, 10), parseInt(num2, 10)],
    character,
    password,
  };
});

const part1Valid = entries.filter(({ numbers: [min, max], character: char, password }) => {
  const notChar = `[^${char}]*`;
  const validPattern = new RegExp(`^${notChar}(${char}${notChar}){${min},${max}}${notChar}$`);
  return validPattern.test(password);
});

const part2Valid = entries.filter(({ numbers, character, password }) => {
  // We subtract 1 from the index because the policy doesn't understand zero-based indexes
  const foundChars = numbers.filter((i) => password[i - 1] === character).length;
  return foundChars === 1;
});

console.log({
  part1: part1Valid.length,
  part2: part2Valid.length,
});
