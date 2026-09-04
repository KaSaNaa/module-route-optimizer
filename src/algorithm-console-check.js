import test from 'node:test';
import assert from 'node:assert/strict';

import { networks } from './data/networks.js';
import { GraphDS } from './data-structures/Graph.js';
import { MinHeap } from './data-structures/MinHeap.js';

import { dijkstra } from './algorithms/dijkstra.js';
import { astar } from './algorithms/astar.js';
import { bellmanFord } from './algorithms/bellmanFord.js';


/*
 * Graph / Network Tests
 */

test('Small network has 10 nodes and 15 edges', () => {
  const network = networks[0];

  assert.equal(network.nodes.length, 10);
  assert.equal(network.edges.length, 15);
});

test('Medium network has 50 nodes', () => {
  const network = networks[1];

  assert.equal(network.nodes.length, 50);
});

test('Large network has 200 nodes and 500 edges', () => {
  const network = networks[2];

  assert.equal(network.nodes.length, 200);
  assert.equal(network.edges.length, 500);
});


/*
 * Graph Data Structure Tests
 */

test('GraphDS creates a graph from network data', () => {
  const graph = GraphDS.fromPayload(networks[0]);

  assert.equal(graph.nodeCount, 10);
  assert.ok(graph.hasNode(1));
  assert.ok(graph.hasNode(10));
  assert.ok(graph.edgeCount >= 15);
});

test('GraphDS returns neighbors for a node', () => {
  const graph = GraphDS.fromPayload(networks[0]);

  const neighbors = graph.getNeighbors(1);

  assert.ok(Array.isArray(neighbors));
  assert.ok(neighbors.length > 0);
});


/*
 * MinHeap Tests
 */

test('MinHeap extracts values in priority order', () => {
  const heap = new MinHeap();

  heap.insert(5, 'five');
  heap.insert(2, 'two');
  heap.insert(8, 'eight');
  heap.insert(1, 'one');

  assert.equal(heap.extractMin().value, 'one');
  assert.equal(heap.extractMin().value, 'two');
  assert.equal(heap.extractMin().value, 'five');
  assert.equal(heap.extractMin().value, 'eight');

  assert.equal(heap.isEmpty(), true);
});


/*
 * Dijkstra Tests
 */

test('Dijkstra rejects graphs containing negative edge weights', () => {
  const graph = GraphDS.fromPayload(networks[0]);

  const result = dijkstra(graph, 1, 10);

  assert.equal(result.found, false);
  assert.equal(result.algorithm, 'dijkstra');
  assert.match(result.error, /negative edge weights/i);
});

test('Dijkstra finds a route on a positive-weight graph', () => {
  const graph = GraphDS.fromPayload(networks[1]);

  const result = dijkstra(graph, 1, 50);

  assert.equal(result.algorithm, 'dijkstra');
  assert.equal(result.found, true);
  assert.ok(Number.isFinite(result.cost));
  assert.ok(Array.isArray(result.path));
  assert.ok(result.path.length >= 2);

  assert.equal(result.path[0], 1);
  assert.equal(result.path[result.path.length - 1], 50);
});


/*
 * A* Tests
 */

test('A* rejects graphs containing negative edge weights', () => {
  const graph = GraphDS.fromPayload(networks[0]);

  const result = astar(graph, 1, 10);

  assert.equal(result.found, false);
  assert.equal(result.algorithm, 'astar');
  assert.match(result.error, /negative edge weights/i);
});

test('A* finds a route on a positive-weight graph', () => {
  const graph = GraphDS.fromPayload(networks[1]);

  const result = astar(graph, 1, 50);

  assert.equal(result.algorithm, 'astar');
  assert.equal(result.found, true);
  assert.ok(Number.isFinite(result.cost));
  assert.ok(Array.isArray(result.path));
  assert.ok(result.path.length >= 2);

  assert.equal(result.path[0], 1);
  assert.equal(result.path[result.path.length - 1], 50);
});

test('Dijkstra and A* return the same shortest-path cost', () => {
  const graph = GraphDS.fromPayload(networks[1]);

  const dijkstraResult = dijkstra(graph, 1, 50);
  const astarResult = astar(graph, 1, 50);

  assert.equal(dijkstraResult.found, true);
  assert.equal(astarResult.found, true);

  assert.equal(astarResult.cost, dijkstraResult.cost);
});


/*
 * Bellman-Ford Tests
 */

test('Bellman-Ford handles the negative-edge network', () => {
  const graph = GraphDS.fromPayload(networks[0]);

  const result = bellmanFord(graph, 1, 10);

  assert.equal(result.algorithm, 'bellman-ford');
  assert.equal(result.found, true);
  assert.ok(Number.isFinite(result.cost));
  assert.ok(Array.isArray(result.path));
  assert.ok(result.path.length >= 2);

  assert.equal(result.path[0], 1);
  assert.equal(result.path[result.path.length - 1], 10);
});

test('Bellman-Ford works on the positive-weight network', () => {
  const graph = GraphDS.fromPayload(networks[1]);

  const result = bellmanFord(graph, 1, 50);

  assert.equal(result.algorithm, 'bellman-ford');
  assert.equal(result.found, true);
  assert.ok(Number.isFinite(result.cost));
  assert.ok(Array.isArray(result.path));

  assert.equal(result.path[0], 1);
  assert.equal(result.path[result.path.length - 1], 50);
});


/*
 * Edge Cases
 */

test('Algorithms report no route when target is unreachable', () => {
  const payload = {
    nodes: [
      { id: 1, name: 'A', x: 0, y: 0 },
      { id: 2, name: 'B', x: 100, y: 0 }
    ],
    edges: []
  };

  const graph = GraphDS.fromPayload(payload);

  const dijkstraResult = dijkstra(graph, 1, 2);
  const astarResult = astar(graph, 1, 2);
  const bellmanResult = bellmanFord(graph, 1, 2);

  assert.equal(dijkstraResult.found, false);
  assert.equal(astarResult.found, false);
  assert.equal(bellmanResult.found, false);
});

test('Bellman-Ford detects a reachable negative cycle', () => {
  const payload = {
    nodes: [
      { id: 1, name: 'A', x: 0, y: 0 },
      { id: 2, name: 'B', x: 1, y: 0 },
      { id: 3, name: 'C', x: 2, y: 0 }
    ],
    edges: [
      {
        id: 1,
        sourceNodeId: 1,
        targetNodeId: 2,
        weight: 1,
        directed: true
      },
      {
        id: 2,
        sourceNodeId: 2,
        targetNodeId: 3,
        weight: -3,
        directed: true
      },
      {
        id: 3,
        sourceNodeId: 3,
        targetNodeId: 2,
        weight: 1,
        directed: true
      }
    ]
  };

  const graph = GraphDS.fromPayload(payload);

  const result = bellmanFord(graph, 1, 3);

  assert.equal(result.found, false);
  assert.equal(result.cost, -Infinity);
  assert.match(result.error, /negative cycle/i);
});

