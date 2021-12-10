/* eslint-disable no-continue */

import { isArraySubset, sum } from '@spenserj-aoc/utilities';

const possibleSignals = ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const;
type Signal = typeof possibleSignals[number];
type SignalPattern = Signal[];

interface DisplayEntry {
  signalPatterns: SignalPattern[];
  outputValueSignal: SignalPattern[];
}

const parseInput = (input: string) => input
  .trim()
  .split('\n')
  .map((line): DisplayEntry => {
    const [signalPatternsRaw, outputValueRaw] = line.split(' | ');
    return {
      signalPatterns: signalPatternsRaw.split(' ')
        .map((v) => v.split('').sort() as SignalPattern),
      outputValueSignal: outputValueRaw.split(' ')
        .map((v) => v.split('').sort() as SignalPattern),
    };
  });

/**
 * The segment indexes that are used for each digit.
 */
const standardPatterns = [
  'abcefg',
  'cf',
  'acdeg',
  'acdfg',
  'bcdf',
  'abdfg',
  'abdefg',
  'acf',
  'abcdefg',
  'abcdfg',
].map((v) => v.split('') as SignalPattern);

const segmentSizes = standardPatterns.reduce((acc, next, i) => {
  const size = next.length;
  acc[size] ||= [];
  acc[size].push(i);
  return acc;
}, [] as number[][]);

const isUniqueSegmentSize = (segment: Signal[]) => segmentSizes[segment.length].length === 1;

export const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce((acc, next) => (
    acc + next.outputValueSignal.filter((v) => isUniqueSegmentSize(v)).length
  ), 0);
};

interface PatternRelationship {
  pattern: SignalPattern;
  subsetOf: SignalPattern[];
  supersetOf: SignalPattern[];
}

const calculatePatternRelationships = (patterns: SignalPattern[]) => {
  const result: PatternRelationship[] = [];
  for (let i = 0; i < patterns.length; i += 1) {
    const relationship: PatternRelationship = {
      pattern: patterns[i],
      subsetOf: [],
      supersetOf: [],
    };
    for (let i2 = 0; i2 < patterns.length; i2 += 1) {
      if (i === i2) { continue; }
      if (isArraySubset(patterns[i], patterns[i2])) {
        relationship.subsetOf.push(patterns[i2]);
      }
      if (isArraySubset(patterns[i2], patterns[i])) {
        relationship.supersetOf.push(patterns[i2]);
      }
    }
    result.push(relationship);
  }
  return result;
};

const standardPatternRelationships = calculatePatternRelationships(standardPatterns);

export const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const entryValues = input.map((line) => {
    const relationships = calculatePatternRelationships(line.signalPatterns);
    const digitPatterns = relationships.reduce((acc, next) => {
      const match = standardPatternRelationships.find((check) => {
        if (next.pattern.length !== check.pattern.length) { return false; }
        if (next.subsetOf.length !== check.subsetOf.length) { return false; }
        if (next.supersetOf.length !== check.supersetOf.length) { return false; }
        return true;
      });
      if (!match) {
        console.log(next);
        throw new Error('Couldn\'t find match for pattern');
      }
      acc[next.pattern.join('')] = standardPatterns.indexOf(match.pattern);
      return acc;
    }, {});

    const outputDigits = line.outputValueSignal.map((pattern) => digitPatterns[pattern.join('')]);
    const entryValue = parseInt(outputDigits.join(''), 10);
    return entryValue;
  });
  return sum(entryValues);
};
