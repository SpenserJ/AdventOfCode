import fs from 'fs';
import path from 'path';


const initialIntcode = fs.readFileSync(path.resolve(__dirname, './input'), 'utf-8')
  .split(',')
  .map(v => parseInt(v, 10));

const getOutput = (noun, verb) => {
  let intcode = [...initialIntcode];

  // Adjust program memory
  intcode[1] = noun;
  intcode[2] = verb;

  for (let i = 0; i <= intcode.length; i += 4) {
    const opcode = intcode[i];
    if (opcode !== 1 && opcode !== 2) { break; }
    const a = intcode[intcode[i + 1]];
    const b = intcode[intcode[i + 2]];
    const outputPos = intcode[i + 3];
    intcode[outputPos] = (opcode === 1)
      ? (a + b)
      : (a * b);
  }

  return intcode[0];
}

// console.log('Part 1:', getOutput(12, 2));

// Part 2
let match = false;
for (let i = 0; i <= 99; i += 1) {
  for (let j = 0; j <= 99; j += 1) {
    const output = getOutput(i, j);
    if (output === 19690720) {
      match = [i, j];
      break;
    }
  }
  if (match) { break; }
}
console.log('Part 2:', (100 * match[0]) + match[1]);
