'use client';

import { useEffect, useRef, useState } from 'react';
import { codeToHtml } from 'shiki';
import MermaidDiagram from './MermaidDiagram';

interface DocumentationContentProps {
  html: string;
  mermaidBlocks: Array<{ id: string; content: string }>;
}

export default function DocumentationContent({ html, mermaidBlocks }: DocumentationContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number>(0);

  // Search functionality
  useEffect(() => {
    if (!contentRef.current || !searchQuery) {
      // Clear highlights
      if (contentRef.current) {
        const highlighted = contentRef.current.querySelectorAll('mark.search-highlight');
        highlighted.forEach(mark => {
          const parent = mark.parentNode;
          if (parent) {
            parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
            parent.normalize();
          }
        });
      }
      setSearchResults(0);
      return;
    }

    const content = contentRef.current;
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];
    let node;
    
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    let count = 0;
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

    textNodes.forEach(textNode => {
      const text = textNode.textContent || '';
      const matches = text.match(regex);
      if (matches) {
        count += matches.length;
        const span = document.createElement('span');
        span.innerHTML = text.replace(regex, '<mark class="search-highlight bg-yellow-500/30 text-yellow-200 rounded px-0.5">$&</mark>');
        textNode.parentNode?.replaceChild(span, textNode);
      }
    });

    setSearchResults(count);
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
    if (!contentRef.current) return;

    // Apply syntax highlighting and add copy buttons to all code blocks.
    // Code is read from textContent (not a data attribute) so special chars don't break parsing.
    const codeBlocks = contentRef.current.querySelectorAll('pre[data-lang] code');

    codeBlocks.forEach(async (codeEl) => {
      const pre = codeEl.parentElement;
      if (!pre) return;
      // Skip already-processed blocks
      if (pre.querySelector('button')) return;

      const code = codeEl.textContent || '';
      const lang = pre.getAttribute('data-lang') || 'text';

      // --- Header bar: language badge + copy button ---
      const header = document.createElement('div');
      header.className = 'flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/70';

      const badge = document.createElement('span');
      badge.className = 'text-[10px] font-mono text-zinc-500 uppercase tracking-wider';
      badge.textContent = lang === 'text' ? 'code' : lang;
      header.appendChild(badge);

      const copyBtn = document.createElement('button');
      copyBtn.className = 'flex items-center gap-1.5 px-2 py-1 text-[11px] text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded transition-colors';
      const copyIcon = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
      const checkIcon = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
      copyBtn.innerHTML = `${copyIcon}<span>Copy</span>`;

      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(code);
          copyBtn.innerHTML = `${checkIcon}<span>Copied!</span>`;
          copyBtn.style.color = 'rgb(134 239 172)'; // green-300
          setTimeout(() => {
            copyBtn.innerHTML = `${copyIcon}<span>Copy</span>`;
            copyBtn.style.color = '';
          }, 2000);
        } catch {
          // Fallback for browsers that block clipboard API
          const ta = document.createElement('textarea');
          ta.value = code;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copyBtn.innerHTML = `${checkIcon}<span>Copied!</span>`;
          setTimeout(() => { copyBtn.innerHTML = `${copyIcon}<span>Copy</span>`; }, 2000);
        }
      };
      header.appendChild(copyBtn);

      // Rewrap: move <code> into a scrollable body div, prepend header
      pre.style.padding = '0';
      pre.style.overflow = 'hidden';

      const body = document.createElement('div');
      body.className = 'overflow-x-auto p-4';
      pre.insertBefore(body, codeEl);
      body.appendChild(codeEl);
      pre.insertBefore(header, body);

      // Apply syntax highlighting
      try {
        const highlighted = await codeToHtml(code, { lang, theme: 'github-dark' });
        const tmp = document.createElement('div');
        tmp.innerHTML = highlighted;
        const hlCode = tmp.querySelector('code');
        if (hlCode) codeEl.innerHTML = hlCode.innerHTML;
      } catch {
        // Keep plain text if highlighting fails
      }
    });

    // Replace Mermaid placeholders with actual diagram containers
    const mermaidPlaceholders = contentRef.current.querySelectorAll('[data-mermaid-id]');
    mermaidPlaceholders.forEach((placeholder) => {
      const id = placeholder.getAttribute('data-mermaid-id');
      if (!id) return;
      
      const block = mermaidBlocks.find(b => b.id === id);
      if (block) {
        const container = document.getElementById(id);
        if (container && placeholder.parentNode) {
          placeholder.parentNode.replaceChild(container, placeholder);
        }
      }
    });

    // Keyboard shortcut for search (Ctrl/Cmd + F)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        // Focus the search input
        const searchInput = document.querySelector('input[placeholder="Search documentation..."]') as HTMLInputElement;
        searchInput?.focus();
      }
      if (e.key === 'Escape') {
        setSearchQuery('');
        // Blur the input
        (document.activeElement as HTMLElement)?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [html, mermaidBlocks]);

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-zinc-900 px-4 py-2 mb-6 flex items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full pl-10 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded focus:outline-none focus:border-zinc-700"
              aria-label="Search documentation"
            />
            {searchResults > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 pointer-events-none">
                {searchResults} {searchResults === 1 ? 'result' : 'results'}
              </span>
            )}
          </div>
          <kbd className="text-[10px] text-zinc-600 px-1.5 py-0.5 bg-zinc-900 rounded shrink-0">⌘F</kbd>
        </div>

        <button
          onClick={handleExport}
          className="px-3 py-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 rounded flex items-center gap-2 transition-colors shrink-0"
          aria-label="Export documentation"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Export</span>
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
