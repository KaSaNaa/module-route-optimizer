export class GraphDS {
  constructor() {
    this.nodes = new Map();
    this.adjList = new Map();
  }

  addNode(node) {
    this.nodes.set(node.id, node);
    if (!this.adjList.has(node.id)) {
      this.adjList.set(node.id, []);
    }
  }

  addEdge(edge) {
    const { sourceNodeId: src, targetNodeId: tgt, weight, id: edgeId, directed } = edge;

    if (!this.adjList.has(src)) this.adjList.set(src, []);
    if (!this.adjList.has(tgt)) this.adjList.set(tgt, []);

    this.adjList.get(src).push({ to: tgt, weight, edgeId });

    if (!directed) {
      this.adjList.get(tgt).push({ to: src, weight, edgeId });
    }
  }

  removeNode(nodeId) {
    this.nodes.delete(nodeId);
    this.adjList.delete(nodeId);

    for (const [, entries] of this.adjList) {
      const filtered = entries.filter((e) => e.to !== nodeId);
      entries.length = 0;
      entries.push(...filtered);
    }
  }

  removeEdge(edgeId) {
    for (const [, entries] of this.adjList) {
      const idx = entries.findIndex((e) => e.edgeId === edgeId);
      if (idx !== -1) entries.splice(idx, 1);
    }
  }

  getNeighbors(nodeId) {
    return this.adjList.get(nodeId) ?? [];
  }

  getNode(nodeId) {
    return this.nodes.get(nodeId);
  }

  getAllNodeIds() {
    return Array.from(this.nodes.keys());
  }

  getAllEdges() {
    const result = [];
    for (const [src, entries] of this.adjList) {
      for (const entry of entries) {
        result.push({ src, entry });
      }
    }
    return result;
  }

  hasNode(nodeId) {
    return this.nodes.has(nodeId);
  }

  get nodeCount() {
    return this.nodes.size;
  }

  get edgeCount() {
    let count = 0;
    for (const [, entries] of this.adjList) count += entries.length;
    return count;
  }

  static fromPayload(payload) {
    const g = new GraphDS();
    for (const node of payload.nodes) g.addNode(node);
    for (const edge of payload.edges) g.addEdge(edge);
    return g;
  }
}
