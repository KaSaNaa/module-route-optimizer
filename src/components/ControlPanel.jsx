const ALGORITHMS = [
  {
    value: 'dijkstra',
    label: "Dijkstra's",
    description: 'Greedy, O((V+E)logV). Requires non-negative weights.',
  },
  {
    value: 'astar',
    label: 'A* (A-Star)',
    description: 'Informed Dijkstra with Euclidean heuristic. Explores fewer nodes.',
  },
  {
    value: 'bellman-ford',
    label: 'Bellman-Ford',
    description: 'O(V·E). Handles negative weights, detects negative cycles.',
  },
];

export function ControlPanel({
  graphs,
  selectedGraphId,
  currentNodes,
  sourceNodeId,
  targetNodeId,
  selectedAlgorithm,
  loading,
  onSelectGraph,
  onSelectAlgorithm,
  onFindRoute,
  onCompareAll,
  onReset,
}) {
  const getNodeName = (id) => {
    if (id === null) return '— not selected —';
    return currentNodes.find((n) => n.id === id)?.name ?? `Node #${id}`;
  };

  const canRun =
    selectedGraphId !== null &&
    sourceNodeId !== null &&
    targetNodeId !== null;

  return (
    <aside
      style={{
        width: 280,
        flexShrink: 0,
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        overflowY: 'auto',
      }}
    >
      {/* Graph Selector */}
      <section>
        <label style={labelStyle}>Network / Graph</label>

        <select
          value={selectedGraphId ?? ''}
          onChange={(e) => onSelectGraph(Number(e.target.value))}
          style={selectStyle}
          disabled={loading}
        >
          <option value="" disabled>
            Select a network…
          </option>

          {graphs.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name} ({g.nodeCount}N / {g.edgeCount}E)
            </option>
          ))}
        </select>
      </section>

      {/* Node Selection */}
      <section>
        <label style={labelStyle}>Node Selection</label>

        <p style={hintStyle}>
          Click nodes on the canvas to select source then target.
        </p>

        <div style={nodeBoxStyle}>
          <span
            style={{
              ...dotStyle,
              background: '#22c55e',
            }}
          />

          <span style={nodeNameStyle}>
            Source: {getNodeName(sourceNodeId)}
          </span>
        </div>

        <div style={nodeBoxStyle}>
          <span
            style={{
              ...dotStyle,
              background: '#ef4444',
            }}
          />

          <span style={nodeNameStyle}>
            Target: {getNodeName(targetNodeId)}
          </span>
        </div>

        <button
          onClick={onReset}
          style={ghostBtnStyle}
          disabled={loading}
        >
          ↺ Reset selection
        </button>
      </section>

      {/* Algorithm Selector */}
      <section>
        <label style={labelStyle}>Algorithm</label>

        {ALGORITHMS.map((algo) => (
          <label
            key={algo.value}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              marginBottom: 10,
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name="algorithm"
              value={algo.value}
              checked={selectedAlgorithm === algo.value}
              onChange={() => onSelectAlgorithm(algo.value)}
              style={{
                marginTop: 3,
                accentColor: '#2563eb',
              }}
            />

            <div>
              <div
                style={{
                  color: '#1e293b',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {algo.label}
              </div>

              <div
                style={{
                  color: '#64748b',
                  fontSize: 11,
                  lineHeight: 1.4,
                }}
              >
                {algo.description}
              </div>
            </div>
          </label>
        ))}
      </section>

      {/* Action Buttons */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* Find Route */}
        <button
          onClick={onFindRoute}
          disabled={!canRun || loading}
          style={primaryBtnStyle(!canRun || loading)}
        >
          {loading ? '⏳ Computing…' : '▶ Find Route'}
        </button>

        
      </section>

      {/* Legend */}
      <section>
        <label style={labelStyle}>Legend</label>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          {[
            { color: '#22c55e', label: 'Source node' },
            { color: '#ef4444', label: 'Target node' },
            { color: '#f59e0b', label: 'Shortest path' },
            { color: '#2563eb', label: 'Unvisited node' },
          ].map(({ color, label }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  ...dotStyle,
                  background: color,
                }}
              />

              <span
                style={{
                  color: '#64748b',
                  fontSize: 12,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

const labelStyle = {
  display: 'block',
  color: '#64748b',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: 8,
};

const hintStyle = {
  color: '#64748b',
  fontSize: 11,
  marginBottom: 8,
  lineHeight: 1.4,
};

const selectStyle = {
  width: '100%',
  padding: '8px 10px',
  background: '#e2e8f0',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  color: '#1e293b',
  fontSize: 13,
  cursor: 'pointer',
};

const nodeBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 10px',
  background: '#e2e8f0',
  borderRadius: 6,
  marginBottom: 6,
};

const nodeNameStyle = {
  color: '#1e293b',
  fontSize: 13,
  fontWeight: 500,
};

const dotStyle = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  flexShrink: 0,
};

const primaryBtnStyle = (disabled) => ({
  padding: '10px 0',
  background: disabled ? '#e2e8f0' : '#2563eb',
  color: disabled ? '#64748b' : '#fff',
  border: 'none',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'background 0.15s',
});

const secondaryBtnStyle = (disabled) => ({
  padding: '10px 0',
  background: disabled ? '#e2e8f0' : 'transparent',
  color: disabled ? '#64748b' : '#2563eb',
  border: `1px solid ${disabled ? '#e2e8f0' : '#2563eb'}`,
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: disabled ? 'not-allowed' : 'pointer',
});

const ghostBtnStyle = {
  padding: '6px 10px',
  background: 'transparent',
  color: '#64748b',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  fontSize: 12,
  cursor: 'pointer',
  marginTop: 4,
};

