import BaseDay from '@spenserj-aoc/utilities/BaseDay';

export default class Day05 extends BaseDay<any, null> {
  parseInput(rawInput: string) {
    const result = rawInput.split('\n\n')
      .reduce((acc, next, i) => {
        if (i === 0) {
          acc.seeds = next.slice(7).split(' ').map(Number);
        } else {
          const [nameLine, ...lines] = next.split('\n');
          const name = nameLine.slice(0, nameLine.indexOf(' '));
          acc.stages.push({ name, steps: lines.map((line) => line.split(' ').map(Number)) });
        }
        return acc;
      }, { seeds: [], stages: [] });
    // Sort the stages by their source range
    result.stages.forEach((stage) => stage.steps.sort((a, b) => a[1] - b[1]));
    // Fill in any gaps for easier processing later
    for (const { steps } of result.stages) {
      if (steps[0][1] !== 0) {
        steps.splice(0, 0, [0, 0, steps[0][1]]);
      }
      for (let i = 0; i < steps.length; i += 1) {
        if (i === steps.length - 1) { break; }
        const step = steps[i];
        const stepEnds = step[1] + step[2];
        const nextStep = steps[i + 1];
        if (stepEnds < nextStep[1]) {
          steps.splice(i + 1, 0, [stepEnds, stepEnds, nextStep[1] - stepEnds]);
        }
      }
      const lastStep = steps[steps.length - 1];
      const stepEnds = lastStep[1] + lastStep[2];
      steps.push([stepEnds, stepEnds, Number.MAX_SAFE_INTEGER - stepEnds]);
    }
    return result;
  }

  step() {}

  part1() {
    const levels = this.state.seeds
      .map((seed) => this.state.stages.reduce((acc, next) => {
        const match = next.steps.find((v) => v[1] <= acc && acc < v[1] + v[2]);
        return match ? match[0] + (acc - match[1]) : acc;
      }, seed))
      .sort((a, b) => a - b);
    return levels[0];
  }

  part2() {
    let processing = new Array(this.state.seeds.length / 2);
    for (let i = 0; i < this.state.seeds.length; i += 2) {
      processing[i / 2] = [this.state.seeds[i], this.state.seeds[i + 1]];
    }

    for (const stage of this.state.stages) {
      const finished = new Array(processing.length);
      for (let i = 0; i < processing.length; i += 1) {
        const check = processing[i];
        const match = stage.steps
          .find((step) => step[1] <= check[0] && check[0] < step[1] + step[2]);
        const matchEnd = match[1] + match[2];
        const shiftBy = match[0] - match[1];
        // If the whole range of this item can fit into the match, it is fully processed
        if (check[0] + check[1] <= matchEnd) {
          finished[i] = [check[0] + shiftBy, check[1]];
        } else {
          // Otherwise split it into a finished range, and a range that we need to reprocess
          finished[i] = [check[0] + shiftBy, matchEnd - check[0]];
          processing.push([matchEnd, check[1] - (matchEnd - check[0])]);
        }
      }
      processing = finished;
    }
    return processing.map((v) => v[0]).sort((a, b) => a - b)[0];
  }
}
