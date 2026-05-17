'use client';

import { motion } from 'framer-motion';
import { type Category, getCategoryColor } from './categoryColors';

interface Props {
  descriptions: Record<string, string>;
  categories: Record<string, Category>;
  activeNode: string | null;
  label: string;
  onNodeHover: (name: string | null) => void;
  onNodeClick: (name: string) => void;
}

export default function DescriptionPanel({
  descriptions,
  categories,
  activeNode,
  label,
  onNodeHover,
  onNodeClick,
}: Props) {
  const entries = Object.entries(descriptions).sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      {/* Sticky header */}
      <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-900 px-4 py-3 z-10">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
          {label}
        </p>
        <p className="text-[10px] text-zinc-700 mt-0.5">
          {entries.length} {entries.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-3 space-y-2">
          {entries.length === 0 ? (
            <div className="text-xs text-zinc-600 text-center py-8">
              No descriptions available
            </div>
          ) : (
            entries.map(([name, description]) => {
              const category = categories[name];
              const colors = getCategoryColor(category);
              const isActive = activeNode === name;

              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => onNodeHover(name)}
                  onMouseLeave={() => onNodeHover(null)}
                  onClick={() => onNodeClick(name)}
                  className="rounded-lg border transition-all cursor-pointer"
                  style={{
                    backgroundColor: isActive ? colors.bg : 'transparent',
                    borderColor: isActive ? colors.border : 'rgb(39 39 42)',
                    opacity: activeNode && !isActive ? 0.4 : 1,
                  }}
                >
                  <div className="p-3">
                    {/* Node name with category badge */}
                    <div className="flex items-start gap-2 mb-2">
                      {category && (
                        <span
                          className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          {category}
                        </span>
                      )}
                      <h3
                        className="text-xs font-mono font-semibold flex-1"
                        style={{
                          color: category ? colors.text : 'rgb(228 228 231)',
                        }}
                      >
                        {name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer hint */}
      {entries.length > 0 && (
        <div className="sticky bottom-0 bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-900 px-4 py-2">
          <p className="text-[9px] text-zinc-700">
            Click or hover to highlight in diagram
          </p>
        </div>
      )}
    </>
  );
}

// Made with Bob
