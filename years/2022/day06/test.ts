import Solver from './solve';

describe('2022/12/06', () => {
  test('Part 1', () => {
    expect(new Solver('mjqjpqmgbljsphdztnvjfqwrcgsmlb').part1()).toEqual(7);
    expect(new Solver('bvwbjplbgvbhsrlpgdmjqwftvncz').part1()).toEqual(5);
    expect(new Solver('nppdvjthqldpwncqszvftbrmjlhg').part1()).toEqual(6);
    expect(new Solver('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg').part1()).toEqual(10);
    expect(new Solver('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw').part1()).toEqual(11);
  });

  test('Part 2', () => {
    expect(new Solver('mjqjpqmgbljsphdztnvjfqwrcgsmlb').part2()).toEqual(19);
    expect(new Solver('bvwbjplbgvbhsrlpgdmjqwftvncz').part2()).toEqual(23);
    expect(new Solver('nppdvjthqldpwncqszvftbrmjlhg').part2()).toEqual(23);
    expect(new Solver('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg').part2()).toEqual(29);
    expect(new Solver('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw').part2()).toEqual(26);
  });
});
