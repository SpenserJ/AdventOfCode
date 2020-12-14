import { loadInput } from '../../utils';

interface Bag {
  name: string;
  contains: Map<Bag, number>;
  containedIn: Set<Bag>;
}

const bagTypes: Record<string, Bag> = {};

const getBagByName = (name: string): Bag => {
  if (!bagTypes[name]) {
    bagTypes[name] = {
      name,
      contains: new Map<Bag, number>(),
      containedIn: new Set(),
    };
  }

  return bagTypes[name];
};

loadInput(__dirname).forEach((rule) => {
  const [name, rawContains] = rule
    .replace(/( bags?|no other|\.)/g, '')
    .split(' contain ');

  const bag = getBagByName(name);

  // Parse all of the bags that it can contain into tuples with the amount and name
  rawContains.split(', ').filter((v) => v).forEach((v) => {
    const [, rawAmount, innerName] = /^(\d+) (.*)$/.exec(v) || [];
    const amount = Number(rawAmount);
    const innerBag = getBagByName(innerName);

    bag.contains.set(innerBag, amount);
    innerBag.containedIn.add(bag);
  });
});

const getCarryOptions = (bag: Bag): Set<Bag> => new Set([
  ...bag.containedIn,
  ...Array.from(bag.containedIn).flatMap((v) => Array.from(getCarryOptions(v))),
]);

console.log('Part 1:', getCarryOptions(getBagByName('shiny gold')).size);
