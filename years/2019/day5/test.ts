import Intcode8 from './Intcode';

describe('2019/12/5', () => {
  test('Opcode 3 & 4', () => {
    const callback = jest.fn();
    const intcode = new Intcode8('3,0,4,0,99');
    intcode.setInput(12345);
    intcode.setOutputCallback(callback);
    intcode.run();
    expect(callback).toBeCalledWith(12345);
  });

  test('Opcode 8', () => {
    let intcode: Intcode8;
    const callback = jest.fn();
    const testInput = (value: number, expectedOutput: number): void => {
      callback.mockReset();
      intcode.reset();
      intcode.setInput(value);
      intcode.setOutputCallback(callback);
      intcode.run();
      expect(callback).toHaveBeenLastCalledWith(expectedOutput);
    };

    intcode = new Intcode8('3,9,8,9,10,9,4,9,99,-1,8');
    testInput(8, 1);
    testInput(5, 0);

    intcode = new Intcode8('3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99');
    testInput(7, 999);
    testInput(8, 1000);
    testInput(9, 1001);
  });
});
