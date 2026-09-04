export function bellmanFord(graph, sourceId, targetId) {
  const startTime = performance.now();

  const nodeIds = graph.getAllNodeIds();
  const V = nodeIds.length;
  const INF = Infinity;

  const dist = new Map(nodeIds.map((id) => [id, INF]));
  const prev = new Map(nodeIds.map((id) => [id, null]));

  dist.set(sourceId, 0);

  const allEdges = graph.getAllEdges();

  let edgesRelaxed = 0;
  let nodesVisited = 0;
  const improved = new Set();

  for (let pass = 0; pass < V - 1; pass++) {
    let anyUpdate = false;

    for (const { src, entry: { to, weight } } of allEdges) {
      const distSrc = dist.get(src) ?? INF;

      if (distSrc === INF) continue;

      edgesRelaxed++;

      const newDist = distSrc + weight;

      if (newDist < (dist.get(to) ?? INF)) {
        dist.set(to, newDist);
        prev.set(to, src);
        anyUpdate = true;

        if (!improved.has(to)) {
          improved.add(to);
          nodesVisited++;
        }
      }
    }

    if (!anyUpdate) break;
  }

  let hasNegativeCycle = false;

  for (const { src, entry: { to, weight } } of allEdges) {
    const distSrc = dist.get(src) ?? INF;
    if (distSrc === INF) continue;

    if (distSrc + weight < (dist.get(to) ?? INF)) {
      hasNegativeCycle = true;
      break;
    }
  }

  const executionTimeMs = performance.now() - startTime;

  if (hasNegativeCycle) {
    return {
      path: [],
      cost: -Infinity,
      executionTimeMs,
      nodesVisited,
      edgesRelaxed,
      algorithm: "bellman-ford",
      found: false,
      error: "Negative cycle detected — shortest path is undefined.",
    };
  }

  const finalCost = dist.get(targetId) ?? INF;

  if (finalCost === INF) {
    return {
      path: [],
      cost: INF,
      executionTimeMs,
      nodesVisited,
      edgesRelaxed,
      algorithm: "bellman-ford",
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
    algorithm: "bellman-ford",
    found: true,
  };
}
