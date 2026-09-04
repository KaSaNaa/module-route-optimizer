import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export function GraphCanvas({
  nodes,
  edges,
  sourceNodeId,
  targetNodeId,
  pathNodeIds,
  pathEdgeIds,
  onNodeClick,
}) {
  const rfNodes = useMemo(() => {
    return nodes.map((n) => {
      const isSource  = n.id === sourceNodeId;
      const isTarget  = n.id === targetNodeId;
      const isOnPath  = pathNodeIds.includes(n.id);

      let bg = '#6366f1'; // default: indigo
      if (isSource)     bg = '#22c55e'; // green
      else if (isTarget) bg = '#ef4444'; // red
      else if (isOnPath) bg = '#f59e0b'; // amber

      return {
        id: String(n.id),
        position: { x: n.x, y: n.y },
        data: { label: n.name },
        style: {
          background: bg,
          color: '#fff',
          border: isOnPath ? '2px solid #1d4ed8' : '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 600,
          cursor: 'pointer',
        },
      };
    });
  }, [nodes, sourceNodeId, targetNodeId, pathNodeIds]);

  const rfEdges = useMemo(() => {
    return edges.map((e) => {
      const isOnPath = pathEdgeIds.includes(e.id);
      return {
        id: String(e.id),
        source: String(e.sourceNodeId),
        target: String(e.targetNodeId),
        type: 'default',
        animated: isOnPath,
        label: String(e.weight),
        labelStyle: { fontSize: 10, fill: isOnPath ? '#f59e0b' : '#cbd5e1' },
        labelBgStyle: { fill: '#0f172a', fillOpacity: 0.8 },
        labelBgPadding: [4, 4],
        labelBgBorderRadius: 4,
        style: {
          stroke: isOnPath ? '#f59e0b' : '#334155',
          strokeWidth: isOnPath ? 3 : 1.5,
        },
        markerEnd: e.directed ? 'url(#react-flow__arrowclosed)' : undefined,
      };
    });
  }, [edges, pathEdgeIds]);

  const handleNodeClick = useCallback(
    (_event, node) => {
      onNodeClick(Number(node.id));
    },
    [onNodeClick]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={3}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        colorMode="dark"
      >
        <Background color="#1e293b" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
