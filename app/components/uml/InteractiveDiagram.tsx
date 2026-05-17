"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORY_META, BOX_COLORS, type Category } from "./categoryColors";

function cleanChart(raw: string): string {
  return raw
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/^(\s*)interface\s+/gm, "$1class ")
    .replace(/^(\s*)enum\s+/gm, "$1class ")
    .replace(/^(\s*)abstract class\s+/gm, "$1class ")
    .replace(/: [A-Za-z]+\[\]/g, "")
    .replace(/: Record<[^>]+>/g, "")
    .replace(/: [A-Za-z]+\|[A-Za-z| ]+/g, "");
}

function injectClassDiagramStyles(chart: string, categories: Record<string, string>): string {
  if (!Object.keys(categories).length) return chart;

  const grouped = Object.entries(categories).reduce<Record<string, string[]>>((acc, [name, cat]) => {
    (acc[cat] ??= []).push(name);
    return acc;
  }, {});

  const used = new Set(Object.values(categories));
  const classDefLines = [...used].map((cat) => {
    const m = CATEGORY_META[cat as Category];
    return m ? `classDef ${cat} fill:${m.fill},stroke:${m.stroke},color:#fff` : '';
  }).filter(Boolean);

  // Mermaid classDiagram requires one `class NodeName styleName` line per node —
  // comma-separated names are not supported and cause a parse error.
  const cssClassLines = Object.entries(grouped).flatMap(
    ([cat, names]) => names.map(n => `class ${n} ${cat}`)
  );

  return [
    chart,
    'classDef default fill:#18181b,stroke:#3f3f46,color:#a1a1aa',
    ...classDefLines,
    ...cssClassLines,
  ].join('\n');
}

function injectSequenceBoxes(chart: string, categories: Record<string, string>): string {
  if (!Object.keys(categories).length) return chart;

  const lines = chart.split('\n');
  const header = lines[0];
  const participantRe = /^\s*(participant|actor)\s+(\w+)/;
  const participantLines: string[] = [];
  const otherLines: string[] = [];

  lines.slice(1).forEach((line) => {
    if (participantRe.test(line)) participantLines.push(line.trim());
    else otherLines.push(line);
  });

  const groups: Record<string, string[]> = {};
  participantLines.forEach((line) => {
    const m = line.match(participantRe);
    const name = m?.[2] ?? '';
    const cat = categories[name] ?? 'internal';
    (groups[cat] ??= []).push(line);
  });

  // Only inject boxes when participants are spread across 2+ categories —
  // a single category box paints the whole diagram one color which is worse than nothing.
  if (Object.keys(groups).length < 2) return chart;

  const boxLines: string[] = [];
  for (const [cat, participants] of Object.entries(groups)) {
    const color = BOX_COLORS[cat as Category] ?? 'rgb(39,39,42)';
    const label = CATEGORY_META[cat as Category]?.label ?? cat;
    boxLines.push(`    box ${color} ${label}`);
    participants.forEach((p) => boxLines.push(`    ${p}`));
    boxLines.push('    end');
  }

  return [header, ...boxLines, ...otherLines].join('\n');
}

interface Props {
  chart: string;
  id: string;
  categories?: Record<string, string>;
  activeNode: string | null;
  onNodeHover: (name: string | null) => void;
  onNodeClick: (name: string) => void;
  onHeightReady?: (height: number) => void;
}

export default function InteractiveDiagram({
  chart, id, categories = {}, activeNode, onNodeHover, onNodeClick, onHeightReady,
}: Props) {
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const [renderState, setRenderState] = useState<"loading" | "done" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  // Pan/zoom
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const isDragged = useRef(false);

  // Non-passive wheel listener so preventDefault() actually blocks page scroll
  useEffect(() => {
    const el = zoomContainerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      setScale((s) => Math.min(4, Math.max(0.3, s * factor)));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const onNodeHoverRef = useRef(onNodeHover);
  const onNodeClickRef = useRef(onNodeClick);
  const onHeightReadyRef = useRef(onHeightReady);
  useEffect(() => { onNodeHoverRef.current = onNodeHover; }, [onNodeHover]);
  useEffect(() => { onNodeClickRef.current = onNodeClick; }, [onNodeClick]);
  useEffect(() => { onHeightReadyRef.current = onHeightReady; }, [onHeightReady]);

  const nodeMapRef = useRef<Map<SVGGElement, string>>(new Map());

  useEffect(() => {
    let cancelled = false;
    setRenderState("loading");
    setErrorMsg("");
    setScale(1);
    setOffset({ x: 0, y: 0 });

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
          fontSize: "14px",
        },
      });

      if (cancelled || !svgWrapRef.current) return;

      const cleaned = cleanChart(chart);
      const isClass = cleaned.trimStart().startsWith('classDiagram');
      const styled = Object.keys(categories).length > 0
        ? (isClass ? injectClassDiagramStyles(cleaned, categories) : injectSequenceBoxes(cleaned, categories))
        : cleaned;

      try {
        await mermaid.parse(styled);
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : "Invalid diagram syntax");
          setRenderState("error");
        }
        return;
      }

      try {
        const { svg } = await mermaid.render(id, styled);
        if (!cancelled && svgWrapRef.current) {
          svgWrapRef.current.innerHTML = svg;
          const svgEl = svgWrapRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.removeAttribute("height");
            svgEl.style.width = "100%";
            svgEl.style.height = "auto";
            svgEl.style.minWidth = "500px";
            attachNodeHandlers(svgEl);
            // Report natural SVG height for container auto-sizing
            requestAnimationFrame(() => {
              const h = svgEl.getBoundingClientRect().height || svgEl.getBBox?.()?.height;
              if (h) onHeightReadyRef.current?.(h);
            });
          }
          setRenderState("done");
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : "Render failed");
          setRenderState("error");
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart, id, categories]);

  function getNodeName(el: Element): string | null {
    const elId = el.getAttribute("id") ?? "";
    const cls = el.getAttribute("class") ?? "";

    const isSequenceNode =
      cls.includes("actor") ||
      cls.includes("participant") ||
      elId.startsWith("actor");
    if (isSequenceNode) {
      for (const t of el.querySelectorAll("text")) {
        const content = t.textContent?.trim() ?? "";
        if (content && content.length > 0 && content.length < 60) return content;
      }
      const fo = el.querySelector("foreignObject");
      if (fo?.textContent?.trim()) {
        const firstLine = fo.textContent.trim().split(/\n/)[0].trim();
        if (firstLine) return firstLine;
      }
    }

    const classIdMatch = elId.match(/^classId-(.+)-\d+$/);
    if (classIdMatch) return classIdMatch[1];

    const dataId = el.getAttribute("data-id");
    if (dataId?.trim()) return dataId.trim();

    const fo = el.querySelector("foreignObject");
    if (fo?.textContent?.trim()) {
      const firstLine = fo.textContent.trim().split(/\n/)[0].trim();
      if (firstLine) return firstLine;
    }

    const title = el.querySelector("title");
    if (title?.textContent?.trim()) return title.textContent.trim();

    const text = el.querySelector("text");
    return text?.textContent?.trim() ?? null;
  }

  function attachNodeHandlers(svgEl: SVGSVGElement) {
    nodeMapRef.current.clear();

    function wire(g: SVGGElement) {
      if (nodeMapRef.current.has(g)) return;
      let ancestor = g.parentElement;
      while (ancestor && ancestor !== (svgEl as unknown as HTMLElement)) {
        if (nodeMapRef.current.has(ancestor as unknown as SVGGElement)) return;
        ancestor = ancestor.parentElement;
      }
      const name = getNodeName(g);
      if (!name) return;
      nodeMapRef.current.set(g, name);
      g.style.cursor = "pointer";
      g.addEventListener("mouseenter", () => onNodeHoverRef.current(name));
      g.addEventListener("mouseleave", () => onNodeHoverRef.current(null));
      g.addEventListener("click", () => {
        if (!isDragged.current) onNodeClickRef.current(name);
      });
    }

    svgEl.querySelectorAll<SVGGElement>("g.node, g.classGroup, g[id^='classId-']").forEach(wire);
    svgEl.querySelectorAll<SVGGElement>(
      "g.actor, g.participant, g[class*='actor'], g[class*='participant'], g[id^='actor']"
    ).forEach(wire);
  }

  useEffect(() => {
    if (renderState !== "done") return;
    nodeMapRef.current.forEach((name, g) => {
      const isActive = activeNode !== null && name === activeNode;
      g.style.opacity = activeNode === null || isActive ? "1" : "0.25";
      g.style.transition = "opacity 0.15s";
      g.querySelectorAll<SVGRectElement>("rect").forEach((rect) => {
        rect.style.stroke = isActive ? "rgba(255,255,255,0.85)" : "";
        rect.style.strokeWidth = isActive ? "2" : "";
        rect.style.transition = "stroke 0.15s, stroke-width 0.15s";
      });
    });
  }, [activeNode, renderState]);

  function handleMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    isDragged.current = false;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragged.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  }

  function handleMouseUp() { dragging.current = false; }

  return (
    <div className="relative w-full h-full flex flex-col">
      {renderState === "done" && (
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          {([
            { label: "+", title: "Zoom in",  action: () => setScale((s) => Math.min(4, s * 1.3)) },
            { label: "−", title: "Zoom out", action: () => setScale((s) => Math.max(0.3, s / 1.3)) },
            { label: "⊡", title: "Fit",      action: () => { setScale(1); setOffset({ x: 0, y: 0 }); } },
          ] as const).map(({ label, title, action }) => (
            <button
              key={label}
              title={title}
              onClick={action}
              className="w-7 h-7 rounded-md bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors flex items-center justify-center select-none"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {renderState === "loading" && (
        <div className="flex items-center gap-2 py-16 justify-center flex-1">
          <div className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-zinc-400 animate-spin" />
          <span className="text-xs text-zinc-600">Rendering diagram…</span>
        </div>
      )}

      {renderState === "error" && (
        <div className="py-6 flex flex-col gap-3 p-4 flex-1">
          <p className="text-xs text-zinc-500">Could not render diagram — showing raw source</p>
          {errorMsg && <p className="text-xs text-red-400/70 font-mono">{errorMsg}</p>}
          <pre className="text-[11px] text-zinc-600 font-mono overflow-x-auto whitespace-pre-wrap break-all bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
            {chart}
          </pre>
        </div>
      )}

      <div
        ref={zoomContainerRef}
        className="flex-1 overflow-hidden"
        style={{
          display: renderState === "done" ? "block" : "none",
          cursor: dragging.current ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={svgWrapRef}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "top left",
            transition: dragging.current ? "none" : "transform 0.05s ease-out",
            padding: "16px",
          }}
        />
      </div>
    </div>
  );
}
