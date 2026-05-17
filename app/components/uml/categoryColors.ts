export type Category = 'page' | 'route' | 'external' | 'internal' | 'actor';

export const CATEGORY_META: Record<Category, { fill: string; stroke: string; label: string; dot: string }> = {
  page:     { fill: '#1e3a5f', stroke: '#3b82f6', label: 'Page',     dot: '#3b82f6' },
  route:    { fill: '#3b2a5c', stroke: '#a855f7', label: 'Route',    dot: '#a855f7' },
  external: { fill: '#5c3a1e', stroke: '#f97316', label: 'External', dot: '#f97316' },
  internal: { fill: '#1e4a3a', stroke: '#22c55e', label: 'Internal', dot: '#22c55e' },
  actor:    { fill: '#27272a', stroke: '#71717a', label: 'Actor',    dot: '#71717a' },
};

export const BOX_COLORS: Record<Category, string> = {
  page:     'rgb(30,58,95)',
  route:    'rgb(59,42,92)',
  external: 'rgb(92,58,30)',
  internal: 'rgb(30,74,58)',
  actor:    'rgb(39,39,42)',
};
