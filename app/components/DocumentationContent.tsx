'use client';

import { useEffect, useRef, useState } from 'react';
import { codeToHtml } from 'shiki';
import MermaidDiagram from './MermaidDiagram';

interface DocumentationContentProps {
  html: string;
  mermaidBlocks: Array<{ id: string; content: string }>;
  onActiveHeadingChange?: (id: string | null) => void;
}

export default function DocumentationContent({ html, mermaidBlocks, onActiveHeadingChange }: DocumentationContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number>(0);
  const [currentMatch, setCurrentMatch] = useState(0);

  // Scroll spy: highlight the TOC item for whichever h2 is near the top of the viewport
  useEffect(() => {
    const container = contentRef.current;
    if (!container || !onActiveHeadingChange) return;

    const headings = Array.from(container.querySelectorAll('h2[id]'));
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the first intersecting heading (topmost visible)
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          onActiveHeadingChange(visible[0].target.id);
        }
      },
      // Trigger when heading crosses the top 30% of the viewport
      { rootMargin: '0px 0px -65% 0px', threshold: 0 }
    );

    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [html, onActiveHeadingChange]);

  // Search: highlight matches and jump to first result
  useEffect(() => {
    if (!contentRef.current || !searchQuery) {
      if (contentRef.current) {
        contentRef.current.querySelectorAll('mark.search-highlight').forEach(mark => {
          const parent = mark.parentNode;
          if (parent) {
            parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
            parent.normalize();
          }
        });
      }
      setSearchResults(0);
      setCurrentMatch(0);
      return;
    }

    const content = contentRef.current;
    // Clear old highlights first
    content.querySelectorAll('mark.search-highlight').forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        parent.normalize();
      }
    });

    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      // Skip nodes inside code blocks (copy buttons etc)
      const el = node.parentElement;
      if (el?.closest('.copy-code-btn')) continue;
      textNodes.push(node as Text);
    }

    let count = 0;
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    textNodes.forEach(textNode => {
      const text = textNode.textContent || '';
      if (!regex.test(text)) return;
      regex.lastIndex = 0;
      count += (text.match(regex) || []).length;
      const span = document.createElement('span');
      span.innerHTML = text.replace(
        regex,
        '<mark class="search-highlight bg-yellow-500/30 text-yellow-200 rounded px-0.5">$&</mark>'
      );
      textNode.parentNode?.replaceChild(span, textNode);
    });

    setSearchResults(count);
    setCurrentMatch(count > 0 ? 1 : 0);

    // Scroll to first match
    if (count > 0) {
      const first = content.querySelector('mark.search-highlight');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [searchQuery]);

  // Export documentation as markdown
  const handleExport = () => {
    const markdown = contentRef.current?.innerText || '';
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documentation.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // --- Copy button: event delegation ---
    // Buttons are rendered statically by processMarkdown so they're always in the DOM.
    const copyIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
    const checkIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;

    const handleCopy = async (e: Event) => {
      const btn = (e.target as Element).closest('.copy-code-btn') as HTMLElement | null;
      if (!btn) return;
      const code = decodeURIComponent(btn.getAttribute('data-code') || '');
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = code;
        Object.assign(ta.style, { position: 'fixed', top: '0', opacity: '0' });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      btn.innerHTML = `${checkIcon}<span>Copied!</span>`;
      btn.style.color = 'rgb(134 239 172)';
      setTimeout(() => {
        btn.innerHTML = `${copyIcon}<span>Copy</span>`;
        btn.style.color = '';
      }, 2000);
    };
    container.addEventListener('click', handleCopy);

    // --- Syntax highlighting (cosmetic only — copy works without it) ---
    container.querySelectorAll('code[data-lang]').forEach(async (codeEl) => {
      const lang = codeEl.getAttribute('data-lang') || 'text';
      const code = codeEl.textContent || '';
      if (!code.trim() || lang === 'text') return;
      try {
        const highlighted = await codeToHtml(code, { lang, theme: 'github-dark' });
        const tmp = document.createElement('div');
        tmp.innerHTML = highlighted;
        const hlCode = tmp.querySelector('code');
        if (hlCode) (codeEl as HTMLElement).innerHTML = hlCode.innerHTML;
      } catch { /* keep plain text */ }
    });

    // --- Mermaid placeholders ---
    container.querySelectorAll('[data-mermaid-id]').forEach((placeholder) => {
      const id = placeholder.getAttribute('data-mermaid-id');
      if (!id) return;
      const block = mermaidBlocks.find(b => b.id === id);
      if (block) {
        const el = document.getElementById(id);
        if (el && placeholder.parentNode) placeholder.parentNode.replaceChild(el, placeholder);
      }
    });

    // --- Keyboard shortcuts ---
    const handleKeyDown = (e: KeyboardEvent) => {
      const input = document.getElementById('doc-search-input') as HTMLInputElement | null;
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        input?.select();
        input?.focus();
      }
      if (e.key === 'Escape') {
        setSearchQuery('');
        input?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('click', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [html, mermaidBlocks]);

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-zinc-900 px-4 py-2 mb-6 flex items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          {/* Search input */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              id="doc-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search… (⌘F)"
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600 transition-colors"
              aria-label="Search documentation"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors text-base leading-none"
              >×</button>
            )}
          </div>

          {/* Match count + prev/next */}
          {searchResults > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[11px] text-zinc-500 tabular-nums whitespace-nowrap">
                {currentMatch} / {searchResults}
              </span>
              <button
                onClick={() => {
                  const marks = contentRef.current?.querySelectorAll('mark.search-highlight');
                  if (!marks?.length) return;
                  const next = currentMatch % searchResults;
                  marks[next]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setCurrentMatch(next + 1);
                }}
                className="w-6 h-6 flex items-center justify-center rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Next match (↵)"
              >↓</button>
              <button
                onClick={() => {
                  const marks = contentRef.current?.querySelectorAll('mark.search-highlight');
                  if (!marks?.length) return;
                  const prev = (currentMatch - 2 + searchResults) % searchResults;
                  marks[prev]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setCurrentMatch(prev + 1);
                }}
                className="w-6 h-6 flex items-center justify-center rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Previous match"
              >↑</button>
            </div>
          )}
          {searchQuery && searchResults === 0 && (
            <span className="text-[11px] text-red-400/70 shrink-0">No results</span>
          )}
        </div>

        <button
          onClick={handleExport}
          className="px-3 py-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 rounded-lg flex items-center gap-2 transition-colors shrink-0"
          aria-label="Export documentation"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </button>
      </div>

      {/* Content */}
      <div className="text-zinc-300 text-sm leading-relaxed prose-docs">
        <div
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: html.replace(/__MERMAID_([^_]+)__/g, '<div data-mermaid-id="$1"></div>') }}
        />
        
        {/* Render Mermaid diagrams (hidden initially, will be moved by useEffect) */}
        <div style={{ display: 'none' }}>
          {mermaidBlocks.map(block => (
            <div key={block.id} id={block.id} className="my-6">
              <MermaidDiagram chart={block.content} id={block.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Made with Bob
