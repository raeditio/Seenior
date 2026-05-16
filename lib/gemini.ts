import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  AnalyzeResponse,
  DocumentationSection,
  DiagramsSection,
  QuizSection,
  SectionId,
} from "./types";
import {
  buildDocumentationPrompt,
  buildDiagramsPrompt,
  buildQuizPrompt,
} from "./prompts";

const MODEL = "gemini-1.5-pro";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenerativeAI(apiKey);
}

async function callGemini<T>(prompt: string): Promise<T> {
  const model = getClient().getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: "application/json" },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    // retry once — Gemini occasionally adds a markdown fence
    const stripped = text.replace(/^```json\s*|```\s*$/g, "").trim();
    return JSON.parse(stripped) as T;
  }
}

export async function analyze(
  sections: SectionId[],
  fileContext: string
): Promise<AnalyzeResponse> {
  const calls: Promise<void>[] = [];
  const response: AnalyzeResponse = {};

  if (sections.includes("documentation")) {
    calls.push(
      callGemini<DocumentationSection>(buildDocumentationPrompt(fileContext)).then(
        (r) => { response.documentation = r; }
      )
    );
  }

  if (sections.includes("diagrams")) {
    calls.push(
      callGemini<DiagramsSection>(buildDiagramsPrompt(fileContext)).then(
        (r) => { response.diagrams = r; }
      )
    );
  }

  if (sections.includes("quiz")) {
    calls.push(
      callGemini<QuizSection>(buildQuizPrompt(fileContext)).then(
        (r) => { response.quiz = r; }
      )
    );
  }

  await Promise.all(calls);
  return response;
}
