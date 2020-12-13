import { loadInput, sortNumbers } from '../../utils';

const expenses = loadInput(__dirname)
  .map((v) => parseInt(v, 10))
  .sort(sortNumbers);

const findExpenses = (count: number, target: number, startAt: number): number[] | false => {
  // If we're on the last number, check if there is an exact match
  if (count === 1) {
    return expenses.indexOf(target) >= startAt ? [target] : false;
  }

  for (let i = startAt; i < expenses.length; i += 1) {
    const check = expenses[i];
    const nested = findExpenses(count - 1, target - check, i + 1);
    // If we found a match, return all of the numbers
    if (nested !== false) { return [check].concat(nested); }
  }

  // If we get here, there were no matches for this input
  return false;
};

const logMatch = (count: number): void => {
  const match = findExpenses(count, 2020, 0);

  if (typeof match === 'boolean') {
    console.error('Could not find correct', count, 'expenses');
  } else {
    const product = match.reduce((acc, next) => (acc * next), 1);
    console.log({ count, match, product });
  }
};

logMatch(2);
logMatch(3);
