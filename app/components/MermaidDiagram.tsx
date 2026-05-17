"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  chart: string;
  id: string;
}

function cleanChart(raw: string): string {
  return raw
    .trim()
    .replace(/\r\n/g, "\n")
    // Replace TypeScript/Java keywords Mermaid doesn't understand
    .replace(/^(\s*)interface\s+/gm, "$1class ")
    .replace(/^(\s*)enum\s+/gm, "$1class ")
    .replace(/^(\s*)abstract class\s+/gm, "$1class ")
    // Strip type annotations Mermaid can't handle
    .replace(/: [A-Za-z]+\[\]/g, "")
    .replace(/: Record<[^>]+>/g, "")
    .replace(/: [A-Za-z]+\|[A-Za-z| ]+/g, "");
}

export default function MermaidDiagram({ chart, id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    setErrorMsg("");

    async function render() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        suppressErrorRendering: true,
        themeVariables: {
          background: "#09090b",
          mainBkg: "#18181b",
          nodeBorder: "#3f3f46",
          lineColor: "#52525b",
          textColor: "#a1a1aa",
          edgeLabelBackground: "#18181b",
          clusterBkg: "#18181b",
          titleColor: "#e4e4e7",
          fontFamily: "ui-monospace, monospace",
          fontSize: "13px",
        },
      });

      if (cancelled || !ref.current) return;

      const cleaned = cleanChart(chart);

      try {
        await mermaid.parse(cleaned);
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : "Invalid diagram syntax");
          setState("error");
        }
        return;
      }

      try {
        const { svg } = await mermaid.render(id, cleaned);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          const svgEl = ref.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.width = "100%";
            svgEl.style.height = "auto";
            svgEl.style.maxWidth = "100%";
          }
          setState("done");
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : "Render failed");
          setState("error");
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart, id]);

  return (
    <div>
      {state === "loading" && (
        <div className="flex items-center gap-2 py-8 justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-zinc-400 animate-spin" />
          <span className="text-xs text-zinc-600">Rendering diagram…</span>
        </div>
      )}

      {state === "error" && (
        <div className="py-6 flex flex-col gap-3">
          <p className="text-xs text-zinc-500">Could not render diagram — showing raw source</p>
          {errorMsg && <p className="text-xs text-red-400/70 font-mono">{errorMsg}</p>}
          <pre className="text-[11px] text-zinc-600 font-mono overflow-x-auto whitespace-pre-wrap break-all bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
            {chart}
          </pre>
        </div>
      )}

      <div
        ref={ref}
        className="overflow-x-auto"
        style={{ display: state === "done" ? "block" : "none" }}
      />
    </div>
  );
}
