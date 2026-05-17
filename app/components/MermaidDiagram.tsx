"use client";

import { useEffect, useRef } from "react";

interface Props {
  chart: string;
  id: string;
}

/**
 * Light sanitisation for Gemini-generated Mermaid strings.
 * Mirrors the critical rules in InteractiveDiagram's cleanChart() so that
 * diagrams rendered here (feature-flow cards, doc embeds) don't crash.
 */
function cleanChart(raw: string): string {
  let result = raw.trim().replace(/\r\n/g, "\n");

  // Remove markdown fences if Gemini accidentally included them
  result = result.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/, "");

  // Flowchart-specific fixes
  if (/^flowchart\b/i.test(result)) {
    // Strip colon-based edge labels: "A --> B[Label]: description" → "A --> B[Label]"
    result = result.replace(
      /^([^\n]*?(?:-->|--[^-\n]|-\.->|===)[^\n]*?)\s*:\s*[^\n]+$/gm,
      "$1"
    );

    // Fix unquoted slashes inside node labels: [/api/github] → ["/api/github"]
    // Mermaid v11 treats [/text/] as a parallelogram shape token and chokes on partial forms.
    result = result.replace(
      /\[([^\]"']*\/[^\]"']*)\]/g,
      (_, inner: string) => `["${inner.replace(/"/g, "'")}"]`
    );

    // Strip parenthetical asides from node labels: [Name (e.g. foo)] → [Name]
    result = result.replace(/\[([^\]]*)\]/g, (_, content: string) =>
      `[${content.replace(/\s*\([^)]*\)/g, "").trim()}]`
    );
  }

  return result;
}

export default function MermaidDiagram({ chart, id }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        suppressErrorRendering: true,
      });

      if (cancelled || !ref.current) return;

      const cleaned = cleanChart(chart);

      try {
        await mermaid.parse(cleaned);
      } catch {
        // Silently skip unparseable diagrams rather than crashing the whole page
        if (!cancelled && ref.current) {
          ref.current.innerHTML =
            `<pre class="text-xs text-zinc-600 font-mono p-2 overflow-x-auto">${cleaned}</pre>`;
        }
        return;
      }

      try {
        const { svg } = await mermaid.render(id, cleaned);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch {
        // ignore render errors — diagram simply won't appear
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart, id]);

  return <div ref={ref} className="overflow-x-auto" />;
}
