'use client';

import Dagre from '@dagrejs/dagre';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect, useMemo, useState } from 'react';
import { CATEGORY_META, type Category } from './categoryColors';

export interface MapNode {
  id: string;
  label: string;
  category: string;
  description: string;
}

export interface MapEdge {
  source: string;
  target: string;
  label?: string;
}

interface Props {
  nodes: MapNode[];
  edges: MapEdge[];
}

const NODE_W = 168;
const NODE_H = 52;

function layoutNodes(
  nodes: MapNode[],
  edges: MapEdge[],
): Map<string, { x: number; y: number }> {
  const g = new Dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 56, ranksep: 72, marginx: 40, marginy: 40 });

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));

  const nodeIds = new Set(nodes.map((n) => n.id));
  edges
    .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
    .forEach((e) => g.setEdge(e.source, e.target));

  Dagre.layout(g);

  const positions = new Map<string, { x: number; y: number }>();
  nodes.forEach((n) => {
    const pos = g.node(n.id);
    // Dagre returns center coords; React Flow expects top-left corner
    positions.set(n.id, { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 });
  });
  return positions;
}

/** Calls fitView after React Flow has measured the container. */
function AutoFitView() {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      fitView({ padding: 0.18, duration: 400, maxZoom: 1.5 });
    });
    return () => cancelAnimationFrame(id);
  }, [fitView]);
  return null;
}

export default function CodebaseMapView({ nodes, edges }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;
  const incomingCount = selectedId ? edges.filter((e) => e.target === selectedId).length : 0;
  const outgoingCount = selectedId ? edges.filter((e) => e.source === selectedId).length : 0;

  const { rfNodes, rfEdges } = useMemo(() => {
    const nodeIds = new Set(nodes.map((n) => n.id));
    const safeEdges = edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));
    const positions = layoutNodes(nodes, safeEdges);

    const rfNodes: Node[] = nodes.map((n) => {
      const meta = CATEGORY_META[n.category as Category];
      const dir = n.id.includes('/') ? n.id.split('/').slice(0, -1).join('/') : '';
      return {
        id: n.id,
        position: positions.get(n.id) ?? { x: 0, y: 0 },
        data: {
          label: (
            <div style={{ textAlign: 'left', lineHeight: 1.3 }}>
              <div style={{ fontWeight: 600, fontSize: 11, color: '#e4e4e7' }}>{n.label}</div>
              {dir && (
                <div style={{ fontSize: 9, color: meta?.stroke ?? '#71717a', marginTop: 2 }}>
                  {dir}
                </div>
              )}
            </div>
          ),
        },
        style: {
          background: meta?.fill ?? '#18181b',
          border: `1px solid ${meta?.stroke ?? '#3f3f46'}`,
          borderRadius: 8,
          padding: '6px 12px',
          width: NODE_W,
          minHeight: NODE_H,
          cursor: 'pointer',
        },
      };
    });

    const rfEdges: Edge[] = safeEdges.map((e, i) => ({
      id: `e${i}`,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: true,
      style: { stroke: '#3f3f46', strokeWidth: 1 },
      labelStyle: { fontSize: 9, fill: '#52525b' },
      labelBgStyle: { fill: '#09090b', fillOpacity: 0.8 },
    }));

    return { rfNodes, rfEdges };
  }, [nodes, edges]);

  // Legend
  const presentCategories = [...new Set(nodes.map((n) => n.category))];

  return (
    <div className="flex flex-col gap-3">
      {/* Legend */}
      {presentCategories.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 px-1">
          {presentCategories.map((cat) => {
            const meta = CATEGORY_META[cat as Category];
            if (!meta) return null;
            return (
              <span key={cat} className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <span
                  className="inline-block w-2 h-2 rounded-sm shrink-0"
                  style={{ backgroundColor: meta.fill, border: `1px solid ${meta.stroke}` }}
                />
                {meta.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Canvas + detail panel */}
      <div className="flex gap-3">
        {/* React Flow canvas */}
        <div
          style={{ flex: 1, minWidth: 0, height: 580, borderRadius: 12, overflow: 'hidden' }}
          className="border border-zinc-900 bg-zinc-950"
        >
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            onNodeClick={(_, node) => setSelectedId((prev) => (prev === node.id ? null : node.id))}
            colorMode="dark"
            minZoom={0.1}
            maxZoom={4}
            proOptions={{ hideAttribution: true }}
          >
            <AutoFitView />
            <Background color="#27272a" gap={20} size={1} />
            <Controls
              style={{
                background: '#18181b',
                border: '1px solid #27272a',
                borderRadius: 8,
              }}
            />
            <MiniMap
              nodeColor={(n) => (n.style?.background as string) ?? '#18181b'}
              style={{
                background: '#09090b',
                border: '1px solid #27272a',
                borderRadius: 8,
              }}
              maskColor="rgba(0,0,0,0.6)"
            />
          </ReactFlow>
        </div>

        {/* Detail panel — appears when a node is clicked */}
        {selectedNode && (
          <div className="w-56 shrink-0 rounded-xl border border-zinc-900 bg-zinc-950/60 flex flex-col self-start sticky top-40 overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b border-zinc-900">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-200 truncate">{selectedNode.label}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5 font-mono break-all leading-relaxed">
                  {selectedNode.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-zinc-700 hover:text-zinc-400 transition-colors text-xs shrink-0 mt-0.5"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Stats */}
            <div className="px-4 py-3 border-b border-zinc-900 flex flex-col gap-1.5">
              {(() => {
                const meta = CATEGORY_META[selectedNode.category as Category];
                return (
                  <div className="flex items-center gap-1.5">
                    {meta && (
                      <span
                        className="inline-block w-2 h-2 rounded-sm shrink-0"
                        style={{ backgroundColor: meta.fill, border: `1px solid ${meta.stroke}` }}
                      />
                    )}
                    <span className="text-[10px] text-zinc-400 capitalize">{selectedNode.category}</span>
                  </div>
                );
              })()}
              <div className="flex gap-3 text-[10px] text-zinc-600">
                <span>
                  Incoming{' '}
                  <span className="text-zinc-300 font-mono">{incomingCount}</span>
                </span>
                <span>
                  Outgoing{' '}
                  <span className="text-zinc-300 font-mono">{outgoingCount}</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="px-4 py-3 text-[11px] text-zinc-400 leading-relaxed">
              {selectedNode.description}
            </p>
          </div>
        )}
      </div>

      <p className="text-[10px] text-zinc-700 px-1">
        {nodes.length} files · {edges.length} dependencies — click a node for details, drag to rearrange
      </p>
    </div>
  );
}
