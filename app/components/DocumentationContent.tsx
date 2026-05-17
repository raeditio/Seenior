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

    // Apply syntax highlighting and add enhanced copy buttons to all code blocks
    const codeBlocks = contentRef.current.querySelectorAll('pre code[data-code]');
    
    codeBlocks.forEach(async (codeEl) => {
      const code = codeEl.getAttribute('data-code') || '';
      const lang = codeEl.getAttribute('data-lang') || 'text';
      const pre = codeEl.parentElement;
      if (!pre) return;

      // Check if already processed
      if (pre.querySelector('button')) return;

      // Apply syntax highlighting
      try {
        const highlighted = await codeToHtml(code, {
          lang: lang,
          theme: 'github-dark',
        });
        
        // Extract just the code content from the generated HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = highlighted;
        const highlightedCode = tempDiv.querySelector('code');
        if (highlightedCode) {
          codeEl.innerHTML = highlightedCode.innerHTML;
        }
      } catch (err) {
        // If highlighting fails, keep original code
        console.warn('Syntax highlighting failed:', err);
      }

      // Add language badge
      const langBadge = document.createElement('div');
      langBadge.className = 'absolute top-2 left-2 px-2 py-0.5 text-[10px] font-mono bg-zinc-800/80 text-zinc-400 rounded uppercase tracking-wider';
      langBadge.textContent = lang;
      pre.appendChild(langBadge);

      // Add line numbers
      const lines = code.split('\n');
      const lineNumbersDiv = document.createElement('div');
      lineNumbersDiv.className = 'absolute left-0 top-0 bottom-0 w-10 bg-zinc-900/50 border-r border-zinc-800 flex flex-col items-end pr-2 pt-4 text-[10px] text-zinc-600 font-mono select-none';
      lines.forEach((_, i) => {
        const lineNum = document.createElement('div');
        lineNum.textContent = String(i + 1);
        lineNum.className = 'leading-[1.5rem] h-[1.5rem]';
        lineNumbersDiv.appendChild(lineNum);
      });
      pre.appendChild(lineNumbersDiv);
      
      // Adjust code padding for line numbers
      if (codeEl instanceof HTMLElement) {
        codeEl.style.paddingLeft = '3rem';
      }

      // Add copy button
      const button = document.createElement('button');
      button.className = 'absolute top-2 right-2 px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1';
      button.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>';
      button.onclick = async () => {
        try {
          await navigator.clipboard.writeText(code);
          button.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copied</span>';
          setTimeout(() => {
            button.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      };
      
      pre.style.position = 'relative';
      pre.appendChild(button);
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
