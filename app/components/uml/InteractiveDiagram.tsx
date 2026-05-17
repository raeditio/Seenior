"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORY_META, BOX_COLORS, type Category } from "./categoryColors";

function cleanChart(raw: string): string {
  let result = raw
    .trim()
    .replace(/\r\n/g, "\n")
    // classDiagram-specific fixes
    .replace(/^(\s*)interface\s+/gm, "$1class ")
    .replace(/^(\s*)enum\s+/gm, "$1class ")
    .replace(/^(\s*)abstract class\s+/gm, "$1class ")
    .replace(/: [A-Za-z]+\[\]/g, "")
    .replace(/: Record<[^>]+>/g, "")
    .replace(/: [A-Za-z]+\|[A-Za-z| ]+/g, "")
    // flowchart fix: strip parenthetical asides from node labels, e.g.
    // [External APIs (e.g., Firebase)] → [External APIs]
    // Mermaid misparses "(" inside "[…]" as a shape token.
    .replace(/\[([^\]]*)\]/g, (_, content: string) =>
      `[${content.replace(/\s*\([^)]*\)/g, '').trim()}]`
    );

  // flowchart-only fix: strip colon-based edge labels which are invalid Mermaid syntax.
  // Gemini emits "A --> B[Label]: description text" but valid syntax is "A -->|label| B".
  // Strip the ": text" suffix from any line that contains a flowchart arrow.
  if (/^flowchart\b/i.test(result)) {
    result = result.replace(
      /^([^\n]*?(?:-->|--[^-\n]|-\.->|===)[^\n]*?)\s*:\s*[^\n]+$/gm,
      '$1'
    );
  }

  return result;
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
  const svgViewBoxRef = useRef<{ vw: number; vh: number } | null>(null);

  function fitToContainer() {
    const vb = svgViewBoxRef.current;
    if (!vb || !zoomContainerRef.current) return;
    const { vw, vh } = vb;
    const containerW = zoomContainerRef.current.clientWidth || 800;
    const containerH = zoomContainerRef.current.clientHeight || 500;
    const padding = 40;
    // Fit to width so the diagram always fills the canvas horizontally.
    // Only add the height constraint when the diagram is wider than tall
    // (e.g. a compact classDiagram) — that way it stays fully visible without
    // needing to scroll. For tall diagrams (typical sequence diagrams) we just
    // fit the width and let the user pan vertically.
    const scaleByWidth  = (containerW - padding) / vw;
    const scaleByHeight = (containerH - padding) / vh;
    const scaleToFit = vw >= vh
      ? Math.min(scaleByWidth, scaleByHeight, 2)   // wider-than-tall: fit both axes
      : Math.min(scaleByWidth, 2);                  // taller-than-wide: fit width only
    setScale(scaleToFit);
    setOffset({ x: (containerW - vw * scaleToFit) / 2, y: 20 });
  }

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

  // Fit to container after the SVG becomes visible (renderState flips to "done")
  useEffect(() => {
    if (renderState !== "done") return;
    // Double-rAF: first frame lets React paint the container (display:block),
    // second frame reads the now-valid clientWidth/clientHeight.
    let raf1: number;
    let raf2: number;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        fitToContainer();
        // Also report height now that the container is visible
        const svgEl = svgWrapRef.current?.querySelector("svg");
        const h = svgEl?.getBoundingClientRect().height || svgEl?.getBBox?.()?.height;
        if (h) onHeightReadyRef.current?.(h);
      });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderState]);

  useEffect(() => {
    let cancelled = false;
    svgViewBoxRef.current = null;
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
      const isClass    = cleaned.trimStart().startsWith('classDiagram');
      const isSequence = cleaned.trimStart().startsWith('sequenceDiagram');
      // Inject direction TB so classDiagram uses a top-to-bottom layout engine instead of
      // its default single-horizontal-rank, giving a readable multi-row grid.
      const directed = isClass
        ? cleaned.replace(/^(classDiagram[^\n]*\n)/, '$1  direction TB\n')
        : cleaned;
      // classDiagram and flowchart both accept classDef/class styling lines.
      // Only sequenceDiagram uses box-based grouping.
      const styled = Object.keys(categories).length > 0
        ? (isSequence ? injectSequenceBoxes(directed, categories) : injectClassDiagramStyles(directed, categories))
        : directed;

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
            svgEl.removeAttribute("width");
            attachNodeHandlers(svgEl);
            // Parse viewBox now (SVG is in DOM). Actual fitting happens in a useEffect
            // that fires after renderState → "done" so the container is visible.
            const viewBox = svgEl.getAttribute('viewBox');
            const parts = (viewBox ?? '').split(/[\s,]+/).map(Number);
            const vw = parts[2];
            const vh = parts[3];
            if (vw > 0 && vh > 0) {
              svgViewBoxRef.current = { vw, vh };
            } else {
              // Fallback: use getBBox for SVGs without an explicit viewBox
              requestAnimationFrame(() => {
                const bbox = svgEl.getBBox?.();
                if (bbox?.width > 0) svgViewBoxRef.current = { vw: bbox.width, vh: bbox.height };
                const h = bbox?.height || svgEl.getBoundingClientRect().height;
                if (h) onHeightReadyRef.current?.(h);
              });
            }
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

    // Flowchart nodes: Mermaid sets id="flowchart-NodeId-N" on the <g> element.
    // Extract the NodeId so it matches the architecture node IDs from Gemini.
    const flowchartMatch = elId.match(/^flowchart-(.+?)-\d+$/);
    if (flowchartMatch) return flowchartMatch[1];

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
      // Don't fire hover on mouseenter — it triggered opacity dimming which
      // looked like a jarring "zoom" effect. Only clicks sync with the panel.
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
      // No opacity dimming — it creates a distracting "zoom" feel on hover.
      // Only the active (clicked) node gets a bright outline.
      g.style.opacity = "1";
      g.querySelectorAll<SVGRectElement>("rect, polygon, circle, ellipse").forEach((shape) => {
        if (isActive) {
          shape.style.stroke = "#ffffff";
          shape.style.strokeWidth = "2.5";
          shape.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,0.35))";
          shape.style.transition = "stroke 0.12s, stroke-width 0.12s, filter 0.12s";
        } else {
          shape.style.stroke = "";
          shape.style.strokeWidth = "";
          shape.style.filter = "";
        }
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
            { label: "⊡", title: "Fit",      action: () => fitToContainer() },
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
