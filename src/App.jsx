import React, { useEffect } from 'react';
import './styles/index.css';
import './styles/idss-theme.css';

import { useRouteOptimizer } from './hooks/useRouteOptimizer.js';
import { ControlPanel } from './components/ControlPanel.jsx';
import { GraphCanvas } from './components/GraphCanvas.jsx';
import { ResultsPanel } from './components/ResultsPanel.jsx';
import { ComparisonTable } from './components/ComparisonTable.jsx';

function App() {
  const {
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
  } = useRouteOptimizer();

  // Load the available networks when the application starts.
  useEffect(() => {
    loadGraphs();
  }, [loadGraphs]);

  const currentNodes = currentGraph?.nodes ?? [];
  const currentEdges = currentGraph?.edges ?? [];

  // Get the edge IDs belonging to the calculated path.
  const pathNodeIds = singleResult?.path ?? [];

  const pathEdgeIds = getPathEdgeIds(
    currentEdges,
    pathNodeIds
  );

  return (
    <div style={appStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Route Optimization</h1>
          <p style={subtitleStyle}>
            Compare shortest-path algorithms on transportation networks
          </p>
        </div>

        {currentGraph && (
          <div style={networkInfoStyle}>
            <strong>{currentGraph.name}</strong>
            <span>
              {currentNodes.length} nodes · {currentEdges.length} edges
            </span>
          </div>
        )}
      </header>

      {/* Main application */}
      <div style={mainStyle}>
        {/* Left control panel */}
        <ControlPanel
          graphs={graphs}
          selectedGraphId={selectedGraphId}
          currentNodes={currentNodes}
          sourceNodeId={sourceNodeId}
          targetNodeId={targetNodeId}
          selectedAlgorithm={selectedAlgorithm}
          loading={loading}
          onSelectGraph={selectGraph}
          onSelectAlgorithm={setAlgorithm}
          onFindRoute={findRoute}
          onCompareAll={compareAll}
          onReset={resetSelection}
        />

        {/* Right side */}
        <main style={contentStyle}>
          {/* Error message */}
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          {/* Empty state */}
          {!currentGraph && (
            <div style={emptyStateStyle}>
              <h2>Select a Network</h2>
              <p>
                Choose a network from the panel on the left to begin
                route optimization.
              </p>
            </div>
          )}

          {/* Graph */}
          {currentGraph && (
            <>
              <section style={graphContainerStyle}>
                <GraphCanvas
                  nodes={currentNodes}
                  edges={currentEdges}
                  sourceNodeId={sourceNodeId}
                  targetNodeId={targetNodeId}
                  pathNodeIds={pathNodeIds}
                  pathEdgeIds={pathEdgeIds}
                  onNodeClick={selectNode}
                />
              </section>

              {/* Single algorithm result */}
              {singleResult && (
                <ResultsPanel
                  result={singleResult}
                  nodes={currentNodes}
                />
              )}

              {/* Algorithm comparison */}
              {compareResults.length > 0 && (
                <ComparisonTable
                  results={compareResults}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * Determine which graph edges belong to the calculated path.
 *
 * The result gives us the ordered node IDs:
 * [A, B, E, G, I]
 *
 * We find the corresponding edge between each pair.
 */
function getPathEdgeIds(edges, pathNodeIds) {
  if (!pathNodeIds || pathNodeIds.length < 2) {
    return [];
  }

  const pathEdgeIds = [];

  for (let i = 0; i < pathNodeIds.length - 1; i++) {
    const source = pathNodeIds[i];
    const target = pathNodeIds[i + 1];

    const edge = edges.find((e) => {
      if (e.directed) {
        return (
          e.sourceNodeId === source &&
          e.targetNodeId === target
        );
      }

      return (
        (e.sourceNodeId === source &&
          e.targetNodeId === target) ||
        (e.sourceNodeId === target &&
          e.targetNodeId === source)
      );
    });

    if (edge) {
      pathEdgeIds.push(edge.id);
    }
  }

  return pathEdgeIds;
}

const appStyle = {
  width: '100%',
  minHeight: '72vh',
  display: 'flex',
  flexDirection: 'column',
  background: '#f4f6fb',
  color: '#1e293b',
  overflow: 'hidden',
};

const headerStyle = {
  height: 70,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  background: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
};

const titleStyle = {
  margin: 0,
  fontSize: 22,
  fontWeight: 700,
  color: '#0f172a',
};

const subtitleStyle = {
  margin: '4px 0 0',
  fontSize: 12,
  color: '#64748b',
};

const networkInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 3,
  fontSize: 12,
  color: '#64748b',
};

const mainStyle = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
};

const contentStyle = {
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
};

const graphContainerStyle = {
  flex: 1,
  minHeight: 500,
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  overflow: 'hidden',
  marginBottom: 12,
};

const errorStyle = {
  background: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: 8,
  padding: '10px 14px',
  marginBottom: 12,
  color: '#b91c1c',
  fontSize: 13,
};

const emptyStateStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  textAlign: 'center',
};

const networkHeadingStyle = {
  color: '#0f172a',
};

export default App;

