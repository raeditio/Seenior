"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORY_META, type Category } from "./categoryColors";

interface Props {
  descriptions: Record<string, string>;
  categories?: Record<string, string>;
  activeNode: string | null;
  onNodeHover: (name: string | null) => void;
  onNodeClick: (name: string) => void;
  label?: string;
}

export default function DescriptionPanel({
  descriptions, categories = {}, activeNode, onNodeHover, onNodeClick, label = "Components",
}: Props) {
  const [search, setSearch] = useState("");
  const activeRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeNode && activeRowRef.current) {
      activeRowRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeNode]);

  const entries = Object.entries(descriptions);
  const query = search.trim().toLowerCase();
  const filtered = query
    ? entries.filter(([name, desc]) =>
        name.toLowerCase().includes(query) || desc.toLowerCase().includes(query)
      )
    : entries;

  // Legend: unique categories present in the current filtered descriptions
  const presentCategories = [...new Set(
    filtered.map(([name]) => categories[name]).filter(Boolean)
  )] as Category[];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-zinc-900 shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-3">
          {label}
          <span className="ml-1.5 text-zinc-700 normal-case tracking-normal font-normal">
            ({filtered.length})
          </span>
        </p>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full bg-zinc-900/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none border border-zinc-800 focus:border-zinc-700 transition-colors pr-7"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* Category legend */}
        {presentCategories.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {presentCategories.map((cat) => {
              const meta = CATEGORY_META[cat];
              if (!meta) return null;
              return (
                <span key={cat} className="flex items-center gap-1 text-[10px] text-zinc-600">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: meta.dot }}
                  />
                  {meta.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1">
        {filtered.length === 0 && (
          <p className="text-xs text-zinc-600 text-center py-10">No matches</p>
        )}
        {filtered.map(([name, desc]) => {
          const isActive = name === activeNode;
          const cat = categories[name] as Category | undefined;
          const meta = cat ? CATEGORY_META[cat] : undefined;
          return (
            <div
              key={name}
              ref={isActive ? activeRowRef : undefined}
              onMouseEnter={() => onNodeHover(name)}
              onMouseLeave={() => onNodeHover(null)}
              onClick={() => onNodeClick(name)}
              className="px-4 py-2.5 cursor-pointer transition-all select-none"
              style={{
                backgroundColor: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                borderLeft: isActive ? "2px solid rgba(255,255,255,0.35)" : "2px solid transparent",
              }}
            >
              <span className="flex items-center gap-1.5 mb-0.5">
                {meta && (
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: meta.dot }}
                    title={meta.label}
                  />
                )}
                <span
                  className="text-xs font-mono leading-tight transition-colors"
                  style={{ color: isActive ? "rgba(255,255,255,0.9)" : "rgba(161,161,170,1)" }}
                >
                  {name}
                </span>
              </span>
              <span className="text-[11px] text-zinc-600 leading-relaxed block pl-3">
                {desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
