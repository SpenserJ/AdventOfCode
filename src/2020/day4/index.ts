import { loadRawInput } from '../../utils';

interface Passport {
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

const entryFieldRegExp = new RegExp('(?:^|\\s)(\\w{3}):([^\\s]+)', 'g');
const passports = loadRawInput(__dirname)
  .split('\n\n') // Split on a double linebreak
  .map((entry): Passport => {
    const fields = entry.matchAll(entryFieldRegExp);
    return Array.from(fields).reduce((acc, [, k, v]) => ({ ...acc, [k]: v }), {});
  });

const isPassportValid = (passport: Passport): boolean => Object
  .entries(passport)
  .filter(([k, v]) => (k !== 'cid' && v))
  .length >= 7;

console.log(passports);
console.log(passports.filter(isPassportValid).length, 'valid passports');
