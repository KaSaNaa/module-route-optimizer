const ALGO_LABELS = {
  dijkstra: "Dijkstra's Algorithm",
  astar: 'A* (A-Star)',
  'bellman-ford': 'Bellman-Ford',
};

export function ResultsPanel({ result, nodes }) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n.name]));
  const pathNames = result.path.map((id) => nodeMap.get(id) ?? `#${id}`);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        {ALGO_LABELS[result.algorithm] ?? result.algorithm}
        {result.found
          ? <span style={{ color: '#22c55e', marginLeft: 10, fontSize: 13 }}>✓ Path found</span>
          : <span style={{ color: '#ef4444', marginLeft: 10, fontSize: 13 }}>✗ No path</span>}
      </h3>

      {result.error && (
        <div style={errorBoxStyle}>⚠ {result.error}</div>
      )}

      {result.found && (
        <div style={pathBoxStyle}>
          {pathNames.map((name, i) => (
            <span key={i}>
              <span style={pathNodeStyle}>{name}</span>
              {i < pathNames.length - 1 && (
                <span style={{ color: '#64748b', margin: '0 4px' }}>→</span>
              )}
            </span>
          ))}
        </div>
      )}

      <div style={metricsGridStyle}>
        <Metric label="Total Cost" value={result.found ? result.cost.toFixed(2) : '—'} accent />
        <Metric label="Time (ms)" value={result.executionTimeMs.toFixed(4)} />
        <Metric label="Nodes Visited" value={String(result.nodesVisited)} />
        <Metric label="Edges Relaxed" value={String(result.edgesRelaxed)} />
      </div>
    </div>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div style={metricItemStyle}>
      <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{label}</div>
      <div style={{ color: accent ? '#2563eb' : '#1e293b', fontSize: 18, fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}

const containerStyle = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  padding: 16,
  marginBottom: 12,
};

const titleStyle = {
  color: '#1e293b',
  fontSize: 15,
  fontWeight: 700,
  margin: '0 0 12px 0',
};

const errorBoxStyle = {
  background: '#e2e8f0',
  border: '1px solid #fecaca',
  borderRadius: 6,
  padding: '8px 12px',
  color: '#b91c1c',
  fontSize: 12,
  marginBottom: 10,
};

const pathBoxStyle = {
  background: '#e2e8f0',
  borderRadius: 6,
  padding: '10px 12px',
  marginBottom: 12,
  lineHeight: 1.8,
  flexWrap: 'wrap',
  display: 'flex',
  alignItems: 'center',
};

const pathNodeStyle = {
  background: '#eff6ff',
  color: '#2563eb',
  borderRadius: 4,
  padding: '1px 6px',
  fontSize: 13,
  fontWeight: 600,
};

const metricsGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 10,
};

const metricItemStyle = {
  background: '#e2e8f0',
  borderRadius: 6,
  padding: '10px 12px',
};
