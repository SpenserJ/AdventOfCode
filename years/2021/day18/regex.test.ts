import {
  explode,
  run,
  calculateMagnitude,
  parseInput,
  part1,
  part2,
  split,
} from './solve-regex';

const input = `
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

describe('2020/12/18', () => {
  test('explode', () => {
    expect(explode('[[[[[9,8],1],2],3],4]')).toEqual('[[[[0,9],2],3],4]');
    expect(explode('[7,[6,[5,[4,[3,2]]]]]')).toEqual('[7,[6,[5,[7,0]]]]');
    expect(explode('[[6,[5,[4,[3,2]]]],1]')).toEqual('[[6,[5,[7,0]]],3]');
    expect(explode('[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]')).toEqual('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]');
    expect(explode('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]')).toEqual('[[3,[2,[8,0]]],[9,[5,[7,0]]]]');
  });

  test('split', () => {
    expect(split('[[[[0,7],4],[15,[0,13]]],[1,1]]')).toEqual('[[[[0,7],4],[[7,8],[0,13]]],[1,1]]');
    expect(split('[[[[0,7],4],[[7,8],[0,13]]],[1,1]]')).toEqual('[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]');
  });

  test('run', () => {
    expect(run('[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]')).toEqual('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]');
  });

  test('parse and run', () => {
    expect(parseInput(`
[1,1]
[2,2]
[3,3]
[4,4]`))
      .toEqual('[[[[1,1],[2,2]],[3,3]],[4,4]]');

    expect(parseInput(`
[1,1]
[2,2]
[3,3]
[4,4]
[5,5]`))
      .toEqual('[[[[3,0],[5,3]],[4,4]],[5,5]]');

    expect(parseInput(`
[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]`))
      .toEqual('[[[[5,0],[7,4]],[5,5]],[6,6]]');
  });

  describe('parse and run slightly large example', () => {
    const largeRun = `
[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`.trim().split('\n');

    const largeRunExpectedSteps = [
      '[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]',
      '[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]',
      '[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]',
      '[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]',
      '[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]',
      '[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]',
      '[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]',
      '[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]',
      '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]',
    ];

    for (let i = 2; i < largeRun.length; i += 1) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      it(`pair ${i - 1}`, () => {
        const largeInput = largeRun.slice(0, i).join('\n');
        const expected = largeRunExpectedSteps[i - 2];
        const received = parseInput(largeInput);
        expect(received).toEqual(expected);
      });
    }
  });

  test('calculate magnitude', () => {
    expect(calculateMagnitude(1)).toEqual(1);
    expect(calculateMagnitude([9, 1])).toEqual(29);
    expect(calculateMagnitude([[9, 1], [1, 9]])).toEqual(129);
  });

  test('part 1', () => {
    expect(parseInput(input))
      .toEqual('[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]');

    expect(part1(input)).toEqual(4140);
  });

  test('Part 2', () => {
    expect(part2(input)).toEqual(3993);
  });
});
