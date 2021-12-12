import { AbstractPathFinder, PathNode } from '@spenserj-aoc/utilities';

type RoomNode = PathNode & {
  smallRoom: boolean;
};

export const parseInput = (input: string) => {
  const lines = input
    .trim()
    .split('\n');
  const initialRooms = lines.flatMap((v) => v.split('-'))
    .map((name): [string, RoomNode] => ([
      name,
      {
        name,
        connections: [],
        smallRoom: name.toLowerCase() === name,
      },
    ]));
  const rooms = new Map(initialRooms);
  for (const line of lines) {
    const [leftName, rightName] = line.split('-');
    const left = rooms.get(leftName);
    const right = rooms.get(rightName);
    left.connections.push(right);
    right.connections.push(left);
  }
  return rooms;
};

class PathWalkerPart1 extends AbstractPathFinder<RoomNode> {
  isValidStep(path: RoomNode[], nextRoom: RoomNode) {
    // Doubling back is allowed in big rooms
    if (!nextRoom.smallRoom) { return true; }
    return !path.includes(nextRoom);
  }
}

class PathWalkerPart2 extends AbstractPathFinder<RoomNode> {
  isValidStep(path: RoomNode[], nextRoom: RoomNode) {
    // Can't double back to the start
    if (nextRoom.name === 'start') { return false; }
    // Doubling back is allowed in big rooms
    if (!nextRoom.smallRoom) { return true; }
    // We can double back one small room twice, and other rooms once
    let hasDoubleSmall = false;
    const seenSmall: string[] = [];
    for (const nextSmall of path) {
      // Skip large rooms
      if (!nextSmall.smallRoom) { continue; }
      // If we haven't seen a double, check if this is a double
      hasDoubleSmall ||= seenSmall.includes(nextSmall.name);
      // Track that we've seen the room
      seenSmall.push(nextSmall.name);
    }
    // If we haven't doubled back to a small, we can
    if (!hasDoubleSmall) { return true; }
    // Otherwise we only double back if we haven't seen this room yet
    return !seenSmall.includes(nextRoom.name);
  }
}

export const part1 = (rawInput: string) => {
  const pathWalker = new PathWalkerPart1(parseInput(rawInput));
  const paths = pathWalker.findPaths(pathWalker.nodes.get('start'), pathWalker.nodes.get('end'));
  return paths.length;
};

export const part2 = (rawInput: string) => {
  const pathWalker = new PathWalkerPart2(parseInput(rawInput));
  const paths = pathWalker.findPaths(pathWalker.nodes.get('start'), pathWalker.nodes.get('end'));
  return paths.length;
};
