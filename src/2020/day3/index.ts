import { loadInput } from '../../utils';

type TreeMap = string[][];

// Convert the input into a TreeMap where `.` is clear and `#` is tree
const baseMap = loadInput(__dirname)
  .map((line) => line.split(''));

const expandMap = (right: number, down: number): TreeMap => {
  const horizontalTravel = ((baseMap.length / down) * right);
  const baseMapWidth = baseMap[0].length;
  const repeat = Math.ceil(horizontalTravel / baseMapWidth);

  if (repeat === 1) { return baseMap; }

  return baseMap.map((row) => Array(repeat).fill('').flatMap(() => row));
};

const countTreesInPath = (right: number, down: number, debug = false): number => {
  const map = expandMap(right, down);

  let treesEncountered = 0;
  let x = 0;
  for (let y = down; y < map.length; y += down) {
    x += right;
    const treeHit = map[y][x] === '#';
    if (treeHit) { treesEncountered += 1; }
    map[y][x] = treeHit ? 'X' : '0';
  }

  if (debug) {
    // Log the map with our path to the console
    console.log(map.map((row) => row.join('')).join('\n'));
  }

  return treesEncountered;
};

const treesEncountered = countTreesInPath(3, 1);
console.log('Encountered', treesEncountered, 'trees');
