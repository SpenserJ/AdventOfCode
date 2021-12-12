export interface PathNode {
  name: string;
  connections: this[];
}

export default abstract class AbstractPathFinder<TNode extends PathNode = PathNode> {
  constructor(public nodes: Map<string, TNode>) {}

  findPaths(start: TNode, end: TNode): TNode[][];
  findPaths(currentPath: TNode[], end: TNode): TNode[][];
  findPaths(startOrPath: TNode | TNode[], end: TNode): TNode[][] {
    const path = Array.isArray(startOrPath) ? startOrPath : [startOrPath];
    const currentRoom = path[path.length - 1];
    const result: TNode[][] = [];
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

  abstract isValidStep(path: TNode[], nextRoom: TNode): boolean;

  debugRooms() {
    const lines: string[] = [];
    for (const [name, value] of this.nodes) {
      lines.push(`${name} -> ${value.connections.map((v) => v.name)}`);
    }
    return lines.join('\n');
  }

  printRooms() {
    console.log(this.debugRooms());
  }
}
