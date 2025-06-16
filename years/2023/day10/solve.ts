import BaseDay from '@spenserj-aoc/utilities/BaseDay';

interface Node {
  i: number;
  value: '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';
  neighbors: number[];
  visitedTimes: number;
}

export default class Day10 extends BaseDay<{
  map: string;
  width: number;
  startNode: Node;
  nodes: Map<number, Node>;
}, null> {
  getNode(i: number): Node {
    if (!this.state.nodes.has(i)) {
      this.state.nodes.set(i, {
        i,
        value: this.state.map[i] as any,
        neighbors: [],
        visitedTimes: 0,
      });
    }
    return this.state.nodes.get(i);
  }

  getNeighbors(i: number): number[] {
    const value = this.state.map[i];
    let neighbors: number[];
    switch (value) {
      case 'S':
        neighbors = [
          i - 1,
          i + 1,
          i - this.state.width,
          i + this.state.width,
        ];
        break;
      case '|':
        neighbors = [
          i - this.state.width,
          i + this.state.width,
        ];
        break;
      case '-':
        neighbors = [
          i - 1,
          i + 1,
        ];
        break;
      case 'L':
        neighbors = [
          i + 1,
          i - this.state.width,
        ];
        break;
      case 'J':
        neighbors = [
          i - 1,
          i - this.state.width,
        ];
        break;
      case 'F':
        neighbors = [
          i + 1,
          i + this.state.width,
        ];
        break;
      case '7':
        neighbors = [
          i - 1,
          i + this.state.width,
        ];
        break;
      default:
        neighbors = [];
    }
    if (value === 'S') {
      neighbors = neighbors.filter((n) => this.getNeighbors(n).includes(i));
    }
    return neighbors;
  }

  parseInput(rawInput: string) {
    const startIndex = rawInput.indexOf('S');
    const lineLength = rawInput.indexOf('\n');
    this.state = {
      map: rawInput,
      width: lineLength + 1,
      startNode: null,
      nodes: new Map(),
    };
    this.state.startNode = this.getNode(startIndex);
    this.state.nodes.set(startIndex, this.state.startNode);
    const pendingNodes: Node[] = [];
    let node = this.state.startNode;
    while (node) {
      if (node.visitedTimes > 0) {
        break;
      }
      node.visitedTimes += 1;
      node.neighbors = this.getNeighbors(node.i);
      pendingNodes.push(
        ...node.neighbors
          .map((i) => this.getNode(i))
          .filter((n) => n.visitedTimes === 0),
      );

      node = pendingNodes.pop();
    }
    return this.state;
  }

  step() {}

  part1() {
    return this.state.nodes.size / 2;
  }

  part2() {
    // This is just a point in polygon problem, where we need to check if each point has an odd
    // number of edges to the left of it. It gets a little more complicated because we have to
    // handle corners like LJ which is like a || since it doubles back, or L7 which is like a |
    // since it continues in the same direction
    const totalInRow: number[] = new Array(this.state.width).fill(0);
    for (let y = 0; y < this.state.width; y += 1) {
      let inside = false;
      for (let x = 0; x < this.state.width; x += 1) {
        const index = (y * this.state.width) + x;
        const char = this.state.map[index];
        // If we saw a node while calculating the path, it must be an edge of our polygon
        if (this.state.nodes.has(index)) {
          // Since we're only looking at a single line of text at a time, we only need to check
          // for half of the corner types to get the same result. If we see an L, then it has to be
          // accompanied by either a J or a 7, and a 7 means we're still inside the polygon, while
          // a J would mean we're outside again.
          // Example:
          // L7 - Down, Right, Down - We only cross over the path once
          // LJ - Down, Right, Up - Doubles back on itself, so we cross the path twice
          if (char === '|' || char === 'L' || char === 'J') {
            inside = !inside;
          }
        } else if (inside) {
          totalInRow[y] += 1;
        }
      }
    }

    return totalInRow.reduce((a, b) => a + b, 0);
  }
}
