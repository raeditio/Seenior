'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveDiagram from '@/app/components/uml/InteractiveDiagram';
import DescriptionPanel from '@/app/components/uml/DescriptionPanel';
import { type Category } from '@/app/components/uml/categoryColors';

interface UmlData {
  classDiagram: string;
  sequenceDiagram: string;
  descriptions: Record<string, string>;
  categories: Record<string, Category>;
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

function extractActorNames(diagram: string): Set<string> {
  const names = new Set<string>();
  for (const m of diagram.matchAll(/^(?:participant|actor)\s+(\w+)/gm)) names.add(m[1]);
  for (const m of diagram.matchAll(/^(\w+)(?:->>|-->|->|-->>)/gm)) names.add(m[1]);
  for (const m of diagram.matchAll(/(?:->>|-->|->|-->>)(\w+):/gm)) names.add(m[1]);
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

export default function ResultsPage() {
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
  const [activeSubTab, setActiveSubTab] = useState<'class' | 'sequence'>('class');
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [diagramHeight, setDiagramHeight] = useState<number>(500);

  const loading = !data && !error;
  const step = useLoadingSteps(loading);

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
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between"
      >
        <div>
          <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-0.5">
            {loading ? 'Analyzing' : error ? 'Error' : 'Report'}
          </p>
          <p className="text-sm font-mono text-zinc-300 truncate max-w-xs">{repo || '—'}</p>
        </div>
        <motion.div whileHover={{ x: -2 }} transition={{ duration: 0.15 }}>
          <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors">← New repo</Link>
        </motion.div>
      </motion.header>

      {/* Tabs — always visible so user can preview each section while loading */}
      {!error && (
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex gap-1 border-b border-zinc-900 px-4 pt-2"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="relative px-4 py-2.5 text-sm font-medium transition-colors"
              style={{ color: activeTab === t.id ? 'white' : 'rgb(113 113 122)' }}
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
      <main className={`flex-1 px-6 py-10 w-full mx-auto ${activeTab === 'uml' && data ? 'max-w-7xl' : 'max-w-3xl'}`}>
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
              <motion.div key="docs" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-10">
                <section>
                  <SectionLabel>Documentation</SectionLabel>
                  <div
                    className="text-zinc-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: data.documentation
                        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-zinc-300 my-4"><code>$2</code></pre>')
                        .replace(/`([^`]+)`/g, '<code class="bg-zinc-900 px-1.5 py-0.5 rounded text-xs text-zinc-300">$1</code>')
                        .replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold text-white mt-6 mb-2">$1</h3>')
                        .replace(/^## (.*$)/gim, '<h2 class="text-lg font-semibold text-white mt-8 mb-3">$1</h2>')
                        .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-white mt-10 mb-4">$1</h1>')
                        .replace(/^\* (.*$)/gim, '<li class="ml-4 text-zinc-400 text-sm">$1</li>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-200">$1</strong>')
                        .replace(/\n\n/g, '<br/>')
                    }}
                  />
                </section>
              </motion.div>
            )}

            {/* UML */}
            {activeTab === 'uml' && data?.uml && (() => {
              // Class tab: show ALL descriptions (diagram nodes + utility functions/interfaces the AI included).
              // Sequence tab: show only actors that appear in the diagram.
              const sequenceActors = extractActorNames(data.uml.sequenceDiagram);
              const panelDescriptions = activeSubTab === 'sequence'
                ? Object.fromEntries(
                    Object.entries(data.uml.descriptions).filter(
                      ([name]) => sequenceActors.size === 0 || sequenceActors.has(name)
                    )
                  )
                : data.uml.descriptions;
              const panelLabel = activeSubTab === 'class' ? 'Components' : 'Actors';

              return (
                <motion.div key="uml" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-4">
                  {/* Sub-tabs */}
                  <div className="flex gap-1">
                    {(['class', 'sequence'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setActiveSubTab(t); setActiveNode(null); }}
                        className="px-4 py-2 text-xs font-medium rounded-lg transition-colors"
                        style={{
                          backgroundColor: activeSubTab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                          color: activeSubTab === t ? 'white' : 'rgb(113,113,122)',
                        }}
                      >
                        {t === 'class' ? 'Class Diagram' : 'Sequence Diagram'}
                      </button>
                    ))}
                  </div>

                  {/* Side-by-side: diagram + description panel */}
                  <div
                    className="flex gap-4"
                    style={{ height: `${Math.min(Math.max(diagramHeight + 48, 380), Math.round(window.innerHeight * 0.82))}px` }}
                  >
                    {/* Diagram — pan/zoom viewport */}
                    <div className="flex-1 min-w-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden relative">
                      <InteractiveDiagram
                        key={activeSubTab}
                        chart={activeSubTab === 'class' ? data.uml.classDiagram : data.uml.sequenceDiagram}
                        id={activeSubTab === 'class' ? 'class-diagram' : 'sequence-diagram'}
                        categories={data.uml.categories ?? {}}
                        activeNode={activeNode}
                        onNodeHover={setActiveNode}
                        onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
                        onHeightReady={setDiagramHeight}
                      />
                    </div>

                    {/* Description panel — sticky header, independently scrollable list */}
                    <div className="w-72 shrink-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden flex flex-col">
                      <DescriptionPanel
                        descriptions={panelDescriptions}
                        categories={data.uml.categories ?? {}}
                        activeNode={activeNode}
                        label={panelLabel}
                        onNodeHover={setActiveNode}
                        onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
                      />
                    </div>
                  </div>
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
