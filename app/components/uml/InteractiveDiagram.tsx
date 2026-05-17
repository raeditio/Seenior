'use client';

import { useEffect, useRef, useState } from 'react';
import { type Category, getCategoryColor } from './categoryColors';

interface Props {
  chart: string;
  id: string;
  categories: Record<string, Category>;
  activeNode: string | null;
  onNodeHover: (name: string | null) => void;
  onNodeClick: (name: string) => void;
  onHeightReady: (height: number) => void;
}

export default function InteractiveDiagram({
  chart,
  id,
  categories,
  activeNode,
  onNodeHover,
  onNodeClick,
  onHeightReady,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Render Mermaid diagram
  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          darkMode: true,
          background: '#000000',
          primaryColor: '#1f1f1f',
          primaryTextColor: '#e4e4e7',
          primaryBorderColor: '#3f3f46',
          lineColor: '#52525b',
          secondaryColor: '#18181b',
          tertiaryColor: '#27272a',
        },
      });

      if (cancelled || !containerRef.current) return;

      try {
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgRef.current = svgElement;
            
            // Get SVG dimensions and report height
            const bbox = svgElement.getBBox();
            const height = bbox.height || 400;
            onHeightReady(height);

            // Center the diagram initially
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;
            const svgWidth = bbox.width || 800;
            
            // Calculate initial scale to fit
            const scaleToFit = Math.min(
              containerWidth / svgWidth,
              containerHeight / height,
              1
            );
            setScale(scaleToFit * 0.9); // 90% to add some padding
            
            // Center position
            setPosition({
              x: (containerWidth - svgWidth * scaleToFit * 0.9) / 2,
              y: 20, // Small top padding
            });

            // Setup node interactions
            setupNodeInteractions(svgElement);
          }
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id, onHeightReady]);

  // Setup node click and hover handlers
  function setupNodeInteractions(svg: SVGSVGElement) {
    // Find all node elements (class nodes and sequence diagram participants)
    const nodes = svg.querySelectorAll('.node, .actor, .participant');
    
    nodes.forEach((node) => {
      const element = node as SVGElement;
      
      // Extract node name from various possible locations
      let nodeName = '';
      const textElement = element.querySelector('text, .nodeLabel, .label');
      if (textElement) {
        nodeName = textElement.textContent?.trim() || '';
      }
      
      // Also check for id-based naming
      if (!nodeName && element.id) {
        nodeName = element.id.replace(/^flowchart-|^node-/, '');
      }

      if (!nodeName) return;

      // Make interactive
      element.style.cursor = 'pointer';
      element.style.transition = 'opacity 0.2s';

      element.addEventListener('mouseenter', () => {
        onNodeHover(nodeName);
      });

      element.addEventListener('mouseleave', () => {
        onNodeHover(null);
      });

      element.addEventListener('click', (e) => {
        e.stopPropagation();
        onNodeClick(nodeName);
      });
    });
  }

  // Apply category colors and active state to nodes
  useEffect(() => {
    if (!svgRef.current) return;

    const nodes = svgRef.current.querySelectorAll('.node, .actor, .participant');
    
    nodes.forEach((node) => {
      const element = node as SVGElement;
      let nodeName = '';
      
      const textElement = element.querySelector('text, .nodeLabel, .label');
      if (textElement) {
        nodeName = textElement.textContent?.trim() || '';
      }
      
      if (!nodeName && element.id) {
        nodeName = element.id.replace(/^flowchart-|^node-/, '');
      }

      if (!nodeName) return;

      const category = categories[nodeName];
      const colors = getCategoryColor(category);
      const isActive = activeNode === nodeName;

      // Apply colors to rect/path elements
      const shapes = element.querySelectorAll('rect, path, polygon, circle, ellipse');
      shapes.forEach((shape) => {
        const shapeElement = shape as SVGElement;
        if (isActive) {
          shapeElement.style.fill = colors.bg;
          shapeElement.style.stroke = colors.border;
          shapeElement.style.strokeWidth = '2px';
          shapeElement.style.filter = 'brightness(1.3)';
        } else if (category) {
          shapeElement.style.fill = colors.bg;
          shapeElement.style.stroke = colors.border;
          shapeElement.style.strokeWidth = '1px';
          shapeElement.style.filter = 'none';
        } else {
          shapeElement.style.filter = 'none';
        }
      });

      // Apply colors to text
      const texts = element.querySelectorAll('text, .nodeLabel, .label');
      texts.forEach((text) => {
        const textElement = text as SVGElement;
        if (category) {
          textElement.style.fill = colors.text;
        }
      });

      // Opacity for non-active nodes when one is active
      if (activeNode && !isActive) {
        element.style.opacity = '0.4';
      } else {
        element.style.opacity = '1';
      }
    });
  }, [categories, activeNode]);

  // Pan and zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.3, scale + delta), 3);
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Reset view
  const handleReset = () => {
    if (!containerRef.current || !svgRef.current) return;
    
    const bbox = svgRef.current.getBBox();
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const svgWidth = bbox.width || 800;
    const height = bbox.height || 400;
    
    const scaleToFit = Math.min(
      containerWidth / svgWidth,
      containerHeight / height,
      1
    );
    
    setScale(scaleToFit * 0.9);
    setPosition({
      x: (containerWidth - svgWidth * scaleToFit * 0.9) / 2,
      y: 20,
    });
  };

  return (
    <div className="relative w-full h-full">
      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button
          onClick={() => setScale((s) => Math.min(s + 0.2, 3))}
          className="w-8 h-8 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center text-lg"
          title="Zoom in"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setScale((s) => Math.max(s - 0.2, 0.3))}
          className="w-8 h-8 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center text-lg"
          title="Zoom out"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={handleReset}
          className="px-3 h-8 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center text-xs"
          title="Reset view"
          aria-label="Reset view"
        >
          Reset
        </button>
      </div>

      {/* Diagram viewport */}
      <div
        className="w-full h-full overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          ref={containerRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s',
          }}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-3 left-3 text-[10px] text-zinc-600 bg-zinc-900/60 px-2 py-1 rounded">
        Scroll to zoom • Drag to pan • Click nodes for details
      </div>
    </div>
  );
}

// Made with Bob
