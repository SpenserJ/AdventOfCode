import { loadInput, binaryPartition } from '../../utils';

interface BoardingPass {
  row: number;
  column: number;
  seatID: number;
}

const parseBoardingPass = (input: string): BoardingPass => {
  // 7 for row, 3 for column
  const rowInput = input.slice(0, 7).split('').map((v) => v === 'B');
  const colInput = input.slice(7).split('').map((v) => v === 'R');

  // Both values in the range should be identical based on the input
  const [row] = binaryPartition(0, 127, rowInput);
  const [column] = binaryPartition(0, 7, colInput);

  return {
    row,
    column,
    seatID: (row * 8) + column,
  };
};

const inputs = loadInput(__dirname);

const foundSeatIDs = inputs.map((v) => parseBoardingPass(v).seatID);

const largest = foundSeatIDs.reduce((acc, next) => Math.max(acc, next), 0);

console.log('Largest seatID:', largest);
