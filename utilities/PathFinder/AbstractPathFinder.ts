export interface PathNode {
  name: string;
  edges: this[];
}

export class Path<TNode extends PathNode = PathNode> {
  public nodes: Readonly<TNode[]>;

  constructor(nodes: TNode[]) {
    this.nodes = nodes;
  }

  public get lastNode(): TNode {
    return this.nodes[this.nodes.length - 1];
  }

  public branch(node: TNode): Path<TNode> {
    return new Path<TNode>(this.nodes.concat(node));
  }
}

export default abstract class AbstractPathFinder<
  TNode extends PathNode = PathNode,
  TPath extends Path<TNode> = Path<TNode>,
> {
  constructor(public nodes: Map<string, TNode>) {}

  abstract isValidStep(path: Path<TNode>, nextNode: TNode): boolean;

  abstract recordCompletePath(path: TNode[]): void;

  run(start: TPath, end: TNode): void {
    const queue: Path<TNode>[] = [start];
    let nextPath: Path<TNode>;
    let circuitBreaker = 0;
    // We use `pop` so that we're always taking the last/longest path and
    // keeping the queue as short as possible
    while (circuitBreaker < 500000 && (nextPath = queue.pop())) {
      circuitBreaker += 1;
      const currentNode = nextPath.lastNode;
      for (let i = 0; i < currentNode.edges.length; i += 1) {
        const next = currentNode.edges[i];
        if (next === end) {
          this.recordCompletePath(nextPath.nodes.concat(next));
        } else if (this.isValidStep(nextPath, next)) {
          queue.push(nextPath.branch(next));
        }
      }
    }
  }

  debugRooms() {
    const lines: string[] = [];
    for (const [name, value] of this.nodes) {
      lines.push(`${name} -> ${value.edges.map((v) => v.name)}`);
    }
    return lines.join('\n');
  }

  printRooms() {
    console.log(this.debugRooms());
  }
}
