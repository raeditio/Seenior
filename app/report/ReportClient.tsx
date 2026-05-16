"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { AnalyzeResponse, SectionId, QuizQuestion } from "@/lib/types";
import MermaidDiagram from "@/app/components/MermaidDiagram";

const TAB_LABELS: Record<SectionId, string> = {
  documentation: "Documentation",
  diagrams: "UML / Flowchart",
  quiz: "Quiz",
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const childFade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

interface Props {
  repo: string;
  sections: SectionId[];
  data: AnalyzeResponse;
}

export default function ReportClient({ repo, sections, data }: Props) {
  const [activeTab, setActiveTab] = useState<SectionId>(sections[0]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between"
      >
        <div>
          <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-0.5">Analyzing</p>
          <p className="text-sm font-mono text-zinc-300 truncate max-w-xs">{repo}</p>
        </div>
        <motion.div whileHover={{ x: -2 }} transition={{ duration: 0.15 }}>
          <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors">
            ← New repo
          </Link>
        </motion.div>
      </motion.header>

      {/* Tabs */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="flex gap-1 border-b border-zinc-900 px-4 pt-2"
      >
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setActiveTab(s)}
            className="relative px-4 py-2.5 text-sm font-medium transition-colors"
            style={{ color: activeTab === s ? "white" : "rgb(113 113 122)" }}
          >
            {activeTab === s && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-lg bg-white/[0.07]"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10">{TAB_LABELS[s]}</span>
            {activeTab === s && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-4 right-4 h-px bg-white"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
          </button>
        ))}
      </motion.nav>

      {/* Content */}
      <main className="flex-1 px-6 py-10 max-w-3xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "documentation" && data.documentation && (
            <motion.div key="documentation" variants={fadeUp} initial="hidden" animate="show" exit="exit">
              <DocumentationTab doc={data.documentation} />
            </motion.div>
          )}
          {activeTab === "diagrams" && data.diagrams && (
            <motion.div key="diagrams" variants={fadeUp} initial="hidden" animate="show" exit="exit">
              <DiagramsTab diagrams={data.diagrams} />
            </motion.div>
          )}
          {activeTab === "quiz" && data.quiz && (
            <motion.div key="quiz" variants={fadeUp} initial="hidden" animate="show" exit="exit">
              <QuizTab questions={data.quiz.questions} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function DocumentationTab({ doc }: { doc: NonNullable<AnalyzeResponse["documentation"]> }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-12">
      <motion.section variants={childFade}>
        <SectionLabel>What is this?</SectionLabel>
        <p className="text-zinc-300 leading-relaxed text-[15px]">{doc.summary}</p>
      </motion.section>

      <motion.section variants={childFade}>
        <SectionLabel>Read these 5 files first</SectionLabel>
        <ol className="flex flex-col gap-3">
          {doc.filesToReadFirst.map((f, i) => (
            <motion.li
              key={i}
              variants={childFade}
              className="flex gap-4 p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 hover:border-zinc-800 transition-colors"
            >
              <span className="text-zinc-700 font-mono text-xs w-4 shrink-0 mt-0.5">{i + 1}</span>
              <div className="min-w-0">
                <p className="font-mono text-xs text-zinc-300 truncate">{f.path}</p>
                <p className="text-xs text-zinc-600 mt-1">{f.reason}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </motion.section>

      <motion.section variants={childFade}>
        <SectionLabel>Business logic by module</SectionLabel>
        <div className="flex flex-col gap-3">
          {doc.businessLogic.map((m, i) => (
            <motion.div
              key={i}
              variants={childFade}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.15 }}
              className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/60 hover:border-zinc-800 transition-colors"
            >
              <p className="font-semibold text-white text-sm mb-3">{m.name}</p>
              <p className="text-xs text-zinc-500 mb-1.5">
                <span className="text-zinc-700">Rules · </span>{m.businessRules}
              </p>
              <p className="text-xs text-zinc-500">
                <span className="text-zinc-700">Watch out · </span>{m.nonObviousDecisions}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={childFade}>
        <SectionLabel>Tech stack</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {doc.techStack.map((t, i) => (
            <motion.span
              key={i}
              variants={childFade}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.12 }}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400"
            >
              {t}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {doc.gotchas.length > 0 && (
        <motion.section variants={childFade}>
          <SectionLabel>Gotchas</SectionLabel>
          <div className="flex flex-col gap-2">
            {doc.gotchas.map((g, i) => (
              <motion.div
                key={i}
                variants={childFade}
                className="flex gap-3 text-xs text-zinc-500 p-3 rounded-lg bg-amber-950/20 border border-amber-900/30"
              >
                <span className="text-amber-700 shrink-0">⚠</span>
                {g}
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}

function DiagramsTab({ diagrams }: { diagrams: NonNullable<AnalyzeResponse["diagrams"]> }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-12">
      <motion.section variants={childFade}>
        <SectionLabel>Architecture map</SectionLabel>
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/60 p-6">
          <MermaidDiagram chart={diagrams.architectureChart} id="architecture-chart" />
        </div>
      </motion.section>

      <motion.section variants={childFade}>
        <SectionLabel>Request flow</SectionLabel>
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/60 p-6">
          <MermaidDiagram chart={diagrams.requestFlow} id="request-flow" />
        </div>
      </motion.section>
    </motion.div>
  );
}

function QuizTab({ questions }: { questions: QuizQuestion[] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-4">
      {questions.map((q, i) => (
        <motion.div
          key={i}
          variants={childFade}
          className="rounded-xl border border-zinc-900 bg-zinc-950/60 p-5 hover:border-zinc-800 transition-colors"
        >
          <p className="text-sm text-zinc-200 mb-4">
            <span className="font-mono text-xs text-zinc-700 mr-2">{i + 1}.</span>
            {q.question}
          </p>

          {q.type === "multiple_choice" && q.options && (
            <div className="flex flex-col gap-2 mb-4">
              {q.options.map((opt, j) => (
                <motion.div
                  key={j}
                  animate={
                    revealed.has(i) && opt === q.answer
                      ? { borderColor: "rgb(21 128 61 / 0.6)", backgroundColor: "rgb(5 46 22 / 0.4)" }
                      : { borderColor: "rgb(39 39 42)", backgroundColor: "transparent" }
                  }
                  transition={{ duration: 0.25 }}
                  className="text-xs px-3 py-2.5 rounded-lg border text-zinc-400"
                >
                  {opt}
                </motion.div>
              ))}
            </div>
          )}

          <AnimatePresence>
            {revealed.has(i) && q.type === "short_answer" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden mb-4"
              >
                <div className="text-xs text-green-400 bg-green-950/40 border border-green-900/50 rounded-lg px-3 py-2.5">
                  {q.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => toggle(i)}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.12 }}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            {revealed.has(i) ? "Hide answer ↑" : "Reveal answer ↓"}
          </motion.button>
        </motion.div>
      ))}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-4">
      {children}
    </p>
  );
}
