interface Room {
  name: string;
  connections: Room[];
}

type RoomList = Record<string, Room>;

export const parseInput = (input: string) => {
  const rooms: RoomList = input
    .trim()
    .split('\n')
    .reduce((acc, next) => {
      const [leftName, rightName] = next.split('-');
      acc[leftName] ||= { name: leftName, connections: [] };
      acc[rightName] ||= { name: rightName, connections: [] };
      acc[leftName].connections.push(acc[rightName]);
      acc[rightName].connections.push(acc[leftName]);
      return acc;
    }, {} as RoomList);
  return rooms;
};

abstract class AbstractPathWalker {
  constructor(public rooms: RoomList) {}

  findPaths(start: Room, end: Room): Room[][];
  findPaths(currentPath: Room[], end: Room): Room[][];
  findPaths(startOrPath: Room | Room[], end: Room): Room[][] {
    const path = Array.isArray(startOrPath) ? startOrPath : [startOrPath];
    const currentRoom = path[path.length - 1];
    const result: Room[][] = [];
    for (const next of currentRoom.connections) {
      if (!this.isValidStep(path, next)) { continue; }
      const newPath = path.concat(next);
      if (next === end) {
        result.push(newPath);
      } else {
        result.push(...this.findPaths(newPath, end));
      }
    }
    return result;
  }

  abstract isValidStep(path: Room[], nextRoom: Room): boolean;

  debugRooms() {
    return Object.values(this.rooms)
      .map((room) => `${room.name} -> ${room.connections.map((v) => v.name)}`);
  }

  printRooms() {
    console.log(this.debugRooms());
  }
}

class PathWalkerPart1 extends AbstractPathWalker {
  isValidStep(path: Room[], nextRoom: Room) {
    // Doubling back is allowed in big rooms
    if (nextRoom.name.toLowerCase() !== nextRoom.name) { return true; }
    return !path.includes(nextRoom);
  }
}

class PathWalkerPart2 extends PathWalkerPart1 {
  isValidStep(path: Room[], nextRoom: Room) {
    // Can't double back to the start
    if (nextRoom.name === 'start') { return false; }
    // Doubling back is allowed in big rooms
    if (nextRoom.name.toLowerCase() !== nextRoom.name) { return true; }
    // We can double back one small room twice, and other rooms once
    let hasDoubleSmall = false;
    const seenSmall: string[] = [];
    for (const nextSmall of path) {
      // Skip large rooms
      if (nextSmall.name.toLowerCase() !== nextSmall.name) { continue; }
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
  const paths = pathWalker.findPaths(pathWalker.rooms.start, pathWalker.rooms.end);
  return paths.length;
};

export const part2 = (rawInput: string) => {
  const pathWalker = new PathWalkerPart2(parseInput(rawInput));
  const paths = pathWalker.findPaths(pathWalker.rooms.start, pathWalker.rooms.end);
  return paths.length;
};
