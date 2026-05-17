// Category types for UML diagram nodes
export type Category = 
  | 'controller'
  | 'service'
  | 'model'
  | 'repository'
  | 'utility'
  | 'middleware'
  | 'config'
  | 'interface'
  | 'type'
  | 'component'
  | 'hook'
  | 'context'
  | 'api'
  | 'route'
  | 'default';

// Color mapping for each category
export const categoryColors: Record<Category, { bg: string; border: string; text: string }> = {
  controller: {
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.3)',
    text: 'rgb(147, 197, 253)',
  },
  service: {
    bg: 'rgba(168, 85, 247, 0.1)',
    border: 'rgba(168, 85, 247, 0.3)',
    text: 'rgb(216, 180, 254)',
  },
  model: {
    bg: 'rgba(34, 197, 94, 0.1)',
    border: 'rgba(34, 197, 94, 0.3)',
    text: 'rgb(134, 239, 172)',
  },
  repository: {
    bg: 'rgba(249, 115, 22, 0.1)',
    border: 'rgba(249, 115, 22, 0.3)',
    text: 'rgb(253, 186, 116)',
  },
  utility: {
    bg: 'rgba(156, 163, 175, 0.1)',
    border: 'rgba(156, 163, 175, 0.3)',
    text: 'rgb(209, 213, 219)',
  },
  middleware: {
    bg: 'rgba(236, 72, 153, 0.1)',
    border: 'rgba(236, 72, 153, 0.3)',
    text: 'rgb(251, 207, 232)',
  },
  config: {
    bg: 'rgba(234, 179, 8, 0.1)',
    border: 'rgba(234, 179, 8, 0.3)',
    text: 'rgb(253, 224, 71)',
  },
  interface: {
    bg: 'rgba(20, 184, 166, 0.1)',
    border: 'rgba(20, 184, 166, 0.3)',
    text: 'rgb(153, 246, 228)',
  },
  type: {
    bg: 'rgba(99, 102, 241, 0.1)',
    border: 'rgba(99, 102, 241, 0.3)',
    text: 'rgb(199, 210, 254)',
  },
  component: {
    bg: 'rgba(14, 165, 233, 0.1)',
    border: 'rgba(14, 165, 233, 0.3)',
    text: 'rgb(186, 230, 253)',
  },
  hook: {
    bg: 'rgba(217, 70, 239, 0.1)',
    border: 'rgba(217, 70, 239, 0.3)',
    text: 'rgb(240, 171, 252)',
  },
  context: {
    bg: 'rgba(244, 63, 94, 0.1)',
    border: 'rgba(244, 63, 94, 0.3)',
    text: 'rgb(251, 113, 133)',
  },
  api: {
    bg: 'rgba(132, 204, 22, 0.1)',
    border: 'rgba(132, 204, 22, 0.3)',
    text: 'rgb(190, 242, 100)',
  },
  route: {
    bg: 'rgba(251, 146, 60, 0.1)',
    border: 'rgba(251, 146, 60, 0.3)',
    text: 'rgb(253, 186, 116)',
  },
  default: {
    bg: 'rgba(113, 113, 122, 0.1)',
    border: 'rgba(113, 113, 122, 0.3)',
    text: 'rgb(161, 161, 170)',
  },
};

// Get category color or default
export function getCategoryColor(category?: Category | string): { bg: string; border: string; text: string } {
  if (!category || !(category in categoryColors)) {
    return categoryColors.default;
  }
  return categoryColors[category as Category];
}

// Made with Bob
