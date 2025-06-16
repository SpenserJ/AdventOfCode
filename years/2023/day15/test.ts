import Solver from './solve';

const input = 'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7';

describe('2023/12/15', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(1320);
  });

  test.only('Part 2', () => {
    expect(new Solver(input).part2()).toEqual(145);
  });
});
