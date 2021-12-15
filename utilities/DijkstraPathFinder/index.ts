export interface CostNode {
  cost: number;
  edges: this[];
}

interface PathNode<T extends CostNode> {
  tentativeCost: number;
  source: this;
  visited: boolean;
  value: T;
}

export default class DijkstraPathFinder<T extends CostNode = CostNode> {
  protected nodes: Map<T, PathNode<T>> = new Map();

  constructor(nodes: T[]) {
    for (let i = 0; i < nodes.length; i += 1) {
      this.nodes.set(nodes[i], {
        tentativeCost: Number.POSITIVE_INFINITY,
        source: undefined,
        visited: false,
        value: nodes[i],
      });
    }
  }

  pickNextNode(queue: PathNode<T>[]): PathNode<T> {
    // This will default to picking the lowest cost option, which will do a
    // breadth-first search
    let minCost = Number.POSITIVE_INFINITY;
    let minIndex = -1;
    for (let i = 0; i < queue.length; i += 1) {
      const next = queue[i];
      if (next.tentativeCost < minCost) {
        minCost = next.tentativeCost;
        minIndex = i;
      }
    }
    return queue.splice(minIndex, 1)[0];
  }

  run(start: T, end: T) {
    const startNode = this.nodes.get(start);
    const endNode = this.nodes.get(end);

    let currNode: PathNode<T>;
    const queue: PathNode<T>[] = [startNode];

    startNode.tentativeCost = startNode.value.cost;

    while (currNode = this.pickNextNode(queue)) {
      for (let i = 0; i < currNode.value.edges.length; i += 1) {
        const edge = currNode.value.edges[i];
        const edgeNode = this.nodes.get(edge);
        const valueThroughNode = currNode.tentativeCost + edge.cost;
        if (edgeNode.tentativeCost > valueThroughNode) {
          edgeNode.tentativeCost = valueThroughNode;
          edgeNode.source = currNode;
          if (valueThroughNode <= endNode.tentativeCost) {
            queue.push(edgeNode);
          }
        }
        if (edge === end) {
          currNode.visited = true;
          break;
        }
      }
      currNode.visited = true;
    }

    // Calculate the path in reverse
    const path: CostNode[] = [end];
    currNode = endNode;
    while (currNode !== startNode) {
      path.push(currNode.source.value);
      currNode = currNode.source;
    }

    return {
      path: path.reverse(),
      cost: endNode.tentativeCost - startNode.tentativeCost,
    };
  }
}
