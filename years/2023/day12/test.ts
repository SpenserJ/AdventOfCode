import Solver from './solve';

const input = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

describe('2023/12/12', () => {
  test('Part 1', () => {
    expect(new Solver('???.### 1,1,3').part1()).toEqual(1);
    expect(new Solver('.??..??...?##. 1,1,3').part1()).toEqual(4);
    expect(new Solver('?#?#?#?#?#?#?#? 1,3,1,6').part1()).toEqual(1);
    expect(new Solver('????.#...#... 4,1,1').part1()).toEqual(1);
    expect(new Solver('????.######..#####. 1,6,5').part1()).toEqual(4);
    expect(new Solver('?###???????? 3,2,1').part1()).toEqual(10);
    expect(new Solver(input).part1()).toEqual(21);
  });

  test('Part 2', () => {
    expect(new Solver('???.### 1,1,3').part2()).toEqual(1);
    expect(new Solver('.??..??...?##. 1,1,3').part2()).toEqual(16384);
    expect(new Solver('?#?#?#?#?#?#?#? 1,3,1,6').part2()).toEqual(1);
    expect(new Solver('????.#...#... 4,1,1').part2()).toEqual(16);
    expect(new Solver('????.######..#####. 1,6,5').part2()).toEqual(2500);
    expect(new Solver('?###???????? 3,2,1').part2()).toEqual(506250);
    expect(new Solver(input).part2()).toEqual(525152);
  });
});
