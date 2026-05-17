'use client';

import DocumentationContent from '@/app/components/DocumentationContent';
import DescriptionPanel from '@/app/components/uml/DescriptionPanel';
import CodebaseMapView from '@/app/components/uml/CodebaseMapView';
import FeatureFlowsView from '@/app/components/uml/FeatureFlowsView';
import InteractiveDiagram from '@/app/components/uml/InteractiveDiagram';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';

interface ArchNode  { id: string; displayName: string; category: string; description: string; }
interface FlowFile  { path: string; role: string; }
interface Feature   { name: string; description: string; flow: FlowFile[]; sequenceDiagram?: string; }
interface ClassEntry { name: string; category: string; description: string; }

interface MapNode { id: string; label: string; category: string; description: string; }
interface MapEdge { source: string; target: string; label?: string; }

interface UmlData {
  architecture: { mermaid: string; nodes: ArchNode[] };
  features: Feature[];
  classDiagram: { hasClassHierarchy: boolean; mermaid: string | null; classes: ClassEntry[] } | null;
  codebaseMap?: { nodes: MapNode[]; edges: MapEdge[] };
}

interface AnalysisData {
  repository: {
    name: string;
    full_name: string;
    description: string;
    html_url: string;
  };
  filesAnalyzed: number;
  documentation?: string;
  uml?: UmlData;
  quiz?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

type TabId = 'documentation' | 'uml' | 'quiz';

// --- Loading steps ---
const STEPS = [
  { label: 'Fetching repository information…', duration: 3000 },
  { label: 'Fetching repository files…',      duration: 6000 },
  { label: 'Reading code structure…',          duration: 7000 },
  { label: 'Generating your report…',          duration: 9000 },
  { label: 'Almost done, hang tight…',         duration: Infinity },
];

function useLoadingSteps(active: boolean) {
  const [step, setStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) { setStep(0); return; }
    if (step >= STEPS.length - 1) return;
    timerRef.current = setTimeout(() => setStep((s) => s + 1), STEPS[step].duration);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, step]);

  return step;
}

// --- Skeleton bones ---
function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className ?? ''}`} style={style} />;
}

function DocsSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Bone className="h-3 w-24 mb-1" />
        <Bone className="h-4 w-full" /><Bone className="h-4 w-5/6" /><Bone className="h-4 w-4/6" />
      </div>
      <div className="flex flex-col gap-3">
        <Bone className="h-3 w-36 mb-1" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl border border-zinc-900">
            <Bone className="h-3 w-3 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-2 flex-1">
              <Bone className="h-3 w-48" /><Bone className="h-3 w-64" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Bone className="h-3 w-44 mb-1" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-5 rounded-xl border border-zinc-900 flex flex-col gap-3">
            <Bone className="h-4 w-36" /><Bone className="h-3 w-full" /><Bone className="h-3 w-5/6" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Bone className="h-3 w-24 mb-1" />
        <div className="flex flex-wrap gap-2">
          {[80, 64, 96, 72, 56, 88].map((w, i) => (
            <Bone key={i} className="h-7 rounded-lg" style={{ width: `${w}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DiagramsSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      {['Architecture map', 'Request flow'].map((label) => (
        <div key={label} className="flex flex-col gap-3">
          <Bone className="h-3 w-36 mb-1" />
          <div className="rounded-xl border border-zinc-900 p-6 flex flex-col gap-4 items-center">
            <Bone className="h-10 w-40 rounded-lg" />
            <Bone className="h-6 w-px" />
            <div className="flex gap-8">
              <Bone className="h-10 w-32 rounded-lg" /><Bone className="h-10 w-32 rounded-lg" />
            </div>
            <Bone className="h-6 w-px" />
            <div className="flex gap-6">
              <Bone className="h-10 w-24 rounded-lg" />
              <Bone className="h-10 w-24 rounded-lg" />
              <Bone className="h-10 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuizSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-5 rounded-xl border border-zinc-900 flex flex-col gap-4">
          <div className="flex gap-2 items-start">
            <Bone className="h-3 w-4 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-2 flex-1">
              <Bone className="h-3 w-full" /><Bone className="h-3 w-4/5" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, j) => <Bone key={j} className="h-8 w-full rounded-lg" />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex flex-col gap-3 pb-8 border-b border-zinc-900 mb-10">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-white shrink-0"
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-zinc-300"
          >
            {STEPS[step].label}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="flex gap-1.5">
        {[...Array(total)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ backgroundColor: i <= step ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.08)' }}
            transition={{ duration: 0.4 }}
            className="h-1 flex-1 rounded-full"
          />
        ))}
      </div>
      <p className="text-xs text-zinc-600">This usually takes 20–40 seconds</p>
    </div>
  );
}

// Extract node names present in each diagram type
function extractClassNames(diagram: string): Set<string> {
  const names = new Set<string>();
  // Explicit declarations: "class ClassName" or "class ClassName {"
  for (const m of diagram.matchAll(/^\s*class\s+(\w+)/gm)) names.add(m[1]);
  // Relationship lines: "A --> B", "A <|-- B", "A *-- B", etc.
  // Left side
  for (const m of diagram.matchAll(/^\s*(\w+)\s*(?:"[^"]*")?\s*(?:<\|--|<\.\.|\*--|o--|-->|\.\.>|<--|--|\|\|--|\.\.)/gm)) names.add(m[1]);
  // Right side
  for (const m of diagram.matchAll(/(?:<\|--|<\.\.|\*--|o--|-->|\.\.>|<--|--|\|\|--|\.\.)(?:"[^"]*")?\s*(\w+)/gm)) names.add(m[1]);
  // Member definitions: "ClassName : +method()"
  for (const m of diagram.matchAll(/^\s*(\w+)\s*:/gm)) names.add(m[1]);
  return names;
}

// --- Animations ---
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-4">{children}</p>;
}

// Process markdown with proper list nesting and Mermaid detection
function processMarkdown(markdown: string): { html: string; mermaidBlocks: Array<{ id: string; content: string }> } {
  const mermaidBlocks: Array<{ id: string; content: string }> = [];
  let mermaidCounter = 0;
  
  // First, extract and replace Mermaid blocks with placeholders
  let processed = markdown.replace(
    /```(?:mermaid\n)?(graph|sequenceDiagram|classDiagram|flowchart)\s+([\s\S]*?)```/g,
    (_, type, content) => {
      const id = `mermaid-doc-${mermaidCounter++}`;
      mermaidBlocks.push({ id, content: `${type} ${content}` });
      return `__MERMAID_${id}__`;
    }
  );
  
  // Process other code blocks.
  // The copy button is generated statically here (not via useEffect) so it's always present.
  // encodeURIComponent on the code keeps the data attribute safe for any content.
  const copyIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  processed = processed.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (_, lang, code) => {
      const language = lang || 'text';
      const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const encoded = encodeURIComponent(code.trimEnd());
      const langLabel = language === 'text' ? 'code' : language;
      return (
        `<div class="my-5 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900 text-xs font-mono">` +
          `<div class="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950/60">` +
            `<span class="text-[10px] text-zinc-500 uppercase tracking-wider">${langLabel}</span>` +
            `<button class="copy-code-btn flex items-center gap-1.5 px-2 py-1 text-[11px] text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded transition-colors" data-code="${encoded}">` +
              `${copyIcon}<span>Copy</span>` +
            `</button>` +
          `</div>` +
          `<div class="overflow-x-auto p-4"><code class="text-zinc-300 leading-relaxed" data-lang="${language}">${escaped}</code></div>` +
        `</div>`
      );
    }
  );
  
  // Process inline code
  processed = processed.replace(
    /`([^`]+)`/g,
    '<code class="bg-zinc-900 px-1.5 py-0.5 rounded text-xs text-zinc-300">$1</code>'
  );
  
  // Process headings with IDs for anchors
  processed = processed.replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold text-white mt-6 mb-2">$1</h3>');
  processed = processed.replace(/^## (.*$)/gim, (_, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h2 id="${id}" class="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-20">${text}</h2>`;
  });
  processed = processed.replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-white mt-10 mb-4">$1</h1>');
  
  // Process nested lists properly
  const lines = processed.split('\n');
  const result: string[] = [];
  let listStack: number[] = [];
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(\s*)\* (.*)$/);
    
    if (match) {
      const indent = match[1].length;
      const content = match[2];
      
      if (!inList) {
        inList = true;
        result.push('<ul class="list-disc ml-6 space-y-1 my-3 text-zinc-400 text-sm">');
        listStack.push(indent);
      } else {
        // Handle nesting
        while (listStack.length > 0 && listStack[listStack.length - 1] > indent) {
          result.push('</ul>');
          listStack.pop();
        }
        if (listStack.length === 0 || listStack[listStack.length - 1] < indent) {
          result.push('<ul class="list-disc ml-6 space-y-1 my-2">');
          listStack.push(indent);
        }
      }
      
      result.push(`<li>${content}</li>`);
    } else {
      // Close all open lists
      if (inList) {
        while (listStack.length > 0) {
          result.push('</ul>');
          listStack.pop();
        }
        inList = false;
      }
      result.push(line);
    }
  }
  
  // Close any remaining lists
  while (listStack.length > 0) {
    result.push('</ul>');
    listStack.pop();
  }
  
  processed = result.join('\n');
  
  // Process bold text
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-200">$1</strong>');
  
  // Process line breaks
  processed = processed.replace(/\n\n/g, '<br/>');
  
  return { html: processed, mermaidBlocks };
}

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const repo = searchParams.get('repo') ?? '';
  const sectionsParam = searchParams.get('sections') ?? '';
  const sections = sectionsParam ? sectionsParam.split(',') : ['documentation'];

  const selectedOptions = {
    documentation: sections.includes('documentation'),
    flowchart: sections.includes('diagrams'),
    quiz: sections.includes('quiz'),
  };

  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>(
    selectedOptions.documentation ? 'documentation' : selectedOptions.flowchart ? 'uml' : 'quiz'
  );
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'features' | 'class' | 'codebase'>('architecture');
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [diagramHeight, setDiagramHeight] = useState<number>(500);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  const loading = !data && !error;
  const step = useLoadingSteps(loading);

  // Track reading progress
  useEffect(() => {
    if (activeTab !== 'documentation') return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab navigation with arrow keys
      if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1].id);
        } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Extract headings for TOC
  const headings = useMemo(() => {
    if (!data?.documentation) return [];
    const matches = Array.from(data.documentation.matchAll(/^## (.+)$/gm));
    return matches.map(m => ({
      text: m[1],
      id: m[1].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }));
  }, [data?.documentation]);

  // Process markdown with Mermaid and proper list handling
  const processedDocs = useMemo(() => {
    if (!data?.documentation) return { html: '', mermaidBlocks: [] };
    return processMarkdown(data.documentation);
  }, [data?.documentation]);

  useEffect(() => {
    if (!repo) return;

    async function run() {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: repo,
            generateDocs: selectedOptions.documentation,
            generateUml: selectedOptions.flowchart,
            generateQuizData: selectedOptions.quiz,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? 'Analysis failed');
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong');
      }
    }

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo]);

  function toggleReveal(i: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const ALL_TABS: { id: TabId; label: string }[] = [
    { id: 'documentation', label: 'Documentation' },
    { id: 'uml',           label: 'UML / Flowchart' },
    { id: 'quiz',          label: 'Quiz' },
  ];
  const tabs = ALL_TABS.filter((t) =>
    t.id === 'documentation' ? selectedOptions.documentation :
    t.id === 'uml'           ? selectedOptions.flowchart :
                               selectedOptions.quiz
  );

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Reading Progress Bar */}
      {activeTab === 'documentation' && !loading && !error && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-white/20 z-50"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: readingProgress / 100 }}
          style={{ transformOrigin: 'left' }}
          transition={{ duration: 0.1 }}
        />
      )}

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-sm z-40"
        role="banner"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-0.5">
              {loading ? 'Analyzing' : error ? 'Error' : 'Report'}
            </p>
            <p className="text-sm font-mono text-zinc-300 truncate max-w-xs" title={repo}>{repo || '—'}</p>
          </div>
          {activeTab === 'documentation' && !loading && !error && readingProgress > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="text-[11px] text-zinc-500">{Math.round(readingProgress)}%</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ x: -2 }} transition={{ duration: 0.15 }}>
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-white transition-colors"
              aria-label="Analyze a new repository"
            >
              ← New repo
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Tabs — always visible so user can preview each section while loading */}
      {!error && (
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex gap-1 border-b border-zinc-900 px-4 pt-2"
          role="tablist"
          aria-label="Documentation sections"
        >
          {tabs.map((t, index) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="relative px-4 py-2.5 text-sm font-medium transition-colors"
              style={{ color: activeTab === t.id ? 'white' : 'rgb(113 113 122)' }}
              role="tab"
              aria-selected={activeTab === t.id}
              aria-controls={`tabpanel-${t.id}`}
              id={`tab-${t.id}`}
              tabIndex={activeTab === t.id ? 0 : -1}
              title={`Switch to ${t.label} (Alt + ${index === 0 ? '←' : '→'})`}
            >
              {activeTab === t.id && (
                <motion.div layoutId="tab-indicator" className="absolute inset-0 rounded-lg bg-white/[0.07]"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
              )}
              <span className="relative z-10">{t.label}</span>
              {activeTab === t.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-4 right-4 h-px bg-white"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
              )}
            </button>
          ))}
        </motion.nav>
      )}

      {/* Content */}
      <main
        className={`flex-1 px-6 py-10 w-full mx-auto ${activeTab === 'uml' && data ? 'max-w-7xl' : 'max-w-6xl'}`}
        role="main"
        aria-live="polite"
        aria-busy={loading}
      >
        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center gap-4 py-32">
            <p className="text-zinc-500 text-sm">Failed to analyze repository</p>
            <p className="text-red-400 text-xs font-mono bg-zinc-900 px-4 py-2 rounded-lg">{error}</p>
            <Link href="/" className="text-xs text-zinc-600 hover:text-white transition-colors mt-2">← Try another repo</Link>
          </div>
        )}

        {/* Loading: step indicator + per-tab skeleton */}
        {loading && (
          <>
            <StepIndicator step={step} total={STEPS.length - 1} />
            {activeTab === 'uml'  ? <DiagramsSkeleton /> :
             activeTab === 'quiz' ? <QuizSkeleton /> :
             <DocsSkeleton />}
          </>
        )}

        {/* Results */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            {/* Documentation */}
            {activeTab === 'documentation' && data?.documentation && (
              <motion.div key="docs" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex gap-8">
                {/* TOC Sidebar */}
                {headings.length > 0 && (
                  <aside className="hidden lg:block w-56 shrink-0">
                    <nav className="sticky top-20">
                      <p className="text-[10px] font-semibold text-zinc-600 mb-3 uppercase tracking-widest">Contents</p>
                      <ul className="space-y-0.5">
                        {headings.map(h => {
                          const isActive = activeHeadingId === h.id;
                          return (
                            <li key={h.id}>
                              <a
                                href={`#${h.id}`}
                                onClick={() => setActiveHeadingId(h.id)}
                                className="flex items-center gap-2.5 py-1.5 pr-2 text-xs transition-all duration-150 rounded"
                                style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgb(113,113,122)' }}
                              >
                                <span
                                  className="shrink-0 w-0.5 h-4 rounded-full transition-all duration-150"
                                  style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.5)' : 'transparent' }}
                                />
                                <span className={isActive ? 'font-medium' : ''}>{h.text}</span>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </aside>
                )}

                {/* Main Content */}
                <section className="flex-1 min-w-0">
                  <SectionLabel>Documentation</SectionLabel>
                  <DocumentationContent
                    html={processedDocs.html}
                    mermaidBlocks={processedDocs.mermaidBlocks}
                    onActiveHeadingChange={setActiveHeadingId}
                  />
                </section>
              </motion.div>
            )}

            {/* UML */}
            {activeTab === 'uml' && data?.uml && (() => {
              const uml = data.uml;

              // Derive per-tab data
              const archCategories    = Object.fromEntries((uml.architecture?.nodes ?? []).map(n => [n.id, n.category]));
              const archDescriptions  = Object.fromEntries((uml.architecture?.nodes ?? []).map(n => [n.id, n.description]));
              const classCategories   = Object.fromEntries((uml.classDiagram?.classes ?? []).map(c => [c.name, c.category]));
              const classDescriptions = Object.fromEntries((uml.classDiagram?.classes ?? []).map(c => [c.name, c.description]));

              // Only show Class Diagram tab if the codebase has real class hierarchy
              const showClassTab = uml.classDiagram?.hasClassHierarchy && uml.classDiagram.mermaid;
              const showCodebaseTab = (uml.codebaseMap?.nodes?.length ?? 0) > 0;
              const visibleSubTabs = [
                { id: 'architecture' as const, label: 'Architecture' },
                { id: 'features'     as const, label: 'Feature Flows' },
                ...(showCodebaseTab ? [{ id: 'codebase' as const, label: 'Codebase Map' }] : []),
                ...(showClassTab    ? [{ id: 'class'    as const, label: 'Class Diagram' }] : []),
              ];

              // Diagram-based tabs (architecture + class) use the fixed-height pan-zoom container
              const isDiagramTab = activeSubTab === 'architecture' || activeSubTab === 'class';

              return (
                <motion.div key="uml" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-4">
                  {/* Sub-tabs */}
                  <div className="flex gap-1">
                    {visibleSubTabs.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setActiveSubTab(t.id); setActiveNode(null); }}
                        className="px-4 py-2 text-xs font-medium rounded-lg transition-colors"
                        style={{
                          backgroundColor: activeSubTab === t.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                          color: activeSubTab === t.id ? 'white' : 'rgb(113,113,122)',
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Architecture — pan/zoom diagram + node panel */}
                  {activeSubTab === 'architecture' && uml.architecture && (
                    <div
                      className="flex gap-4"
                      style={{ height: `${Math.min(Math.max(diagramHeight + 48, 380), Math.round(window.innerHeight * 0.82))}px` }}
                    >
                      <div className="flex-1 min-w-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden relative">
                        <InteractiveDiagram
                          key="architecture"
                          chart={uml.architecture.mermaid}
                          id="architecture-diagram"
                          categories={archCategories}
                          activeNode={activeNode}
                          onNodeHover={setActiveNode}
                          onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
                          onHeightReady={setDiagramHeight}
                        />
                      </div>
                      <div className="w-72 shrink-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden flex flex-col">
                        <DescriptionPanel
                          descriptions={archDescriptions}
                          categories={archCategories}
                          activeNode={activeNode}
                          label="Architecture"
                          onNodeHover={setActiveNode}
                          onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Feature Flows — stacked cards with LR flowcharts + optional sequence drill-downs */}
                  {activeSubTab === 'features' && uml.features?.length > 0 && (
                    <FeatureFlowsView features={uml.features} repoUrl={repo} />
                  )}

                  {/* Codebase Map — React Flow + D3 force layout */}
                  {activeSubTab === 'codebase' && uml.codebaseMap && (
                    <CodebaseMapView nodes={uml.codebaseMap.nodes} edges={uml.codebaseMap.edges} />
                  )}

                  {/* Class Diagram — filtered to classes with relationships only */}
                  {activeSubTab === 'class' && showClassTab && (
                    <div
                      className="flex gap-4"
                      style={{ height: `${Math.min(Math.max(diagramHeight + 48, 380), Math.round(window.innerHeight * 0.82))}px` }}
                    >
                      <div className="flex-1 min-w-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden relative">
                        <InteractiveDiagram
                          key="class"
                          chart={uml.classDiagram!.mermaid!}
                          id="class-diagram"
                          categories={classCategories}
                          activeNode={activeNode}
                          onNodeHover={setActiveNode}
                          onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
                          onHeightReady={setDiagramHeight}
                        />
                      </div>
                      <div className="w-72 shrink-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden flex flex-col">
                        <DescriptionPanel
                          descriptions={classDescriptions}
                          categories={classCategories}
                          activeNode={activeNode}
                          label="Classes"
                          onNodeHover={setActiveNode}
                          onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })()}

            {/* Quiz */}
            {activeTab === 'quiz' && data?.quiz && (
              <motion.div key="quiz" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-4">
                {data.quiz.map((q, i) => (
                  <div key={i} className="rounded-xl border border-zinc-900 bg-zinc-950/60 p-5">
                    <p className="text-sm text-zinc-200 mb-4">
                      <span className="font-mono text-xs text-zinc-700 mr-2">{i + 1}.</span>
                      {q.question}
                    </p>
                    <div className="flex flex-col gap-2 mb-4">
                      {q.options.map((opt, j) => (
                        <motion.div
                          key={j}
                          animate={
                            revealed.has(i) && j === q.correctAnswer
                              ? { borderColor: 'rgb(21 128 61 / 0.6)', backgroundColor: 'rgb(5 46 22 / 0.4)' }
                              : { borderColor: 'rgb(39 39 42)', backgroundColor: 'transparent' }
                          }
                          transition={{ duration: 0.25 }}
                          className="text-xs px-3 py-2.5 rounded-lg border text-zinc-400"
                        >
                          {opt}
                        </motion.div>
                      ))}
                    </div>
                    <AnimatePresence>
                      {revealed.has(i) && q.explanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mb-4"
                        >
                          <div className="text-xs text-zinc-400 bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2.5">
                            {q.explanation}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.button
                      onClick={() => toggleReveal(i)}
                      whileHover={{ x: 2 }}
                      className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      {revealed.has(i) ? 'Hide answer ↑' : 'Reveal answer ↓'}
                    </motion.button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}


export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-sm text-zinc-400">Loading...</span>
        </div>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}
