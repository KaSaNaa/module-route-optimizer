import { MinHeap } from '../data-structures/MinHeap.js';

export function dijkstra(graph, sourceId, targetId) {
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
      algorithm: "dijkstra",
      found: false,
      error: "Dijkstra cannot handle negative edge weights. Use Bellman-Ford instead.",
    };
  }

  const nodeIds = graph.getAllNodeIds();
  const INF = Infinity;

  const dist = new Map(nodeIds.map((id) => [id, INF]));
  const prev = new Map(nodeIds.map((id) => [id, null]));
  const visited = new Set();

  let nodesVisited = 0;
  let edgesRelaxed = 0;

  dist.set(sourceId, 0);
  const heap = new MinHeap();
  heap.insert(0, sourceId);

  while (!heap.isEmpty()) {
    const extracted = heap.extractMin();
    const u = extracted.value;
    const du = extracted.key;

    if (du > (dist.get(u) ?? INF)) continue;

    if (visited.has(u)) continue;
    visited.add(u);
    nodesVisited++;

    if (u === targetId) break;

    for (const { to: v, weight } of graph.getNeighbors(u)) {
      if (visited.has(v)) continue;

      edgesRelaxed++;

      const newDist = (dist.get(u) ?? INF) + weight;

      if (newDist < (dist.get(v) ?? INF)) {
        dist.set(v, newDist);
        prev.set(v, u);

        if (!heap.decreaseKey(v, newDist)) {
          heap.insert(newDist, v);
        }
      }
    }
  }

  const executionTimeMs = performance.now() - startTime;

  const finalCost = dist.get(targetId) ?? INF;

  if (finalCost === INF) {
    return {
      path: [],
      cost: INF,
      executionTimeMs,
      nodesVisited,
      edgesRelaxed,
      algorithm: "dijkstra",
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
    algorithm: "dijkstra",
    found: true,
  };
}
