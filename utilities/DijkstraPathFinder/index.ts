import { BucketQueue } from '../PriorityQueues';

export interface CostNode {
  cost: number | ((source: this | null) => number);
  edges: this[];
}

interface PathNode<T extends CostNode> {
  tentativeCost: number;
  source: this | undefined;
  visited: boolean;
  value: T;
}

export default class DijkstraPathFinder<T extends CostNode = CostNode> {
  protected nodes: Map<T, PathNode<T>> = new Map();

  public circuitBreaker: false | number = false;

  constructor(nodes: T[]) {
    for (let i = 0; i < nodes.length; i += 1) {
      this.addEdgeNode(nodes[i]);
    }
  }

  private addEdgeNode(node: T): void {
    this.nodes.set(node, {
      tentativeCost: Number.POSITIVE_INFINITY,
      source: undefined,
      visited: false,
      value: node,
    });
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
    const startNode = this.nodes.get(start)!;
    const endNode = this.nodes.get(end)!;

    startNode.tentativeCost = (typeof startNode.value.cost === 'number')
      ? startNode.value.cost
      : startNode.value.cost(null);

    let currNode: PathNode<T> | null;
    const queue = new BucketQueue<PathNode<T>>();
    queue.insert(startNode, startNode.tentativeCost);

    let circuitBreaker = 0;

    while (currNode = queue.pull()) {
      for (let i = 0; i < currNode.value.edges.length; i += 1) {
        const edge = currNode.value.edges[i];
        if (!this.nodes.has(edge)) { this.addEdgeNode(edge); }
        const edgeNode = this.nodes.get(edge)!;
        const edgeCost = (typeof edge.cost === 'number') ? edge.cost : edge.cost(currNode.value);
        const valueThroughNode = currNode.tentativeCost + edgeCost;
        if (edgeNode.tentativeCost > valueThroughNode) {
          queue.remove(edgeNode, edgeNode.tentativeCost);
          edgeNode.tentativeCost = valueThroughNode;
          edgeNode.source = currNode;
          if (valueThroughNode <= endNode.tentativeCost) {
            queue.insert(edgeNode, edgeNode.tentativeCost);
          }
        }
        if (edge === end) {
          currNode.visited = true;
          break;
        }
      }
      currNode.visited = true;
      if (this.circuitBreaker) {
        circuitBreaker += 1;
        if (circuitBreaker > this.circuitBreaker) { throw new Error('Circuit breaker tripped'); }
      }
    }

    // Calculate the path in reverse
    const path: CostNode[] = [end];
    currNode = endNode;
    while (currNode.source && currNode !== startNode) {
      path.push(currNode.source.value);
      currNode = currNode.source;
    }

    return {
      path: path.reverse(),
      cost: endNode.tentativeCost - startNode.tentativeCost,
    };
  }
}
