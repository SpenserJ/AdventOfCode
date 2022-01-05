import Intcode8 from './Intcode';

describe('2019/12/5', () => {
  test('Opcode 3 & 4', async () => {
    const callback = jest.fn();
    const intcode = new Intcode8('3,0,4,0,99');
    intcode.addInput(12345);
    intcode.setOutputCallback(callback);
    await intcode.run();
    expect(callback).toBeCalledWith(12345);
  });

  test('Opcode 8', async () => {
    let intcode: Intcode8;
    const callback = jest.fn();
    const testInput = async (value: number, expectedOutput: number): Promise<void> => {
      callback.mockReset();
      intcode.reset();
      intcode.addInput(value);
      intcode.setOutputCallback(callback);
      await intcode.run();
      expect(callback).toHaveBeenLastCalledWith(expectedOutput);
    };

    intcode = new Intcode8('3,9,8,9,10,9,4,9,99,-1,8');
    await testInput(8, 1);
    await testInput(5, 0);

    intcode = new Intcode8('3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9');
    await testInput(0, 0);
    await testInput(1, 1);

    intcode = new Intcode8('3,3,1105,-1,9,1101,0,0,12,4,12,99,1');
    await testInput(0, 0);
    await testInput(1, 1);

    intcode = new Intcode8('3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99');
    await testInput(7, 999);
    await testInput(8, 1000);
    await testInput(9, 1001);
  });
});
