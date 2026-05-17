export function buildDocumentationPrompt(fileContext: string): string {
  return `You are a senior software engineer onboarding a new hire. Given the following repository files, produce a JSON object with this exact shape:

{
  "summary": "<1 paragraph: what this project does, who uses it, what problem it solves>",
  "filesToReadFirst": [
    { "path": "<relative file path>", "reason": "<one sentence why this file is the right starting point>" }
  ],
  "businessLogic": [
    { "name": "<module name>", "businessRules": "<what business rules live here>", "nonObviousDecisions": "<decisions a new hire wouldn't guess from the code alone>" }
  ],
  "techStack": ["<technology name>"],
  "gotchas": ["<one gotcha or non-standard pattern per item>"]
}

Rules:
- filesToReadFirst: exactly 5 entries, ordered from most to least important for understanding the whole system
- businessLogic: one entry per major module (3–7 modules)
- techStack: short strings only, e.g. "Next.js 15", "PostgreSQL", "Stripe SDK"
- gotchas: 2–5 items; skip this array if there are no real gotchas
- Output only valid JSON, no markdown, no explanation

Repository files:
${fileContext}`;
}

export function buildDiagramsPrompt(fileContext: string): string {
  return `You are a senior software engineer onboarding a new hire. Given the following repository files, produce a JSON object with this exact shape:

{
  "architectureChart": "<Mermaid flowchart TD source as a single string with \\n for newlines>",
  "requestFlow": "<Mermaid sequenceDiagram source as a single string with \\n for newlines>"
}

Rules:
- architectureChart: use \`flowchart TD\`, 8–15 nodes, label edges with the relationship type (e.g. "calls", "reads from", "writes to")
- requestFlow: use \`sequenceDiagram\`, trace the single most-trafficked request end-to-end (e.g. HTTP request → controller → service → DB)
- Both values must be valid Mermaid syntax that renders without errors
- Escape all quotes inside the strings with a backslash
- Output only valid JSON, no markdown, no explanation

Repository files:
${fileContext}`;
}

export function buildQuizPrompt(fileContext: string): string {
  return `You are a senior software engineer onboarding a new hire. Given the following repository files, produce a JSON object with this exact shape:

{
  "questions": [
    {
      "question": "<question text>",
      "type": "multiple_choice",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "answer": "<the correct option, verbatim>"
    },
    {
      "question": "<question text>",
      "type": "short_answer",
      "answer": "<concise correct answer>"
    }
  ]
}

Rules:
- Generate exactly 6 questions: 3 multiple_choice and 3 short_answer, interleaved
- Questions must test understanding of this specific codebase (not generic programming knowledge)
- multiple_choice must have exactly 4 options; only one is correct
- short_answer answers should be 1–2 sentences
- Output only valid JSON, no markdown, no explanation

Repository files:
${fileContext}`;
}
