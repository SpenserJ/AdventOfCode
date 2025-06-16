/* eslint-disable no-param-reassign */
import BaseDay from '@spenserj-aoc/utilities/BaseDay';

type Rule = string | {
  rating: 'x' | 'm' | 'a' | 's';
  gt: boolean;
  comparison: number;
  result: string;
};

type Workflow = Rule[];

type Split = {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
}[];

export default class Day19 extends BaseDay<any, null> {
  parseInput(rawInput: string) {
    const [rawWorkflows, rawParts] = rawInput.split('\n\n');
    const workflows = rawWorkflows.split('\n').reduce((acc, line) => {
      const ruleStart = line.indexOf('{') + 1;
      let name = line.slice(0, ruleStart - 1);
      // Need to rename it because `in` is a protected keyword
      if (name === 'in') { name = 'In'; }
      const segments = line.slice(ruleStart, -1).split(',')
        .map((segment) => {
          const split = segment.split(':');
          return split.length === 1
            ? `return workflows.${split[0]}(x, m, a, s)`
            : `if (${split[0]}) { return workflows.${split[1]}(x, m, a, s); }`;
        });
      // eslint-disable-next-line no-eval
      eval(`acc.${name} = function ${name}(x, m, a, s) {\n  ${segments.join('\n  ')}\n}`);
      return acc;
    }, { A: (x, m, a, s) => (x + m + a + s), R: () => 0 });
    const parts = JSON.parse(`[${rawParts.replaceAll('{', '{"').replaceAll(',', ',"').replaceAll('=', '":').replaceAll('\n', ',')}]`);
    return { workflows, parts };
  }

  step() {}

  part1() {
    return this.state.parts.reduce((acc, part) => (
      acc + this.state.workflows.In(part.x, part.m, part.a, part.s)
    ), 0);
  }

  part2() {
    const [rawWorkflows, rawParts] = this.rawInput.trim().split('\n\n');
    const workflows = rawWorkflows.split('\n').reduce((acc, line) => {
      const ruleStart = line.indexOf('{') + 1;
      const name = line.slice(0, ruleStart - 1);
      const rules = line.slice(ruleStart, -1).split(',').map((rawRule) => {
        const resultIndex = rawRule.indexOf(':');
        // Handle rules like 'A' or 'R'
        if (resultIndex === -1) { return rawRule; }
        const gt = rawRule.indexOf('>') !== -1;
        const [rating, comparison, result] = rawRule.split(/[><:]/);
        return {
          rating: rating as 'x' | 'm' | 'a' | 's',
          gt,
          comparison: Number(comparison),
          result,
        } as Rule;
      });
      acc[name] = rules;
      return acc;
    }, {} as Record<string, Workflow>);

    const getInitialSplit = (workflow: 'R' | 'A'): Split => {
      // If we've reached R, there are no rules that apply
      if (workflow === 'R') { return []; }
      // If we've reached A, all of the possible workflows apply
      return [{
        x: [1, 4000],
        m: [1, 4000],
        a: [1, 4000],
        s: [1, 4000],
      }];
    };

    const recurseWorkflow = (workflow: string): Split => {
      const recurseWorkflowInner = ([rule, ...rules]: Rule[]): Split => {
        // If this rule is a string, there is no condition and we can immediately recurse
        if (typeof rule === 'string') {
          // If we reached R or A, those have a known range of values
          if (rule === 'R' || rule === 'A') { return getInitialSplit(rule); }
          // This must be another workflow
          return recurseWorkflow(rule);
        }

        const nestedInitial = (rule.result === 'R' || rule.result === 'A')
          ? getInitialSplit(rule.result)
          : recurseWorkflow(rule.result);

        const nested = [
          ...nestedInitial.map((split) => ({
            ...split,
            [rule.rating]: rule.gt
              ? [Math.max(split[rule.rating][0], rule.comparison + 1), split[rule.rating][1]]
              : [split[rule.rating][0], Math.min(split[rule.rating][1], rule.comparison - 1)],
          })),

          ...recurseWorkflowInner(rules).map((split) => ({
            ...split,
            [rule.rating]: !rule.gt
              ? [Math.max(split[rule.rating][0], rule.comparison), split[rule.rating][1]]
              : [split[rule.rating][0], Math.min(split[rule.rating][1], rule.comparison)],
          })),
        ].filter((split) => (
          split.x[0] < split.x[1]
          && split.m[0] < split.m[1]
          && split.a[0] < split.a[1]
          && split.s[0] < split.s[1]
        ));

        return nested;
      };

      return recurseWorkflowInner(workflows[workflow]);
    };

    const splits = recurseWorkflow('in');
    const result = splits.map((split) => {
      const ranges = [
        split.x[1] - split.x[0] + 1,
        split.m[1] - split.m[0] + 1,
        split.a[1] - split.a[0] + 1,
        split.s[1] - split.s[0] + 1,
      ];
      return ranges[0] * ranges[1] * ranges[2] * ranges[3];
    });

    return result.reduce((acc, next) => acc + next, 0);
  }
}
