"use client";

import { useEffect, useRef } from "react";

interface Props {
  chart: string;
  id: string;
}

export default function MermaidDiagram({ chart, id }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({ startOnLoad: false, theme: "dark" });

      if (cancelled || !ref.current) return;

      const { svg } = await mermaid.render(id, chart);
      if (!cancelled && ref.current) {
        ref.current.innerHTML = svg;
      }
    }

    render().catch(console.error);
    return () => { cancelled = true; };
  }, [chart, id]);

  return <div ref={ref} className="overflow-x-auto" />;
}
