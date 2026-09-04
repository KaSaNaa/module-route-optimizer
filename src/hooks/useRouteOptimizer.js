import { useState, useCallback } from 'react';
import { networks } from '../data/networks.js';
import { GraphDS } from '../data-structures/Graph.js';
import { dijkstra } from '../algorithms/dijkstra.js';
import { astar } from '../algorithms/astar.js';
import { bellmanFord } from '../algorithms/bellmanFord.js';

const ALGO_MAP = {
  'dijkstra': dijkstra,
  'astar': astar,
  'bellman-ford': bellmanFord,
};

export function useRouteOptimizer() {
  const [graphs, setGraphs] = useState([]);
  const [selectedGraphId, setSelectedGraphId] = useState(null);
  const [currentGraph, setCurrentGraph] = useState(null);
  const [sourceNodeId, setSourceNodeId] = useState(null);
  const [targetNodeId, setTargetNodeId] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra');
  const [singleResult, setSingleResult] = useState(null);
  const [compareResults, setCompareResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadGraphs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 200));
      const summary = networks.map(n => ({
        id: n.id,
        name: n.name,
        description: n.description,
        nodeCount: n.nodes.length,
        edgeCount: n.edges.length,
      }));
      setGraphs(summary);
    } catch {
      setError('Failed to load graphs.');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectGraph = useCallback(async (graphId) => {
    setLoading(true);
    setError(null);
    setSourceNodeId(null);
    setTargetNodeId(null);
    setSingleResult(null);
    setCompareResults([]);
    try {
      await new Promise(r => setTimeout(r, 200));
      const g = networks.find(n => n.id === graphId);
      setCurrentGraph(g);
      setSelectedGraphId(graphId);
    } catch {
      setError('Failed to load graph.');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectNode = useCallback((nodeId) => {
    if (sourceNodeId === null) {
      setSourceNodeId(nodeId);
    } else if (targetNodeId === null && nodeId !== sourceNodeId) {
      setTargetNodeId(nodeId);
    } else {
      setSourceNodeId(nodeId);
      setTargetNodeId(null);
      setSingleResult(null);
      setCompareResults([]);
    }
  }, [sourceNodeId, targetNodeId]);

  const setAlgorithm = useCallback((algo) => {
    setSelectedAlgorithm(algo);
    setSingleResult(null);
  }, []);

  const findRoute = useCallback(async () => {
    if (!selectedGraphId || sourceNodeId === null || targetNodeId === null) {
      setError('Please select a graph, source, and target node first.');
      return;
    }
    setLoading(true);
    setError(null);
    setCompareResults([]);
    try {
      await new Promise(r => setTimeout(r, 100)); // allow UI to paint loading state
      const graphDS = GraphDS.fromPayload(currentGraph);
      const algoFn = ALGO_MAP[selectedAlgorithm];
      const result = algoFn(graphDS, sourceNodeId, targetNodeId);
      if (result.error) {
        setError(result.error);
        setSingleResult(result);
      } else {
        setSingleResult(result);
      }
    } catch (err) {
      setError('Failed to compute route.');
    } finally {
      setLoading(false);
    }
  }, [selectedGraphId, sourceNodeId, targetNodeId, selectedAlgorithm, currentGraph]);

  const compareAll = useCallback(async () => {
    if (!selectedGraphId || sourceNodeId === null || targetNodeId === null) {
      setError('Please select a graph, source, and target node first.');
      return;
    }
    setLoading(true);
    setError(null);
    setSingleResult(null);
    try {
      await new Promise(r => setTimeout(r, 100));
      const graphDS = GraphDS.fromPayload(currentGraph);
      const results = Object.keys(ALGO_MAP).map(algoKey => {
         const fn = ALGO_MAP[algoKey];
         const res = fn(graphDS, sourceNodeId, targetNodeId);
         res.algorithm = algoKey; // Ensure algorithm key matches
         return res;
      });
      setCompareResults(results);
    } catch {
      setError('Failed to compare routes.');
    } finally {
      setLoading(false);
    }
  }, [selectedGraphId, sourceNodeId, targetNodeId, currentGraph]);

  const resetSelection = useCallback(() => {
    setSourceNodeId(null);
    setTargetNodeId(null);
    setSingleResult(null);
    setCompareResults([]);
  }, []);

  return {
    graphs,
    selectedGraphId,
    currentGraph,
    sourceNodeId,
    targetNodeId,
    selectedAlgorithm,
    singleResult,
    compareResults,
    loading,
    error,
    loadGraphs,
    selectGraph,
    selectNode,
    setAlgorithm,
    findRoute,
    compareAll,
    resetSelection,
  };
}
