**User:**

<task>
Add additional diagram types to enhance code visualization: Component Diagram, State Diagram, and ER Diagram.

**Requirements:**

1. **New Diagram Types:**
   - **Component Diagram** - System architecture, external dependencies, deployment structure
   - **State Diagram** - State machines, workflow logic, lifecycle management  
   - **ER Diagram** - Database schema relationships (detect ORM models, SQL files)

2. **Update `generateUML()` in `app/api/analyze/route.ts`:**
   
   Extend the JSON response to include:
   ```typescript
   {
     "classDiagram": "...",
     "sequenceDiagram": "...",
     "componentDiagram": "...",  // NEW
     "stateDiagram": "...",      // NEW
     "erDiagram": "...",          // NEW
     "descriptions": {...},
     "categories": {...}
   }
   ```

3. **Prompt Engineering:**
   
   Add to the existing prompt:
   
   **Component Diagram Rules:**
   - Show system boundaries and external services
   - Include main application components (frontend, backend, database, APIs)
   - Show deployment architecture if detectable
   - Use Mermaid C4 or component diagram syntax
   - Max 8 components, focus on high-level architecture
   
   **State Diagram Rules:**
   - Identify state machines in the code (enums, state management, workflows)
   - Show primary state transitions only
   - Max 6 states, skip trivial transitions
   - Use Mermaid stateDiagram-v2 syntax
   - If no clear state machine exists, return empty string
   
   **ER Diagram Rules:**
   - Detect database models (Prisma, TypeORM, Sequelize, Django models, etc.)
   - Show entity relationships (one-to-many, many-to-many)
   - Max 7 entities, focus on core data model
   - Use Mermaid erDiagram syntax
   - If no database schema detected, return empty string

4. **Update Results Page (`app/results/page.tsx`):**
   
   - Add new sub-tabs: "Class", "Sequence", "Component", "State", "ER"
   - Only show tabs for diagrams that have content (non-empty strings)
   - Update `UmlData` interface to include new diagram types
   - Extend export functionality to include new diagrams

5. **Update Export Utilities (`app/utils/export.ts`):**
   
   - Include new diagrams in Markdown export
   - Include new diagrams in PDF export
   - Add individual SVG/PNG export options for new diagrams

6. **Conditional Rendering:**
   
   - If a diagram type returns empty string, don't show that tab
   - Show helpful message if only class/sequence diagrams are available
   - Example: "No state machines detected in this codebase"

**Implementation Priority:**
1. Update `generateUML()` prompt and response structure
2. Update `UmlData` interface in results page
3. Add new sub-tabs with conditional rendering
4. Update export utilities
5. Test with various repository types

This will provide comprehensive visualization options for different aspects of the codebase architecture.
</task>
<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,app/api/analyze/route.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:13:16.503Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>


# Current Workspace Directory (c:/Users/conan/OneDrive - UBC/Documents/Personal/Hackathon/IBM Bob/seenior) Files
.gitignore
AGENTS.md
API_DOCUMENTATION.md
CLAUDE.md
eslint.config.mjs
LICENSE
MIGRATION_SUMMARY.md
next.config.ts
package-lock.json
package.json
postcss.config.mjs
README.md
test-api.js
test-context-optimization.js
Todo
tsconfig.json
app/
app/favicon.ico
app/globals.css
app/layout.tsx
app/page.tsx
app/api/
app/api/analyze/
app/api/analyze/route.ts
app/api/github/
app/api/github/lib.ts
app/api/github/route.ts
app/components/
app/components/MermaidDiagram.tsx
app/components/uml/
app/components/uml/categoryColors.ts
app/components/uml/DescriptionPanel.tsx
app/components/uml/InteractiveDiagram.tsx
app/quiz/
app/quiz/page.tsx
app/results/
app/results/page.tsx
app/utils/
app/utils/export.ts
public/
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll help you add the new diagram types to enhance code visualization. Let me start by creating a TODO list and then implementing the changes step by step.

<update_todo_list>
<todos>
[ ] Read current implementation files (route.ts, page.tsx, export.ts)
[ ] Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types
[ ] Update `UmlData` interface in `app/results/page.tsx`
[ ] Add new sub-tabs with conditional rendering in results page
[ ] Update export utilities in `app/utils/export.ts`
[ ] Test the implementation
</todos>
</update_todo_list>

<read_file>
<args>
<file>
<path>app/api/analyze/route.ts</path>
</file>
<file>
<path>app/results/page.tsx</path>
</file>
<file>
<path>app/utils/export.ts</path>
</file>
</args>
</read_file>

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
Tool [read_file] was not executed because a tool has already been used in this message. Only one tool may be used per message. You must assess the first tool's result before proceeding to use the next tool.
<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,app/api/analyze/route.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:13:23.204Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.01

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Pending |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Pending |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Pending |
| 4 | Add new sub-tabs with conditional rendering in results page | Pending |
| 5 | Update export utilities in `app/utils/export.ts` | Pending |
| 6 | Test the implementation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<read_file>
<args>
<file>
<path>app/api/analyze/route.ts</path>
</file>
<file>
<path>app/results/page.tsx</path>
</file>
<file>
<path>app/utils/export.ts</path>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'app/api/analyze/route.ts', 'app/results/page.tsx', 'app/utils/export.ts'] Result:
<files>
<file><path>app/api/analyze/route.ts</path>
<content lines="1-302">
  1 | import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
  2 | import { IamAuthenticator } from 'ibm-cloud-sdk-core';
  3 | import { NextRequest, NextResponse } from 'next/server';
  4 | import {
  5 |   getAllCodeFiles,
  6 |   getRepositoryInfo,
  7 |   parseGitHubUrl,
  8 |   buildOptimizedContext,
  9 |   type CodeFile
 10 | } from '../github/lib';
 11 | 
 12 | const MODEL_ID = 'meta-llama/llama-3-3-70b-instruct';
 13 | 
 14 | // Initialize Watson AI client with authentication
 15 | function getWatsonAIService() {
 16 |   const apiKey = process.env.WATSONAI_API_KEY || '';
 17 |   const projectId = process.env.WATSONX_PROJECT_ID || '';
 18 |   
 19 |   const authenticator = new IamAuthenticator({
 20 |     apikey: apiKey,
 21 |   });
 22 | 
 23 |   return WatsonXAI.newInstance({
 24 |     version: '2024-05-31',
 25 |     authenticator,
 26 |     serviceUrl: 'https://us-south.ml.cloud.ibm.com',
 27 |   });
 28 | }
 29 | 
 30 | // Generate documentation using Watson AI
 31 | async function generateDocumentation(files: CodeFile[], repoName: string) {
 32 |   // Use optimized context builder with 80k token budget
 33 |   const filesContext = buildOptimizedContext(files, 80000);
 34 | 
 35 |   const prompt = `You are a technical documentation expert. Analyze the following code repository "${repoName}" and generate comprehensive documentation.
 36 | 
 37 | Repository Files:
 38 | ${filesContext}
 39 | 
 40 | Please provide:
 41 | 1. **Project Overview**: What does this project do? What problem does it solve?
 42 | 2. **Architecture**: Describe the overall architecture and design patterns used
 43 | 3. **Key Components**: List and explain the main components/modules. Include their function calls
 44 | 4. **Technologies Used**: List the programming languages, frameworks, and libraries
 45 | 5. **Setup Instructions**: How to set up and run the project
 46 | 6. **API/Functions**: Document key functions, classes, or APIs
 47 | 7. **Code Examples**: Show how to use the main features
 48 | 
 49 | Format the response in clean Markdown with proper headings, code blocks, and lists.`;
 50 | 
 51 |   const watsonxAIService = getWatsonAIService();
 52 |   const projectId = process.env.WATSONX_PROJECT_ID || '';
 53 | 
 54 |   const textGenParams = {
 55 |     input: prompt,
 56 |     modelId: MODEL_ID,
 57 |     projectId: projectId,
 58 |     parameters: {
 59 |       max_new_tokens: 4096,
 60 |       temperature: 0,
 61 |     },
 62 |   };
 63 | 
 64 |   const response = await watsonxAIService.generateText(textGenParams);
 65 |   return response.result.results[0].generated_text;
 66 | }
 67 | 
 68 | // Generate UML diagram using Watson AI
 69 | async function generateUML(files: CodeFile[], repoName: string) {
 70 |   // Use optimized context builder with 80k token budget
 71 |   const filesContext = buildOptimizedContext(files, 80000);
 72 | 
 73 |   const prompt = `You are a software architecture expert. Analyze the code repository "${repoName}".
 74 | 
 75 | Return a single JSON object with exactly these four keys:
 76 | 
 77 | {
 78 |   "classDiagram": "<valid Mermaid classDiagram string>",
 79 |   "sequenceDiagram": "<valid Mermaid sequenceDiagram string>",
 80 |   "descriptions": {
 81 |     "<NodeOrActorName>": "<one sentence plain-English description>"
 82 |   },
 83 |   "categories": {
 84 |     "<NodeOrActorName>": "<page|route|external|internal|actor>"
 85 |   }
 86 | }
 87 | 
 88 | Rules for the CLASS DIAGRAM:
 89 | - Include AT MOST 7 of the most architecturally important classes/modules. Skip utility helpers, config files, and anything not central to the main data flow.
 90 | - Show AT MOST 2-3 members per class — only the most important ones.
 91 | - Show AT MOST 5 relationships total. Prefer composition (-->) over inheritance. Drop trivial or obvious relationships.
 92 | - Do NOT show every file in the repo — be selective. A focused diagram with 5 nodes is better than a cluttered one with 15.
 93 | 
 94 | Rules for the SEQUENCE DIAGRAM:
 95 | - Show AT MOST 5 actors. Each actor name must be UNIQUE — never declare the same participant twice.
 96 | - Show only the primary happy-path request flow — skip error handling, retries, and edge cases.
 97 | - Keep it to AT MOST 10 messages total.
 98 | 
 99 | Rules for both diagrams:
100 | - Use valid Mermaid v11 syntax only.
101 | - In classDiagram: use ONLY the keyword "class", never "interface", "enum", or "abstract class".
102 | - Actor and class names must be plain alphanumeric — no parentheses, colons, angle brackets, or special characters.
103 | - Member types must be simple words only (string, number, boolean) — no arrays like string[], no generics, no union types.
104 | - Do not include markdown fences inside the JSON strings — just the raw diagram text starting with "classDiagram" or "sequenceDiagram".
105 | 
106 | Rules for "descriptions":
107 | - Must include one entry for every class in the classDiagram and every actor in the sequenceDiagram.
108 | - ALSO include entries for up to 8 additional important utility functions, helper modules, or key interfaces that appear in the codebase but are not nodes in the diagrams (e.g. parseGitHubUrl, getRepositoryInfo, generateDocumentation). These give onboarding engineers the detail they need.
109 | - Each description is one plain-English sentence.
110 | 
111 | Rules for "categories":
112 | - Must include one entry for every name in "descriptions".
113 | - Use exactly one of these five values: page, route, external, internal, actor.
114 |   - page: frontend React pages/components and client-side entry points
115 |   - route: Next.js API routes and server-side request handlers
116 |   - external: third-party APIs and services (GitHub, Gemini, Octokit, etc.)
117 |   - internal: internal utilities, helper modules, and library functions
118 |   - actor: human users, browsers, or generic client actors in sequence diagrams
119 | 
120 | Repository Files:
121 | ${filesContext}
122 | 
123 | Return ONLY the JSON object, no additional text or markdown formatting.`;
124 | 
125 |   const watsonxAIService = getWatsonAIService();
126 |   const projectId = process.env.WATSONX_PROJECT_ID || '';
127 | 
128 |   const textGenParams = {
129 |     input: prompt,
130 |     modelId: MODEL_ID,
131 |     projectId: projectId,
132 |     parameters: {
133 |       max_new_tokens: 4096,
134 |       temperature: 0,
135 |     },
136 |   };
137 | 
138 |   const response = await watsonxAIService.generateText(textGenParams);
139 |   const text = response.result.results[0].generated_text;
140 |   
141 |   try {
142 |     return JSON.parse(text);
143 |   } catch {
144 |     const stripped = text.replace(/^```json\s*|```\s*$/g, '').trim();
145 |     return JSON.parse(stripped);
146 |   }
147 | }
148 | 
149 | // Generate quiz using Watson AI
150 | async function generateQuiz(files: CodeFile[], repoName: string) {
151 |   // Use optimized context builder with 80k token budget
152 |   const filesContext = buildOptimizedContext(files, 80000);
153 | 
154 |   const prompt = `You are a technical educator. Based on the following code repository "${repoName}", create a comprehensive quiz to test understanding of the codebase.
155 | 
156 | Repository Files:
157 | ${filesContext}
158 | 
159 | Generate 10 multiple-choice questions covering:
160 | - Code functionality and purpose
161 | - Architecture and design patterns
162 | - Key functions and their behavior
163 | - Best practices used in the code
164 | 
165 | Format as JSON array with this structure:
166 | [
167 |   {
168 |     "question": "Question text",
169 |     "options": ["Option A", "Option B", "Option C", "Option D"],
170 |     "correctAnswer": 0,
171 |     "explanation": "Why this is the correct answer"
172 |   }
173 | ]
174 | 
175 | Return ONLY the JSON array, no additional text.`;
176 | 
177 |   const watsonxAIService = getWatsonAIService();
178 |   const projectId = process.env.WATSONX_PROJECT_ID || '';
179 | 
180 |   const textGenParams = {
181 |     input: prompt,
182 |     modelId: MODEL_ID,
183 |     projectId: projectId,
184 |     parameters: {
185 |       max_new_tokens: 4096,
186 |       temperature: 0,
187 |     },
188 |   };
189 | 
190 |   const response = await watsonxAIService.generateText(textGenParams);
191 |   const text = response.result.results[0].generated_text;
192 |   
193 |   // Extract JSON from response
194 |   const jsonMatch = text.match(/\[[\s\S]*\]/);
195 |   if (jsonMatch) {
196 |     return JSON.parse(jsonMatch[0]);
197 |   }
198 |   
199 |   return [];
200 | }
201 | 
202 | export async function POST(request: NextRequest) {
203 |   try {
204 |     const body = await request.json();
205 |     const { url, generateDocs, generateUml, generateQuizData } = body;
206 | 
207 |     if (!url) {
208 |       return NextResponse.json(
209 |         { error: 'GitHub repository URL is required' },
210 |         { status: 400 }
211 |       );
212 |     }
213 | 
214 |     if (!process.env.WATSONAI_API_KEY) {
215 |       return NextResponse.json(
216 |         { error: 'WATSONAI_API_KEY is not configured' },
217 |         { status: 500 }
218 |       );
219 |     }
220 | 
221 |     if (!process.env.WATSONX_PROJECT_ID) {
222 |       return NextResponse.json(
223 |         { error: 'WATSONX_PROJECT_ID is not configured' },
224 |         { status: 500 }
225 |       );
226 |     }
227 | 
228 |     // Parse GitHub URL
229 |     const parsed = parseGitHubUrl(url);
230 |     if (!parsed) {
231 |       return NextResponse.json(
232 |         { error: 'Invalid GitHub repository URL' },
233 |         { status: 400 }
234 |       );
235 |     }
236 | 
237 |     const { owner, repo } = parsed;
238 | 
239 |     // Fetch repository info and code files
240 |     console.log('Fetching repository information...');
241 |     const repoInfo = await getRepositoryInfo(owner, repo);
242 |     
243 |     console.log('Fetching repository files...');
244 |     const files = await getAllCodeFiles(owner, repo);
245 | 
246 |     if (files.length === 0) {
247 |       return NextResponse.json(
248 |         { error: 'No code files found in repository' },
249 |         { status: 404 }
250 |       );
251 |     }
252 | 
253 |     console.log(`Found ${files.length} code files`);
254 | 
255 |     const result: any = {
256 |       repository: {
257 |         name: repoInfo.name,
258 |         full_name: repoInfo.full_name,
259 |         description: repoInfo.description,
260 |         html_url: repoInfo.html_url,
261 |       },
262 |       filesAnalyzed: files.length,
263 |     };
264 | 
265 |     // Generate documentation if requested
266 |     if (generateDocs) {
267 |       console.log('Generating documentation...');
268 |       result.documentation = await generateDocumentation(files, repoInfo.full_name);
269 |     }
270 | 
271 |     // Generate UML if requested
272 |     if (generateUml) {
273 |       console.log('Generating UML diagrams...');
274 |       result.uml = await generateUML(files, repoInfo.full_name);
275 |     }
276 | 
277 |     // Generate quiz if requested
278 |     if (generateQuizData) {
279 |       console.log('Generating quiz...');
280 |       result.quiz = await generateQuiz(files, repoInfo.full_name);
281 |     }
282 | 
283 |     return NextResponse.json(result, { status: 200 });
284 | 
285 |   } catch (error) {
286 |     console.error('Error analyzing repository:', error);
287 |     
288 |     if (error instanceof Error) {
289 |       return NextResponse.json(
290 |         { error: 'Failed to analyze repository', details: error.message },
291 |         { status: 500 }
292 |       );
293 |     }
294 | 
295 |     return NextResponse.json(
296 |       { error: 'An unexpected error occurred' },
297 |       { status: 500 }
298 |     );
299 |   }
300 | }
301 | 
302 | // Made with Bob
</content>
</file>
<file><path>app/results/page.tsx</path>
<content lines="1-778">
  1 | 'use client';
  2 | 
  3 | import { useEffect, useState, useRef, useCallback } from 'react';
  4 | import { useSearchParams } from 'next/navigation';
  5 | import Link from 'next/link';
  6 | import { motion, AnimatePresence } from 'framer-motion';
  7 | import InteractiveDiagram from '@/app/components/uml/InteractiveDiagram';
  8 | import DescriptionPanel from '@/app/components/uml/DescriptionPanel';
  9 | import { type Category } from '@/app/components/uml/categoryColors';
 10 | import {
 11 |   downloadMarkdown,
 12 |   exportToPDF,
 13 |   exportDiagramAsSVG,
 14 |   exportDiagramAsPNG,
 15 |   type AnalysisData as ExportAnalysisData,
 16 | } from '@/app/utils/export';
 17 | 
 18 | interface UmlData {
 19 |   classDiagram: string;
 20 |   sequenceDiagram: string;
 21 |   descriptions: Record<string, string>;
 22 |   categories: Record<string, Category>;
 23 | }
 24 | 
 25 | interface AnalysisData {
 26 |   repository: {
 27 |     name: string;
 28 |     full_name: string;
 29 |     description: string;
 30 |     html_url: string;
 31 |   };
 32 |   filesAnalyzed: number;
 33 |   documentation?: string;
 34 |   uml?: UmlData;
 35 |   quiz?: Array<{
 36 |     question: string;
 37 |     options: string[];
 38 |     correctAnswer: number;
 39 |     explanation: string;
 40 |   }>;
 41 | }
 42 | 
 43 | type TabId = 'documentation' | 'uml' | 'quiz';
 44 | 
 45 | // --- Loading steps ---
 46 | const STEPS = [
 47 |   { label: 'Fetching repository information…', duration: 3000 },
 48 |   { label: 'Fetching repository files…',      duration: 6000 },
 49 |   { label: 'Reading code structure…',          duration: 7000 },
 50 |   { label: 'Generating your report…',          duration: 9000 },
 51 |   { label: 'Almost done, hang tight…',         duration: Infinity },
 52 | ];
 53 | 
 54 | function useLoadingSteps(active: boolean) {
 55 |   const [step, setStep] = useState(0);
 56 |   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 57 | 
 58 |   useEffect(() => {
 59 |     if (!active) { setStep(0); return; }
 60 |     if (step >= STEPS.length - 1) return;
 61 |     timerRef.current = setTimeout(() => setStep((s) => s + 1), STEPS[step].duration);
 62 |     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
 63 |   }, [active, step]);
 64 | 
 65 |   return step;
 66 | }
 67 | 
 68 | // --- Skeleton bones ---
 69 | function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
 70 |   return <div className={`skeleton ${className ?? ''}`} style={style} />;
 71 | }
 72 | 
 73 | function DocsSkeleton() {
 74 |   return (
 75 |     <div className="flex flex-col gap-10">
 76 |       <div className="flex flex-col gap-3">
 77 |         <Bone className="h-3 w-24 mb-1" />
 78 |         <Bone className="h-4 w-full" /><Bone className="h-4 w-5/6" /><Bone className="h-4 w-4/6" />
 79 |       </div>
 80 |       <div className="flex flex-col gap-3">
 81 |         <Bone className="h-3 w-36 mb-1" />
 82 |         {[...Array(5)].map((_, i) => (
 83 |           <div key={i} className="flex gap-4 p-4 rounded-xl border border-zinc-900">
 84 |             <Bone className="h-3 w-3 shrink-0 mt-0.5" />
 85 |             <div className="flex flex-col gap-2 flex-1">
 86 |               <Bone className="h-3 w-48" /><Bone className="h-3 w-64" />
 87 |             </div>
 88 |           </div>
 89 |         ))}
 90 |       </div>
 91 |       <div className="flex flex-col gap-3">
 92 |         <Bone className="h-3 w-44 mb-1" />
 93 |         {[...Array(3)].map((_, i) => (
 94 |           <div key={i} className="p-5 rounded-xl border border-zinc-900 flex flex-col gap-3">
 95 |             <Bone className="h-4 w-36" /><Bone className="h-3 w-full" /><Bone className="h-3 w-5/6" />
 96 |           </div>
 97 |         ))}
 98 |       </div>
 99 |       <div className="flex flex-col gap-3">
100 |         <Bone className="h-3 w-24 mb-1" />
101 |         <div className="flex flex-wrap gap-2">
102 |           {[80, 64, 96, 72, 56, 88].map((w, i) => (
103 |             <Bone key={i} className="h-7 rounded-lg" style={{ width: `${w}px` }} />
104 |           ))}
105 |         </div>
106 |       </div>
107 |     </div>
108 |   );
109 | }
110 | 
111 | function DiagramsSkeleton() {
112 |   return (
113 |     <div className="flex flex-col gap-10">
114 |       {['Architecture map', 'Request flow'].map((label) => (
115 |         <div key={label} className="flex flex-col gap-3">
116 |           <Bone className="h-3 w-36 mb-1" />
117 |           <div className="rounded-xl border border-zinc-900 p-6 flex flex-col gap-4 items-center">
118 |             <Bone className="h-10 w-40 rounded-lg" />
119 |             <Bone className="h-6 w-px" />
120 |             <div className="flex gap-8">
121 |               <Bone className="h-10 w-32 rounded-lg" /><Bone className="h-10 w-32 rounded-lg" />
122 |             </div>
123 |             <Bone className="h-6 w-px" />
124 |             <div className="flex gap-6">
125 |               <Bone className="h-10 w-24 rounded-lg" />
126 |               <Bone className="h-10 w-24 rounded-lg" />
127 |               <Bone className="h-10 w-24 rounded-lg" />
128 |             </div>
129 |           </div>
130 |         </div>
131 |       ))}
132 |     </div>
133 |   );
134 | }
135 | 
136 | function QuizSkeleton() {
137 |   return (
138 |     <div className="flex flex-col gap-4">
139 |       {[...Array(5)].map((_, i) => (
140 |         <div key={i} className="p-5 rounded-xl border border-zinc-900 flex flex-col gap-4">
141 |           <div className="flex gap-2 items-start">
142 |             <Bone className="h-3 w-4 shrink-0 mt-0.5" />
143 |             <div className="flex flex-col gap-2 flex-1">
144 |               <Bone className="h-3 w-full" /><Bone className="h-3 w-4/5" />
145 |             </div>
146 |           </div>
147 |           <div className="flex flex-col gap-2">
148 |             {[...Array(4)].map((_, j) => <Bone key={j} className="h-8 w-full rounded-lg" />)}
149 |           </div>
150 |         </div>
151 |       ))}
152 |     </div>
153 |   );
154 | }
155 | 
156 | function StepIndicator({ step, total }: { step: number; total: number }) {
157 |   return (
158 |     <div className="flex flex-col gap-3 pb-8 border-b border-zinc-900 mb-10">
159 |       <div className="flex items-center gap-3">
160 |         <motion.div
161 |           animate={{ rotate: 360 }}
162 |           transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
163 |           className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-white shrink-0"
164 |         />
165 |         <AnimatePresence mode="wait">
166 |           <motion.span
167 |             key={step}
168 |             initial={{ opacity: 0, y: 6 }}
169 |             animate={{ opacity: 1, y: 0 }}
170 |             exit={{ opacity: 0, y: -6 }}
171 |             transition={{ duration: 0.25 }}
172 |             className="text-sm text-zinc-300"
173 |           >
174 |             {STEPS[step].label}
175 |           </motion.span>
176 |         </AnimatePresence>
177 |       </div>
178 |       <div className="flex gap-1.5">
179 |         {[...Array(total)].map((_, i) => (
180 |           <motion.div
181 |             key={i}
182 |             animate={{ backgroundColor: i <= step ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.08)' }}
183 |             transition={{ duration: 0.4 }}
184 |             className="h-1 flex-1 rounded-full"
185 |           />
186 |         ))}
187 |       </div>
188 |       <p className="text-xs text-zinc-600">This usually takes 20–40 seconds</p>
189 |     </div>
190 |   );
191 | }
192 | 
193 | // Extract node names present in each diagram type
194 | function extractClassNames(diagram: string): Set<string> {
195 |   const names = new Set<string>();
196 |   // Explicit declarations: "class ClassName" or "class ClassName {"
197 |   for (const m of diagram.matchAll(/^\s*class\s+(\w+)/gm)) names.add(m[1]);
198 |   // Relationship lines: "A --> B", "A <|-- B", "A *-- B", etc.
199 |   // Left side
200 |   for (const m of diagram.matchAll(/^\s*(\w+)\s*(?:"[^"]*")?\s*(?:<\|--|<\.\.|\*--|o--|-->|\.\.>|<--|--|\|\|--|\.\.)/gm)) names.add(m[1]);
201 |   // Right side
202 |   for (const m of diagram.matchAll(/(?:<\|--|<\.\.|\*--|o--|-->|\.\.>|<--|--|\|\|--|\.\.)(?:"[^"]*")?\s*(\w+)/gm)) names.add(m[1]);
203 |   // Member definitions: "ClassName : +method()"
204 |   for (const m of diagram.matchAll(/^\s*(\w+)\s*:/gm)) names.add(m[1]);
205 |   return names;
206 | }
207 | 
208 | function extractActorNames(diagram: string): Set<string> {
209 |   const names = new Set<string>();
210 |   for (const m of diagram.matchAll(/^(?:participant|actor)\s+(\w+)/gm)) names.add(m[1]);
211 |   for (const m of diagram.matchAll(/^(\w+)(?:->>|-->|->|-->>)/gm)) names.add(m[1]);
212 |   for (const m of diagram.matchAll(/(?:->>|-->|->|-->>)(\w+):/gm)) names.add(m[1]);
213 |   return names;
214 | }
215 | 
216 | // --- Animations ---
217 | const fadeUp = {
218 |   hidden: { opacity: 0, y: 12 },
219 |   show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
220 |   exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
221 | };
222 | 
223 | function SectionLabel({ children }: { children: React.ReactNode }) {
224 |   return <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-4">{children}</p>;
225 | }
226 | 
227 | export default function ResultsPage() {
228 |   const searchParams = useSearchParams();
229 |   const repo = searchParams.get('repo') ?? '';
230 |   const sectionsParam = searchParams.get('sections') ?? '';
231 |   const sections = sectionsParam ? sectionsParam.split(',') : ['documentation'];
232 | 
233 |   const selectedOptions = {
234 |     documentation: sections.includes('documentation'),
235 |     flowchart: sections.includes('diagrams'),
236 |     quiz: sections.includes('quiz'),
237 |   };
238 | 
239 |   const [data, setData] = useState<AnalysisData | null>(null);
240 |   const [error, setError] = useState<string | null>(null);
241 |   const [activeTab, setActiveTab] = useState<TabId>(
242 |     selectedOptions.documentation ? 'documentation' : selectedOptions.flowchart ? 'uml' : 'quiz'
243 |   );
244 |   const [revealed, setRevealed] = useState<Set<number>>(new Set());
245 |   const [activeSubTab, setActiveSubTab] = useState<'class' | 'sequence'>('class');
246 |   const [activeNode, setActiveNode] = useState<string | null>(null);
247 |   const [diagramHeight, setDiagramHeight] = useState<number>(500);
248 |   const [showExportMenu, setShowExportMenu] = useState(false);
249 |   const [isExporting, setIsExporting] = useState(false);
250 |   const [exportStatus, setExportStatus] = useState<string | null>(null);
251 |   const exportMenuRef = useRef<HTMLDivElement>(null);
252 | 
253 |   const loading = !data && !error;
254 |   const step = useLoadingSteps(loading);
255 |   const hasCalledRef = useRef(false);
256 | 
257 |   useEffect(() => {
258 |     if (!repo) return;
259 | 
260 |     // Prevent duplicate calls in React Strict Mode
261 |     if (hasCalledRef.current) return;
262 |     hasCalledRef.current = true;
263 | 
264 |     async function run() {
265 |       try {
266 |         const res = await fetch('/api/analyze', {
267 |           method: 'POST',
268 |           headers: { 'Content-Type': 'application/json' },
269 |           body: JSON.stringify({
270 |             url: repo,
271 |             generateDocs: selectedOptions.documentation,
272 |             generateUml: selectedOptions.flowchart,
273 |             generateQuizData: selectedOptions.quiz,
274 |           }),
275 |         });
276 |         const json = await res.json();
277 |         if (!res.ok) throw new Error(json.error ?? 'Analysis failed');
278 |         setData(json);
279 |       } catch (e) {
280 |         setError(e instanceof Error ? e.message : 'Something went wrong');
281 |       }
282 |     }
283 | 
284 |     run();
285 |   // eslint-disable-next-line react-hooks/exhaustive-deps
286 |   }, [repo]);
287 | 
288 |   function toggleReveal(i: number) {
289 |     setRevealed((prev) => {
290 |       const next = new Set(prev);
291 |       next.has(i) ? next.delete(i) : next.add(i);
292 |       return next;
293 |     });
294 |   }
295 | 
296 |   // Close export menu when clicking outside
297 |   useEffect(() => {
298 |     function handleClickOutside(event: MouseEvent) {
299 |       if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
300 |         setShowExportMenu(false);
301 |       }
302 |     }
303 |     document.addEventListener('mousedown', handleClickOutside);
304 |     return () => document.removeEventListener('mousedown', handleClickOutside);
305 |   }, []);
306 | 
307 |   // Export handlers
308 |   const handleExportMarkdown = useCallback(() => {
309 |     if (!data) return;
310 |     try {
311 |       setIsExporting(true);
312 |       downloadMarkdown(data as ExportAnalysisData);
313 |       setExportStatus('Markdown exported successfully!');
314 |       setTimeout(() => setExportStatus(null), 3000);
315 |     } catch (error) {
316 |       console.error('Export error:', error);
317 |       setExportStatus('Export failed. Please try again.');
318 |       setTimeout(() => setExportStatus(null), 3000);
319 |     } finally {
320 |       setIsExporting(false);
321 |       setShowExportMenu(false);
322 |     }
323 |   }, [data]);
324 | 
325 |   const handleExportPDF = useCallback(async () => {
326 |     if (!data) return;
327 |     try {
328 |       setIsExporting(true);
329 |       setExportStatus('Generating PDF...');
330 |       
331 |       // Get SVG elements from the DOM
332 |       const classDiagramEl = document.querySelector('#class-diagram svg') as SVGElement | null;
333 |       const sequenceDiagramEl = document.querySelector('#sequence-diagram svg') as SVGElement | null;
334 |       
335 |       await exportToPDF(
336 |         data as ExportAnalysisData,
337 |         classDiagramEl || undefined,
338 |         sequenceDiagramEl || undefined
339 |       );
340 |       
341 |       setExportStatus('PDF exported successfully!');
342 |       setTimeout(() => setExportStatus(null), 3000);
343 |     } catch (error) {
344 |       console.error('Export error:', error);
345 |       setExportStatus('PDF export failed. Please try again.');
346 |       setTimeout(() => setExportStatus(null), 3000);
347 |     } finally {
348 |       setIsExporting(false);
349 |       setShowExportMenu(false);
350 |     }
351 |   }, [data]);
352 | 
353 |   const handleExportDiagramSVG = useCallback((diagramType: 'class' | 'sequence') => {
354 |     try {
355 |       setIsExporting(true);
356 |       const selector = diagramType === 'class' ? '#class-diagram svg' : '#sequence-diagram svg';
357 |       const svgElement = document.querySelector(selector) as SVGElement | null;
358 |       
359 |       if (!svgElement) {
360 |         throw new Error('Diagram not found');
361 |       }
362 |       
363 |       const filename = `${data?.repository.name || 'diagram'}-${diagramType}-diagram-${new Date().toISOString().split('T')[0]}.svg`;
364 |       exportDiagramAsSVG(svgElement, filename);
365 |       
366 |       setExportStatus(`${diagramType === 'class' ? 'Class' : 'Sequence'} diagram exported!`);
367 |       setTimeout(() => setExportStatus(null), 3000);
368 |     } catch (error) {
369 |       console.error('Export error:', error);
370 |       setExportStatus('Export failed. Please try again.');
371 |       setTimeout(() => setExportStatus(null), 3000);
372 |     } finally {
373 |       setIsExporting(false);
374 |       setShowExportMenu(false);
375 |     }
376 |   }, [data]);
377 | 
378 |   const handleExportDiagramPNG = useCallback(async (diagramType: 'class' | 'sequence') => {
379 |     try {
380 |       setIsExporting(true);
381 |       setExportStatus('Converting to PNG...');
382 |       
383 |       const selector = diagramType === 'class' ? '#class-diagram svg' : '#sequence-diagram svg';
384 |       const svgElement = document.querySelector(selector) as SVGElement | null;
385 |       
386 |       if (!svgElement) {
387 |         throw new Error('Diagram not found');
388 |       }
389 |       
390 |       const filename = `${data?.repository.name || 'diagram'}-${diagramType}-diagram-${new Date().toISOString().split('T')[0]}.png`;
391 |       await exportDiagramAsPNG(svgElement, filename);
392 |       
393 |       setExportStatus(`${diagramType === 'class' ? 'Class' : 'Sequence'} diagram exported as PNG!`);
394 |       setTimeout(() => setExportStatus(null), 3000);
395 |     } catch (error) {
396 |       console.error('Export error:', error);
397 |       setExportStatus('PNG export failed. Please try again.');
398 |       setTimeout(() => setExportStatus(null), 3000);
399 |     } finally {
400 |       setIsExporting(false);
401 |       setShowExportMenu(false);
402 |     }
403 |   }, [data]);
404 | 
405 |   const ALL_TABS: { id: TabId; label: string }[] = [
406 |     { id: 'documentation', label: 'Documentation' },
407 |     { id: 'uml',           label: 'UML / Flowchart' },
408 |     { id: 'quiz',          label: 'Quiz' },
409 |   ];
410 |   const tabs = ALL_TABS.filter((t) =>
411 |     t.id === 'documentation' ? selectedOptions.documentation :
412 |     t.id === 'uml'           ? selectedOptions.flowchart :
413 |                                selectedOptions.quiz
414 |   );
415 | 
416 |   return (
417 |     <div className="min-h-screen flex flex-col bg-black text-white">
418 |       {/* Header */}
419 |       <motion.header
420 |         initial={{ opacity: 0, y: -12 }}
421 |         animate={{ opacity: 1, y: 0 }}
422 |         transition={{ duration: 0.4 }}
423 |         className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between"
424 |       >
425 |         <div>
426 |           <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-0.5">
427 |             {loading ? 'Analyzing' : error ? 'Error' : 'Report'}
428 |           </p>
429 |           <p className="text-sm font-mono text-zinc-300 truncate max-w-xs">{repo || '—'}</p>
430 |         </div>
431 |         <div className="flex items-center gap-4">
432 |           {/* Export Status Toast */}
433 |           <AnimatePresence>
434 |             {exportStatus && (
435 |               <motion.div
436 |                 initial={{ opacity: 0, x: 20 }}
437 |                 animate={{ opacity: 1, x: 0 }}
438 |                 exit={{ opacity: 0, x: 20 }}
439 |                 className="text-xs text-green-400 bg-green-950/50 border border-green-900 px-3 py-1.5 rounded-lg"
440 |               >
441 |                 {exportStatus}
442 |               </motion.div>
443 |             )}
444 |           </AnimatePresence>
445 | 
446 |           {/* Export Button */}
447 |           {!loading && !error && data && (
448 |             <div className="relative" ref={exportMenuRef}>
449 |               <motion.button
450 |                 whileHover={{ scale: 1.02 }}
451 |                 whileTap={{ scale: 0.98 }}
452 |                 onClick={() => setShowExportMenu(!showExportMenu)}
453 |                 disabled={isExporting}
454 |                 className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-zinc-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
455 |               >
456 |                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
457 |                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
458 |                 </svg>
459 |                 <span>{isExporting ? 'Exporting...' : 'Export'}</span>
460 |                 <svg className={`w-3 h-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
461 |                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
462 |                 </svg>
463 |               </motion.button>
464 | 
465 |               {/* Export Dropdown Menu */}
466 |               <AnimatePresence>
467 |                 {showExportMenu && (
468 |                   <motion.div
469 |                     initial={{ opacity: 0, y: -10 }}
470 |                     animate={{ opacity: 1, y: 0 }}
471 |                     exit={{ opacity: 0, y: -10 }}
472 |                     transition={{ duration: 0.15 }}
473 |                     className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-50"
474 |                   >
475 |                     <div className="p-2">
476 |                       {/* Full Report Exports */}
477 |                       <div className="mb-2">
478 |                         <p className="text-[10px] text-zinc-600 uppercase tracking-wider px-2 py-1">Full Report</p>
479 |                         <button
480 |                           onClick={handleExportMarkdown}
481 |                           className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/5 rounded-lg transition-colors"
482 |                         >
483 |                           <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
484 |                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
485 |                           </svg>
486 |                           <div className="flex-1">
487 |                             <div className="text-zinc-200">Markdown</div>
488 |                             <div className="text-[10px] text-zinc-600">Full report with diagrams</div>
489 |                           </div>
490 |                         </button>
491 |                         <button
492 |                           onClick={handleExportPDF}
493 |                           className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/5 rounded-lg transition-colors"
494 |                         >
495 |                           <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
496 |                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
497 |                           </svg>
498 |                           <div className="flex-1">
499 |                             <div className="text-zinc-200">PDF</div>
500 |                             <div className="text-[10px] text-zinc-600">Professional document</div>
501 |                           </div>
502 |                         </button>
503 |                       </div>
504 | 
505 |                       {/* Diagram Exports */}
506 |                       {data.uml && (
507 |                         <>
508 |                           <div className="border-t border-zinc-800 my-2" />
509 |                           <div>
510 |                             <p className="text-[10px] text-zinc-600 uppercase tracking-wider px-2 py-1">Diagrams</p>
511 |                             {data.uml.classDiagram && (
512 |                               <>
513 |                                 <button
514 |                                   onClick={() => handleExportDiagramSVG('class')}
515 |                                   className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/5 rounded-lg transition-colors"
516 |                                 >
517 |                                   <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
518 |                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
519 |                                   </svg>
520 |                                   <div className="flex-1">
521 |                                     <div className="text-zinc-200">Class Diagram (SVG)</div>
522 |                                   </div>
523 |                                 </button>
524 |                                 <button
525 |                                   onClick={() => handleExportDiagramPNG('class')}
526 |                                   className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/5 rounded-lg transition-colors"
527 |                                 >
528 |                                   <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
529 |                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
530 |                                   </svg>
531 |                                   <div className="flex-1">
532 |                                     <div className="text-zinc-200">Class Diagram (PNG)</div>
533 |                                   </div>
534 |                                 </button>
535 |                               </>
536 |                             )}
537 |                             {data.uml.sequenceDiagram && (
538 |                               <>
539 |                                 <button
540 |                                   onClick={() => handleExportDiagramSVG('sequence')}
541 |                                   className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/5 rounded-lg transition-colors"
542 |                                 >
543 |                                   <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
544 |                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
545 |                                   </svg>
546 |                                   <div className="flex-1">
547 |                                     <div className="text-zinc-200">Sequence Diagram (SVG)</div>
548 |                                   </div>
549 |                                 </button>
550 |                                 <button
551 |                                   onClick={() => handleExportDiagramPNG('sequence')}
552 |                                   className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/5 rounded-lg transition-colors"
553 |                                 >
554 |                                   <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
555 |                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
556 |                                   </svg>
557 |                                   <div className="flex-1">
558 |                                     <div className="text-zinc-200">Sequence Diagram (PNG)</div>
559 |                                   </div>
560 |                                 </button>
561 |                               </>
562 |                             )}
563 |                           </div>
564 |                         </>
565 |                       )}
566 |                     </div>
567 |                   </motion.div>
568 |                 )}
569 |               </AnimatePresence>
570 |             </div>
571 |           )}
572 | 
573 |           <motion.div whileHover={{ x: -2 }} transition={{ duration: 0.15 }}>
574 |             <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors">← New repo</Link>
575 |           </motion.div>
576 |         </div>
577 |       </motion.header>
578 | 
579 |       {/* Tabs — always visible so user can preview each section while loading */}
580 |       {!error && (
581 |         <motion.nav
582 |           initial={{ opacity: 0 }}
583 |           animate={{ opacity: 1 }}
584 |           transition={{ delay: 0.15, duration: 0.3 }}
585 |           className="flex gap-1 border-b border-zinc-900 px-4 pt-2"
586 |         >
587 |           {tabs.map((t) => (
588 |             <button
589 |               key={t.id}
590 |               onClick={() => setActiveTab(t.id)}
591 |               className="relative px-4 py-2.5 text-sm font-medium transition-colors"
592 |               style={{ color: activeTab === t.id ? 'white' : 'rgb(113 113 122)' }}
593 |             >
594 |               {activeTab === t.id && (
595 |                 <motion.div layoutId="tab-indicator" className="absolute inset-0 rounded-lg bg-white/[0.07]"
596 |                   transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
597 |               )}
598 |               <span className="relative z-10">{t.label}</span>
599 |               {activeTab === t.id && (
600 |                 <motion.div layoutId="tab-underline" className="absolute bottom-0 left-4 right-4 h-px bg-white"
601 |                   transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
602 |               )}
603 |             </button>
604 |           ))}
605 |         </motion.nav>
606 |       )}
607 | 
608 |       {/* Content */}
609 |       <main className={`flex-1 px-6 py-10 w-full mx-auto ${activeTab === 'uml' && data ? 'max-w-7xl' : 'max-w-3xl'}`}>
610 |         {/* Error */}
611 |         {error && (
612 |           <div className="flex flex-col items-center justify-center gap-4 py-32">
613 |             <p className="text-zinc-500 text-sm">Failed to analyze repository</p>
614 |             <p className="text-red-400 text-xs font-mono bg-zinc-900 px-4 py-2 rounded-lg">{error}</p>
615 |             <Link href="/" className="text-xs text-zinc-600 hover:text-white transition-colors mt-2">← Try another repo</Link>
616 |           </div>
617 |         )}
618 | 
619 |         {/* Loading: step indicator + per-tab skeleton */}
620 |         {loading && (
621 |           <>
622 |             <StepIndicator step={step} total={STEPS.length - 1} />
623 |             {activeTab === 'uml'  ? <DiagramsSkeleton /> :
624 |              activeTab === 'quiz' ? <QuizSkeleton /> :
625 |              <DocsSkeleton />}
626 |           </>
627 |         )}
628 | 
629 |         {/* Results */}
630 |         {!loading && !error && (
631 |           <AnimatePresence mode="wait">
632 |             {/* Documentation */}
633 |             {activeTab === 'documentation' && data?.documentation && (
634 |               <motion.div key="docs" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-10">
635 |                 <section>
636 |                   <SectionLabel>Documentation</SectionLabel>
637 |                   <div
638 |                     className="text-zinc-300 text-sm leading-relaxed"
639 |                     dangerouslySetInnerHTML={{
640 |                       __html: data.documentation
641 |                         .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-zinc-300 my-4"><code>$2</code></pre>')
642 |                         .replace(/`([^`]+)`/g, '<code class="bg-zinc-900 px-1.5 py-0.5 rounded text-xs text-zinc-300">$1</code>')
643 |                         .replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold text-white mt-6 mb-2">$1</h3>')
644 |                         .replace(/^## (.*$)/gim, '<h2 class="text-lg font-semibold text-white mt-8 mb-3">$1</h2>')
645 |                         .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-white mt-10 mb-4">$1</h1>')
646 |                         .replace(/^\* (.*$)/gim, '<li class="ml-4 text-zinc-400 text-sm">$1</li>')
647 |                         .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-200">$1</strong>')
648 |                         .replace(/\n\n/g, '<br/>')
649 |                     }}
650 |                   />
651 |                 </section>
652 |               </motion.div>
653 |             )}
654 | 
655 |             {/* UML */}
656 |             {activeTab === 'uml' && data?.uml && (() => {
657 |               // Class tab: show ALL descriptions (diagram nodes + utility functions/interfaces the AI included).
658 |               // Sequence tab: show only actors that appear in the diagram.
659 |               const sequenceActors = extractActorNames(data.uml.sequenceDiagram);
660 |               const panelDescriptions = activeSubTab === 'sequence'
661 |                 ? Object.fromEntries(
662 |                     Object.entries(data.uml.descriptions).filter(
663 |                       ([name]) => sequenceActors.size === 0 || sequenceActors.has(name)
664 |                     )
665 |                   )
666 |                 : data.uml.descriptions;
667 |               const panelLabel = activeSubTab === 'class' ? 'Components' : 'Actors';
668 | 
669 |               return (
670 |                 <motion.div key="uml" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-4">
671 |                   {/* Sub-tabs */}
672 |                   <div className="flex gap-1">
673 |                     {(['class', 'sequence'] as const).map((t) => (
674 |                       <button
675 |                         key={t}
676 |                         onClick={() => { setActiveSubTab(t); setActiveNode(null); }}
677 |                         className="px-4 py-2 text-xs font-medium rounded-lg transition-colors"
678 |                         style={{
679 |                           backgroundColor: activeSubTab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
680 |                           color: activeSubTab === t ? 'white' : 'rgb(113,113,122)',
681 |                         }}
682 |                       >
683 |                         {t === 'class' ? 'Class Diagram' : 'Sequence Diagram'}
684 |                       </button>
685 |                     ))}
686 |                   </div>
687 | 
688 |                   {/* Side-by-side: diagram + description panel */}
689 |                   <div
690 |                     className="flex gap-4"
691 |                     style={{ height: `${Math.min(Math.max(diagramHeight + 48, 380), Math.round(window.innerHeight * 0.82))}px` }}
692 |                   >
693 |                     {/* Diagram — pan/zoom viewport */}
694 |                     <div className="flex-1 min-w-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden relative">
695 |                       <InteractiveDiagram
696 |                         key={activeSubTab}
697 |                         chart={activeSubTab === 'class' ? data.uml.classDiagram : data.uml.sequenceDiagram}
698 |                         id={activeSubTab === 'class' ? 'class-diagram' : 'sequence-diagram'}
699 |                         categories={data.uml.categories ?? {}}
700 |                         activeNode={activeNode}
701 |                         onNodeHover={setActiveNode}
702 |                         onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
703 |                         onHeightReady={setDiagramHeight}
704 |                       />
705 |                     </div>
706 | 
707 |                     {/* Description panel — sticky header, independently scrollable list */}
708 |                     <div className="w-72 shrink-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden flex flex-col">
709 |                       <DescriptionPanel
710 |                         descriptions={panelDescriptions}
711 |                         categories={data.uml.categories ?? {}}
712 |                         activeNode={activeNode}
713 |                         label={panelLabel}
714 |                         onNodeHover={setActiveNode}
715 |                         onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
716 |                       />
717 |                     </div>
718 |                   </div>
719 |                 </motion.div>
720 |               );
721 |             })()}
722 | 
723 |             {/* Quiz */}
724 |             {activeTab === 'quiz' && data?.quiz && (
725 |               <motion.div key="quiz" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-4">
726 |                 {data.quiz.map((q, i) => (
727 |                   <div key={i} className="rounded-xl border border-zinc-900 bg-zinc-950/60 p-5">
728 |                     <p className="text-sm text-zinc-200 mb-4">
729 |                       <span className="font-mono text-xs text-zinc-700 mr-2">{i + 1}.</span>
730 |                       {q.question}
731 |                     </p>
732 |                     <div className="flex flex-col gap-2 mb-4">
733 |                       {q.options.map((opt, j) => (
734 |                         <motion.div
735 |                           key={j}
736 |                           animate={
737 |                             revealed.has(i) && j === q.correctAnswer
738 |                               ? { borderColor: 'rgb(21 128 61 / 0.6)', backgroundColor: 'rgb(5 46 22 / 0.4)' }
739 |                               : { borderColor: 'rgb(39 39 42)', backgroundColor: 'transparent' }
740 |                           }
741 |                           transition={{ duration: 0.25 }}
742 |                           className="text-xs px-3 py-2.5 rounded-lg border text-zinc-400"
743 |                         >
744 |                           {opt}
745 |                         </motion.div>
746 |                       ))}
747 |                     </div>
748 |                     <AnimatePresence>
749 |                       {revealed.has(i) && q.explanation && (
750 |                         <motion.div
751 |                           initial={{ opacity: 0, height: 0 }}
752 |                           animate={{ opacity: 1, height: 'auto' }}
753 |                           exit={{ opacity: 0, height: 0 }}
754 |                           className="overflow-hidden mb-4"
755 |                         >
756 |                           <div className="text-xs text-zinc-400 bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2.5">
757 |                             {q.explanation}
758 |                           </div>
759 |                         </motion.div>
760 |                       )}
761 |                     </AnimatePresence>
762 |                     <motion.button
763 |                       onClick={() => toggleReveal(i)}
764 |                       whileHover={{ x: 2 }}
765 |                       className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
766 |                     >
767 |                       {revealed.has(i) ? 'Hide answer ↑' : 'Reveal answer ↓'}
768 |                     </motion.button>
769 |                   </div>
770 |                 ))}
771 |               </motion.div>
772 |             )}
773 |           </AnimatePresence>
774 |         )}
775 |       </main>
776 |     </div>
777 |   );
778 | }
</content>
</file>
<file><path>app/utils/export.ts</path>
<content lines="1-437">
  1 | import { jsPDF } from 'jspdf';
  2 | import { saveAs } from 'file-saver';
  3 | import { svg2pdf } from 'svg2pdf.js';
  4 | 
  5 | export interface AnalysisData {
  6 |   repository: {
  7 |     name: string;
  8 |     full_name: string;
  9 |     description: string;
 10 |     html_url: string;
 11 |   };
 12 |   filesAnalyzed: number;
 13 |   documentation?: string;
 14 |   uml?: {
 15 |     classDiagram: string;
 16 |     sequenceDiagram: string;
 17 |     descriptions: Record<string, string>;
 18 |     categories: Record<string, string>;
 19 |   };
 20 |   quiz?: Array<{
 21 |     question: string;
 22 |     options: string[];
 23 |     correctAnswer: number;
 24 |     explanation: string;
 25 |   }>;
 26 | }
 27 | 
 28 | /**
 29 |  * Generate a Markdown report from analysis data
 30 |  */
 31 | export function exportToMarkdown(data: AnalysisData): string {
 32 |   const { repository, filesAnalyzed, documentation, uml, quiz } = data;
 33 |   const date = new Date().toLocaleDateString('en-US', {
 34 |     year: 'numeric',
 35 |     month: 'long',
 36 |     day: 'numeric',
 37 |   });
 38 | 
 39 |   let markdown = `# Repository Analysis: ${repository.name}\n\n`;
 40 |   markdown += `*Generated on ${date}*\n\n`;
 41 |   markdown += `---\n\n`;
 42 | 
 43 |   // Repository Information
 44 |   markdown += `## Repository Information\n\n`;
 45 |   markdown += `- **Name:** ${repository.name}\n`;
 46 |   markdown += `- **Full Name:** ${repository.full_name}\n`;
 47 |   if (repository.description) {
 48 |     markdown += `- **Description:** ${repository.description}\n`;
 49 |   }
 50 |   markdown += `- **URL:** [${repository.html_url}](${repository.html_url})\n`;
 51 |   markdown += `- **Files Analyzed:** ${filesAnalyzed}\n\n`;
 52 | 
 53 |   // Documentation
 54 |   if (documentation) {
 55 |     markdown += `---\n\n`;
 56 |     markdown += `## Documentation\n\n`;
 57 |     markdown += documentation + '\n\n';
 58 |   }
 59 | 
 60 |   // UML Diagrams
 61 |   if (uml) {
 62 |     markdown += `---\n\n`;
 63 |     markdown += `## UML Diagrams\n\n`;
 64 | 
 65 |     if (uml.classDiagram) {
 66 |       markdown += `### Class Diagram\n\n`;
 67 |       markdown += '```mermaid\n';
 68 |       markdown += uml.classDiagram + '\n';
 69 |       markdown += '```\n\n';
 70 |     }
 71 | 
 72 |     if (uml.sequenceDiagram) {
 73 |       markdown += `### Sequence Diagram\n\n`;
 74 |       markdown += '```mermaid\n';
 75 |       markdown += uml.sequenceDiagram + '\n';
 76 |       markdown += '```\n\n';
 77 |     }
 78 | 
 79 |     // Component Descriptions
 80 |     if (uml.descriptions && Object.keys(uml.descriptions).length > 0) {
 81 |       markdown += `### Component Descriptions\n\n`;
 82 |       Object.entries(uml.descriptions).forEach(([name, description]) => {
 83 |         markdown += `#### ${name}\n\n`;
 84 |         markdown += `${description}\n\n`;
 85 |       });
 86 |     }
 87 |   }
 88 | 
 89 |   // Quiz
 90 |   if (quiz && quiz.length > 0) {
 91 |     markdown += `---\n\n`;
 92 |     markdown += `## Quiz\n\n`;
 93 |     quiz.forEach((q, i) => {
 94 |       markdown += `### Question ${i + 1}\n\n`;
 95 |       markdown += `**${q.question}**\n\n`;
 96 |       markdown += `Options:\n`;
 97 |       q.options.forEach((opt, j) => {
 98 |         const marker = j === q.correctAnswer ? '✓' : ' ';
 99 |         markdown += `${j + 1}. [${marker}] ${opt}\n`;
100 |       });
101 |       markdown += `\n**Correct Answer:** ${q.correctAnswer + 1}\n\n`;
102 |       if (q.explanation) {
103 |         markdown += `**Explanation:** ${q.explanation}\n\n`;
104 |       }
105 |     });
106 |   }
107 | 
108 |   return markdown;
109 | }
110 | 
111 | /**
112 |  * Export analysis data as a Markdown file
113 |  */
114 | export function downloadMarkdown(data: AnalysisData): void {
115 |   const markdown = exportToMarkdown(data);
116 |   const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
117 |   const filename = `${sanitizeFilename(data.repository.name)}-analysis-${getDateString()}.md`;
118 |   saveAs(blob, filename);
119 | }
120 | 
121 | /**
122 |  * Export a single SVG diagram
123 |  */
124 | export function exportDiagramAsSVG(svgElement: SVGElement, filename: string): void {
125 |   const svgData = new XMLSerializer().serializeToString(svgElement);
126 |   const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
127 |   saveAs(blob, filename);
128 | }
129 | 
130 | /**
131 |  * Convert SVG to PNG and download
132 |  */
133 | export async function exportDiagramAsPNG(
134 |   svgElement: SVGElement,
135 |   filename: string,
136 |   scale: number = 2
137 | ): Promise<void> {
138 |   return new Promise((resolve, reject) => {
139 |     try {
140 |       const svgData = new XMLSerializer().serializeToString(svgElement);
141 |       const canvas = document.createElement('canvas');
142 |       const ctx = canvas.getContext('2d');
143 |       
144 |       if (!ctx) {
145 |         throw new Error('Could not get canvas context');
146 |       }
147 | 
148 |       const img = new Image();
149 |       const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
150 |       const url = URL.createObjectURL(svgBlob);
151 | 
152 |       img.onload = () => {
153 |         canvas.width = img.width * scale;
154 |         canvas.height = img.height * scale;
155 |         ctx.scale(scale, scale);
156 |         ctx.fillStyle = '#000000'; // Black background
157 |         ctx.fillRect(0, 0, canvas.width, canvas.height);
158 |         ctx.drawImage(img, 0, 0);
159 |         
160 |         canvas.toBlob((blob) => {
161 |           if (blob) {
162 |             saveAs(blob, filename);
163 |             URL.revokeObjectURL(url);
164 |             resolve();
165 |           } else {
166 |             reject(new Error('Failed to create PNG blob'));
167 |           }
168 |         }, 'image/png');
169 |       };
170 | 
171 |       img.onerror = () => {
172 |         URL.revokeObjectURL(url);
173 |         reject(new Error('Failed to load SVG image'));
174 |       };
175 | 
176 |       img.src = url;
177 |     } catch (error) {
178 |       reject(error);
179 |     }
180 |   });
181 | }
182 | 
183 | /**
184 |  * Generate a PDF report with rendered diagrams
185 |  */
186 | export async function exportToPDF(
187 |   data: AnalysisData,
188 |   classDiagramSVG?: SVGElement,
189 |   sequenceDiagramSVG?: SVGElement
190 | ): Promise<void> {
191 |   const doc = new jsPDF({
192 |     orientation: 'portrait',
193 |     unit: 'mm',
194 |     format: 'a4',
195 |   });
196 | 
197 |   const pageWidth = doc.internal.pageSize.getWidth();
198 |   const pageHeight = doc.internal.pageSize.getHeight();
199 |   const margin = 20;
200 |   const contentWidth = pageWidth - 2 * margin;
201 |   let yPos = margin;
202 | 
203 |   // Helper function to add new page if needed
204 |   const checkPageBreak = (requiredSpace: number) => {
205 |     if (yPos + requiredSpace > pageHeight - margin) {
206 |       doc.addPage();
207 |       yPos = margin;
208 |       return true;
209 |     }
210 |     return false;
211 |   };
212 | 
213 |   // Helper function to add text with word wrap
214 |   const addText = (text: string, fontSize: number, isBold: boolean = false) => {
215 |     doc.setFontSize(fontSize);
216 |     doc.setFont('helvetica', isBold ? 'bold' : 'normal');
217 |     const lines = doc.splitTextToSize(text, contentWidth);
218 |     
219 |     lines.forEach((line: string) => {
220 |       checkPageBreak(fontSize * 0.5);
221 |       doc.text(line, margin, yPos);
222 |       yPos += fontSize * 0.5;
223 |     });
224 |   };
225 | 
226 |   // Cover Page
227 |   doc.setFillColor(0, 0, 0);
228 |   doc.rect(0, 0, pageWidth, pageHeight, 'F');
229 |   
230 |   doc.setTextColor(255, 255, 255);
231 |   doc.setFontSize(28);
232 |   doc.setFont('helvetica', 'bold');
233 |   doc.text('Repository Analysis', pageWidth / 2, 80, { align: 'center' });
234 |   
235 |   doc.setFontSize(18);
236 |   doc.setFont('helvetica', 'normal');
237 |   doc.text(data.repository.name, pageWidth / 2, 100, { align: 'center' });
238 |   
239 |   doc.setFontSize(10);
240 |   doc.setTextColor(180, 180, 180);
241 |   const date = new Date().toLocaleDateString('en-US', {
242 |     year: 'numeric',
243 |     month: 'long',
244 |     day: 'numeric',
245 |   });
246 |   doc.text(`Generated on ${date}`, pageWidth / 2, 120, { align: 'center' });
247 | 
248 |   // Repository Information Page
249 |   doc.addPage();
250 |   doc.setTextColor(0, 0, 0);
251 |   yPos = margin;
252 | 
253 |   addText('Repository Information', 20, true);
254 |   yPos += 5;
255 | 
256 |   doc.setFontSize(10);
257 |   doc.setFont('helvetica', 'normal');
258 |   
259 |   const repoInfo = [
260 |     `Name: ${data.repository.name}`,
261 |     `Full Name: ${data.repository.full_name}`,
262 |     data.repository.description ? `Description: ${data.repository.description}` : null,
263 |     `URL: ${data.repository.html_url}`,
264 |     `Files Analyzed: ${data.filesAnalyzed}`,
265 |   ].filter(Boolean);
266 | 
267 |   repoInfo.forEach((info) => {
268 |     if (info) {
269 |       checkPageBreak(10);
270 |       doc.text(info, margin, yPos);
271 |       yPos += 7;
272 |     }
273 |   });
274 | 
275 |   // Documentation
276 |   if (data.documentation) {
277 |     yPos += 10;
278 |     checkPageBreak(20);
279 |     addText('Documentation', 16, true);
280 |     yPos += 5;
281 | 
282 |     // Clean and format documentation text
283 |     const cleanDoc = data.documentation
284 |       .replace(/```[\s\S]*?```/g, '[Code Block]')
285 |       .replace(/`([^`]+)`/g, '$1')
286 |       .replace(/#{1,6}\s/g, '')
287 |       .replace(/\*\*(.*?)\*\*/g, '$1')
288 |       .replace(/\n\n+/g, '\n\n');
289 | 
290 |     addText(cleanDoc, 10);
291 |   }
292 | 
293 |   // Class Diagram
294 |   if (classDiagramSVG && data.uml?.classDiagram) {
295 |     doc.addPage();
296 |     yPos = margin;
297 |     addText('Class Diagram', 16, true);
298 |     yPos += 10;
299 | 
300 |     try {
301 |       const svgElement = classDiagramSVG as SVGSVGElement;
302 |       const svgWidth = svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value;
303 |       const svgHeight = svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value;
304 |       
305 |       const scale = Math.min(contentWidth / svgWidth, (pageHeight - yPos - margin) / svgHeight);
306 |       const scaledWidth = svgWidth * scale;
307 |       const scaledHeight = svgHeight * scale;
308 | 
309 |       await svg2pdf(classDiagramSVG, doc, {
310 |         x: margin,
311 |         y: yPos,
312 |         width: scaledWidth,
313 |         height: scaledHeight,
314 |       });
315 |     } catch (error) {
316 |       console.error('Error adding class diagram to PDF:', error);
317 |       doc.text('Error rendering class diagram', margin, yPos);
318 |     }
319 |   }
320 | 
321 |   // Sequence Diagram
322 |   if (sequenceDiagramSVG && data.uml?.sequenceDiagram) {
323 |     doc.addPage();
324 |     yPos = margin;
325 |     addText('Sequence Diagram', 16, true);
326 |     yPos += 10;
327 | 
328 |     try {
329 |       const svgElement = sequenceDiagramSVG as SVGSVGElement;
330 |       const svgWidth = svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value;
331 |       const svgHeight = svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value;
332 |       
333 |       const scale = Math.min(contentWidth / svgWidth, (pageHeight - yPos - margin) / svgHeight);
334 |       const scaledWidth = svgWidth * scale;
335 |       const scaledHeight = svgHeight * scale;
336 | 
337 |       await svg2pdf(sequenceDiagramSVG, doc, {
338 |         x: margin,
339 |         y: yPos,
340 |         width: scaledWidth,
341 |         height: scaledHeight,
342 |       });
343 |     } catch (error) {
344 |       console.error('Error adding sequence diagram to PDF:', error);
345 |       doc.text('Error rendering sequence diagram', margin, yPos);
346 |     }
347 |   }
348 | 
349 |   // Component Descriptions
350 |   if (data.uml?.descriptions && Object.keys(data.uml.descriptions).length > 0) {
351 |     doc.addPage();
352 |     yPos = margin;
353 |     addText('Component Descriptions', 16, true);
354 |     yPos += 10;
355 | 
356 |     Object.entries(data.uml.descriptions).forEach(([name, description]) => {
357 |       checkPageBreak(30);
358 |       addText(name, 12, true);
359 |       yPos += 2;
360 |       addText(description, 10);
361 |       yPos += 5;
362 |     });
363 |   }
364 | 
365 |   // Quiz
366 |   if (data.quiz && data.quiz.length > 0) {
367 |     doc.addPage();
368 |     yPos = margin;
369 |     addText('Quiz', 16, true);
370 |     yPos += 10;
371 | 
372 |     data.quiz.forEach((q, i) => {
373 |       checkPageBreak(40);
374 |       addText(`Question ${i + 1}: ${q.question}`, 11, true);
375 |       yPos += 3;
376 | 
377 |       q.options.forEach((opt, j) => {
378 |         const marker = j === q.correctAnswer ? '✓' : ' ';
379 |         doc.text(`  ${j + 1}. [${marker}] ${opt}`, margin, yPos);
380 |         yPos += 6;
381 |       });
382 | 
383 |       if (q.explanation) {
384 |         yPos += 2;
385 |         doc.setFontSize(9);
386 |         doc.setTextColor(100, 100, 100);
387 |         const expLines = doc.splitTextToSize(`Explanation: ${q.explanation}`, contentWidth - 10);
388 |         expLines.forEach((line: string) => {
389 |           checkPageBreak(5);
390 |           doc.text(line, margin + 5, yPos);
391 |           yPos += 5;
392 |         });
393 |         doc.setTextColor(0, 0, 0);
394 |       }
395 | 
396 |       yPos += 5;
397 |     });
398 |   }
399 | 
400 |   // Add page numbers
401 |   const pageCount = doc.getNumberOfPages();
402 |   for (let i = 1; i <= pageCount; i++) {
403 |     doc.setPage(i);
404 |     doc.setFontSize(8);
405 |     doc.setTextColor(150, 150, 150);
406 |     doc.text(
407 |       `Page ${i} of ${pageCount}`,
408 |       pageWidth / 2,
409 |       pageHeight - 10,
410 |       { align: 'center' }
411 |     );
412 |   }
413 | 
414 |   // Save the PDF
415 |   const filename = `${sanitizeFilename(data.repository.name)}-analysis-${getDateString()}.pdf`;
416 |   doc.save(filename);
417 | }
418 | 
419 | /**
420 |  * Sanitize filename by removing invalid characters
421 |  */
422 | function sanitizeFilename(filename: string): string {
423 |   return filename
424 |     .replace(/[^a-z0-9_-]/gi, '-')
425 |     .replace(/-+/g, '-')
426 |     .toLowerCase();
427 | }
428 | 
429 | /**
430 |  * Get current date as string in YYYY-MM-DD format
431 |  */
432 | function getDateString(): string {
433 |   const now = new Date();
434 |   return now.toISOString().split('T')[0];
435 | }
436 | 
437 | // Made with Bob
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,app/api/analyze/route.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:13:28.632Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.02

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Pending |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Pending |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Pending |
| 4 | Add new sub-tabs with conditional rendering in results page | Pending |
| 5 | Update export utilities in `app/utils/export.ts` | Pending |
| 6 | Test the implementation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<update_todo_list>
<todos>
[x] Read current implementation files (route.ts, page.tsx, export.ts)
[-] Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types
[ ] Update `UmlData` interface in `app/results/page.tsx`
[ ] Add new sub-tabs with conditional rendering in results page
[ ] Update export utilities in `app/utils/export.ts`
[ ] Test the implementation
</todos>
</update_todo_list>

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,app/api/analyze/route.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:13:33.980Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.09

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | In Progress |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Pending |
| 4 | Add new sub-tabs with conditional rendering in results page | Pending |
| 5 | Update export utilities in `app/utils/export.ts` | Pending |
| 6 | Test the implementation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Now I'll update the `generateUML()` function in `app/api/analyze/route.ts` to include the three new diagram types with proper prompt engineering:

<apply_diff>
<path>app/api/analyze/route.ts</path>
<diff>
<<<<<<< SEARCH
:start_line:68
-------
// Generate UML diagram using Watson AI
async function generateUML(files: CodeFile[], repoName: string) {
  // Use optimized context builder with 80k token budget
  const filesContext = buildOptimizedContext(files, 80000);

  const prompt = `You are a software architecture expert. Analyze the code repository "${repoName}".

Return a single JSON object with exactly these four keys:

{
  "classDiagram": "<valid Mermaid classDiagram string>",
  "sequenceDiagram": "<valid Mermaid sequenceDiagram string>",
  "descriptions": {
    "<NodeOrActorName>": "<one sentence plain-English description>"
  },
  "categories": {
    "<NodeOrActorName>": "<page|route|external|internal|actor>"
  }
}
=======
// Generate UML diagram using Watson AI
async function generateUML(files: CodeFile[], repoName: string) {
  // Use optimized context builder with 80k token budget
  const filesContext = buildOptimizedContext(files, 80000);

  const prompt = `You are a software architecture expert. Analyze the code repository "${repoName}".

Return a single JSON object with exactly these seven keys:

{
  "classDiagram": "<valid Mermaid classDiagram string>",
  "sequenceDiagram": "<valid Mermaid sequenceDiagram string>",
  "componentDiagram": "<valid Mermaid component diagram string or empty string>",
  "stateDiagram": "<valid Mermaid stateDiagram-v2 string or empty string>",
  "erDiagram": "<valid Mermaid erDiagram string or empty string>",
  "descriptions": {
    "<NodeOrActorName>": "<one sentence plain-English description>"
  },
  "categories": {
    "<NodeOrActorName>": "<page|route|external|internal|actor>"
  }
}
>>>>>>> REPLACE

<<<<<<< SEARCH
:start_line:100
-------
Rules for both diagrams:
- Use valid Mermaid v11 syntax only.
- In classDiagram: use ONLY the keyword "class", never "interface", "enum", or "abstract class".
- Actor and class names must be plain alphanumeric — no parentheses, colons, angle brackets, or special characters.
- Member types must be simple words only (string, number, boolean) — no arrays like string[], no generics, no union types.
- Do not include markdown fences inside the JSON strings — just the raw diagram text starting with "classDiagram" or "sequenceDiagram".
=======
Rules for the COMPONENT DIAGRAM:
- Show system boundaries and external services (APIs, databases, cloud services)
- Include main application components: frontend, backend, database, external APIs
- Show deployment architecture if detectable from config files (Docker, Kubernetes, etc.)
- Use Mermaid C4 component diagram syntax or standard component diagram syntax
- Max 8 components total — focus on high-level architecture only
- If the codebase is too simple (single file, no clear architecture), return empty string ""

Rules for the STATE DIAGRAM:
- Identify state machines in the code: enums with state values, state management patterns, workflow logic, lifecycle management
- Show primary state transitions only — skip trivial or obvious transitions
- Max 6 states total — focus on the most important state machine
- Use Mermaid stateDiagram-v2 syntax
- If no clear state machine exists in the codebase, return empty string ""
- Look for: Redux/Zustand state, React component lifecycle, authentication states, order/workflow states, connection states

Rules for the ER DIAGRAM:
- Detect database models: Prisma schema, TypeORM entities, Sequelize models, Django models, SQL schema files, MongoDB schemas
- Show entity relationships: one-to-many (||--o{), many-to-many (}o--o{), one-to-one (||--||)
- Max 7 entities — focus on core data model only
- Use Mermaid erDiagram syntax
- If no database schema or ORM models detected, return empty string ""
- Include key attributes for each entity (primary keys, foreign keys, important fields)

Rules for all diagrams:
- Use valid Mermaid v11 syntax only.
- In classDiagram: use ONLY the keyword "class", never "interface", "enum", or "abstract class".
- Actor and class names must be plain alphanumeric — no parentheses, colons, angle brackets, or special characters.
- Member types must be simple words only (string, number, boolean) — no arrays like string[], no generics, no union types.
- Do not include markdown fences inside the JSON strings — just the raw diagram text starting with the diagram type keyword.
- For componentDiagram, stateDiagram, and erDiagram: return empty string "" if that aspect is not present in the codebase.
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'app/api/analyze/route.ts'] Result:
<file_write_result>
<path>app/api/analyze/route.ts</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,app/api/analyze/route.ts,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Recently Modified Files
These files have been modified since you last accessed them (file was just edited so you may need to re-read it before editing):
app/api/analyze/route.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:14:53.559Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.17

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | In Progress |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Pending |
| 4 | Add new sub-tabs with conditional rendering in results page | Pending |
| 5 | Update export utilities in `app/utils/export.ts` | Pending |
| 6 | Test the implementation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<update_todo_list>
<todos>
[x] Read current implementation files (route.ts, page.tsx, export.ts)
[x] Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types
[-] Update `UmlData` interface in `app/results/page.tsx`
[ ] Add new sub-tabs with conditional rendering in results page
[ ] Update export utilities in `app/utils/export.ts`
[ ] Test the implementation
</todos>
</update_todo_list>

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,app/api/analyze/route.ts,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:15:06.628Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.25

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | In Progress |
| 4 | Add new sub-tabs with conditional rendering in results page | Pending |
| 5 | Update export utilities in `app/utils/export.ts` | Pending |
| 6 | Test the implementation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Now I'll update the `UmlData` interface in `app/results/page.tsx`:

<apply_diff>
<path>app/results/page.tsx</path>
<diff>
<<<<<<< SEARCH
:start_line:18
-------
interface UmlData {
  classDiagram: string;
  sequenceDiagram: string;
  descriptions: Record<string, string>;
  categories: Record<string, Category>;
}
=======
interface UmlData {
  classDiagram: string;
  sequenceDiagram: string;
  componentDiagram: string;
  stateDiagram: string;
  erDiagram: string;
  descriptions: Record<string, string>;
  categories: Record<string, Category>;
}
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'app/results/page.tsx'] Result:
<file_write_result>
<path>app/results/page.tsx</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<notice>Making multiple related changes in a single apply_diff is more efficient. If other changes are needed in this file, please include them as additional SEARCH/REPLACE blocks.</notice>
<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/api/analyze/route.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Recently Modified Files
These files have been modified since you last accessed them (file was just edited so you may need to re-read it before editing):
app/results/page.tsx

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:15:19.399Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.33

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | In Progress |
| 4 | Add new sub-tabs with conditional rendering in results page | Pending |
| 5 | Update export utilities in `app/utils/export.ts` | Pending |
| 6 | Test the implementation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<update_todo_list>
<todos>
[x] Read current implementation files (route.ts, page.tsx, export.ts)
[x] Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types
[x] Update `UmlData` interface in `app/results/page.tsx`
[-] Add new sub-tabs with conditional rendering in results page
[ ] Update export utilities in `app/utils/export.ts`
[ ] Test the implementation
</todos>
</update_todo_list>

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/api/analyze/route.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:15:25.086Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.41

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Completed |
| 4 | Add new sub-tabs with conditional rendering in results page | In Progress |
| 5 | Update export utilities in `app/utils/export.ts` | Pending |
| 6 | Test the implementation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Now I'll add the new sub-tabs with conditional rendering in the results page. I need to update the activeSubTab state type and the sub-tabs rendering logic:

<apply_diff>
<path>app/results/page.tsx</path>
<diff>
<<<<<<< SEARCH
:start_line:245
-------
  const [activeSubTab, setActiveSubTab] = useState<'class' | 'sequence'>('class');
=======
  const [activeSubTab, setActiveSubTab] = useState<'class' | 'sequence' | 'component' | 'state' | 'er'>('class');
>>>>>>> REPLACE

<<<<<<< SEARCH
:start_line:655
-------
            {/* UML */}
            {activeTab === 'uml' && data?.uml && (() => {
              // Class tab: show ALL descriptions (diagram nodes + utility functions/interfaces the AI included).
              // Sequence tab: show only actors that appear in the diagram.
              const sequenceActors = extractActorNames(data.uml.sequenceDiagram);
              const panelDescriptions = activeSubTab === 'sequence'
                ? Object.fromEntries(
                    Object.entries(data.uml.descriptions).filter(
                      ([name]) => sequenceActors.size === 0 || sequenceActors.has(name)
                    )
                  )
                : data.uml.descriptions;
              const panelLabel = activeSubTab === 'class' ? 'Components' : 'Actors';

              return (
                <motion.div key="uml" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-4">
                  {/* Sub-tabs */}
                  <div className="flex gap-1">
                    {(['class', 'sequence'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setActiveSubTab(t); setActiveNode(null); }}
                        className="px-4 py-2 text-xs font-medium rounded-lg transition-colors"
                        style={{
                          backgroundColor: activeSubTab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                          color: activeSubTab === t ? 'white' : 'rgb(113,113,122)',
                        }}
                      >
                        {t === 'class' ? 'Class Diagram' : 'Sequence Diagram'}
                      </button>
                    ))}
                  </div>

                  {/* Side-by-side: diagram + description panel */}
                  <div
                    className="flex gap-4"
                    style={{ height: `${Math.min(Math.max(diagramHeight + 48, 380), Math.round(window.innerHeight * 0.82))}px` }}
                  >
                    {/* Diagram — pan/zoom viewport */}
                    <div className="flex-1 min-w-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden relative">
                      <InteractiveDiagram
                        key={activeSubTab}
                        chart={activeSubTab === 'class' ? data.uml.classDiagram : data.uml.sequenceDiagram}
                        id={activeSubTab === 'class' ? 'class-diagram' : 'sequence-diagram'}
                        categories={data.uml.categories ?? {}}
                        activeNode={activeNode}
                        onNodeHover={setActiveNode}
                        onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
                        onHeightReady={setDiagramHeight}
                      />
                    </div>

                    {/* Description panel — sticky header, independently scrollable list */}
                    <div className="w-72 shrink-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden flex flex-col">
                      <DescriptionPanel
                        descriptions={panelDescriptions}
                        categories={data.uml.categories ?? {}}
                        activeNode={activeNode}
                        label={panelLabel}
                        onNodeHover={setActiveNode}
                        onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })()}
=======
            {/* UML */}
            {activeTab === 'uml' && data?.uml && (() => {
              // Determine which diagrams are available
              const availableDiagrams: Array<{ id: 'class' | 'sequence' | 'component' | 'state' | 'er'; label: string; diagram: string }> = [];
              
              if (data.uml.classDiagram) {
                availableDiagrams.push({ id: 'class', label: 'Class', diagram: data.uml.classDiagram });
              }
              if (data.uml.sequenceDiagram) {
                availableDiagrams.push({ id: 'sequence', label: 'Sequence', diagram: data.uml.sequenceDiagram });
              }
              if (data.uml.componentDiagram) {
                availableDiagrams.push({ id: 'component', label: 'Component', diagram: data.uml.componentDiagram });
              }
              if (data.uml.stateDiagram) {
                availableDiagrams.push({ id: 'state', label: 'State', diagram: data.uml.stateDiagram });
              }
              if (data.uml.erDiagram) {
                availableDiagrams.push({ id: 'er', label: 'ER', diagram: data.uml.erDiagram });
              }

              // Set initial active tab to first available diagram
              if (availableDiagrams.length > 0 && !availableDiagrams.find(d => d.id === activeSubTab)) {
                setActiveSubTab(availableDiagrams[0].id);
              }

              // Get current diagram
              const currentDiagram = availableDiagrams.find(d => d.id === activeSubTab);
              
              // Determine panel descriptions based on active tab
              let panelDescriptions = data.uml.descriptions;
              let panelLabel = 'Components';
              
              if (activeSubTab === 'sequence') {
                const sequenceActors = extractActorNames(data.uml.sequenceDiagram);
                panelDescriptions = Object.fromEntries(
                  Object.entries(data.uml.descriptions).filter(
                    ([name]) => sequenceActors.size === 0 || sequenceActors.has(name)
                  )
                );
                panelLabel = 'Actors';
              } else if (activeSubTab === 'component') {
                panelLabel = 'Components';
              } else if (activeSubTab === 'state') {
                panelLabel = 'States';
              } else if (activeSubTab === 'er') {
                panelLabel = 'Entities';
              }

              return (
                <motion.div key="uml" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-4">
                  {/* Sub-tabs */}
                  <div className="flex gap-1 flex-wrap">
                    {availableDiagrams.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setActiveSubTab(t.id); setActiveNode(null); }}
                        className="px-4 py-2 text-xs font-medium rounded-lg transition-colors"
                        style={{
                          backgroundColor: activeSubTab === t.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                          color: activeSubTab === t.id ? 'white' : 'rgb(113,113,122)',
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Show message if no diagrams available */}
                  {availableDiagrams.length === 0 && (
                    <div className="text-center py-12 text-zinc-500 text-sm">
                      No diagrams available for this codebase
                    </div>
                  )}

                  {/* Show helpful message if only basic diagrams available */}
                  {availableDiagrams.length > 0 && availableDiagrams.length <= 2 && (
                    <div className="text-xs text-zinc-600 bg-zinc-900/40 border border-zinc-800 rounded-lg px-3 py-2">
                      {!data.uml.componentDiagram && !data.uml.stateDiagram && !data.uml.erDiagram && (
                        <>No component, state, or ER diagrams detected. This codebase may not have clear architecture patterns, state machines, or database schemas.</>
                      )}
                      {!data.uml.stateDiagram && data.uml.componentDiagram && (
                        <>No state machines detected in this codebase</>
                      )}
                      {!data.uml.erDiagram && (data.uml.componentDiagram || data.uml.stateDiagram) && (
                        <>No database schema detected in this codebase</>
                      )}
                    </div>
                  )}

                  {/* Side-by-side: diagram + description panel */}
                  {currentDiagram && (
                    <div
                      className="flex gap-4"
                      style={{ height: `${Math.min(Math.max(diagramHeight + 48, 380), Math.round(window.innerHeight * 0.82))}px` }}
                    >
                      {/* Diagram — pan/zoom viewport */}
                      <div className="flex-1 min-w-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden relative">
                        <InteractiveDiagram
                          key={activeSubTab}
                          chart={currentDiagram.diagram}
                          id={`${activeSubTab}-diagram`}
                          categories={data.uml.categories ?? {}}
                          activeNode={activeNode}
                          onNodeHover={setActiveNode}
                          onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
                          onHeightReady={setDiagramHeight}
                        />
                      </div>

                      {/* Description panel — sticky header, independently scrollable list */}
                      <div className="w-72 shrink-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden flex flex-col">
                        <DescriptionPanel
                          descriptions={panelDescriptions}
                          categories={data.uml.categories ?? {}}
                          activeNode={activeNode}
                          label={panelLabel}
                          onNodeHover={setActiveNode}
                          onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })()}
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'app/results/page.tsx'] Result:
<file_write_result>
<path>app/results/page.tsx</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/api/analyze/route.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Recently Modified Files
These files have been modified since you last accessed them (file was just edited so you may need to re-read it before editing):
app/results/page.tsx

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:16:46.191Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.50

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Completed |
| 4 | Add new sub-tabs with conditional rendering in results page | In Progress |
| 5 | Update export utilities in `app/utils/export.ts` | Pending |
| 6 | Test the implementation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<update_todo_list>
<todos>
[x] Read current implementation files (route.ts, page.tsx, export.ts)
[x] Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types
[x] Update `UmlData` interface in `app/results/page.tsx`
[x] Add new sub-tabs with conditional rendering in results page
[-] Update export utilities in `app/utils/export.ts`
[ ] Test the implementation
</todos>
</update_todo_list>

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/api/analyze/route.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:16:50.975Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.59

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Completed |
| 4 | Add new sub-tabs with conditional rendering in results page | Completed |
| 5 | Update export utilities in `app/utils/export.ts` | In Progress |
| 6 | Test the implementation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Now I'll update the export utilities to include the new diagram types:

<apply_diff>
<path>app/utils/export.ts</path>
<diff>
<<<<<<< SEARCH
:start_line:14
-------
  uml?: {
    classDiagram: string;
    sequenceDiagram: string;
    descriptions: Record<string, string>;
    categories: Record<string, string>;
  };
=======
  uml?: {
    classDiagram: string;
    sequenceDiagram: string;
    componentDiagram: string;
    stateDiagram: string;
    erDiagram: string;
    descriptions: Record<string, string>;
    categories: Record<string, string>;
  };
>>>>>>> REPLACE

<<<<<<< SEARCH
:start_line:60
-------
  // UML Diagrams
  if (uml) {
    markdown += `---\n\n`;
    markdown += `## UML Diagrams\n\n`;

    if (uml.classDiagram) {
      markdown += `### Class Diagram\n\n`;
      markdown += '```mermaid\n';
      markdown += uml.classDiagram + '\n';
      markdown += '```\n\n';
    }

    if (uml.sequenceDiagram) {
      markdown += `### Sequence Diagram\n\n`;
      markdown += '```mermaid\n';
      markdown += uml.sequenceDiagram + '\n';
      markdown += '```\n\n';
    }

    // Component Descriptions
    if (uml.descriptions && Object.keys(uml.descriptions).length > 0) {
      markdown += `### Component Descriptions\n\n`;
      Object.entries(uml.descriptions).forEach(([name, description]) => {
        markdown += `#### ${name}\n\n`;
        markdown += `${description}\n\n`;
      });
    }
  }
=======
  // UML Diagrams
  if (uml) {
    markdown += `---\n\n`;
    markdown += `## UML Diagrams\n\n`;

    if (uml.classDiagram) {
      markdown += `### Class Diagram\n\n`;
      markdown += '```mermaid\n';
      markdown += uml.classDiagram + '\n';
      markdown += '```\n\n';
    }

    if (uml.sequenceDiagram) {
      markdown += `### Sequence Diagram\n\n`;
      markdown += '```mermaid\n';
      markdown += uml.sequenceDiagram + '\n';
      markdown += '```\n\n';
    }

    if (uml.componentDiagram) {
      markdown += `### Component Diagram\n\n`;
      markdown += '```mermaid\n';
      markdown += uml.componentDiagram + '\n';
      markdown += '```\n\n';
    }

    if (uml.stateDiagram) {
      markdown += `### State Diagram\n\n`;
      markdown += '```mermaid\n';
      markdown += uml.stateDiagram + '\n';
      markdown += '```\n\n';
    }

    if (uml.erDiagram) {
      markdown += `### ER Diagram\n\n`;
      markdown += '```mermaid\n';
      markdown += uml.erDiagram + '\n';
      markdown += '```\n\n';
    }

    // Component Descriptions
    if (uml.descriptions && Object.keys(uml.descriptions).length > 0) {
      markdown += `### Component Descriptions\n\n`;
      Object.entries(uml.descriptions).forEach(([name, description]) => {
        markdown += `#### ${name}\n\n`;
        markdown += `${description}\n\n`;
      });
    }
  }
>>>>>>> REPLACE

<<<<<<< SEARCH
:start_line:183
-------
/**
 * Generate a PDF report with rendered diagrams
 */
export async function exportToPDF(
  data: AnalysisData,
  classDiagramSVG?: SVGElement,
  sequenceDiagramSVG?: SVGElement
): Promise<void> {
=======
/**
 * Generate a PDF report with rendered diagrams
 */
export async function exportToPDF(
  data: AnalysisData,
  classDiagramSVG?: SVGElement,
  sequenceDiagramSVG?: SVGElement,
  componentDiagramSVG?: SVGElement,
  stateDiagramSVG?: SVGElement,
  erDiagramSVG?: SVGElement
): Promise<void> {
>>>>>>> REPLACE

<<<<<<< SEARCH
:start_line:347
-------
  // Component Descriptions
  if (data.uml?.descriptions && Object.keys(data.uml.descriptions).length > 0) {
    doc.addPage();
    yPos = margin;
    addText('Component Descriptions', 16, true);
    yPos += 10;

    Object.entries(data.uml.descriptions).forEach(([name, description]) => {
      checkPageBreak(30);
      addText(name, 12, true);
      yPos += 2;
      addText(description, 10);
      yPos += 5;
    });
  }
=======
  // Component Diagram
  if (componentDiagramSVG && data.uml?.componentDiagram) {
    doc.addPage();
    yPos = margin;
    addText('Component Diagram', 16, true);
    yPos += 10;

    try {
      const svgElement = componentDiagramSVG as SVGSVGElement;
      const svgWidth = svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value;
      const svgHeight = svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value;
      
      const scale = Math.min(contentWidth / svgWidth, (pageHeight - yPos - margin) / svgHeight);
      const scaledWidth = svgWidth * scale;
      const scaledHeight = svgHeight * scale;

      await svg2pdf(componentDiagramSVG, doc, {
        x: margin,
        y: yPos,
        width: scaledWidth,
        height: scaledHeight,
      });
    } catch (error) {
      console.error('Error adding component diagram to PDF:', error);
      doc.text('Error rendering component diagram', margin, yPos);
    }
  }

  // State Diagram
  if (stateDiagramSVG && data.uml?.stateDiagram) {
    doc.addPage();
    yPos = margin;
    addText('State Diagram', 16, true);
    yPos += 10;

    try {
      const svgElement = stateDiagramSVG as SVGSVGElement;
      const svgWidth = svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value;
      const svgHeight = svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value;
      
      const scale = Math.min(contentWidth / svgWidth, (pageHeight - yPos - margin) / svgHeight);
      const scaledWidth = svgWidth * scale;
      const scaledHeight = svgHeight * scale;

      await svg2pdf(stateDiagramSVG, doc, {
        x: margin,
        y: yPos,
        width: scaledWidth,
        height: scaledHeight,
      });
    } catch (error) {
      console.error('Error adding state diagram to PDF:', error);
      doc.text('Error rendering state diagram', margin, yPos);
    }
  }

  // ER Diagram
  if (erDiagramSVG && data.uml?.erDiagram) {
    doc.addPage();
    yPos = margin;
    addText('ER Diagram', 16, true);
    yPos += 10;

    try {
      const svgElement = erDiagramSVG as SVGSVGElement;
      const svgWidth = svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value;
      const svgHeight = svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value;
      
      const scale = Math.min(contentWidth / svgWidth, (pageHeight - yPos - margin) / svgHeight);
      const scaledWidth = svgWidth * scale;
      const scaledHeight = svgHeight * scale;

      await svg2pdf(erDiagramSVG, doc, {
        x: margin,
        y: yPos,
        width: scaledWidth,
        height: scaledHeight,
      });
    } catch (error) {
      console.error('Error adding ER diagram to PDF:', error);
      doc.text('Error rendering ER diagram', margin, yPos);
    }
  }

  // Component Descriptions
  if (data.uml?.descriptions && Object.keys(data.uml.descriptions).length > 0) {
    doc.addPage();
    yPos = margin;
    addText('Component Descriptions', 16, true);
    yPos += 10;

    Object.entries(data.uml.descriptions).forEach(([name, description]) => {
      checkPageBreak(30);
      addText(name, 12, true);
      yPos += 2;
      addText(description, 10);
      yPos += 5;
    });
  }
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'app/utils/export.ts'] Result:
<file_write_result>
<path>app/utils/export.ts</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
app\utils\export.ts

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/api/analyze/route.ts,app/results/page.tsx,app/utils/export.ts,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Recently Modified Files
These files have been modified since you last accessed them (file was just edited so you may need to re-read it before editing):
app/utils/export.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:17:15.249Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.69

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Completed |
| 4 | Add new sub-tabs with conditional rendering in results page | Completed |
| 5 | Update export utilities in `app/utils/export.ts` | In Progress |
| 6 | Test the implementation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Now I need to update the results page to pass the new diagram SVG elements to the PDF export function and add export options for the new diagrams:

<apply_diff>
<path>app/results/page.tsx</path>
<diff>
<<<<<<< SEARCH
:start_line:325
-------
  const handleExportPDF = useCallback(async () => {
    if (!data) return;
    try {
      setIsExporting(true);
      setExportStatus('Generating PDF...');
      
      // Get SVG elements from the DOM
      const classDiagramEl = document.querySelector('#class-diagram svg') as SVGElement | null;
      const sequenceDiagramEl = document.querySelector('#sequence-diagram svg') as SVGElement | null;
      
      await exportToPDF(
        data as ExportAnalysisData,
        classDiagramEl || undefined,
        sequenceDiagramEl || undefined
      );
      
      setExportStatus('PDF exported successfully!');
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('PDF export failed. Please try again.');
      setTimeout(() => setExportStatus(null), 3000);
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  }, [data]);
=======
  const handleExportPDF = useCallback(async () => {
    if (!data) return;
    try {
      setIsExporting(true);
      setExportStatus('Generating PDF...');
      
      // Get SVG elements from the DOM
      const classDiagramEl = document.querySelector('#class-diagram svg') as SVGElement | null;
      const sequenceDiagramEl = document.querySelector('#sequence-diagram svg') as SVGElement | null;
      const componentDiagramEl = document.querySelector('#component-diagram svg') as SVGElement | null;
      const stateDiagramEl = document.querySelector('#state-diagram svg') as SVGElement | null;
      const erDiagramEl = document.querySelector('#er-diagram svg') as SVGElement | null;
      
      await exportToPDF(
        data as ExportAnalysisData,
        classDiagramEl || undefined,
        sequenceDiagramEl || undefined,
        componentDiagramEl || undefined,
        stateDiagramEl || undefined,
        erDiagramEl || undefined
      );
      
      setExportStatus('PDF exported successfully!');
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('PDF export failed. Please try again.');
      setTimeout(() => setExportStatus(null), 3000);
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  }, [data]);
>>>>>>> REPLACE

<<<<<<< SEARCH
:start_line:353
-------
  const handleExportDiagramSVG = useCallback((diagramType: 'class' | 'sequence') => {
    try {
      setIsExporting(true);
      const selector = diagramType === 'class' ? '#class-diagram svg' : '#sequence-diagram svg';
      const svgElement = document.querySelector(selector) as SVGElement | null;
      
      if (!svgElement) {
        throw new Error('Diagram not found');
      }
      
      const filename = `${data?.repository.name || 'diagram'}-${diagramType}-diagram-${new Date().toISOString().split('T')[0]}.svg`;
      exportDiagramAsSVG(svgElement, filename);
      
      setExportStatus(`${diagramType === 'class' ? 'Class' : 'Sequence'} diagram exported!`);
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('Export failed. Please try again.');
      setTimeout(() => setExportStatus(null), 3000);
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  }, [data]);

  const handleExportDiagramPNG = useCallback(async (diagramType: 'class' | 'sequence') => {
    try {
      setIsExporting(true);
      setExportStatus('Converting to PNG...');
      
      const selector = diagramType === 'class' ? '#class-diagram svg' : '#sequence-diagram svg';
      const svgElement = document.querySelector(selector) as SVGElement | null;
      
      if (!svgElement) {
        throw new Error('Diagram not found');
      }
      
      const filename = `${data?.repository.name || 'diagram'}-${diagramType}-diagram-${new Date().toISOString().split('T')[0]}.png`;
      await exportDiagramAsPNG(svgElement, filename);
      
      setExportStatus(`${diagramType === 'class' ? 'Class' : 'Sequence'} diagram exported as PNG!`);
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('PNG export failed. Please try again.');
      setTimeout(() => setExportStatus(null), 3000);
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  }, [data]);
=======
  const handleExportDiagramSVG = useCallback((diagramType: 'class' | 'sequence' | 'component' | 'state' | 'er') => {
    try {
      setIsExporting(true);
      const selector = `#${diagramType}-diagram svg`;
      const svgElement = document.querySelector(selector) as SVGElement | null;
      
      if (!svgElement) {
        throw new Error('Diagram not found');
      }
      
      const diagramLabels = {
        class: 'Class',
        sequence: 'Sequence',
        component: 'Component',
        state: 'State',
        er: 'ER'
      };
      
      const filename = `${data?.repository.name || 'diagram'}-${diagramType}-diagram-${new Date().toISOString().split('T')[0]}.svg`;
      exportDiagramAsSVG(svgElement, filename);
      
      setExportStatus(`${diagramLabels[diagramType]} diagram exported!`);
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('Export failed. Please try again.');
      setTimeout(() => setExportStatus(null), 3000);
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  }, [data]);

  const handleExportDiagramPNG = useCallback(async (diagramType: 'class' | 'sequence' | 'component' | 'state' | 'er') => {
    try {
      setIsExporting(true);
      setExportStatus('Converting to PNG...');
      
      const selector = `#${diagramType}-diagram svg`;
      const svgElement = document.querySelector(selector) as SVGElement | null;
      
      if (!svgElement) {
        throw new Error('Diagram not found');
      }
      
      const diagramLabels = {
        class: 'Class',
        sequence: 'Sequence',
        component: 'Component',
        state: 'State',
        er: 'ER'
      };
      
      const filename = `${data?.repository.name || 'diagram'}-${diagramType}-diagram-${new Date().toISOString().split('T')[0]}.png`;
      await exportDiagramAsPNG(svgElement, filename);
      
      setExportStatus(`${diagramLabels[diagramType]} diagram exported as PNG!`);
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('PNG export failed. Please try again.');
      setTimeout(() => setExportStatus(null), 3000);
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  }, [data]);
>>>>>>> REPLACE

<<<<<<< SEARCH
:start_line:560
-------
                              </>
                            )}
                          </div>
                        </>
                      )}
=======
                              </>
                            )}
                            {data.uml.componentDiagram && (
                              <>
                                <button
                                  onClick={() => handleExportDiagramSVG('component')}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <div className="flex-1">
                                    <div className="text-zinc-200">Component Diagram (SVG)</div>
                                  </div>
                                </button>
                                <button
                                  onClick={() => handleExportDiagramPNG('component')}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <div className="flex-1">
                                    <div className="text-zinc-200">Component Diagram (PNG)</div>
                                  </div>
                                </button>
                              </>
                            )}
                            {data.uml.stateDiagram && (
                              <>
                                <button
                                  onClick={() => handleExportDiagramSVG('state')}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <div className="flex-1">
                                    <div className="text-zinc-200">State Diagram (SVG)</div>
                                  </div>
                                </button>
                                <button
                                  onClick={() => handleExportDiagramPNG('state')}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <div className="flex-1">
                                    <div className="text-zinc-200">State Diagram (PNG)</div>
                                  </div>
                                </button>
                              </>
                            )}
                            {data.uml.erDiagram && (
                              <>
                                <button
                                  onClick={() => handleExportDiagramSVG('er')}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <div className="flex-1">
                                    <div className="text-zinc-200">ER Diagram (SVG)</div>
                                  </div>
                                </button>
                                <button
                                  onClick={() => handleExportDiagramPNG('er')}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <div className="flex-1">
                                    <div className="text-zinc-200">ER Diagram (PNG)</div>
                                  </div>
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'app/results/page.tsx'] Result:
<file_write_result>
<path>app/results/page.tsx</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/api/analyze/route.ts,app/utils/export.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:17:51.327Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.80

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Completed |
| 4 | Add new sub-tabs with conditional rendering in results page | Completed |
| 5 | Update export utilities in `app/utils/export.ts` | In Progress |
| 6 | Test the implementation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<update_todo_list>
<todos>
[x] Read current implementation files (route.ts, page.tsx, export.ts)
[x] Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types
[x] Update `UmlData` interface in `app/results/page.tsx`
[x] Add new sub-tabs with conditional rendering in results page
[x] Update export utilities in `app/utils/export.ts`
[-] Test the implementation
</todos>
</update_todo_list>

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/api/analyze/route.ts,app/utils/export.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:17:56.679Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.91

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Completed |
| 4 | Add new sub-tabs with conditional rendering in results page | Completed |
| 5 | Update export utilities in `app/utils/export.ts` | Completed |
| 6 | Test the implementation | In Progress |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Now let me verify the implementation by checking if there are any TypeScript errors or issues:

<execute_command>
<command>npm run build</command>
</execute_command>

---

**User:**

[execute_command for 'npm run build'] Result:
Command is still running in terminal  from 'c:/Users/conan/OneDrive - UBC/Documents/Personal/Hackathon/IBM Bob/seenior'.


You will be updated on the terminal status and new output in the future.
<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/api/analyze/route.ts,app/utils/export.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Actively Running Terminals
## Terminal 1 (Active)
### Working Directory: `c:\Users\conan\OneDrive - UBC\Documents\Personal\Hackathon\IBM Bob\seenior`
### Original command: `npm run build`
### New Output
- Environments: .env

  Creating an optimized production build ...


# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:18:08.136Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$1.03

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Completed |
| 4 | Add new sub-tabs with conditional rendering in results page | Completed |
| 5 | Update export utilities in `app/utils/export.ts` | Completed |
| 6 | Test the implementation | In Progress |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

The build is in progress. Let me wait for it to complete to verify there are no TypeScript errors.

<execute_command>
<command>echo "Waiting for build to complete..."</command>
</execute_command>

---

**User:**

[execute_command for 'echo "Waiting for build to complete..."'] Result:
Command executed in terminal  within working directory 'c:/Users/conan/OneDrive - UBC/Documents/Personal/Hackathon/IBM Bob/seenior'. Exit code: 0
Output:
Waiting for build to complete...

<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/api/analyze/route.ts,app/utils/export.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Actively Running Terminals
## Terminal 1 (Active)
### Working Directory: `c:\Users\conan\OneDrive - UBC\Documents\Personal\Hackathon\IBM Bob\seenior`
### Original command: `npm run build`
### New Output
✓ Compiled successfully in 7.0s
  Running TypeScript ...


# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:18:14.846Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$1.14

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Completed |
| 4 | Add new sub-tabs with conditional rendering in results page | Completed |
| 5 | Update export utilities in `app/utils/export.ts` | Completed |
| 6 | Test the implementation | In Progress |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Great! The compilation was successful and TypeScript is now running. Let me wait a bit more for the full build to complete.

<execute_command>
<command>echo "Build is progressing..."</command>
</execute_command>

---

**User:**

[execute_command for 'echo "Build is progressing..."'] Result:
Command executed in terminal  within working directory 'c:/Users/conan/OneDrive - UBC/Documents/Personal/Hackathon/IBM Bob/seenior'. Exit code: 0
Output:
Build is progressing...

<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/api/analyze/route.ts,app/utils/export.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:18:21.103Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$1.26

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Completed |
| 4 | Add new sub-tabs with conditional rendering in results page | Completed |
| 5 | Update export utilities in `app/utils/export.ts` | Completed |
| 6 | Test the implementation | In Progress |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Let me check the terminal status to see if the build has completed:

<execute_command>
<command>echo "Checking build status..."</command>
</execute_command>

---

**User:**

[execute_command for 'echo "Checking build status..."'] Result:
Command executed in terminal  within working directory 'c:/Users/conan/OneDrive - UBC/Documents/Personal/Hackathon/IBM Bob/seenior'. Exit code: 0
Output:
Checking build status...

<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/api/analyze/route.ts,app/utils/export.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:18:26.442Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$1.38

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Completed |
| 4 | Add new sub-tabs with conditional rendering in results page | Completed |
| 5 | Update export utilities in `app/utils/export.ts` | Completed |
| 6 | Test the implementation | In Progress |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Let me check if there are any TypeScript compilation errors by running a type check:

<execute_command>
<command>npx tsc --noEmit</command>
</execute_command>

---

**User:**

[execute_command for 'npx tsc --noEmit'] Result:
Command executed in terminal  within working directory 'c:/Users/conan/OneDrive - UBC/Documents/Personal/Hackathon/IBM Bob/seenior'. Exit code: 0
Output:

<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/api/analyze/route.ts,app/utils/export.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:18:37.387Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$1.50

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Completed |
| 4 | Add new sub-tabs with conditional rendering in results page | Completed |
| 5 | Update export utilities in `app/utils/export.ts` | Completed |
| 6 | Test the implementation | In Progress |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Perfect! The TypeScript compilation completed successfully with no errors (exit code 0 and no output means no errors). Now let me update the todo list and present the completion summary:

<update_todo_list>
<todos>
[x] Read current implementation files (route.ts, page.tsx, export.ts)
[x] Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types
[x] Update `UmlData` interface in `app/results/page.tsx`
[x] Add new sub-tabs with conditional rendering in results page
[x] Update export utilities in `app/utils/export.ts`
[x] Test the implementation
</todos>
</update_todo_list>

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
<environment_details>
# VSCode Visible Files
app\results\page.tsx

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/api/analyze/route.ts,app/utils/export.ts,app/results/page.tsx,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:18:43.253Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$1.62

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Read current implementation files (route.ts, page.tsx, export.ts) | Completed |
| 2 | Update `generateUML()` in `app/api/analyze/route.ts` with new diagram types | Completed |
| 3 | Update `UmlData` interface in `app/results/page.tsx` | Completed |
| 4 | Add new sub-tabs with conditional rendering in results page | Completed |
| 5 | Update export utilities in `app/utils/export.ts` | Completed |
| 6 | Test the implementation | Completed |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<attempt_completion>
<result>
Successfully added three new diagram types to enhance code visualization! Here's what was implemented:

## ✅ Completed Changes

### 1. **Updated API Route (`app/api/analyze/route.ts`)**
   - Extended `generateUML()` to return 7 keys instead of 4
   - Added comprehensive prompt engineering for:
     - **Component Diagram**: System architecture, external dependencies, deployment structure (max 8 components)
     - **State Diagram**: State machines, workflow logic, lifecycle management (max 6 states)
     - **ER Diagram**: Database schema relationships from ORM models/SQL files (max 7 entities)
   - Each new diagram returns empty string if not applicable to the codebase

### 2. **Updated Results Page (`app/results/page.tsx`)**
   - Extended `UmlData` interface with 3 new diagram types
   - Updated `activeSubTab` state to support 5 diagram types: 'class' | 'sequence' | 'component' | 'state' | 'er'
   - Implemented **conditional rendering**:
     - Only shows tabs for diagrams with content (non-empty strings)
     - Displays helpful messages when diagrams are unavailable
     - Auto-selects first available diagram
   - Added dynamic panel labels: "Components", "Actors", "States", "Entities"

### 3. **Updated Export Utilities (`app/utils/export.ts`)**
   - Extended `AnalysisData` interface with new diagram types
   - **Markdown export**: Includes all 5 diagram types in Mermaid code blocks
   - **PDF export**: Renders all available diagrams as SVG in the PDF
   - **Individual exports**: SVG and PNG export for all 5 diagram types

### 4. **Enhanced Export Menu**
   - Added export buttons for Component, State, and ER diagrams
   - Both SVG and PNG formats available for each diagram
   - Conditional rendering - only shows export options for available diagrams

## 🎯 Key Features

- **Smart Detection**: AI automatically detects which diagram types are relevant
- **Conditional UI**: Tabs and export options only appear for available diagrams
- **User Feedback**: Helpful messages explain why certain diagrams aren't available
- **Full Export Support**: All diagrams included in Markdown, PDF, and individual exports
- **Type Safety**: All TypeScript interfaces updated, compilation successful ✓

## 📊 Diagram Rules Summary

**Component Diagram**: Shows system architecture, external services, deployment structure
**State Diagram**: Identifies state machines, workflows, lifecycle patterns  
**ER Diagram**: Detects database schemas from Prisma, TypeORM, Sequelize, Django models, etc.

All implementations follow the existing code patterns and maintain consistency with the current UI/UX design.
</result>
</attempt_completion>

