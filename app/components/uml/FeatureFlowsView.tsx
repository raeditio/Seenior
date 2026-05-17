'use client';

import MermaidDiagram from '@/app/components/MermaidDiagram';
import { useRef, useState } from 'react';

export interface FeatureFlow {
  path: string;
  role: string;
}

export interface Feature {
  name: string;
  description: string;
  flow: FeatureFlow[];
  sequenceDiagram?: string;
}

interface Props {
  features: Feature[];
  repoUrl: string; // e.g. "https://github.com/owner/repo"
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function buildFlowMermaid(flow: FeatureFlow[], repoUrl: string): string {
  const repoPath = repoUrl.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  const nodes = flow
    .map((f, i) => {
      const fileName = f.path.split('/').pop() ?? f.path;
      // Escape double-quotes inside node labels
      return `  N${i}["${fileName.replace(/"/g, "'")}"]`;
    })
    .join('\n');
  const edges = flow
    .slice(0, -1)
    .map((_, i) => `  N${i} --> N${i + 1}`)
    .join('\n');
  const clicks = flow
    .map(
      (f, i) =>
        `  click N${i} "https://github.com/${repoPath}/blob/main/${f.path}" "_blank"`,
    )
    .join('\n');
  return `flowchart LR\n${nodes}\n${edges}\n${clicks}`;
}

export default function FeatureFlowsView({ features, repoUrl }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleSeq = (i: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const scrollToCard = (i: number) =>
    cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const repoPath = repoUrl.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');

  return (
    <div className="flex gap-4">
      {/* Feature cards */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {features.map((feature, i) => (
          <div
            key={feature.name}
            ref={(el) => { cardRefs.current[i] = el; }}
            id={`feature-${slugify(feature.name)}`}
            className="rounded-xl border border-zinc-900 bg-zinc-950/60 p-5"
          >
            <h3 className="text-sm font-medium text-zinc-200 mb-1">{feature.name}</h3>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{feature.description}</p>

            {/* LR flowchart — file chain */}
            <div className="mb-3 overflow-x-auto rounded-lg border border-zinc-900 bg-black/30 p-3">
              <MermaidDiagram
                chart={buildFlowMermaid(feature.flow, repoUrl)}
                id={`feature-flow-${i}`}
              />
            </div>

            {/* File pills — clickable GitHub links with role tooltip */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {feature.flow.map((f, j) => (
                <a
                  key={j}
                  href={`https://github.com/${repoPath}/blob/main/${f.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={f.role}
                  className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
                >
                  {f.path.split('/').pop()}
                </a>
              ))}
            </div>

            {/* Optional sequence diagram drill-down */}
            {feature.sequenceDiagram && (
              <div>
                <button
                  onClick={() => toggleSeq(i)}
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
                >
                  <span className="font-mono">{expanded.has(i) ? '▾' : '▸'}</span>
                  {expanded.has(i) ? 'Hide' : 'Show'} sequence diagram
                </button>
                {expanded.has(i) && (
                  <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-900 bg-black/30 p-3">
                    <MermaidDiagram
                      chart={feature.sequenceDiagram}
                      id={`feature-seq-${i}`}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Side panel: feature navigation */}
      <div className="w-72 shrink-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden flex flex-col self-start sticky top-40">
        <div className="px-4 pt-4 pb-3 border-b border-zinc-900 shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Features
            <span className="ml-1.5 text-zinc-700 normal-case tracking-normal font-normal">
              ({features.length})
            </span>
          </p>
        </div>
        <div className="overflow-y-auto py-1">
          {features.map((feature, i) => (
            <button
              key={feature.name}
              onClick={() => scrollToCard(i)}
              className="w-full text-left px-4 py-2.5 cursor-pointer transition-all select-none hover:bg-white/5"
            >
              <span className="text-xs font-mono text-zinc-400 block mb-0.5 truncate">
                {feature.name}
              </span>
              <span className="text-[11px] text-zinc-600 leading-relaxed">
                {feature.flow.length} file{feature.flow.length !== 1 ? 's' : ''}
                {feature.sequenceDiagram ? ' · sequence' : ''}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
