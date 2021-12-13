import { AbstractPathFinder, Path, PathNode } from '@spenserj-aoc/utilities';

type RoomNode = PathNode & {
  smallRoom: boolean;
};

class RoomPath extends Path<RoomNode> {
  public nodeCount: Readonly<Record<string, number>>;

  public readonly smallRoomTwice: boolean;

  constructor(
    nodes: RoomNode[],
    nodeCount?: Record<string, number>,
    smallRoomTwice?: boolean,
  ) {
    super(nodes);

    const realNodeCount = nodeCount || {};
    let realSmallTwice = smallRoomTwice;

    if (!nodeCount) {
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        realNodeCount[node.name] = (realNodeCount[node.name] || 0) + 1;
        realSmallTwice ||= (node.smallRoom && realNodeCount[node.name] > 1);
      }
    }
    this.nodeCount = realNodeCount;
    this.smallRoomTwice = realSmallTwice;
  }

  public branch(node: RoomNode): RoomPath {
    const newCountRoom = (this.nodeCount[node.name] || 0) + 1;
    const newCountTotal = { ...this.nodeCount, [node.name]: newCountRoom };
    const smallRoomTwice = this.smallRoomTwice || (node.smallRoom && newCountRoom > 1);

    return new RoomPath(this.nodes.concat(node), newCountTotal, smallRoomTwice);
  }
}

export const parseInput = (input: string) => {
  const lines = input
    .trim()
    .split('\n');
  const initialRooms = lines.flatMap((v) => v.split('-'))
    .map((name): [string, RoomNode] => ([
      name,
      {
        name,
        edges: [],
        smallRoom: name.toLowerCase() === name,
      },
    ]));
  const rooms = new Map(initialRooms);
  for (const line of lines) {
    const [leftName, rightName] = line.split('-');
    const left = rooms.get(leftName);
    const right = rooms.get(rightName);
    left.edges.push(right);
    right.edges.push(left);
  }
  return rooms;
};

abstract class Day12PathFinder extends AbstractPathFinder<RoomNode, RoomPath> {
  public validPaths = 0;

  recordCompletePath() {
    this.validPaths += 1;
  }
}

class PathWalkerPart1 extends Day12PathFinder {
  isValidStep(path: RoomPath, nextRoom: RoomNode) {
    // Doubling back is allowed in big rooms
    if (!nextRoom.smallRoom) { return true; }
    return !path.nodeCount[nextRoom.name];
  }
}

class PathWalkerPart2 extends Day12PathFinder {
  isValidStep(path: RoomPath, nextRoom: RoomNode) {
    // Can't double back to the start
    if (nextRoom.name === 'start') { return false; }
    // Doubling back is allowed in big rooms
    if (!nextRoom.smallRoom) { return true; }
    // Check if we've already seen another small room twice
    if (path.smallRoomTwice && path.nodeCount[nextRoom.name] > 0) { return false; }
    return true;
  }
}

export const part1 = (rawInput: string) => {
  const pathWalker = new PathWalkerPart1(parseInput(rawInput));
  pathWalker.run(new RoomPath([pathWalker.nodes.get('start')]), pathWalker.nodes.get('end'));
  return pathWalker.validPaths;
};

export const part2 = (rawInput: string) => {
  const pathWalker = new PathWalkerPart2(parseInput(rawInput));
  pathWalker.run(new RoomPath([pathWalker.nodes.get('start')]), pathWalker.nodes.get('end'));
  return pathWalker.validPaths;
};
