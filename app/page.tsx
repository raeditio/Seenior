"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "documentation", label: "Documentation", desc: "Summary, key files, business logic" },
  { id: "diagrams",      label: "UML / Flowchart", desc: "Architecture & request flow diagrams" },
  { id: "quiz",          label: "Quiz",            desc: "Comprehension questions to test understanding" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export default function Home() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");
  const [selected, setSelected] = useState<Set<SectionId>>(new Set());
  const [focused, setFocused] = useState(false);

  function toggleSection(id: SectionId) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const canSubmit = repoUrl.trim().length > 0 && selected.size > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const params = new URLSearchParams({
      repo: repoUrl.trim(),
      sections: [...selected].join(","),
    });
    router.push(`/results?${params.toString()}`);
  }

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-white/[0.03] blur-3xl" />
      </div>

      <motion.form
        onSubmit={handleSubmit}
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex flex-col gap-10 w-full max-w-lg"
      >
        <motion.div variants={item}>
          <span className="text-xs font-semibold tracking-[0.2em] text-zinc-600 uppercase">Seenior</span>
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Understand any codebase<br />
            <span className="text-zinc-500">in 60 seconds.</span>
          </h1>
          <p className="text-sm text-zinc-600">Paste a GitHub URL. Get an instant onboarding report.</p>
        </motion.div>

        <motion.div variants={item} className="relative">
          <motion.div
            animate={{
              boxShadow: focused
                ? "0 0 0 2px rgba(255,255,255,0.15), 0 0 24px rgba(255,255,255,0.04)"
                : "0 0 0 1px rgba(255,255,255,0.08)",
            }}
            transition={{ duration: 0.2 }}
            className="rounded-xl overflow-hidden"
          >
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="github.com/user/repo"
              className="w-full bg-zinc-900/60 backdrop-blur px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none text-sm"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-2">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Generate</p>
          {SECTIONS.map(({ id, label, desc }) => {
            const checked = selected.has(id);
            return (
              <motion.label
                key={id}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 rounded-xl cursor-pointer select-none"
                style={{
                  background: checked ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
                  border: checked ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.04)",
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                <input type="checkbox" checked={checked} onChange={() => toggleSection(id)} className="sr-only" />
                <motion.div
                  animate={{
                    backgroundColor: checked ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.05)",
                    borderColor: checked ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.15)",
                  }}
                  transition={{ duration: 0.15 }}
                  className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0"
                >
                  <AnimatePresence>
                    {checked && (
                      <motion.svg
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "backOut" }}
                        width="11" height="9" viewBox="0 0 11 9" fill="none"
                      >
                        <path d="M1 4L4 7.5L10 1" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-white">{label}</span>
                  <span className="text-xs text-zinc-600">{desc}</span>
                </div>
              </motion.label>
            );
          })}
        </motion.div>

        <motion.div variants={item}>
          <motion.button
            type="submit"
            disabled={!canSubmit}
            whileHover={canSubmit ? { scale: 1.02 } : {}}
            whileTap={canSubmit ? { scale: 0.97 } : {}}
            transition={{ duration: 0.15 }}
            className="relative overflow-hidden rounded-xl px-6 py-3.5 text-sm font-semibold transition-all disabled:cursor-not-allowed w-full"
            style={{
              background: canSubmit ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.08)",
              color: canSubmit ? "black" : "rgba(255,255,255,0.2)",
            }}
          >
            <motion.span animate={{ opacity: canSubmit ? 1 : 0.4 }} transition={{ duration: 0.2 }}>
              Analyze repository →
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.form>
    </main>
  );
}
