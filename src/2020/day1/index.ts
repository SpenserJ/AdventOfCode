import { loadInput, sortNumbers } from '../../utils';

const expenses = loadInput(__dirname)
  .map((v) => parseInt(v, 10))
  .sort(sortNumbers);

let pair: boolean | [number, number] = false;

// Outer loop will be the number we're starting to compare with
for (let i = 0; i < expenses.length; i += 1) {
  // Inner loop is what we're adding
  for (let j = expenses.length - 1; j > i; j -= 1) {
    // If the two numbers equal 2020, save it and break out of the loops
    if (expenses[i] + expenses[j] === 2020) {
      pair = [expenses[i], expenses[j]];
      break;
    }
  }
  if (pair) { break; }
}

if (typeof pair === 'boolean') {
  console.error('Could not find correct expenses');
} else {
  console.log({ pair, total: pair[0] * pair[1] });
}
