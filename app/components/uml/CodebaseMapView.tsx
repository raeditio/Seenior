'use client';

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { forceCenter, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import { useMemo } from 'react';
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

interface SimNode {
  id: string;
  x: number;
  y: number;
}

interface SimLink {
  source: string | SimNode;
  target: string | SimNode;
}

function layoutNodes(nodes: MapNode[], edges: MapEdge[]): Map<string, { x: number; y: number }> {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const simNodes: SimNode[] = nodes.map((n) => ({ id: n.id, x: 0, y: 0 }));
  // Filter out edges where source or target isn't in the nodes list — d3-force throws if a node is missing
  const simLinks: SimLink[] = edges
    .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
    .map((e) => ({ source: e.source, target: e.target }));

  const sim = forceSimulation<SimNode>(simNodes)
    .force(
      'link',
      forceLink<SimNode, SimLink>(simLinks)
        .id((d) => d.id)
        .distance(140),
    )
    .force('charge', forceManyBody().strength(-500))
    .force('center', forceCenter(0, 0))
    .stop();

  // Run synchronously — no animation, just compute final positions
  for (let i = 0; i < 300; i++) sim.tick();

  const positions = new Map<string, { x: number; y: number }>();
  simNodes.forEach((n) => positions.set(n.id, { x: n.x + 600, y: n.y + 400 }));
  return positions;
}

export default function CodebaseMapView({ nodes, edges }: Props) {
  const { rfNodes, rfEdges } = useMemo(() => {
    const nodeIds = new Set(nodes.map((n) => n.id));
    const safeEdges = edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));
    const positions = layoutNodes(nodes, safeEdges);

    const rfNodes: Node[] = nodes.map((n) => {
      const meta = CATEGORY_META[n.category as Category];
      return {
        id: n.id,
        position: positions.get(n.id) ?? { x: 0, y: 0 },
        data: { label: n.label, description: n.description },
        style: {
          background: meta?.fill ?? '#18181b',
          border: `1px solid ${meta?.stroke ?? '#3f3f46'}`,
          color: '#fff',
          borderRadius: 8,
          fontSize: 11,
          fontFamily: 'ui-monospace, monospace',
          padding: '6px 12px',
          minWidth: 80,
          textAlign: 'center' as const,
        },
      };
    });

    const rfEdges: Edge[] = safeEdges.map((e, i) => ({
      id: `e${i}`,
      source: e.source,
      target: e.target,
      label: e.label,
      style: { stroke: '#3f3f46', strokeWidth: 1 },
      labelStyle: { fontSize: 9, fill: '#71717a' },
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

      {/* React Flow canvas */}
      <div
        style={{ height: 580, borderRadius: 12, overflow: 'hidden' }}
        className="border border-zinc-900 bg-zinc-950"
      >
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          onInit={(instance) => {
            // fitView as a prop fires before the container has dimensions;
            // calling it imperatively in onInit ensures the viewport is set correctly.
            setTimeout(() => instance.fitView({ padding: 0.2, duration: 300 }), 50);
          }}
          colorMode="dark"
          minZoom={0.15}
          maxZoom={4}
          proOptions={{ hideAttribution: true }}
        >
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

      <p className="text-[10px] text-zinc-700 px-1">
        {nodes.length} files · {edges.length} dependencies — drag nodes, scroll to zoom
      </p>
    </div>
  );
}
