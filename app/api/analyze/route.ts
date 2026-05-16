import type { NextRequest } from "next/server";
import { analyze } from "@/lib/gemini";
import type { AnalyzeRequest, AnalyzeResponse, SectionId } from "@/lib/types";

const VALID_SECTIONS: SectionId[] = ["documentation", "diagrams", "quiz"];

// In-memory cache: "repoUrl|sections" → AnalyzeResponse
const cache = new Map<string, AnalyzeResponse>();

export async function POST(request: NextRequest) {
  let body: AnalyzeRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { repoUrl, sections, files } = body;

  if (!repoUrl || typeof repoUrl !== "string") {
    return Response.json({ error: "repoUrl is required" }, { status: 400 });
  }

  if (!Array.isArray(sections) || sections.length === 0) {
    return Response.json({ error: "sections must be a non-empty array" }, { status: 400 });
  }

  const validSections = sections.filter((s): s is SectionId =>
    VALID_SECTIONS.includes(s as SectionId)
  );

  if (validSections.length === 0) {
    return Response.json({ error: "No valid sections provided" }, { status: 400 });
  }

  if (!files || typeof files !== "object" || Object.keys(files).length === 0) {
    return Response.json({ error: "files map is required and must not be empty" }, { status: 400 });
  }

  const cacheKey = `${repoUrl}|${[...validSections].sort().join(",")}`;
  if (cache.has(cacheKey)) {
    return Response.json(cache.get(cacheKey));
  }

  // Build flat file context string for the prompt
  const fileContext = Object.entries(files)
    .map(([path, content]) => `### ${path}\n${content}`)
    .join("\n\n");

  try {
    const result = await analyze(validSections, fileContext);
    cache.set(cacheKey, result);
    return Response.json(result);
  } catch (err) {
    console.error("Gemini analysis failed:", err);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
