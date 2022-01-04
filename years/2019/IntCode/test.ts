import BaseIntcode from '.';

const formatAsIntcode = (value: string) => value.split(',').map((v) => Number(v));

const getResult = (input: string) => {
  const intCode = new BaseIntcode(input);
  intCode.run();
  return intCode.memory.join(',');
};

describe('BaseIntcode', () => {
  test('getInstructions()', () => {
    expect(new BaseIntcode('1,9,10,3,2,3,11,0,99,30,40,50').getInstructions())
      .toEqual([
        [1, 9, 10, 3],
        [2, 3, 11, 0],
        [99],
        [30],
        [40],
        [50],
      ]);
  });

  test('Opcode 1 & 2', () => {
    const intCode = new BaseIntcode('1,9,10,3,2,3,11,0,99,30,40,50');
    intCode.step();
    expect(intCode.memory).toEqual(formatAsIntcode('1,9,10,70,2,3,11,0,99,30,40,50'));
    intCode.step();
    expect(intCode.memory).toEqual(formatAsIntcode('3500,9,10,70,2,3,11,0,99,30,40,50'));
    intCode.step();
    expect(intCode.memory).toEqual(formatAsIntcode('3500,9,10,70,2,3,11,0,99,30,40,50'));

    expect(getResult('1,0,0,0,99')).toEqual('2,0,0,0,99');
    expect(getResult('2,3,0,3,99')).toEqual('2,3,0,6,99');
    expect(getResult('2,4,4,5,99,0')).toEqual('2,4,4,5,99,9801');
    expect(getResult('1,1,1,4,99,5,6,0,99')).toEqual('30,1,1,4,2,5,6,0,99');
  });
});
