import Intcode9 from './Intcode';

describe('2019/12/9', () => {
  test('Opcode 9', async () => {
    let intcode: Intcode9;
    const callback = jest.fn();
    const testOutput = async (...expectedOutputs: number[]): Promise<void> => {
      callback.mockReset();
      intcode.reset();
      intcode.setOutputCallback((v) => { console.log(v); callback(v); });
      await intcode.run();
      for (let i = 0; i < expectedOutputs.length; i += 1) {
        expect(callback).toHaveBeenNthCalledWith(i, expectedOutputs[i]);
      }
    };

    intcode = new Intcode9('109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99');
    await testOutput(...'109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99'.split(',').map((v) => Number(v)));
    // await testInput(5, 0);

    /*
    intcode = new Intcode9('1102,34915192,34915192,7,4,7,99,0');
    await testOutput(0, 0);
    await testOutput(1, 1);

    intcode = new Intcode9('3,3,1105,-1,9,1101,0,0,12,4,12,99,1');
    await testOutput(0, 0);
    await testOutput(1, 1);

    intcode = new Intcode9('3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99');
    await testOutput(7, 999);
    await testOutput(8, 1000);
    await testOutput(9, 1001);
    */
  });
});
