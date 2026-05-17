import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { getAllCodeFiles, getRepositoryInfo, parseGitHubUrl, type CodeFile } from '../github/lib';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const GENERATION_CONFIG = {
  temperature: 0,      // fully deterministic output
  topP: 1,
  topK: 1,
};

// Generate documentation using Gemini
async function generateDocumentation(files: CodeFile[], repoName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: GENERATION_CONFIG });
  
  const filesContext = files.map(f => `
File: ${f.path}
Language: ${f.language}
Content:
\`\`\`${f.language}
${f.content.substring(0, 2000)}${f.content.length > 2000 ? '...' : ''}
\`\`\`
`).join('\n\n');

  const prompt = `You are a technical documentation expert. Analyze the following code repository "${repoName}" and generate comprehensive documentation.

Repository Files:
${filesContext}

Please provide:
1. **Project Overview**: What does this project do? What problem does it solve?
2. **Architecture**: Describe the overall architecture and design patterns used
3. **Key Components**: List and explain the main components/modules
4. **File Structure**: Explain the organization of files and directories
5. **Technologies Used**: List the programming languages, frameworks, and libraries
6. **Setup Instructions**: How to set up and run the project
7. **API/Functions**: Document key functions, classes, or APIs
8. **Code Examples**: Show how to use the main features

Format the response in clean Markdown with proper headings, code blocks, and lists.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Generate UML diagram using Gemini
async function generateUML(files: CodeFile[], repoName: string) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { ...GENERATION_CONFIG, responseMimeType: 'application/json' },
  });

  const filesContext = files.map(f => `
File: ${f.path}
Language: ${f.language}
Content:
\`\`\`${f.language}
${f.content.substring(0, 2000)}${f.content.length > 2000 ? '...' : ''}
\`\`\`
`).join('\n\n');

  const prompt = `You are a software architecture expert. Analyze the code repository "${repoName}".

Return a single JSON object with exactly these four keys: "architecture", "features", "classDiagram", "codebaseMap".

{
  "architecture": {
    "mermaid": "<valid Mermaid flowchart TD string>",
    "nodes": [
      { "id": "<alphanumericNodeId>", "displayName": "<human-readable label>", "category": "<page|route|external|internal>", "description": "<one sentence>" }
    ]
  },
  "features": [
    {
      "name": "<feature name>",
      "description": "<one sentence>",
      "flow": [
        { "path": "<relative/file/path.ts>", "role": "<10-15 word description of this file's role in the feature>" }
      ],
      "sequenceDiagram": "<optional Mermaid sequenceDiagram string — omit key entirely if not needed>"
    }
  ],
  "classDiagram": {
    "hasClassHierarchy": <true|false>,
    "mermaid": "<Mermaid classDiagram string or null>",
    "classes": [
      { "name": "<ClassName>", "category": "<page|route|external|internal>", "description": "<one sentence>" }
    ]
  },
  "codebaseMap": {
    "nodes": [
      { "id": "<relative/file/path.ts>", "label": "<filename only>", "category": "<page|route|external|internal>", "description": "<one sentence>" }
    ],
    "edges": [
      { "source": "<relative/file/path.ts>", "target": "<relative/file/path.ts>", "label": "<optional: import|uses|calls>" }
    ]
  }
}

ARCHITECTURE rules:
- 5 to 8 nodes representing the major modules (e.g. Frontend, APILayer, GitHubAPI, GeminiAI).
- Use flowchart TD (top-down). Arrow labels show data flow direction (e.g., "POST /api/analyze", "returns repo files").
- Node IDs must be plain alphanumeric words (e.g. Frontend, APILayer). The "id" in nodes[] must exactly match the node ID used in the flowchart.
- Do NOT include markdown fences — just raw Mermaid starting with "flowchart TD".
- Categories: page=frontend pages/components, route=API routes/server handlers, external=third-party APIs/services, internal=utilities/libraries.

FEATURE FLOWS rules:
- Identify 3 to 6 of the most important user-facing features or workflows.
- flow[] lists files in execution order from user action to response/persistence. Include 3 to 7 files per feature using real paths from the repository.
- sequenceDiagram is OPTIONAL — include only for features with complex multi-system interactions. If included: AT MOST 5 actors, AT MOST 10 messages, bare alphanumeric participant names only (never use the "as" alias form).
- Do NOT include markdown fences inside sequenceDiagram strings.

CODEBASE MAP rules:
- Include the 12 to 20 most architecturally significant files as nodes. Use real file paths.
- "id" is the relative file path (e.g. "app/page.tsx"). "label" is just the filename without directory.
- Edges represent import/dependency relationships between the listed nodes only.
- Include 10 to 25 edges covering the key dependency chains. Do NOT list every import — only architecturally meaningful ones.
- Categories: same values as architecture nodes (page, route, external, internal).

CLASS DIAGRAM rules:
- Only include a class if it has at least one structural relationship (inheritance <|--, composition -->, aggregation o--) with another class. Do NOT include: React function components, page files, standalone route handlers, or utility modules with only exported functions.
- If fewer than 3 classes have structural relationships, set hasClassHierarchy: false, mermaid: null, classes: [].
- If hasClassHierarchy: true, mermaid must start with "classDiagram". Use ONLY the "class" keyword (never "interface", "enum", "abstract class"). Class names must be plain alphanumeric. Member types: simple words only (string, number, boolean — no arrays, generics, or unions).
- Do NOT include markdown fences in mermaid strings.

Repository Files:
${filesContext}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch {
    const stripped = text.replace(/^```json\s*|```\s*$/g, '').trim();
    return JSON.parse(stripped);
  }
}

// Generate quiz using Gemini
async function generateQuiz(files: CodeFile[], repoName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: GENERATION_CONFIG });
  
  const filesContext = files.map(f => `
File: ${f.path}
Content:
\`\`\`${f.language}
${f.content.substring(0, 1500)}${f.content.length > 1500 ? '...' : ''}
\`\`\`
`).join('\n\n');

  const prompt = `You are a technical educator. Based on the following code repository "${repoName}", create a comprehensive quiz to test understanding of the codebase.

Repository Files:
${filesContext}

Generate 10 multiple-choice questions covering:
- Code functionality and purpose
- Architecture and design patterns
- Key functions and their behavior
- Best practices used in the code
- Potential improvements or issues

Format as JSON array with this structure:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this is the correct answer"
  }
]

Return ONLY the JSON array, no additional text.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  return [];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, generateDocs, generateUml, generateQuizData } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'GitHub repository URL is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Parse GitHub URL
    const parsed = parseGitHubUrl(url);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL' },
        { status: 400 }
      );
    }

    const { owner, repo } = parsed;

    // Fetch repository info and code files
    console.log('Fetching repository information...');
    const repoInfo = await getRepositoryInfo(owner, repo);
    
    console.log('Fetching repository files...');
    const files = await getAllCodeFiles(owner, repo);

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No code files found in repository' },
        { status: 404 }
      );
    }

    console.log(`Found ${files.length} code files`);

    const result: any = {
      repository: {
        name: repoInfo.name,
        full_name: repoInfo.full_name,
        description: repoInfo.description,
        html_url: repoInfo.html_url,
      },
      filesAnalyzed: files.length,
    };

    // Generate documentation if requested
    if (generateDocs) {
      console.log('Generating documentation...');
      result.documentation = await generateDocumentation(files, repoInfo.full_name);
    }

    // Generate UML if requested
    if (generateUml) {
      console.log('Generating UML diagrams...');
      result.uml = await generateUML(files, repoInfo.full_name);
    }

    // Generate quiz if requested
    if (generateQuizData) {
      console.log('Generating quiz...');
      result.quiz = await generateQuiz(files, repoInfo.full_name);
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error analyzing repository:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to analyze repository', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Made with Bob
