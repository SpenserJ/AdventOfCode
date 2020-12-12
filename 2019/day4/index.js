const input = [271973, 785961];
const strictMode = true;

const matching = [];

for (let i = input[0]; i <= input[1]; i += 1) {
  if (strictMode) {
    // Find any repeating numbers and ensure they only happen an even number of times
    const repeatingMatch = `${i}`.match(/(.)\1+/g);
    if (!repeatingMatch || !repeatingMatch.find(v => v.length === 2)) { continue; }
  } else {
    // Ensure strings have repeating numbers
    if (/((.)\2+)/.test(i) === false) { continue; }
  }
  // Don't allow numbers to decrease in value
  if (/^1*2*3*4*5*6*7*8*9*$/.test(i) === false) { continue; }
  matching.push(i);
}

console.log(matching.length);
