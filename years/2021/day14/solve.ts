type Counter = Record<string, number>;
type PairInsertion = Record<string, [string, string]>;

export const parseInput = (input: string): [Counter, PairInsertion] => {
  const [rawTemplate, rawPairInsertion] = input
    .trim()
    .split('\n\n');

  const template: Counter = {};
  for (let i = 1; i < rawTemplate.length; i += 1) {
    const pair = rawTemplate.substring(i - 1, i + 1);
    template[pair] = (template[pair] || 0) + 1;
  }

  const pairInsertion = rawPairInsertion.split('\n').reduce((acc, next) => {
    const [from, insert] = next.split(' -> ');
    acc[from] = [`${from[0]}${insert}`, `${insert}${from[1]}`];
    return acc;
  }, {} as PairInsertion);

  return [template, pairInsertion];
};

const insertionStep = (template: Counter, pairInsertion: PairInsertion): Counter => {
  const newTemplate: Counter = {};
  Object.entries(template).forEach(([key, value]) => {
    for (let i = 0; i < pairInsertion[key].length; i += 1) {
      const newPair = pairInsertion[key][i];
      newTemplate[newPair] = (newTemplate[newPair] || 0) + value;
    }
  });
  return newTemplate;
};

const expandPolymer = (
  initialTemplate: Counter,
  pairInsertion: PairInsertion,
  times: number,
): Counter => {
  let newTemplate = initialTemplate;
  for (let i = 0; i < times; i += 1) {
    newTemplate = insertionStep(newTemplate, pairInsertion);
  }
  return newTemplate;
};

const calculatePolymerStrength = (polymer: Counter): number => {
  const total: Counter = {};
  Object.entries(polymer).forEach(([key, value], i) => {
    // If we're on the first item, count the first letter as well.
    // This only works with an object because Node has consistent insertion
    if (i === 0) { total[key[0]] = (total[key[0]] || 0) + value; }
    total[key[1]] = (total[key[1]] || 0) + value;
  });
  const sorted = Object.values(total).sort((a, b) => b - a);
  return sorted[0] - sorted[sorted.length - 1];
};

export const part1 = (rawInput: string) => {
  const [template, pairInsertion] = parseInput(rawInput);
  return calculatePolymerStrength(expandPolymer(template, pairInsertion, 10));
};

export const part2 = (rawInput: string) => {
  const [template, pairInsertion] = parseInput(rawInput);
  return calculatePolymerStrength(expandPolymer(template, pairInsertion, 40));
};
