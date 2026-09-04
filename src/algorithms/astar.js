import { MinHeap } from '../data-structures/MinHeap.js';

export function euclideanHeuristic(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function astar(
  graph,
  sourceId,
  targetId,
  heuristic = euclideanHeuristic
) {
  const startTime = performance.now();

  const allEdges = graph.getAllEdges();
  const hasNegative = allEdges.some((e) => e.entry.weight < 0);
  if (hasNegative) {
    return {
      path: [],
      cost: Infinity,
      executionTimeMs: performance.now() - startTime,
      nodesVisited: 0,
      edgesRelaxed: 0,
      algorithm: "astar",
      found: false,
      error: "A* cannot handle negative edge weights. Use Bellman-Ford instead.",
    };
  }

  const targetNode = graph.getNode(targetId);

  const h = (nodeId) => {
    if (!targetNode) return 0;
    const node = graph.getNode(nodeId);
    if (!node) return 0;
    return heuristic(node, targetNode);
  };

  const nodeIds = graph.getAllNodeIds();
  const INF = Infinity;

  const g = new Map(nodeIds.map((id) => [id, INF]));
  const prev = new Map(nodeIds.map((id) => [id, null]));
  const closed = new Set();

  let nodesVisited = 0;
  let edgesRelaxed = 0;

  g.set(sourceId, 0);
  const heap = new MinHeap();
  heap.insert(h(sourceId), sourceId);

  while (!heap.isEmpty()) {
    const extracted = heap.extractMin();
    const u = extracted.value;

    if (closed.has(u)) continue;
    closed.add(u);
    nodesVisited++;

    if (u === targetId) break;

    for (const { to: v, weight } of graph.getNeighbors(u)) {
      if (closed.has(v)) continue;

      edgesRelaxed++;

      const tentativeG = (g.get(u) ?? INF) + weight;

      if (tentativeG < (g.get(v) ?? INF)) {
        g.set(v, tentativeG);
        prev.set(v, u);

        const fScore = tentativeG + h(v);

        if (!heap.decreaseKey(v, fScore)) {
          heap.insert(fScore, v);
        }
      }
    }
  }

  const executionTimeMs = performance.now() - startTime;
  const finalCost = g.get(targetId) ?? INF;

  if (finalCost === INF) {
    return {
      path: [],
      cost: INF,
      executionTimeMs,
      nodesVisited,
      edgesRelaxed,
      algorithm: "astar",
      found: false,
    };
  }

  const path = [];
  let current = targetId;
  while (current !== null && current !== undefined) {
    path.unshift(current);
    current = prev.get(current);
  }

  return {
    path,
    cost: finalCost,
    executionTimeMs,
    nodesVisited,
    edgesRelaxed,
    algorithm: "astar",
    found: true,
  };
}
