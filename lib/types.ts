export type SectionId = "documentation" | "diagrams" | "quiz";

export interface AnalyzeRequest {
  repoUrl: string;
  sections: SectionId[];
  /** Flat map of file path → file content, provided by the crawler */
  files: Record<string, string>;
}

export interface FileToRead {
  path: string;
  reason: string;
}

export interface Module {
  name: string;
  businessRules: string;
  nonObviousDecisions: string;
}

export interface DocumentationSection {
  summary: string;
  filesToReadFirst: FileToRead[];
  businessLogic: Module[];
  techStack: string[];
  gotchas: string[];
}

export interface DiagramsSection {
  architectureChart: string;  // Mermaid flowchart TD source
  requestFlow: string;        // Mermaid sequenceDiagram source
}

export interface QuizQuestion {
  question: string;
  type: "multiple_choice" | "short_answer";
  options?: string[];         // only for multiple_choice
  answer: string;
}

export interface QuizSection {
  questions: QuizQuestion[];
}

export interface AnalyzeResponse {
  documentation?: DocumentationSection;
  diagrams?: DiagramsSection;
  quiz?: QuizSection;
}
