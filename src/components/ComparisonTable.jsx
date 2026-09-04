const ALGO_LABELS = {
  dijkstra: "Dijkstra's",
  astar: 'A*',
  'bellman-ford': 'Bellman-Ford',
};

export function ComparisonTable({ results, nodes }) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n.name]));

  if (results.length === 0) return null;

  const found = results.filter((r) => r.found);
  const minCost    = found.length ? Math.min(...found.map((r) => r.cost)) : null;
  const minTime    = found.length ? Math.min(...found.map((r) => r.executionTimeMs)) : null;
  const minNodes   = found.length ? Math.min(...found.map((r) => r.nodesVisited)) : null;
  const minEdges   = found.length ? Math.min(...found.map((r) => r.edgesRelaxed)) : null;

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Algorithm Comparison</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <Th width={90}>Algorithm</Th>
            <Th>Path</Th>
            <Th width={60}>Cost</Th>
            <Th width={72}>Time (ms)</Th>
            <Th width={60}>Nodes</Th>
            <Th width={60}>Edges</Th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => {
            const pathStr = r.found
              ? r.path.map((id) => nodeMap.get(id) ?? `#${id}`).join(' → ')
              : '—';
            return (
              <tr key={r.algorithm}>
                <Td bold width={90}>{ALGO_LABELS[r.algorithm] ?? r.algorithm}</Td>
                <Td>
                  <span style={{
                    fontSize: 11,
                    color: r.found ? '#2563eb' : '#64748b',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 180,
                  }}>
                    {pathStr}
                  </span>
                </Td>
                <Td winner={r.found && r.cost === minCost} width={60}>
                  {r.found ? r.cost.toFixed(2) : r.error ? '⚠' : '—'}
                </Td>
                <Td winner={r.found && r.executionTimeMs === minTime} width={72}>
                  {r.executionTimeMs.toFixed(4)}
                </Td>
                <Td winner={r.found && r.nodesVisited === minNodes} width={60}>
                  {r.nodesVisited}
                </Td>
                <Td winner={r.found && r.edgesRelaxed === minEdges} width={60}>
                  {r.edgesRelaxed}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ color: '#64748b', fontSize: 11, marginTop: 8, marginBottom: 0 }}>
        🏆 Gold cells indicate the best value in each column among algorithms that found a path.
      </p>
    </div>
  );
}

function Th({ children, width }) {
  return (
    <th style={{
      padding: '8px 10px',
      textAlign: 'left',
      color: '#64748b',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      borderBottom: '1px solid #e2e8f0',
      whiteSpace: 'nowrap',
      width: width ?? undefined,
      minWidth: width ?? undefined,
    }}>{children}</th>
  );
}

function Td({ children, bold, winner, width }) {
  return (
    <td style={{
      padding: '8px 10px',
      color: winner ? '#b45309' : bold ? '#1e293b' : '#64748b',
      fontSize: 12,
      fontWeight: winner ? 700 : bold ? 600 : 400,
      borderBottom: '1px solid #ffffff',
      background: winner ? 'rgba(37,99,235,0.06)' : 'transparent',
      width: width ?? undefined,
      minWidth: width ?? undefined,
      verticalAlign: 'middle',
    }}>{children}</td>
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

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
};
