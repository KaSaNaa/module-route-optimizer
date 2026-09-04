// src/data/networks.js

// ─── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
// Gives us reproducible "random" numbers for layout and edge generation.
function makePRNG(seed) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randFloat(rng, min, max) {
  return parseFloat((min + rng() * (max - min)).toFixed(2));
}

function randInt(rng, min, max) {
  return Math.floor(min + rng() * (max - min + 1));
}

// ─────────────────────────────────────────────────────────────────────────────
//  NETWORK 1: Small Hand-Crafted City (10 nodes, 15 edges, undirected)
// ─────────────────────────────────────────────────────────────────────────────
function generateSmallNetwork() {
  const nodes = [
    { id: 1, name: "A", x: 100, y: 300 },
    { id: 2, name: "B", x: 250, y: 150 },
    { id: 3, name: "C", x: 250, y: 450 },
    { id: 4, name: "D", x: 450, y: 80 },
    { id: 5, name: "E", x: 450, y: 300 },
    { id: 6, name: "F", x: 450, y: 520 },
    { id: 7, name: "G", x: 650, y: 150 },
    { id: 8, name: "H", x: 650, y: 400 },
    { id: 9, name: "I", x: 800, y: 280 },
    { id: 10, name: "J", x: 800, y: 500 },
  ];

  let edgeIdCounter = 1;
  const rawEdges = [
    [0, 1, 4, false],   // A–B
    [0, 2, 6, false],   // A–C
    [1, 3, 5, false],   // B–D
    [1, 4, 3, false],   // B–E
    [2, 4, 7, false],   // C–E
    [2, 5, 2, false],   // C–F
    [3, 6, 4, false],   // D–G
    [4, 6, 6, false],   // E–G
    [4, 7, 8, false],   // E–H
    [4, 5, -3, true],   // E→F (negative, directed)
    [5, 7, 5, false],   // F–H
    [5, 9, 9, false],   // F–J
    [6, 8, 3, false],   // G–I
    [7, 8, 2, false],   // H–I
    [7, 9, 4, false],   // H–J
  ];

  const edges = rawEdges.map(([si, ti, w, dir]) => ({
    id: edgeIdCounter++,
    sourceNodeId: nodes[si].id,
    targetNodeId: nodes[ti].id,
    weight: w,
    directed: dir,
  }));

  return {
    id: 1,
    name: "Small City Network",
    description:
      "A hand-crafted 10-node city map. Undirected edges. " +
      "Includes one negative-weight edge (E→F) to demonstrate Bellman-Ford. " +
      "Ideal for tracing algorithm steps manually.",
    nodes,
    edges,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  NETWORK 2: Medium Road Network (50 nodes, ~110 edges, directed)
// ─────────────────────────────────────────────────────────────────────────────
function generateMediumNetwork() {
  const rng = makePRNG(42);
  const COLS = 10;
  const ROWS = 5;
  const TOTAL = COLS * ROWS;

  const nodes = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const baseX = 60 + c * 110;
      const baseY = 60 + r * 130;
      nodes.push({
        id: r * COLS + c + 1,
        name: `N${r * COLS + c + 1}`,
        x: parseFloat((baseX + (rng() - 0.5) * 40).toFixed(1)),
        y: parseFloat((baseY + (rng() - 0.5) * 40).toFixed(1)),
      });
    }
  }

  const edgePairs = new Set();
  const edges = [];
  let edgeIdCounter = 1;

  const addEdge = (si, ti) => {
    const key = `${si}-${ti}`;
    if (si === ti || edgePairs.has(key)) return;
    edgePairs.add(key);
    edges.push({
      id: edgeIdCounter++,
      sourceNodeId: nodes[si].id,
      targetNodeId: nodes[ti].id,
      weight: randFloat(rng, 1, 20),
      directed: true,
    });
  };

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      if (c < COLS - 1) addEdge(idx, idx + 1);
      if (r < ROWS - 1) addEdge(idx, idx + COLS);
      if (c < COLS - 1 && rng() > 0.4) addEdge(idx + 1, idx);
      if (r < ROWS - 1 && rng() > 0.4) addEdge(idx + COLS, idx);
    }
  }

  for (let i = 0; i < 15; i++) {
    addEdge(randInt(rng, 0, TOTAL - 1), randInt(rng, 0, TOTAL - 1));
  }

  return {
    id: 2,
    name: "Medium Road Network",
    description:
      "A 50-node directed road network. Nodes are placed on a 5×10 grid " +
      "with small positional jitter. Edge weights represent travel time (minutes). " +
      "Suitable for comparing Dijkstra vs A* performance.",
    nodes,
    edges,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  NETWORK 3: Large Sparse Network (200 nodes, ~500 edges, undirected)
// ─────────────────────────────────────────────────────────────────────────────
function generateLargeNetwork() {
  const rng = makePRNG(99);
  const N = 200;

  const nodes = [];
  for (let i = 0; i < N; i++) {
    nodes.push({
      id: i + 1,
      name: `V${i + 1}`,
      x: parseFloat((20 + rng() * 1160).toFixed(1)),
      y: parseFloat((20 + rng() * 760).toFixed(1)),
    });
  }

  const edgePairs = new Set();
  const edges = [];
  let edgeIdCounter = 1;

  const addEdge = (si, ti) => {
    if (si === ti) return;
    const key = si < ti ? `${si}-${ti}` : `${ti}-${si}`;
    if (edgePairs.has(key)) return;
    edgePairs.add(key);
    edges.push({
      id: edgeIdCounter++,
      sourceNodeId: nodes[si].id,
      targetNodeId: nodes[ti].id,
      weight: randFloat(rng, 1, 50),
      directed: false,
    });
  };

  const shuffled = Array.from({ length: N }, (_, i) => i).sort(
    () => rng() - 0.5
  );
  for (let i = 1; i < N; i++) {
    const parent = shuffled[randInt(rng, 0, i - 1)];
    addEdge(shuffled[i], parent);
  }

  let attempts = 0;
  while (edges.length < 500 && attempts < 5000) {
    addEdge(randInt(rng, 0, N - 1), randInt(rng, 0, N - 1));
    attempts++;
  }

  return {
    id: 3,
    name: "Large Sparse Network",
    description:
      "A 200-node sparse undirected network for scalability benchmarking. " +
      "Nodes are randomly placed on a 1200×800 canvas. " +
      "Each node has 2–4 edges on average. Connectivity guaranteed via a spanning tree.",
    nodes,
    edges,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Export all static networks
// ─────────────────────────────────────────────────────────────────────────────
export const networks = [
  generateSmallNetwork(),
  generateMediumNetwork(),
  generateLargeNetwork(),
];
