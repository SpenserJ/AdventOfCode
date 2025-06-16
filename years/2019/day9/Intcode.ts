import Intcode8 from '../day5/Intcode';

export * from '../Intcode';

export default class Intcode9 extends Intcode8 {
  constructor(program: string) {
    super(program);

    this.addOpcode(9, (modes, offset) => {
      this.relativeBase += this.get(offset, modes[0]);
    });
  }
}
