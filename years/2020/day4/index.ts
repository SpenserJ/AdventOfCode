import { loadRawInput, numBetween } from '@spenserj-aoc/utilities';

interface PassportRaw {
  // We don't really care about the types. We just care if they're set
  byr?: string; // Birth Year
  iyr?: string; // Issue Year
  eyr?: string; // Expiration Year
  hgt?: string; // Height
  hcl?: string; // Hair Color
  ecl?: string; // Eye Color
  pid?: string; // Passport ID
  cid?: string; // Country ID
}

const entryFieldRegExp = /(?:^|\s)(\w{3}):([^\s]+)/g;
const passports = loadRawInput(__dirname)
  .split('\n\n') // Split on a double linebreak
  .map((entry): PassportRaw => {
    const fields = entry.matchAll(entryFieldRegExp);
    return Array.from(fields).reduce((acc, [, k, v]) => ({ ...acc, [k]: v }), {});
  });

const isPassportValidPart1 = (passport: PassportRaw): boolean => Object
  .entries(passport)
  .filter(([k, v]) => (k !== 'cid' && v))
  .length >= 7;

const validEyeColor = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

const isPassportValidPart2 = (passport: PassportRaw): boolean => {
  // byr (Birth Year) - four digits; at least 1920 and at most 2002.
  if (!numBetween(passport.byr, 1920, 2002)) { return false; }

  // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
  if (!numBetween(passport.iyr, 2010, 2020)) { return false; }

  // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
  if (!numBetween(passport.eyr, 2020, 2030)) { return false; }

  // hgt (Height) - a number followed by either cm or in:
  const [, strHeight, heightUnit] = /^(\d+)(cm|in)$/.exec(passport.hgt || '') || [];
  const intHeight = Number(strHeight);

  if ((
    // Invalid unit
    heightUnit !== 'cm' && heightUnit !== 'in'
  ) || (
    // If cm, the number must be at least 150 and at most 193.
    heightUnit === 'cm' && !numBetween(intHeight, 150, 193)
  ) || (
    // If in, the number must be at least 59 and at most 76.
    heightUnit === 'in' && !numBetween(intHeight, 59, 76)
  )) { return false; }

  // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
  if (/^#[0-9a-f]{6}$/.test(passport.hcl || '') === false) { return false; }

  // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
  if (!validEyeColor.includes(passport.ecl || '')) { return false; }

  // pid (Passport ID) - a nine-digit number, including leading zeroes.
  if (/^[0-9]{9}$/.test(passport.pid || '') === false) { return false; }

  // cid (Country ID) - ignored, missing or not.

  return true;
};

console.log('Part 1:', passports.filter(isPassportValidPart1).length, 'valid passports');
console.log('Part 2:', passports.filter(isPassportValidPart2).length, 'valid passports');
