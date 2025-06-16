interface RuleSplit {
  type: 'split';
  splitOn: string | RegExp;
  children?: Rule[] | Rule;
}

interface RuleMatch {
  type: 'match';
  pattern: RegExp;
  children?: Rule | {
    [key: string]: Rule;
    type: never;
  };
}

interface RuleTransform {
  type: 'transform';
  transformer: (input: any) => any;
}

type Rule = RuleSplit | RuleMatch | RuleTransform;

const parse = (input: any, rule: Rule) => {
  switch (rule.type) {
    case 'split': {
      const result = input.split(rule.splitOn);
      if (typeof rule.children === 'undefined') { return result; }
      if (Array.isArray(rule.children)) {
        for (let i = 0; i < rule.children.length; i += 1) {
          result[i] = parse(result[i], rule.children[i]);
        }
        return result;
      }
      return result.map((v) => parse(v, rule.children as Rule));
    }

    case 'match': {
      const result = input.matchAll(rule.pattern);
      if (rule.children) {
        const { children } = rule;
        if (typeof children.type !== 'undefined') {
          console.log(children);
        } else {
          console.log(children);
        }
      }
    }

    default:
      throw new Error(`Rule ${rule.type} has not been implemented`);
  }
};

const input = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const test: Rule = {
  type: 'split',
  splitOn: '\n',
  children: {
    type: 'match',
    pattern: /: (?:(?<winning>\d+) )+|(?: (?<ours>\d+))+/,
  }
}

export default parse;
