import { loadInput } from '../../utils';

interface Entry {
  validPattern: RegExp;
  password: string;
}

const entryMatchRegExp = /^(\d+)-(\d+) (\w): (.*)$/;
const entries = loadInput(__dirname)
  .map((line): Entry => {
    const parts = entryMatchRegExp.exec(line);
    if (!parts) { throw new Error(`Failed to parse line: "${line}"`); }

    const [, min, max, char, password] = parts;
    const notChar = `[^${char}]*`;

    return {
      validPattern: new RegExp(`^${notChar}(${char}${notChar}){${min},${max}}${notChar}$`),
      password,
    };
  })
  .filter(({ validPattern, password }) => validPattern.test(password));

console.log(entries.length);
